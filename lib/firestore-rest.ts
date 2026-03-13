import { createSign } from "node:crypto"
import { getFirebaseProjectId, getFirebaseServiceAccount } from "@/lib/firebase-config"

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }

let cachedToken: { token: string; expiresAt: number } | null = null

function toBase64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null }
  if (Array.isArray(value)) {
    return {
      arrayValue: {
        values: value.map(encodeValue),
      },
    }
  }
  if (typeof value === "string") return { stringValue: value }
  if (typeof value === "boolean") return { booleanValue: value }
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value }
  }
  if (value instanceof Date) return { timestampValue: value.toISOString() }
  if (typeof value === "object") {
    const fields: Record<string, FirestoreValue> = {}
    for (const [key, nestedValue] of Object.entries(value)) {
      fields[key] = encodeValue(nestedValue)
    }
    return { mapValue: { fields } }
  }

  return { stringValue: String(value) }
}

function decodeValue(value: FirestoreValue): any {
  if ("nullValue" in value) return null
  if ("stringValue" in value) return value.stringValue
  if ("integerValue" in value) return Number(value.integerValue)
  if ("doubleValue" in value) return value.doubleValue
  if ("booleanValue" in value) return value.booleanValue
  if ("timestampValue" in value) return value.timestampValue
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeValue)
  if ("mapValue" in value) {
    const result: Record<string, any> = {}
    for (const [key, nestedValue] of Object.entries(value.mapValue.fields || {})) {
      result[key] = decodeValue(nestedValue)
    }
    return result
  }

  return null
}

function decodeDocument<T>(document: { name: string; fields?: Record<string, FirestoreValue> }): T {
  const decoded = decodeValue({ mapValue: { fields: document.fields || {} } }) as T & { id?: string }
  const nameParts = document.name.split("/")
  return {
    ...decoded,
    id: decoded.id || nameParts[nameParts.length - 1],
  }
}

async function getAccessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.token
  }

  const serviceAccount = getFirebaseServiceAccount()
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + 3600

  const header = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }))
  const claimSet = toBase64Url(
    JSON.stringify({
      iss: serviceAccount.clientEmail,
      sub: serviceAccount.clientEmail,
      aud: "https://oauth2.googleapis.com/token",
      scope: "https://www.googleapis.com/auth/datastore",
      iat: issuedAt,
      exp: expiresAt,
    }),
  )

  const signer = createSign("RSA-SHA256")
  signer.update(`${header}.${claimSet}`)
  signer.end()
  const signature = signer.sign(serviceAccount.privateKey)
  const assertion = `${header}.${claimSet}.${toBase64Url(signature)}`

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  })

  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error_description || payload.error || "Failed to get Google access token")
  }

  cachedToken = {
    token: payload.access_token,
    expiresAt: Date.now() + Number(payload.expires_in) * 1000,
  }

  return cachedToken.token
}

async function firestoreRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken()
  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  if (response.status === 404) {
    throw new Error("NOT_FOUND")
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error?.message || "Firestore request failed")
  }

  return payload as T
}

function getDocumentUrl(collection: string, documentId?: string) {
  const base = `https://firestore.googleapis.com/v1/projects/${getFirebaseProjectId()}/databases/(default)/documents`
  return documentId ? `${base}/${collection}/${documentId}` : `${base}/${collection}`
}

function getDocumentsRootUrl() {
  return `https://firestore.googleapis.com/v1/projects/${getFirebaseProjectId()}/databases/(default)/documents`
}

export async function getDocument<T>(collection: string, documentId: string): Promise<T | null> {
  try {
    const document = await firestoreRequest<{ name: string; fields?: Record<string, FirestoreValue> }>(
      getDocumentUrl(collection, documentId),
    )
    return decodeDocument<T>(document)
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return null
    }
    throw error
  }
}

export async function setDocument<T extends object>(collection: string, documentId: string, data: T): Promise<T> {
  const document = await firestoreRequest<{ name: string; fields?: Record<string, FirestoreValue> }>(
    getDocumentUrl(collection, documentId),
    {
      method: "PATCH",
      body: JSON.stringify({
        fields: (encodeValue(data) as { mapValue: { fields: Record<string, FirestoreValue> } }).mapValue.fields,
      }),
    },
  )

  return decodeDocument<T>(document)
}

export async function queryCollection<T>(collection: string, field: string, value: string): Promise<T[]> {
  const response = await firestoreRequest<Array<{ document?: { name: string; fields?: Record<string, FirestoreValue> } }>>(
    `${getDocumentsRootUrl()}:runQuery`,
    {
      method: "POST",
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: collection }],
          where: {
            fieldFilter: {
              field: { fieldPath: field },
              op: "EQUAL",
              value: encodeValue(value),
            },
          },
        },
      }),
    },
  )

  return response.flatMap((entry) => (entry.document ? [decodeDocument<T>(entry.document)] : []))
}

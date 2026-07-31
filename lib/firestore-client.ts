"use client"

import { getFirebaseProjectId } from "@/lib/firebase-config"

// Browser-side Firestore access over the REST API. Requests carry the caller's
// Firebase ID token, so Firestore enforces firestore.rules on every read and
// write — there is no privileged path left in the app.

type FirestoreValue =
  | { nullValue: null }
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } }

interface FirestoreDocument {
  name: string
  fields?: Record<string, FirestoreValue>
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

function decodeDocument<T>(document: FirestoreDocument): T {
  const decoded = decodeValue({ mapValue: { fields: document.fields || {} } }) as T & { id?: string }
  const nameParts = document.name.split("/")
  return {
    ...decoded,
    id: decoded.id || nameParts[nameParts.length - 1],
  }
}

function toFields(data: object) {
  return (encodeValue(data) as { mapValue: { fields: Record<string, FirestoreValue> } }).mapValue.fields
}

function getDocumentsRootUrl() {
  return `https://firestore.googleapis.com/v1/projects/${getFirebaseProjectId()}/databases/(default)/documents`
}

async function firestoreRequest<T>(url: string, idToken: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  })

  if (response.status === 404) {
    throw new Error("NOT_FOUND")
  }
  if (response.status === 409) {
    throw new Error("ALREADY_EXISTS")
  }
  if (response.status === 403) {
    throw new Error("PERMISSION_DENIED")
  }

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload?.error?.message || "Firestore request failed")
  }

  return payload as T
}

/** `path` is a document path relative to the database root, e.g. `classes/AB12CD`. */
export async function getDocument<T>(path: string, idToken: string): Promise<T | null> {
  try {
    const document = await firestoreRequest<FirestoreDocument>(`${getDocumentsRootUrl()}/${path}`, idToken)
    return decodeDocument<T>(document)
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      return null
    }
    throw error
  }
}

/** Creates or merges into the document at `path`. Fields omitted from `data` are left alone. */
export async function setDocument<T extends object>(path: string, data: T, idToken: string): Promise<T> {
  const fields = toFields(data)
  const mask = Object.keys(fields)
    .map((key) => `updateMask.fieldPaths=${encodeURIComponent(key)}`)
    .join("&")

  const document = await firestoreRequest<FirestoreDocument>(
    `${getDocumentsRootUrl()}/${path}?${mask}`,
    idToken,
    {
      method: "PATCH",
      body: JSON.stringify({ fields }),
    },
  )

  return decodeDocument<T>(document)
}

/** Fails with ALREADY_EXISTS rather than overwriting, which is what class-code allocation wants. */
export async function createDocument<T extends object>(
  collectionPath: string,
  documentId: string,
  data: T,
  idToken: string,
): Promise<T> {
  const document = await firestoreRequest<FirestoreDocument>(
    `${getDocumentsRootUrl()}/${collectionPath}?documentId=${encodeURIComponent(documentId)}`,
    idToken,
    {
      method: "POST",
      body: JSON.stringify({ fields: toFields(data) }),
    },
  )

  return decodeDocument<T>(document)
}

/** Lists every document in a collection, following pagination. */
export async function listCollection<T>(collectionPath: string, idToken: string): Promise<T[]> {
  const documents: T[] = []
  let pageToken: string | undefined

  do {
    const query = new URLSearchParams({ pageSize: "300" })
    if (pageToken) {
      query.set("pageToken", pageToken)
    }

    const payload = await firestoreRequest<{ documents?: FirestoreDocument[]; nextPageToken?: string }>(
      `${getDocumentsRootUrl()}/${collectionPath}?${query.toString()}`,
      idToken,
    )

    for (const document of payload.documents || []) {
      documents.push(decodeDocument<T>(document))
    }

    pageToken = payload.nextPageToken
  } while (pageToken)

  return documents
}

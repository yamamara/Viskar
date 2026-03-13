import { getFirebaseApiKey } from "@/lib/firebase-config"
import { getDocument, setDocument } from "@/lib/firestore-rest"
import type { TeacherProfile } from "@/lib/app-types"

interface IdentityLookupResponse {
  users?: Array<{
    localId: string
    email: string
  }>
}

interface AuthResult {
  uid: string
  email: string
}

async function parseIdentityResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error?.message || payload.error || "Firebase auth request failed")
  }
  return payload as T
}

export async function verifyIdToken(idToken: string): Promise<AuthResult> {
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${getFirebaseApiKey()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  })

  const payload = await parseIdentityResponse<IdentityLookupResponse>(response)
  const user = payload.users?.[0]
  if (!user?.localId || !user.email) {
    throw new Error("Invalid auth session")
  }

  return {
    uid: user.localId,
    email: user.email,
  }
}

export function getBearerToken(request: Request) {
  const header = request.headers.get("authorization")
  if (!header?.startsWith("Bearer ")) {
    throw new Error("Missing authorization token")
  }
  return header.slice("Bearer ".length)
}

export async function requireTeacherAuth(request: Request) {
  const idToken = getBearerToken(request)
  const authUser = await verifyIdToken(idToken)
  const teacher = await getDocument<TeacherProfile>("teachers", authUser.uid)

  if (!teacher) {
    const createdTeacher = await setDocument<TeacherProfile>("teachers", authUser.uid, {
      id: authUser.uid,
      email: authUser.email,
      classCodes: [],
      createdAt: new Date().toISOString(),
    })

    return { authUser, teacher: createdTeacher }
  }

  return { authUser, teacher }
}

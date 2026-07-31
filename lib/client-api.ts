import { getValidTeacherIdToken } from "@/lib/firebase-auth"
import { getCurrentStudentSession } from "@/lib/student-session"

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload?.error || payload?.message || "Request failed"
    throw new Error(message)
  }

  return payload as T
}

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const response = await fetch(input, init)
  return parseJson<T>(response)
}

export async function fetchTeacherJson<T>(input: RequestInfo | URL, init?: RequestInit) {
  const token = await getValidTeacherIdToken()
  if (!token) {
    throw new Error("Missing teacher session")
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  })

  return parseJson<T>(response)
}

export async function fetchStudentJson<T>(classCode: string, input: RequestInfo | URL, init?: RequestInit) {
  const session = getCurrentStudentSession(classCode)
  if (!session?.studentId || !session.sessionToken) {
    throw new Error("Missing student session")
  }

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      "X-Student-Id": session.studentId,
      "X-Student-Session": session.sessionToken,
    },
  })

  return parseJson<T>(response)
}

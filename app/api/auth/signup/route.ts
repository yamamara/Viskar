import { NextResponse } from "next/server"
import { getFirebaseApiKey } from "@/lib/firebase-config"
import { getDocument, setDocument } from "@/lib/firestore-rest"
import type { TeacherProfile } from "@/lib/app-types"

async function parseFirebaseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    return Promise.reject(new Error(payload.error?.message || payload.error || "Firebase auth request failed"))
  }
  return payload as T
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const authResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${getFirebaseApiKey()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      },
    )

    const authPayload = await parseFirebaseResponse<{
      idToken: string
      refreshToken: string
      expiresIn: string
      localId: string
      email: string
    }>(authResponse)

    const existingTeacher = await getDocument<TeacherProfile>("teachers", authPayload.localId)
    if (!existingTeacher) {
      await setDocument<TeacherProfile>("teachers", authPayload.localId, {
        id: authPayload.localId,
        email: authPayload.email,
        classCodes: [],
        createdAt: new Date().toISOString(),
      })
    }

    return NextResponse.json(authPayload)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to sign up"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

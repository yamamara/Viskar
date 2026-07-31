import { NextResponse } from "next/server"
import { getFirebaseApiKey } from "@/lib/firebase-config"

async function parseFirebaseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    return Promise.reject(new Error(payload.error?.message || payload.error || "Firebase auth request failed"))
  }
  return payload as T
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const resetResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${getFirebaseApiKey()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email,
        }),
      },
    )

    await parseFirebaseResponse(resetResponse)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send password reset email"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

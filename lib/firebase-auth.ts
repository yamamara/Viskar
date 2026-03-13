"use client"

import type { TeacherSession } from "@/lib/app-types"

const STORAGE_KEY = "viskar_teacher_session"
const REFRESH_WINDOW_MS = 60_000

interface AuthResponse {
  idToken: string
  refreshToken: string
  expiresIn: string
  localId: string
  email: string
}

function getApiKey() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_FIREBASE_API_KEY is not configured")
  }
  return apiKey
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    const message = payload?.error?.message || payload?.error || "Request failed"
    throw new Error(message)
  }

  return payload as T
}

function toSession(data: AuthResponse): TeacherSession {
  return {
    uid: data.localId,
    email: data.email,
    idToken: data.idToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + Number(data.expiresIn) * 1000,
  }
}

export function loadStoredTeacherSession(): TeacherSession | null {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as TeacherSession
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export function persistTeacherSession(session: TeacherSession | null) {
  if (typeof window === "undefined") return

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY)
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export async function refreshTeacherSession(session: TeacherSession): Promise<TeacherSession> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: session.refreshToken,
  })

  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${getApiKey()}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  })

  const payload = await parseResponse<{
    id_token: string
    refresh_token: string
    expires_in: string
    user_id: string
  }>(response)

  return {
    uid: payload.user_id,
    email: session.email,
    idToken: payload.id_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + Number(payload.expires_in) * 1000,
  }
}

export async function ensureFreshTeacherSession(session: TeacherSession): Promise<TeacherSession> {
  if (session.expiresAt - Date.now() > REFRESH_WINDOW_MS) {
    return session
  }

  const refreshed = await refreshTeacherSession(session)
  persistTeacherSession(refreshed)
  return refreshed
}

export async function getValidTeacherIdToken() {
  const session = loadStoredTeacherSession()
  if (!session) return null

  const freshSession = await ensureFreshTeacherSession(session)
  return freshSession.idToken
}

export async function logoutTeacher() {
  persistTeacherSession(null)
}

export async function sendTeacherPasswordReset(email: string) {
  const response = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  return parseResponse<{ success: boolean }>(response)
}

export async function signInTeacher(email: string, password: string) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const payload = await parseResponse<AuthResponse>(response)
  const session = toSession(payload)
  persistTeacherSession(session)
  return session
}

export async function signUpTeacher(email: string, password: string) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const payload = await parseResponse<AuthResponse>(response)
  const session = toSession(payload)
  persistTeacherSession(session)
  return session
}

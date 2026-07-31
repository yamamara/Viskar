"use client"

import type { TeacherProfile, TeacherSession } from "@/lib/app-types"
import { getDocument, setDocument } from "@/lib/firestore-client"
import {
  exchangeRefreshToken,
  sendPasswordResetEmail,
  signInWithPassword,
  signUpWithPassword,
  type FirebaseIdentity,
} from "@/lib/firebase-identity"

const STORAGE_KEY = "viskar_teacher_session"
const REFRESH_WINDOW_MS = 60_000
let currentTeacherSession: TeacherSession | null = null

function toSession(identity: FirebaseIdentity): TeacherSession {
  return {
    uid: identity.uid,
    email: identity.email,
    idToken: identity.idToken,
    refreshToken: identity.refreshToken,
    expiresAt: identity.expiresAt,
  }
}

/**
 * The teacher profile used to be created by the login route. With no server,
 * the client writes it on first sign-in; rules only let a teacher touch their
 * own document.
 */
async function ensureTeacherProfile(session: TeacherSession) {
  const existing = await getDocument<TeacherProfile>(`teachers/${session.uid}`, session.idToken)
  if (existing) return existing

  return setDocument<TeacherProfile>(
    `teachers/${session.uid}`,
    {
      id: session.uid,
      email: session.email,
      classCodes: [],
      createdAt: new Date().toISOString(),
    },
    session.idToken,
  )
}

export function getCurrentTeacherSession() {
  return currentTeacherSession
}

export function setCurrentTeacherSession(session: TeacherSession | null) {
  currentTeacherSession = session
}

export function loadStoredTeacherSession(): TeacherSession | null {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const session = JSON.parse(raw) as TeacherSession
    currentTeacherSession = session
    return session
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    currentTeacherSession = null
    return null
  }
}

export function persistTeacherSession(session: TeacherSession | null) {
  if (typeof window === "undefined") return

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY)
    currentTeacherSession = null
    return
  }

  currentTeacherSession = session
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

export async function refreshTeacherSession(session: TeacherSession): Promise<TeacherSession> {
  const refreshed = await exchangeRefreshToken(session.refreshToken)

  return {
    ...session,
    uid: refreshed.uid,
    idToken: refreshed.idToken,
    refreshToken: refreshed.refreshToken,
    expiresAt: refreshed.expiresAt,
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
  const session = currentTeacherSession
  if (!session) return null

  const freshSession = await ensureFreshTeacherSession(session)
  return freshSession.idToken
}

export async function logoutTeacher() {
  persistTeacherSession(null)
}

export async function sendTeacherPasswordReset(email: string) {
  return sendPasswordResetEmail(email)
}

export async function signInTeacher(email: string, password: string) {
  const session = toSession(await signInWithPassword(email, password))
  persistTeacherSession(session)
  await ensureTeacherProfile(session)
  return session
}

export async function signUpTeacher(email: string, password: string) {
  const session = toSession(await signUpWithPassword(email, password))
  persistTeacherSession(session)
  await ensureTeacherProfile(session)
  return session
}

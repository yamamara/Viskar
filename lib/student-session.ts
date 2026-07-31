"use client"

import type { StudentClientSession } from "@/lib/app-types"
import { exchangeRefreshToken, signInAnonymously, type FirebaseIdentity } from "@/lib/firebase-identity"

// Students have no password. Identity comes from a Firebase anonymous account
// held by the browser: the uid is recorded on the student document's authUids,
// and Firestore rules use it to decide who may write that document.
//
// Which student this browser *is* (per class) stays in localStorage alongside
// the anonymous session.

const ANON_SESSION_KEY = "viskar_anon_session"
const SESSION_KEY_PREFIX = "viskar_student_session_"
const REFRESH_WINDOW_MS = 60_000

const keyForClass = (classCode: string) => `${SESSION_KEY_PREFIX}${classCode.toUpperCase()}`
const currentStudentSessions = new Map<string, StudentClientSession>()

let anonymousSession: FirebaseIdentity | null = null
let anonymousSessionPromise: Promise<FirebaseIdentity> | null = null

function loadStoredAnonymousSession(): FirebaseIdentity | null {
  if (anonymousSession) return anonymousSession
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(ANON_SESSION_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as FirebaseIdentity
    if (parsed?.uid && parsed.refreshToken) {
      anonymousSession = parsed
      return parsed
    }
  } catch {
    // fall through and re-register below
  }

  window.localStorage.removeItem(ANON_SESSION_KEY)
  return null
}

function persistAnonymousSession(session: FirebaseIdentity) {
  anonymousSession = session
  if (typeof window !== "undefined") {
    window.localStorage.setItem(ANON_SESSION_KEY, JSON.stringify(session))
  }
  return session
}

async function resolveAnonymousSession(): Promise<FirebaseIdentity> {
  const stored = loadStoredAnonymousSession()

  if (!stored) {
    return persistAnonymousSession(await signInAnonymously())
  }

  if (stored.expiresAt - Date.now() > REFRESH_WINDOW_MS) {
    return stored
  }

  try {
    const refreshed = await exchangeRefreshToken(stored.refreshToken)
    return persistAnonymousSession({ ...stored, ...refreshed })
  } catch {
    // The anonymous account was revoked or expired. A new one loses access to
    // any student document this browser owned, so the student has to pick their
    // name from the class list again.
    return persistAnonymousSession(await signInAnonymously())
  }
}

/** Registers this browser with Firebase if needed, and returns a fresh anonymous session. */
export async function ensureAnonymousSession(): Promise<FirebaseIdentity> {
  if (!anonymousSessionPromise) {
    anonymousSessionPromise = resolveAnonymousSession().finally(() => {
      anonymousSessionPromise = null
    })
  }

  return anonymousSessionPromise
}

export async function getStudentIdToken() {
  const session = await ensureAnonymousSession()
  return session.idToken
}

export async function getStudentUid() {
  const session = await ensureAnonymousSession()
  return session.uid
}

export function getCurrentStudentSession(classCode: string) {
  return currentStudentSessions.get(classCode.toUpperCase()) ?? null
}

export function setCurrentStudentSession(classCode: string, session: StudentClientSession | null) {
  const normalizedCode = classCode.toUpperCase()
  if (!session) {
    currentStudentSessions.delete(normalizedCode)
    return
  }

  currentStudentSessions.set(normalizedCode, session)
}

export function loadStudentSession(classCode: string) {
  if (typeof window === "undefined") return null

  const raw = window.localStorage.getItem(keyForClass(classCode))
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as StudentClientSession
    if (parsed?.studentId) {
      const session = { studentId: parsed.studentId }
      setCurrentStudentSession(classCode, session)
      return session
    }
  } catch {
    // Sessions were once stored as a bare student id.
    if (raw.trim()) {
      const legacySession = { studentId: raw.trim() }
      setCurrentStudentSession(classCode, legacySession)
      return legacySession
    }
  }

  window.localStorage.removeItem(keyForClass(classCode))
  setCurrentStudentSession(classCode, null)
  return null
}

export function persistStudentSession(classCode: string, session: StudentClientSession | null) {
  if (typeof window === "undefined") return

  if (!session) {
    window.localStorage.removeItem(keyForClass(classCode))
    setCurrentStudentSession(classCode, null)
    return
  }

  setCurrentStudentSession(classCode, session)
  window.localStorage.setItem(keyForClass(classCode), JSON.stringify(session))
}

export function getStoredStudentSessionClassCodes() {
  if (typeof window === "undefined") return []

  const classCodes: string[] = []
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)
    if (key?.startsWith(SESSION_KEY_PREFIX)) {
      classCodes.push(key.slice(SESSION_KEY_PREFIX.length).toUpperCase())
    }
  }

  return classCodes.sort()
}

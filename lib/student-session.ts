"use client"

import type { StudentClientSession } from "@/lib/app-types"

const keyForClass = (classCode: string) => `viskar_student_session_${classCode.toUpperCase()}`
const currentStudentSessions = new Map<string, StudentClientSession>()

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
    if (parsed?.studentId && parsed?.sessionToken) {
      setCurrentStudentSession(classCode, parsed)
      return parsed
    }
  } catch {
    if (raw.trim()) {
      const legacySession = {
        studentId: raw,
        sessionToken: "",
      }
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

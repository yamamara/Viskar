"use client"

const keyForClass = (classCode: string) => `viskar_student_session_${classCode.toUpperCase()}`

export function loadStudentSession(classCode: string) {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(keyForClass(classCode))
}

export function persistStudentSession(classCode: string, studentId: string | null) {
  if (typeof window === "undefined") return

  if (!studentId) {
    window.localStorage.removeItem(keyForClass(classCode))
    return
  }

  window.localStorage.setItem(keyForClass(classCode), studentId)
}

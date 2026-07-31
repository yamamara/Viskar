"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import type { StudentRecord } from "@/lib/app-types"
import { fetchStudentJson } from "@/lib/client-api"
import { consumeSkipAutoResumeOnce } from "@/lib/home-navigation"
import { getStoredStudentSessionClassCodes, loadStudentSession, persistStudentSession } from "@/lib/student-session"

export function AutoStudentRedirect() {
  const router = useRouter()
  const shouldSkipAutoResumeRef = useRef<boolean | null>(null)

  if (shouldSkipAutoResumeRef.current === null) {
    shouldSkipAutoResumeRef.current = consumeSkipAutoResumeOnce()
  }

  useEffect(() => {
    if (shouldSkipAutoResumeRef.current) {
      return
    }

    let cancelled = false

    async function resumeStudentSession() {
      const classCodes = getStoredStudentSessionClassCodes()

      for (const classCode of classCodes) {
        const session = loadStudentSession(classCode)
        if (!session?.studentId || !session.sessionToken) {
          continue
        }

        try {
          await fetchStudentJson<StudentRecord>(classCode, `/api/students/session?classCode=${classCode}`)
          if (!cancelled) {
            router.replace(`/learn?code=${classCode}`)
          }
          return
        } catch {
          persistStudentSession(classCode, null)
        }
      }
    }

    resumeStudentSession()

    return () => {
      cancelled = true
    }
  }, [router])

  return null
}

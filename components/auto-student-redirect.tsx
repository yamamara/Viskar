"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { loadStudentRecord } from "@/lib/client-api"
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
        if (!session?.studentId) {
          continue
        }

        try {
          await loadStudentRecord(classCode)
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

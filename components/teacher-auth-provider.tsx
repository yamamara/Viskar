"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { TeacherSession } from "@/lib/app-types"
import {
  ensureFreshTeacherSession,
  loadStoredTeacherSession,
  logoutTeacher,
  persistTeacherSession,
  setCurrentTeacherSession,
  signInTeacher,
  signUpTeacher,
} from "@/lib/firebase-auth"

interface TeacherAuthContextValue {
  session: TeacherSession | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<TeacherSession | null>
}

const TeacherAuthContext = createContext<TeacherAuthContextValue | null>(null)

export function TeacherAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<TeacherSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const stored = loadStoredTeacherSession()
      if (!stored) {
        if (!cancelled) {
          setLoading(false)
        }
        return
      }

      try {
        const freshSession = await ensureFreshTeacherSession(stored)
        if (!cancelled) {
          setSession(freshSession)
        }
      } catch {
        persistTeacherSession(null)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo<TeacherAuthContextValue>(
    () => ({
      session,
      loading,
      login: async (email, password) => {
        const nextSession = await signInTeacher(email, password)
        setSession(nextSession)
      },
      signup: async (email, password) => {
        const nextSession = await signUpTeacher(email, password)
        setSession(nextSession)
      },
      logout: async () => {
        await logoutTeacher()
        setSession(null)
      },
      refresh: async () => {
        const stored = session ?? loadStoredTeacherSession()
        if (!stored) {
          setCurrentTeacherSession(null)
          setSession(null)
          return null
        }
        const nextSession = await ensureFreshTeacherSession(stored)
        setSession(nextSession)
        return nextSession
      },
    }),
    [loading, session],
  )

  return <TeacherAuthContext.Provider value={value}>{children}</TeacherAuthContext.Provider>
}

export function useTeacherAuth() {
  const context = useContext(TeacherAuthContext)
  if (!context) {
    throw new Error("useTeacherAuth must be used within TeacherAuthProvider")
  }
  return context
}

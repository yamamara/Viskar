"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTeacherAuth } from "@/components/teacher-auth-provider"

export function TeacherAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { session, loading } = useTeacherAuth()

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/teacher/login")
    }
  }, [loading, router, session])

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return <>{children}</>
}

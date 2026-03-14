"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { fetchJson } from "@/lib/client-api"
import { loadStudentSession, persistStudentSession } from "@/lib/student-session"
import type { StudentJoinResponse } from "@/lib/app-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ClassCodeForm() {
  const [classCode, setClassCode] = useState("")
  const [loadedClassCode, setLoadedClassCode] = useState("")
  const [studentName, setStudentName] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const hasLoadedRoster = loadedClassCode.length > 0 && loadedClassCode === classCode.trim().toUpperCase()
  const rememberedSession = useMemo(() => loadStudentSession(classCode.trim().toUpperCase()), [classCode])
  const canResumeExistingSession = Boolean(rememberedSession?.studentId && rememberedSession?.sessionToken)

  const resetRosterState = () => {
    setLoadedClassCode("")
    setStudentName("")
  }

  const lookupClass = async () => {
    const upperCode = classCode.trim().toUpperCase()
    if (!upperCode) {
      setError("Please enter a class code")
      return
    }

    setError("")
    setLoadedClassCode(upperCode)
  }

  const continueExistingStudent = () => {
    if (!rememberedSession?.studentId || !rememberedSession.sessionToken) {
      setError("No saved student session was found for this device.")
      return
    }

    persistStudentSession(loadedClassCode, rememberedSession)
    router.push(`/learn?code=${loadedClassCode}`)
  }

  const joinAsNewStudent = async () => {
    if (!studentName.trim()) {
      setError("Please enter your name")
      return
    }

    setIsSubmitting(true)
    setError("")
    try {
      const response = await fetchJson<StudentJoinResponse>("/api/students/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classCode: loadedClassCode,
          name: studentName.trim(),
        }),
      })

      persistStudentSession(loadedClassCode, {
        studentId: response.student.id,
        sessionToken: response.sessionToken,
      })
      router.push(`/learn?code=${loadedClassCode}`)
    } catch (joinError) {
      const message = joinError instanceof Error ? joinError.message : "Failed to join class"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hasLoadedRoster) {
      await lookupClass()
      return
    }

    if (canResumeExistingSession) {
      continueExistingStudent()
      return
    }

    if (studentName.trim()) {
      await joinAsNewStudent()
      return
    }

    setError("Enter your name to join this class.")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-3">
        <Label htmlFor="classCode" className="text-sm font-medium">
          Class Code
        </Label>
        <Input
          id="classCode"
          type="text"
          placeholder="Enter your class code"
          value={classCode}
          onChange={(e) => {
            const nextCode = e.target.value.toUpperCase()
            setClassCode(nextCode)
            setError("")
            if (loadedClassCode && nextCode.trim().toUpperCase() !== loadedClassCode) {
              resetRosterState()
            }
          }}
          className="text-center text-lg tracking-wider font-mono h-12 transition-all duration-200 focus:scale-[1.02]"
          maxLength={6}
          disabled={isSubmitting}
        />
      </div>

      {hasLoadedRoster && canResumeExistingSession && (
        <div className="space-y-3 animate-in">
          <Label className="text-sm font-medium">Saved Session Found</Label>
          <div className="rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
            Continue learning on this device, or enter your name below to create a new student profile.
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={continueExistingStudent} disabled={isSubmitting}>
              Continue Learning
            </Button>
            <Button type="button" variant="ghost" className="px-4" onClick={resetRosterState} disabled={isSubmitting}>
              Change Code
            </Button>
          </div>
        </div>
      )}

      {hasLoadedRoster && (
        <div className="space-y-3 animate-in">
          <Label htmlFor="studentName" className="text-sm font-medium">
            {canResumeExistingSession ? "Join As Someone New" : "Your Name"}
          </Label>
          <Input
            id="studentName"
            type="text"
            placeholder="Enter your name"
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value)
              setError("")
            }}
            className="h-11 transition-all duration-200"
            autoFocus
            disabled={isSubmitting}
          />
          {!canResumeExistingSession && (
            <Button type="button" variant="ghost" className="px-4" onClick={resetRosterState} disabled={isSubmitting}>
              Change Code
            </Button>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 text-sm text-destructive bg-destructive/10 p-4 rounded-xl border border-destructive/20 animate-in">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p className="leading-relaxed">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base font-medium shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
        size="lg"
        disabled={isSubmitting}
      >
        {!hasLoadedRoster ? "Continue" : canResumeExistingSession && !studentName.trim() ? "Continue Learning" : "Join And Start Learning"}
      </Button>
    </form>
  )
}

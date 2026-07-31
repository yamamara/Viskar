"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { continueAsStudent, fetchClassRoster, joinClass } from "@/lib/client-api"
import { loadStudentSession, persistStudentSession } from "@/lib/student-session"
import type { StudentRosterEntry } from "@/lib/app-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ClassCodeForm() {
  const [classCode, setClassCode] = useState("")
  const [loadedClassCode, setLoadedClassCode] = useState("")
  const [students, setStudents] = useState<StudentRosterEntry[]>([])
  const [selectedStudentId, setSelectedStudentId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [isNewStudent, setIsNewStudent] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const hasLoadedRoster = loadedClassCode.length > 0 && loadedClassCode === classCode.trim().toUpperCase()
  const rememberedSession = useMemo(() => loadStudentSession(classCode.trim().toUpperCase()), [classCode])
  const canResumeExistingSession = Boolean(rememberedSession?.studentId)
  const hasStudents = students.length > 0

  const resetRosterState = () => {
    setLoadedClassCode("")
    setStudents([])
    setSelectedStudentId("")
    setStudentName("")
    setIsNewStudent(false)
  }

  const lookupClass = async () => {
    const upperCode = classCode.trim().toUpperCase()
    if (!upperCode) {
      setError("Please enter a class code")
      return
    }

    setIsSubmitting(true)
    setError("")
    try {
      const roster = await fetchClassRoster(upperCode)
      setLoadedClassCode(roster.classCode)
      setStudents(roster.students)
      setIsNewStudent(roster.students.length === 0)
      setSelectedStudentId("")
    } catch (lookupError) {
      const message = lookupError instanceof Error ? lookupError.message : "Failed to load class"
      resetRosterState()
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const continueExistingStudent = () => {
    if (!rememberedSession?.studentId) {
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
      const student = await joinClass(loadedClassCode, studentName.trim())

      persistStudentSession(loadedClassCode, { studentId: student.id })
      router.push(`/learn?code=${loadedClassCode}`)
    } catch (joinError) {
      const message = joinError instanceof Error ? joinError.message : "Failed to join class"
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const continueFromStudentList = async () => {
    if (!selectedStudentId) {
      setError("Select your name to continue.")
      return
    }

    setIsSubmitting(true)
    setError("")
    try {
      const student = await continueAsStudent(loadedClassCode, selectedStudentId)

      persistStudentSession(loadedClassCode, { studentId: student.id })
      router.push(`/learn?code=${loadedClassCode}`)
    } catch (continueError) {
      const message = continueError instanceof Error ? continueError.message : "Failed to continue class progress"
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

    if (isNewStudent) {
      await joinAsNewStudent()
      return
    }

    await continueFromStudentList()
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

      {hasLoadedRoster && !isNewStudent && (
        <div className="space-y-3 animate-in">
          <Label htmlFor="studentSelect" className="text-sm font-medium">
            Current Students
          </Label>
          <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
            <SelectTrigger id="studentSelect" className="w-full h-11">
              <SelectValue placeholder="Choose your name" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setIsNewStudent(true)
                setError("")
              }}
              disabled={isSubmitting}
            >
              Add New Student
            </Button>
            <Button type="button" variant="ghost" className="px-4" onClick={resetRosterState} disabled={isSubmitting}>
              Change Code
            </Button>
          </div>
        </div>
      )}

      {hasLoadedRoster && (isNewStudent || !hasStudents) && (
        <div className="space-y-3 animate-in">
          <Label htmlFor="studentName" className="text-sm font-medium">
            {hasStudents ? "Add Yourself To The Class" : "Your Name"}
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
          <div className="flex gap-2">
            {hasStudents && (
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsNewStudent(false)
                  setError("")
                }}
                disabled={isSubmitting}
              >
                Back To Student List
              </Button>
            )}
            <Button type="button" variant="ghost" className="px-4" onClick={resetRosterState} disabled={isSubmitting}>
              Change Code
            </Button>
          </div>
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
        {!hasLoadedRoster
          ? "Continue"
          : canResumeExistingSession && !selectedStudentId && !studentName.trim()
            ? "Continue Learning"
            : isNewStudent || !hasStudents
              ? "Join And Start Learning"
              : "Continue Learning"}
      </Button>
    </form>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { storage } from "@/lib/storage"
import { AlertCircle } from "lucide-react"

export function ClassCodeForm() {
  const [classCode, setClassCode] = useState("")
  const [studentName, setStudentName] = useState("")
  const [error, setError] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!classCode.trim()) {
      setError("Please enter a class code")
      return
    }

    const upperCode = classCode.trim().toUpperCase()

    // Check if class code exists
    const classData = storage.getClassCode(upperCode)

    if (!classData) {
      setError("Invalid class code. Please check with your teacher.")
      return
    }

    // Check if student already exists
    const existingStudent = storage.getStudent(upperCode)

    if (existingStudent) {
      // Student already registered, redirect to app
      router.push(`/learn?code=${upperCode}`)
      return
    }

    // Show name input for new students
    if (!showNameInput) {
      setShowNameInput(true)
      return
    }

    if (!studentName.trim()) {
      setError("Please enter your name")
      return
    }

    // Create new student
    const newStudent = {
      id: `student_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: studentName.trim(),
      classCode: upperCode,
      currentModule: 1,
      currentLesson: 1,
      currentStage: 1,
      completedStages: [],
      createdAt: new Date().toISOString(),
    }

    storage.setStudent(newStudent)

    // Add student to class
    classData.students.push(newStudent.id)
    storage.setClassCode(classData)

    // Redirect to learning app
    router.push(`/learn?code=${upperCode}`)
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
            setClassCode(e.target.value.toUpperCase())
            setError("")
          }}
          className="text-center text-lg tracking-wider font-mono h-12 transition-all duration-200 focus:scale-[1.02]"
          maxLength={6}
          disabled={showNameInput}
        />
      </div>

      {showNameInput && (
        <div className="space-y-3 animate-in">
          <Label htmlFor="studentName" className="text-sm font-medium">
            Your Name
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
          />
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
      >
        {showNameInput ? "Start Learning" : "Continue"}
      </Button>

      {showNameInput && (
        <Button
          type="button"
          variant="ghost"
          className="w-full h-11 transition-all duration-300"
          onClick={() => {
            setShowNameInput(false)
            setStudentName("")
            setError("")
          }}
        >
          Back
        </Button>
      )}
    </form>
  )
}

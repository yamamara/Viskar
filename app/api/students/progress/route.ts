import { NextResponse } from "next/server"
import type { StudentRecord } from "@/lib/app-types"
import { getDocument, setDocument } from "@/lib/firestore-rest"

export async function PATCH(request: Request) {
  try {
    const { studentId, classCode, currentModule, currentLesson, currentStage, completedStageKey } = await request.json()
    const normalizedCode = String(classCode || "").trim().toUpperCase()

    if (!studentId || !normalizedCode) {
      return NextResponse.json({ error: "Student ID and class code are required" }, { status: 400 })
    }

    const student = await getDocument<StudentRecord>("students", studentId)
    if (!student || student.classCode !== normalizedCode) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const completedStages = completedStageKey
      ? Array.from(new Set([...student.completedStages, String(completedStageKey)]))
      : student.completedStages

    const nextStudent: StudentRecord = {
      ...student,
      currentModule: Number(currentModule),
      currentLesson: Number(currentLesson),
      currentStage: Number(currentStage),
      completedStages,
    }

    const savedStudent = await setDocument<StudentRecord>("students", student.id, nextStudent)
    return NextResponse.json(savedStudent)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update student progress"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

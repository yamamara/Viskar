import { NextResponse } from "next/server"
import type { StudentRecord } from "@/lib/app-types"
import { getDocument, setDocument } from "@/lib/firestore-rest"

export async function POST(request: Request) {
  try {
    const { studentId, classCode } = await request.json()
    const normalizedCode = String(classCode || "").trim().toUpperCase()

    if (!studentId || !normalizedCode) {
      return NextResponse.json({ error: "Student ID and class code are required" }, { status: 400 })
    }

    const student = await getDocument<StudentRecord>("students", studentId)
    if (!student || student.classCode !== normalizedCode) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const nextStudent: StudentRecord = {
      ...student,
      currentModule: 1,
      currentLesson: 1,
      currentStage: 1,
      completedStages: [],
    }

    const savedStudent = await setDocument<StudentRecord>("students", student.id, nextStudent)
    return NextResponse.json(savedStudent)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset student progress"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

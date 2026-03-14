import { NextResponse } from "next/server"
import { getAuthorizedStudent, saveStoredStudent, toPublicStudentRecord } from "@/lib/student-auth"

export async function POST(request: Request) {
  try {
    const { classCode } = await request.json()
    const normalizedCode = String(classCode || "").trim().toUpperCase()
    const studentId = String(request.headers.get("x-student-id") || "").trim()
    const sessionToken = String(request.headers.get("x-student-session") || "").trim()

    if (!studentId || !normalizedCode || !sessionToken) {
      return NextResponse.json({ error: "Student session is required" }, { status: 401 })
    }

    const student = await getAuthorizedStudent(String(studentId), normalizedCode, sessionToken)
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const nextStudent = {
      ...student,
      currentModule: 1,
      currentLesson: 1,
      currentStage: 1,
      completedStages: [],
    }

    const savedStudent = await saveStoredStudent(nextStudent)
    return NextResponse.json(toPublicStudentRecord(savedStudent))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reset student progress"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

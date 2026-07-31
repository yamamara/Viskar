import { NextResponse } from "next/server"
import type { StudentContinueResponse } from "@/lib/app-types"
import { addStudentSession, createStudentSessionToken, getStoredStudent, saveStoredStudent, toPublicStudentRecord } from "@/lib/student-auth"

export async function POST(request: Request) {
  try {
    const { classCode, studentId } = await request.json()
    const normalizedCode = String(classCode || "").trim().toUpperCase()
    const normalizedStudentId = String(studentId || "").trim()

    if (!normalizedCode || !normalizedStudentId) {
      return NextResponse.json({ error: "Class code and student are required" }, { status: 400 })
    }

    const student = await getStoredStudent(normalizedStudentId)
    if (!student || student.classCode !== normalizedCode) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const sessionToken = createStudentSessionToken()
    const savedStudent = await saveStoredStudent(addStudentSession(student, sessionToken))

    const payload: StudentContinueResponse = {
      student: toPublicStudentRecord(savedStudent),
      sessionToken,
    }

    return NextResponse.json(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to continue student session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

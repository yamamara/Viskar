import { NextResponse } from "next/server"
import { getAuthorizedStudent, toPublicStudentRecord } from "@/lib/student-auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classCode = String(searchParams.get("classCode") || "").trim().toUpperCase()
    const studentId = String(request.headers.get("x-student-id") || "").trim()
    const sessionToken = String(request.headers.get("x-student-session") || "").trim()

    if (!classCode || !studentId || !sessionToken) {
      return NextResponse.json({ error: "Student session is required" }, { status: 401 })
    }

    const student = await getAuthorizedStudent(studentId, classCode, sessionToken)
    if (!student) {
      return NextResponse.json({ error: "Student session not found" }, { status: 404 })
    }

    return NextResponse.json(toPublicStudentRecord(student))
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load student session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

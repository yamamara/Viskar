import { NextResponse } from "next/server"
import type { StudentRecord } from "@/lib/app-types"
import { getDocument } from "@/lib/firestore-rest"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const classCode = String(searchParams.get("classCode") || "").trim().toUpperCase()
    const studentId = String(searchParams.get("studentId") || "").trim()

    if (!classCode || !studentId) {
      return NextResponse.json({ error: "Class code and student ID are required" }, { status: 400 })
    }

    const student = await getDocument<StudentRecord>("students", studentId)
    if (!student || student.classCode !== classCode) {
      return NextResponse.json({ error: "Student session not found" }, { status: 404 })
    }

    return NextResponse.json(student)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load student session"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

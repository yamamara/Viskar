import { randomUUID } from "node:crypto"
import { NextResponse } from "next/server"
import type { ClassRecord, StudentRecord } from "@/lib/app-types"
import { getDocument, setDocument } from "@/lib/firestore-rest"

export async function POST(request: Request) {
  try {
    const { classCode, name } = await request.json()
    const normalizedCode = String(classCode || "").trim().toUpperCase()
    const normalizedName = String(name || "").trim()

    if (!normalizedCode) {
      return NextResponse.json({ error: "Class code is required" }, { status: 400 })
    }

    if (!normalizedName) {
      return NextResponse.json({ error: "Student name is required" }, { status: 400 })
    }

    const classRecord = await getDocument<ClassRecord>("classes", normalizedCode)
    if (!classRecord) {
      return NextResponse.json({ error: "Invalid class code. Please check with your teacher." }, { status: 404 })
    }

    const studentRecord: StudentRecord = {
      id: randomUUID(),
      name: normalizedName,
      classCode: normalizedCode,
      currentModule: 1,
      currentLesson: 1,
      currentStage: 1,
      completedStages: [],
      createdAt: new Date().toISOString(),
    }

    await setDocument("students", studentRecord.id, studentRecord)

    return NextResponse.json(studentRecord, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to join class"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

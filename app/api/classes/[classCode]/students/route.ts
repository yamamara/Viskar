import { NextResponse } from "next/server"
import type { ClassRecord, StudentRecord, StudentRosterEntry } from "@/lib/app-types"
import { getDocument, queryCollection } from "@/lib/firestore-rest"

interface RouteContext {
  params: Promise<{
    classCode: string
  }>
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { classCode } = await context.params
    const normalizedCode = String(classCode || "").trim().toUpperCase()

    if (!normalizedCode) {
      return NextResponse.json({ error: "Class code is required" }, { status: 400 })
    }

    const classRecord = await getDocument<ClassRecord>("classes", normalizedCode)
    if (!classRecord) {
      return NextResponse.json({ error: "Invalid class code. Please check with your teacher." }, { status: 404 })
    }

    const students = await queryCollection<StudentRecord>("students", "classCode", normalizedCode)
    const roster: StudentRosterEntry[] = students
      .map((student) => ({
        id: student.id,
        name: student.name,
      }))
      .sort((left, right) => left.name.localeCompare(right.name))

    return NextResponse.json({
      classCode: normalizedCode,
      students: roster,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load class roster"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

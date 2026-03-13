import { NextResponse } from "next/server"
import { queryCollection } from "@/lib/firestore-rest"
import { requireTeacherAuth } from "@/lib/server-auth"
import type { ClassRecord, StudentRecord, TeacherDashboardData } from "@/lib/app-types"

export async function GET(request: Request) {
  try {
    const { teacher } = await requireTeacherAuth(request)
    const classes = await queryCollection<ClassRecord>("classes", "teacherId", teacher.id)

    const classesWithStudents = await Promise.all(
      classes.map(async (classRecord) => {
        const students = await queryCollection<StudentRecord>("students", "classCode", classRecord.code)
        return {
          code: classRecord.code,
          createdAt: classRecord.createdAt,
          students: students.sort((a, b) => a.name.localeCompare(b.name)),
        }
      }),
    )

    const payload: TeacherDashboardData = {
      teacher,
      classes: classesWithStudents.sort((a, b) => a.code.localeCompare(b.code)),
    }

    return NextResponse.json(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard"
    const status = message === "Missing authorization token" || message === "Invalid auth session" ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

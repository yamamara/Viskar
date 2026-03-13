import { randomInt } from "node:crypto"
import { NextResponse } from "next/server"
import type { ClassRecord, TeacherProfile } from "@/lib/app-types"
import { getDocument, setDocument } from "@/lib/firestore-rest"
import { requireTeacherAuth } from "@/lib/server-auth"

function generateClassCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let index = 0; index < 6; index += 1) {
    code += alphabet[randomInt(0, alphabet.length)]
  }
  return code
}

export async function POST(request: Request) {
  try {
    const { teacher } = await requireTeacherAuth(request)

    let classCode = generateClassCode()
    while (await getDocument<ClassRecord>("classes", classCode)) {
      classCode = generateClassCode()
    }

    const classRecord: ClassRecord = {
      code: classCode,
      teacherId: teacher.id,
      createdAt: new Date().toISOString(),
    }

    await setDocument("classes", classCode, classRecord)

    const nextTeacher: TeacherProfile = {
      ...teacher,
      classCodes: Array.from(new Set([...teacher.classCodes, classCode])).sort(),
    }
    await setDocument("teachers", teacher.id, nextTeacher)

    return NextResponse.json(classRecord, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create class"
    const status = message === "Missing authorization token" || message === "Invalid auth session" ? 401 : 500
    return NextResponse.json({ error: message }, { status })
  }
}

import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { getDocument, setDocument } from "@/lib/firestore-rest"
import { getDefaultModules, parseModules, type LessonsContentDocument } from "@/lib/lesson-content"
import { requireTeacherAuth } from "@/lib/server-auth"

const LESSONS_COLLECTION = "content"
const LESSONS_DOCUMENT_ID = "lessons"

export async function GET() {
  try {
    const document = await getDocument<LessonsContentDocument>(LESSONS_COLLECTION, LESSONS_DOCUMENT_ID)
    const modules = document?.modules ? parseModules(document.modules) : getDefaultModules()
    return NextResponse.json(modules)
  } catch (error) {
    console.error("Failed to load lessons:", error)
    return NextResponse.json({ error: "Failed to load lessons" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { teacher } = await requireTeacherAuth(request)
    const modules = parseModules(await request.json())

    const document: LessonsContentDocument = {
      id: LESSONS_DOCUMENT_ID,
      modules,
      updatedAt: new Date().toISOString(),
      updatedBy: teacher.id,
      updatedByEmail: teacher.email,
    }

    await setDocument<LessonsContentDocument>(LESSONS_COLLECTION, LESSONS_DOCUMENT_ID, document)

    return NextResponse.json({ success: true, updatedAt: document.updatedAt })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save lessons"
    const status =
      message === "Missing authorization token" || message === "Invalid auth session"
        ? 401
        : error instanceof ZodError
          ? 400
          : 500

    return NextResponse.json({ error: message }, { status })
  }
}

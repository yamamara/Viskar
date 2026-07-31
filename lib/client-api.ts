"use client"

import type {
  ClassRecord,
  ClassRosterResponse,
  StoredStudentRecord,
  StudentRecord,
  TeacherDashboardClass,
  TeacherDashboardData,
  TeacherProfile,
} from "@/lib/app-types"
import { CURRICULUM_VERSION } from "@/lib/curriculum-version"
import { getCurrentTeacherSession, getValidTeacherIdToken } from "@/lib/firebase-auth"
import { createDocument, getDocument, listCollection, setDocument } from "@/lib/firestore-client"
import { getDefaultModules, parseModules, resolveModules, type LessonsContentDocument } from "@/lib/lesson-content"
import type { Module } from "@/lib/lessons-data"
import { ensureAnonymousSession, getStudentIdToken, loadStudentSession } from "@/lib/student-session"

// Every call in this module talks to Firestore straight from the browser.
// Authorisation is Firestore's job (firestore.rules); the checks here exist to
// produce sensible messages, not to protect data.

const LESSONS_PATH = "content/lessons"
const CLASS_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
const CLASS_CODE_LENGTH = 6
/** How many devices may hold a claim on one student record. */
const MAX_STUDENT_AUTH_UIDS = 5

const classPath = (classCode: string) => `classes/${classCode}`
const studentsPath = (classCode: string) => `${classPath(classCode)}/students`
const studentPath = (classCode: string, studentId: string) => `${studentsPath(classCode)}/${studentId}`

function normalizeClassCode(classCode: string) {
  return String(classCode || "").trim().toUpperCase()
}

function toPublicStudentRecord(student: StoredStudentRecord): StudentRecord {
  const { authUids: _authUids, ...publicRecord } = student
  return publicRecord
}

async function requireTeacherToken() {
  const token = await getValidTeacherIdToken()
  if (!token) {
    throw new Error("Missing teacher session")
  }
  return token
}

function requireTeacherUid() {
  const session = getCurrentTeacherSession()
  if (!session) {
    throw new Error("Missing teacher session")
  }
  return session.uid
}

/** Whichever identity this browser already has. Lessons are readable by both roles. */
async function getReadToken() {
  return (await getValidTeacherIdToken()) ?? (await getStudentIdToken())
}

function generateClassCode() {
  const bytes = new Uint32Array(CLASS_CODE_LENGTH)
  crypto.getRandomValues(bytes)

  return Array.from(bytes)
    .map((byte) => CLASS_CODE_ALPHABET[byte % CLASS_CODE_ALPHABET.length])
    .join("")
}

async function requireClass(classCode: string, idToken: string) {
  const classRecord = await getDocument<ClassRecord>(classPath(classCode), idToken)
  if (!classRecord) {
    throw new Error("Invalid class code. Please check with your teacher.")
  }
  return classRecord
}

async function requireStoredStudent(classCode: string, studentId: string, idToken: string) {
  const student = await getDocument<StoredStudentRecord>(studentPath(classCode, studentId), idToken)
  if (!student) {
    throw new Error("Student not found")
  }
  return student
}

function requireStudentId(classCode: string) {
  const session = loadStudentSession(classCode)
  if (!session?.studentId) {
    throw new Error("Missing student session")
  }
  return session.studentId
}

/* ------------------------------------------------------------------ lessons */

export async function loadLessons(): Promise<Module[]> {
  try {
    const document = await getDocument<LessonsContentDocument>(LESSONS_PATH, await getReadToken())
    // A stored curriculum is only trusted when it matches the bundled version.
    return resolveModules(document).modules
  } catch (error) {
    console.error("Failed to load lessons:", error)
    return getDefaultModules()
  }
}

export async function saveLessons(input: unknown) {
  const idToken = await requireTeacherToken()
  const session = getCurrentTeacherSession()
  if (!session) {
    throw new Error("Missing teacher session")
  }

  const document: LessonsContentDocument = {
    id: "lessons",
    version: CURRICULUM_VERSION,
    modules: parseModules(input),
    updatedAt: new Date().toISOString(),
    updatedBy: session.uid,
    updatedByEmail: session.email,
  }

  await setDocument<LessonsContentDocument>(LESSONS_PATH, document, idToken)
  return { success: true, updatedAt: document.updatedAt }
}

/* ----------------------------------------------------------------- students */

export async function fetchClassRoster(classCode: string): Promise<ClassRosterResponse> {
  const normalizedCode = normalizeClassCode(classCode)
  if (!normalizedCode) {
    throw new Error("Class code is required")
  }

  const idToken = await getStudentIdToken()
  await requireClass(normalizedCode, idToken)

  const students = await listCollection<StoredStudentRecord>(studentsPath(normalizedCode), idToken)

  return {
    classCode: normalizedCode,
    students: students
      .map((student) => ({ id: student.id, name: student.name }))
      .sort((left, right) => left.name.localeCompare(right.name)),
  }
}

export async function joinClass(classCode: string, name: string): Promise<StudentRecord> {
  const normalizedCode = normalizeClassCode(classCode)
  const normalizedName = String(name || "").trim()

  if (!normalizedCode) {
    throw new Error("Class code is required")
  }
  if (!normalizedName) {
    throw new Error("Student name is required")
  }

  const { uid, idToken } = await ensureAnonymousSession()
  await requireClass(normalizedCode, idToken)

  const studentId = crypto.randomUUID()
  const student: StoredStudentRecord = {
    id: studentId,
    name: normalizedName,
    classCode: normalizedCode,
    currentModule: 1,
    currentLesson: 1,
    currentStage: 1,
    completedStages: [],
    createdAt: new Date().toISOString(),
    authUids: [uid],
  }

  await createDocument(studentsPath(normalizedCode), studentId, student, idToken)
  return toPublicStudentRecord(student)
}

/**
 * Claims an existing student record for this browser. As before, knowing the
 * class code is the only thing standing between a student and someone else's
 * name in the list.
 */
export async function continueAsStudent(classCode: string, studentId: string): Promise<StudentRecord> {
  const normalizedCode = normalizeClassCode(classCode)
  const normalizedStudentId = String(studentId || "").trim()

  if (!normalizedCode || !normalizedStudentId) {
    throw new Error("Class code and student are required")
  }

  const { uid, idToken } = await ensureAnonymousSession()
  const student = await requireStoredStudent(normalizedCode, normalizedStudentId, idToken)

  if (!student.authUids?.includes(uid)) {
    const authUids = [...(student.authUids || []), uid].slice(-MAX_STUDENT_AUTH_UIDS)
    await setDocument(studentPath(normalizedCode, normalizedStudentId), { authUids }, idToken)
    student.authUids = authUids
  }

  return toPublicStudentRecord(student)
}

export async function loadStudentRecord(classCode: string): Promise<StudentRecord> {
  const normalizedCode = normalizeClassCode(classCode)
  const studentId = requireStudentId(normalizedCode)
  const { uid, idToken } = await ensureAnonymousSession()

  const student = await requireStoredStudent(normalizedCode, studentId, idToken)
  if (!student.authUids?.includes(uid)) {
    // This browser lost its claim — the record was taken over elsewhere, or the
    // anonymous account was replaced. Treat it as no session at all.
    throw new Error("Student session not found")
  }

  return toPublicStudentRecord(student)
}

export async function saveStudentProgress(
  classCode: string,
  update: {
    currentModule: number
    currentLesson: number
    currentStage: number
    completedStageKey?: string
  },
): Promise<StudentRecord> {
  const normalizedCode = normalizeClassCode(classCode)
  const studentId = requireStudentId(normalizedCode)
  const idToken = await getStudentIdToken()

  const student = await requireStoredStudent(normalizedCode, studentId, idToken)
  const completedStages = update.completedStageKey
    ? Array.from(new Set([...student.completedStages, String(update.completedStageKey)]))
    : student.completedStages

  const progress = {
    currentModule: Number(update.currentModule),
    currentLesson: Number(update.currentLesson),
    currentStage: Number(update.currentStage),
    completedStages,
  }

  await setDocument(studentPath(normalizedCode, studentId), progress, idToken)
  return toPublicStudentRecord({ ...student, ...progress })
}

export async function resetStudentProgress(classCode: string): Promise<StudentRecord> {
  const normalizedCode = normalizeClassCode(classCode)
  const studentId = requireStudentId(normalizedCode)
  const idToken = await getStudentIdToken()

  const student = await requireStoredStudent(normalizedCode, studentId, idToken)
  const progress = {
    currentModule: 1,
    currentLesson: 1,
    currentStage: 1,
    completedStages: [] as string[],
  }

  await setDocument(studentPath(normalizedCode, studentId), progress, idToken)
  return toPublicStudentRecord({ ...student, ...progress })
}

/* ----------------------------------------------------------------- teachers */

async function requireTeacherProfile(uid: string, idToken: string): Promise<TeacherProfile> {
  const teacher = await getDocument<TeacherProfile>(`teachers/${uid}`, idToken)
  if (teacher) {
    return { ...teacher, classCodes: teacher.classCodes || [] }
  }

  const session = getCurrentTeacherSession()
  return setDocument<TeacherProfile>(
    `teachers/${uid}`,
    {
      id: uid,
      email: session?.email || "",
      classCodes: [],
      createdAt: new Date().toISOString(),
    },
    idToken,
  )
}

export async function createClass(): Promise<ClassRecord> {
  const idToken = await requireTeacherToken()
  const uid = requireTeacherUid()
  const teacher = await requireTeacherProfile(uid, idToken)

  // createDocument fails rather than overwriting, so a collision with a class
  // owned by another teacher — which this teacher cannot read — is still safe.
  let classRecord: ClassRecord | null = null
  for (let attempt = 0; attempt < 5 && !classRecord; attempt += 1) {
    const candidate: ClassRecord = {
      code: generateClassCode(),
      teacherId: uid,
      createdAt: new Date().toISOString(),
    }

    try {
      classRecord = await createDocument("classes", candidate.code, candidate, idToken)
    } catch (error) {
      if (!(error instanceof Error) || error.message !== "ALREADY_EXISTS") {
        throw error
      }
    }
  }

  if (!classRecord) {
    throw new Error("Could not allocate a class code. Please try again.")
  }

  await setDocument<Pick<TeacherProfile, "classCodes">>(
    `teachers/${uid}`,
    { classCodes: Array.from(new Set([...teacher.classCodes, classRecord.code])).sort() },
    idToken,
  )

  return classRecord
}

export async function loadTeacherDashboard(): Promise<TeacherDashboardData> {
  const idToken = await requireTeacherToken()
  const uid = requireTeacherUid()
  const teacher = await requireTeacherProfile(uid, idToken)

  const classes = await Promise.all(
    teacher.classCodes.map(async (code): Promise<TeacherDashboardClass | null> => {
      const classRecord = await getDocument<ClassRecord>(classPath(code), idToken)
      if (!classRecord) return null

      const students = await listCollection<StoredStudentRecord>(studentsPath(code), idToken)

      return {
        code: classRecord.code,
        createdAt: classRecord.createdAt,
        students: students.map(toPublicStudentRecord).sort((a, b) => a.name.localeCompare(b.name)),
      }
    }),
  )

  return {
    teacher,
    classes: classes
      .filter((entry): entry is TeacherDashboardClass => entry !== null)
      .sort((a, b) => a.code.localeCompare(b.code)),
  }
}

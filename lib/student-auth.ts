import { createHash, timingSafeEqual, randomBytes } from "node:crypto"
import type { StudentRecord } from "@/lib/app-types"
import { getDocument, setDocument } from "@/lib/firestore-rest"

interface StoredStudentRecord extends StudentRecord {
  sessionHash: string
}

function hashStudentSessionToken(sessionToken: string) {
  return createHash("sha256").update(sessionToken).digest("hex")
}

function sanitizeStudentRecord(student: StoredStudentRecord): StudentRecord {
  const { sessionHash: _sessionHash, ...safeStudent } = student
  return safeStudent
}

export function createStudentSessionToken() {
  return randomBytes(32).toString("hex")
}

export function createStoredStudentRecord(student: StudentRecord, sessionToken: string): StoredStudentRecord {
  return {
    ...student,
    sessionHash: hashStudentSessionToken(sessionToken),
  }
}

export async function getStoredStudent(studentId: string) {
  return getDocument<StoredStudentRecord>("students", studentId)
}

export async function getAuthorizedStudent(studentId: string, classCode: string, sessionToken: string) {
  const student = await getStoredStudent(studentId)
  if (!student || student.classCode !== classCode) {
    return null
  }

  if (!student.sessionHash || !sessionToken) {
    return null
  }

  const expected = Buffer.from(student.sessionHash, "hex")
  const actual = Buffer.from(hashStudentSessionToken(sessionToken), "hex")
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null
  }

  return student
}

export async function saveStoredStudent(student: StoredStudentRecord) {
  return setDocument<StoredStudentRecord>("students", student.id, student)
}

export function toPublicStudentRecord(student: StoredStudentRecord) {
  return sanitizeStudentRecord(student)
}

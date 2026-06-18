import { createHash, timingSafeEqual, randomBytes } from "node:crypto"
import type { StudentRecord } from "@/lib/app-types"
import { getDocument, setDocument } from "@/lib/firestore-rest"

interface StoredStudentRecord extends StudentRecord {
  sessionHash?: string
  sessionHashes?: string[]
}

function hashStudentSessionToken(sessionToken: string) {
  return createHash("sha256").update(sessionToken).digest("hex")
}

function getSessionHashes(student: StoredStudentRecord) {
  if (Array.isArray(student.sessionHashes) && student.sessionHashes.length > 0) {
    return student.sessionHashes
  }

  return student.sessionHash ? [student.sessionHash] : []
}

function sanitizeStudentRecord(student: StoredStudentRecord): StudentRecord {
  const { sessionHash: _sessionHash, sessionHashes: _sessionHashes, ...safeStudent } = student
  return safeStudent
}

export function createStudentSessionToken() {
  return randomBytes(32).toString("hex")
}

export function createStoredStudentRecord(student: StudentRecord, sessionToken: string): StoredStudentRecord {
  return {
    ...student,
    sessionHashes: [hashStudentSessionToken(sessionToken)],
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

  const sessionHashes = getSessionHashes(student)
  if (sessionHashes.length === 0 || !sessionToken) {
    return null
  }

  const actual = Buffer.from(hashStudentSessionToken(sessionToken), "hex")
  const isAuthorized = sessionHashes.some((hash) => {
    const expected = Buffer.from(hash, "hex")
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  })

  if (!isAuthorized) {
    return null
  }

  return {
    ...student,
    sessionHashes,
  }
}

export function addStudentSession(student: StoredStudentRecord, sessionToken: string): StoredStudentRecord {
  const sessionHash = hashStudentSessionToken(sessionToken)
  const sessionHashes = Array.from(new Set([...getSessionHashes(student), sessionHash])).slice(-5)

  return {
    ...student,
    sessionHashes,
  }
}

export async function saveStoredStudent(student: StoredStudentRecord) {
  return setDocument<StoredStudentRecord>("students", student.id, {
    ...student,
    sessionHashes: getSessionHashes(student),
  })
}

export function toPublicStudentRecord(student: StoredStudentRecord) {
  return sanitizeStudentRecord(student)
}

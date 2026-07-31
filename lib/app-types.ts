export interface StudentRecord {
  id: string
  name: string
  classCode: string
  currentModule: number
  currentLesson: number
  currentStage: number
  completedStages: string[]
  createdAt: string
}

/**
 * The stored shape of a student. `authUids` holds the anonymous Firebase uids
 * allowed to write this record — one per device, capped so a shared classroom
 * machine does not grow the list forever. It is stripped before the record
 * reaches the UI.
 */
export interface StoredStudentRecord extends StudentRecord {
  authUids?: string[]
}

export interface StudentClientSession {
  studentId: string
}

export interface ClassRosterResponse {
  classCode: string
  students: StudentRosterEntry[]
}

export interface StudentRosterEntry {
  id: string
  name: string
}

export interface TeacherProfile {
  id: string
  email: string
  classCodes: string[]
  createdAt: string
}

export interface ClassRecord {
  code: string
  teacherId: string
  createdAt: string
}

export interface TeacherDashboardClass {
  code: string
  createdAt: string
  students: StudentRecord[]
}

export interface TeacherDashboardData {
  teacher: TeacherProfile
  classes: TeacherDashboardClass[]
}

export interface TeacherSession {
  uid: string
  email: string
  idToken: string
  refreshToken: string
  expiresAt: number
}

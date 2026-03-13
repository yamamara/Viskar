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

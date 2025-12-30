// Local storage utilities for managing app state
export interface Student {
  id: string
  name: string
  classCode: string
  currentModule: number
  currentLesson: number
  currentStage: number
  completedStages: string[] // Format: "moduleId-lessonId-stageId"
  createdAt: string
}

export interface Teacher {
  id: string
  email: string
  password: string // In production, this would be hashed
  classCodes: string[]
  createdAt: string
}

export interface ClassCode {
  code: string
  teacherId: string
  createdAt: string
  students: string[] // Student IDs
}

export const storage = {
  // Student methods
  getStudent: (classCode: string): Student | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(`student_${classCode}`)
    return data ? JSON.parse(data) : null
  },

  setStudent: (student: Student): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(`student_${student.classCode}`, JSON.stringify(student))
  },

  updateStudentProgress: (
    classCode: string,
    module: number,
    lesson: number,
    stage: number,
    completed: boolean,
  ): void => {
    const student = storage.getStudent(classCode)
    if (!student) return

    const stageId = `${module}-${lesson}-${stage}`
    if (completed && !student.completedStages.includes(stageId)) {
      student.completedStages.push(stageId)
    }

    student.currentModule = module
    student.currentLesson = lesson
    student.currentStage = stage

    storage.setStudent(student)
  },

  // Teacher methods
  getTeacher: (email: string): Teacher | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(`teacher_${email}`)
    return data ? JSON.parse(data) : null
  },

  setTeacher: (teacher: Teacher): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(`teacher_${teacher.email}`, JSON.stringify(teacher))
  },

  // Class code methods
  getClassCode: (code: string): ClassCode | null => {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(`class_${code}`)
    return data ? JSON.parse(data) : null
  },

  setClassCode: (classCode: ClassCode): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(`class_${classCode.code}`, JSON.stringify(classCode))
  },

  generateClassCode: (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  },

  getAllTeachers: (): Teacher[] => {
    if (typeof window === "undefined") return []
    const teachers: Teacher[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("teacher_")) {
        const data = localStorage.getItem(key)
        if (data) teachers.push(JSON.parse(data))
      }
    }
    return teachers
  },

  getAllStudentsForClass: (classCode: string): Student[] => {
    if (typeof window === "undefined") return []
    const classData = storage.getClassCode(classCode)
    if (!classData) return []

    return classData.students
      .map((id) => {
        const data = localStorage.getItem(`student_${id}`)
        return data ? JSON.parse(data) : null
      })
      .filter(Boolean)
  },
}

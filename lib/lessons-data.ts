import lessonsData from "./lessons.json"

// Lesson content and structure
export interface TestCase {
  input: string
  expectedOutput: string
  description: string
}

export interface Stage {
  id: number
  type: 'exercise' | 'lesson'
  title: string
  description: string
  instructions: string
  starterCode?: string
  testCases?: TestCase[]
  hint?: string
}

export interface Lesson {
  id: number
  title: string
  description: string
  stages: Stage[]
}

export interface Module {
  id: number
  title: string
  description: string
  lessons: Lesson[]
}

export const modules: Module[] = (Array.isArray(lessonsData) ? lessonsData : (lessonsData as any).modules || []) as Module[]

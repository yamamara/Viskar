import lessonsData from "./lessons.json"

// Lesson content and structure
/**
 * How a test case's `expectedOutput` is compared against what the program
 * printed. Omitting `match` means an exact literal comparison, which is the
 * only safe default: expected output routinely contains brackets, parentheses,
 * dots and backslashes that would otherwise be read as regex metacharacters.
 */
export type MatchMode = "exact" | "contains" | "regex"

export interface TestCase {
  /** Newline-delimited text supplied to the program's `input()` calls. */
  input: string
  expectedOutput: string
  description: string
  match?: MatchMode
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

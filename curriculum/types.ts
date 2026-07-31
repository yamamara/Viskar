/**
 * Authoring types for the curriculum source.
 *
 * These deliberately omit `id` fields. IDs are assigned by
 * `scripts/build-curriculum.ts` from array position, which makes the
 * "consecutive integers starting at 1" rule structurally impossible to break.
 *
 * Exercises carry a `solution` here. The build strips it, so reference
 * solutions are validated but never shipped to students in `lib/lessons.json`.
 */

export type MatchMode = "exact" | "contains" | "regex"

export interface TestCaseSource {
  /** Newline-delimited stdin. Omit when the program reads no input. */
  input?: string
  expectedOutput: string
  /** Explains the behaviour under test without giving away the solution. */
  description: string
  match?: MatchMode
  /**
   * Set when the program is correct to print nothing at all. Without it the
   * validator treats an empty expectedOutput as an authoring slip.
   */
  expectEmpty?: boolean
}

export interface LessonStageSource {
  type: "lesson"
  title: string
  description: string
  instructions: string
}

export interface ExerciseStageSource {
  type: "exercise"
  title: string
  description: string
  instructions: string
  /** Must be syntactically valid Python even before the student edits it. */
  starterCode: string
  /**
   * Set only for repair exercises whose whole point is to hand the student
   * code that does not compile. The validator asserts that flagged starter
   * code really is broken, so the flag cannot go stale.
   */
  starterIsBroken?: boolean
  hint: string
  tests: TestCaseSource[]
  /** Reference solution: validated against `tests`, stripped from the build. */
  solution: string
}

export type StageSource = LessonStageSource | ExerciseStageSource

export interface LessonSource {
  title: string
  description: string
  stages: StageSource[]
}

export interface ModuleSource {
  title: string
  description: string
  lessons: LessonSource[]
}

/** Convenience helpers that keep the module files readable. */
export function lesson(
  title: string,
  description: string,
  stages: StageSource[],
): LessonSource {
  return { title, description, stages }
}

export function module(
  title: string,
  description: string,
  lessons: LessonSource[],
): ModuleSource {
  return { title, description, lessons }
}

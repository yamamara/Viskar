/**
 * Compiles the authored curriculum in `curriculum/` into `lib/lessons.json`.
 *
 * Run with:  node scripts/build-curriculum.ts
 *
 * The output is deterministic: IDs come from array position and keys are
 * emitted in a fixed order, so rebuilding without content changes produces a
 * byte-identical file. The application reads the committed JSON directly and
 * never runs this script at runtime.
 */
import { writeFileSync, readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { curriculum } from "../curriculum/index.ts"
import type { ExerciseStageSource, StageSource } from "../curriculum/types.ts"

const here = dirname(fileURLToPath(import.meta.url))
const outputPath = join(here, "..", "lib", "lessons.json")

interface BuiltTestCase {
  input: string
  expectedOutput: string
  description: string
  match?: string
}

interface BuiltStage {
  id: number
  type: "lesson" | "exercise"
  title: string
  description: string
  instructions: string
  starterCode?: string
  testCases?: BuiltTestCase[]
  hint?: string
}

function buildStage(stage: StageSource, index: number): BuiltStage {
  const base: BuiltStage = {
    id: index + 1,
    type: stage.type,
    title: stage.title,
    description: stage.description,
    instructions: stage.instructions,
  }

  if (stage.type !== "exercise") return base

  const exercise = stage as ExerciseStageSource
  return {
    ...base,
    starterCode: exercise.starterCode,
    testCases: exercise.tests.map((test) => {
      const built: BuiltTestCase = {
        input: test.input ?? "",
        expectedOutput: test.expectedOutput,
        description: test.description,
      }
      // Only persist a match mode when it differs from the safe default.
      if (test.match && test.match !== "exact") built.match = test.match
      return built
    }),
    hint: exercise.hint,
  }
}

const modules = curriculum.map((source, moduleIndex) => ({
  id: moduleIndex + 1,
  title: source.title,
  description: source.description,
  lessons: source.lessons.map((lessonSource, lessonIndex) => ({
    id: lessonIndex + 1,
    title: lessonSource.title,
    description: lessonSource.description,
    stages: lessonSource.stages.map(buildStage),
  })),
}))

const json = JSON.stringify(modules, null, 2) + "\n"

let previous = ""
try {
  previous = readFileSync(outputPath, "utf8")
} catch {
  /* first build */
}

writeFileSync(outputPath, json, "utf8")

let lessons = 0
let stages = 0
let exercises = 0
let tests = 0
let words = 0

for (const moduleItem of modules) {
  for (const lessonItem of moduleItem.lessons) {
    lessons += 1
    for (const stage of lessonItem.stages) {
      stages += 1
      if (stage.type === "exercise") {
        exercises += 1
        tests += stage.testCases?.length ?? 0
      }
      words += `${stage.instructions} ${stage.description}`.split(/\s+/).filter(Boolean).length
    }
  }
}

console.log(`Wrote ${outputPath}`)
console.log(`  modules   ${modules.length}`)
console.log(`  lessons   ${lessons}`)
console.log(`  stages    ${stages}`)
console.log(`  exercises ${exercises}`)
console.log(`  tests     ${tests}`)
console.log(`  words     ${words.toLocaleString("en-US")}`)
console.log(previous === json ? "  (unchanged)" : "  (updated)")

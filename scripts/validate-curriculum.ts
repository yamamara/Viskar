/**
 * Validates the built curriculum in `lib/lessons.json`.
 *
 * Run with:  node scripts/validate-curriculum.ts
 *
 * Structural and editorial checks run here in Node. Python-level checks — that
 * every fenced example compiles, that starter code compiles, and that every
 * reference solution actually passes its own tests — are delegated to
 * `scripts/check-python.py`, which is invoked at the end when python3 is
 * available.
 */
import { readFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"
import { spawnSync } from "node:child_process"
import { curriculum } from "../curriculum/index.ts"
import type { ExerciseStageSource } from "../curriculum/types.ts"

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, "..")
const jsonPath = join(root, "lib", "lessons.json")

const errors: string[] = []
const warnings: string[] = []

function fail(where: string, message: string) {
  errors.push(`${where}: ${message}`)
}

function warn(where: string, message: string) {
  warnings.push(`${where}: ${message}`)
}

/* ---------------------------------------------------------------- parsing */

const raw = readFileSync(jsonPath, "utf8")
let data: unknown
try {
  data = JSON.parse(raw)
} catch (error) {
  console.error(`lib/lessons.json is not valid JSON: ${(error as Error).message}`)
  process.exit(1)
}

if (!Array.isArray(data)) {
  console.error("lib/lessons.json must contain an array of modules")
  process.exit(1)
}

const modules = data as Array<Record<string, any>>

/* ------------------------------------------------------------ definitions */

const ALLOWED_STAGE_TYPES = new Set(["lesson", "exercise"])
const ALLOWED_MATCH_MODES = new Set(["exact", "contains", "regex"])

const PLACEHOLDER_PATTERNS: Array<[RegExp, string]> = [
  [/\bTODO\b/i, "contains TODO"],
  [/\bFIXME\b/i, "contains FIXME"],
  [/\blorem ipsum\b/i, "contains lorem ipsum"],
  [/^New (Module|Lesson|Stage)$/i, "is a placeholder title"],
  [/^Description of the new /i, "is placeholder description text"],
  [/^Test Case \d+$/i, "is a placeholder test description"],
  [/\bxxx+\b/i, "contains placeholder xxx"],
  [/\bcoming soon\b/i, "contains 'coming soon'"],
]

/** Flags titles that look like a slipped keyboard rather than English. */
function looksCorrupted(text: string): boolean {
  if (/[A-Z]{5,}/.test(text.replace(/\b(CSV|JSON|HTML|HTTP|API|PEP|IDE|URL|UTF)\b/g, ""))) return true
  if (/([bcdfghjklmnpqrstvwxz])\1{2,}/i.test(text)) return true
  if (/[a-z]{4,}[A-Z]{3,}/.test(text)) return true
  return false
}

function checkPlaceholders(where: string, text: string, field: string) {
  for (const [pattern, description] of PLACEHOLDER_PATTERNS) {
    if (pattern.test(text.trim())) fail(where, `${field} ${description}`)
  }
}

/** Verifies every ``` fence is opened and closed, and uses a known language. */
function checkFences(where: string, markdown: string) {
  const lines = markdown.split("\n")
  let open: string | null = null
  let openedAt = 0
  const known = new Set(["python", "text", "", "json", "csv", "bash"])

  lines.forEach((line, index) => {
    const match = /^\s*```(.*)$/.exec(line)
    if (!match) return
    const info = match[1].trim()
    if (open === null) {
      open = info
      openedAt = index + 1
      if (!known.has(info)) fail(where, `unknown code fence language "${info}" on line ${index + 1}`)
    } else {
      if (info !== "") fail(where, `fence closed with an info string "${info}" on line ${index + 1}`)
      open = null
    }
  })

  if (open !== null) fail(where, `unclosed code fence opened on line ${openedAt}`)
}

/** Markdown tables are not supported by the renderer (no GFM plugin). */
function checkNoTables(where: string, markdown: string) {
  const inFence = { value: false }
  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence.value = !inFence.value
      continue
    }
    if (inFence.value) continue
    if (/^\s*\|.*\|\s*$/.test(line)) {
      fail(where, "contains a Markdown table, which the renderer does not support")
      return
    }
  }
}

function checkNoRawHtml(where: string, markdown: string) {
  let inFence = false
  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue
    if (/<(div|span|br|img|table|p|b|i|u|h[1-6])\b/i.test(line)) {
      fail(where, "contains raw HTML")
      return
    }
  }
}

/* --------------------------------------------- authoring-source cross-refs */

/** Tests explicitly authored to expect no output at all. */
const emptyOk = new Set<string>()
curriculum.forEach((moduleSource, moduleIndex) => {
  moduleSource.lessons.forEach((lessonSource, lessonIndex) => {
    lessonSource.stages.forEach((stage, stageIndex) => {
      if (stage.type !== "exercise") return
      const exercise = stage as ExerciseStageSource
      exercise.tests.forEach((test, testIndex) => {
        if (!test.expectEmpty) return
        const where =
          `module ${moduleIndex + 1} / lesson ${lessonIndex + 1} "${lessonSource.title}"` +
          ` / stage ${stageIndex + 1} "${stage.title}"`
        emptyOk.add(`${where}#${testIndex}`)
      })
    })
  })
})

/* -------------------------------------------------------------- structure */

let lessonCount = 0
let stageCount = 0
let exerciseCount = 0
let testCount = 0
let instructionWords = 0

if (modules.length === 0) fail("curriculum", "contains no modules")

const moduleTitles = new Set<string>()

modules.forEach((moduleItem, moduleIndex) => {
  const where = `module ${moduleItem.id ?? moduleIndex + 1}`

  if (moduleItem.id !== moduleIndex + 1) {
    fail(where, `id is ${moduleItem.id}, expected ${moduleIndex + 1} (IDs must be consecutive from 1)`)
  }
  for (const field of ["title", "description"]) {
    if (typeof moduleItem[field] !== "string" || moduleItem[field].trim() === "") {
      fail(where, `${field} is missing or empty`)
    }
  }
  if (moduleTitles.has(moduleItem.title)) fail(where, `duplicate module title "${moduleItem.title}"`)
  moduleTitles.add(moduleItem.title)

  checkPlaceholders(where, moduleItem.title ?? "", "title")
  checkPlaceholders(where, moduleItem.description ?? "", "description")
  if (looksCorrupted(moduleItem.title ?? "")) fail(where, `title looks corrupted: "${moduleItem.title}"`)

  if (!Array.isArray(moduleItem.lessons) || moduleItem.lessons.length === 0) {
    fail(where, "has no lessons")
    return
  }

  const lessonTitles = new Set<string>()

  moduleItem.lessons.forEach((lessonItem: Record<string, any>, lessonIndex: number) => {
    lessonCount += 1
    const lessonWhere = `${where} / lesson ${lessonItem.id ?? lessonIndex + 1} "${lessonItem.title}"`

    if (lessonItem.id !== lessonIndex + 1) {
      fail(lessonWhere, `id is ${lessonItem.id}, expected ${lessonIndex + 1} (lesson IDs restart at 1 per module)`)
    }
    for (const field of ["title", "description"]) {
      if (typeof lessonItem[field] !== "string" || lessonItem[field].trim() === "") {
        fail(lessonWhere, `${field} is missing or empty`)
      }
    }
    if (lessonTitles.has(lessonItem.title)) fail(lessonWhere, `duplicate lesson title within the module`)
    lessonTitles.add(lessonItem.title)

    checkPlaceholders(lessonWhere, lessonItem.title ?? "", "title")
    checkPlaceholders(lessonWhere, lessonItem.description ?? "", "description")
    if (looksCorrupted(lessonItem.title ?? "")) fail(lessonWhere, `title looks corrupted: "${lessonItem.title}"`)

    if (!Array.isArray(lessonItem.stages) || lessonItem.stages.length === 0) {
      fail(lessonWhere, "has no stages")
      return
    }

    const stageTitles = new Set<string>()
    let lessonExercises = 0

    lessonItem.stages.forEach((stage: Record<string, any>, stageIndex: number) => {
      stageCount += 1
      const stageWhere = `${lessonWhere} / stage ${stage.id ?? stageIndex + 1} "${stage.title}"`

      if (stage.id !== stageIndex + 1) {
        fail(stageWhere, `id is ${stage.id}, expected ${stageIndex + 1} (stage IDs restart at 1 per lesson)`)
      }
      if (!ALLOWED_STAGE_TYPES.has(stage.type)) {
        fail(stageWhere, `unsupported stage type "${stage.type}"`)
      }
      for (const field of ["title", "description", "instructions"]) {
        if (typeof stage[field] !== "string" || stage[field].trim() === "") {
          fail(stageWhere, `${field} is missing or empty`)
        }
      }
      if (stageTitles.has(stage.title)) fail(stageWhere, "duplicate stage title within the lesson")
      stageTitles.add(stage.title)

      checkPlaceholders(stageWhere, stage.title ?? "", "title")
      checkPlaceholders(stageWhere, stage.description ?? "", "description")
      checkPlaceholders(stageWhere, stage.instructions ?? "", "instructions")
      if (looksCorrupted(stage.title ?? "")) fail(stageWhere, `title looks corrupted: "${stage.title}"`)

      const instructions: string = stage.instructions ?? ""
      checkFences(stageWhere, instructions)
      checkNoTables(stageWhere, instructions)
      checkNoRawHtml(stageWhere, instructions)
      instructionWords += instructions.split(/\s+/).filter(Boolean).length

      if (stage.type === "lesson") {
        const words = instructions.split(/\s+/).filter(Boolean).length
        if (words < 300) warn(stageWhere, `instructional stage is short (${words} words)`)
        if (stage.testCases) fail(stageWhere, "a lesson stage must not carry test cases")
        if (stage.starterCode) fail(stageWhere, "a lesson stage must not carry starter code")
      }

      if (stage.type === "exercise") {
        exerciseCount += 1
        lessonExercises += 1

        if (typeof stage.starterCode !== "string" || stage.starterCode.trim() === "") {
          fail(stageWhere, "exercise has no starter code")
        }
        if (typeof stage.hint !== "string" || stage.hint.trim() === "") {
          fail(stageWhere, "exercise has no hint")
        }
        if (!Array.isArray(stage.testCases) || stage.testCases.length === 0) {
          fail(stageWhere, "exercise has no test cases")
        } else {
          stage.testCases.forEach((test: Record<string, any>, testIndex: number) => {
            testCount += 1
            const testWhere = `${stageWhere} / test ${testIndex + 1}`
            if (typeof test.input !== "string") fail(testWhere, "input must be a string")
            if (typeof test.expectedOutput !== "string") fail(testWhere, "expectedOutput must be a string")
            if (typeof test.description !== "string" || test.description.trim() === "") {
              fail(testWhere, "description is empty")
            }
            if (test.expectedOutput === "" && test.match !== "contains" && !emptyOk.has(`${stageWhere}#${testIndex}`)) {
              fail(testWhere, "expectedOutput is empty (set expectEmpty if the program prints nothing)")
            }
            if (test.match !== undefined && !ALLOWED_MATCH_MODES.has(test.match)) {
              fail(testWhere, `unknown match mode "${test.match}"`)
            }
            checkPlaceholders(testWhere, test.description ?? "", "description")
          })

          const signatures = stage.testCases.map(
            (t: Record<string, any>) => `${t.input} ${t.expectedOutput}`,
          )
          if (new Set(signatures).size !== signatures.length) {
            warn(stageWhere, "has duplicate test cases (same input and expected output)")
          }
        }
        if ("solution" in stage) fail(stageWhere, "reference solution leaked into shipped data")
      }
    })

    if (lessonExercises === 0) warn(lessonWhere, "has no graded exercises")
  })
})

/* ------------------------------------------------------------ course size */

const REQUIREMENTS = [
  ["modules", modules.length, 12, 13],
  ["lessons", lessonCount, 45, 60],
  ["stages", stageCount, 180, 260],
  ["exercises", exerciseCount, 90, Number.POSITIVE_INFINITY],
  ["instruction words", instructionWords, 50000, Number.POSITIVE_INFINITY],
] as const

/* ------------------------------------------------- python-level validation */

function runPythonChecks(): boolean {
  const checker = join(here, "check-python.py")
  if (!existsSync(checker)) {
    warn("python checks", "scripts/check-python.py is missing; skipped")
    return true
  }

  // Reference solutions live only in the authoring source, never in the build.
  const exercises: Array<Record<string, unknown>> = []
  curriculum.forEach((moduleSource, moduleIndex) => {
    moduleSource.lessons.forEach((lessonSource, lessonIndex) => {
      lessonSource.stages.forEach((stage, stageIndex) => {
        if (stage.type !== "exercise") return
        const exercise = stage as ExerciseStageSource
        exercises.push({
          where: `${moduleIndex + 1}.${lessonIndex + 1}.${stageIndex + 1} ${exercise.title}`,
          starterCode: exercise.starterCode,
          starterIsBroken: exercise.starterIsBroken === true,
          solution: exercise.solution,
          tests: exercise.tests.map((test) => ({
            input: test.input ?? "",
            expectedOutput: test.expectedOutput,
            match: test.match ?? "exact",
          })),
        })
      })
    })
  })

  const snippets: Array<Record<string, unknown>> = []
  modules.forEach((moduleItem) => {
    moduleItem.lessons.forEach((lessonItem: Record<string, any>) => {
      lessonItem.stages.forEach((stage: Record<string, any>) => {
        const text: string = stage.instructions ?? ""
        const pattern = /```python\n([\s\S]*?)```/g
        let match: RegExpExecArray | null
        let index = 0
        while ((match = pattern.exec(text)) !== null) {
          index += 1
          snippets.push({
            where: `${moduleItem.id}.${lessonItem.id}.${stage.id} ${stage.title} (example ${index})`,
            code: match[1],
          })
        }
      })
    })
  })

  const payload = JSON.stringify({ exercises, snippets })
  const result = spawnSync("python3", [checker], { input: payload, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })

  if (result.error) {
    warn("python checks", `could not run python3 (${result.error.message}); skipped`)
    return true
  }
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  return result.status === 0
}

const pythonOk = runPythonChecks()

/* ----------------------------------------------------------------- report */

console.log("")
console.log("Curriculum totals")
for (const [label, actual, min, max] of REQUIREMENTS) {
  const withinMin = actual >= min
  const withinMax = actual <= max
  const status = withinMin && withinMax ? "ok  " : "FAIL"
  const range = max === Number.POSITIVE_INFINITY ? `min ${min.toLocaleString("en-US")}` : `${min}-${max}`
  console.log(`  ${status} ${label.padEnd(18)} ${actual.toLocaleString("en-US").padStart(7)}   (${range})`)
  if (!withinMin) fail("course size", `${label} is ${actual}, below the required minimum of ${min}`)
  if (!withinMax) fail("course size", `${label} is ${actual}, above the allowed maximum of ${max}`)
}
console.log(`  ---- ${"test cases".padEnd(18)} ${testCount.toLocaleString("en-US").padStart(7)}`)

if (warnings.length > 0) {
  console.log("")
  console.log(`Warnings (${warnings.length}):`)
  for (const warning of warnings.slice(0, 40)) console.log(`  - ${warning}`)
  if (warnings.length > 40) console.log(`  ...and ${warnings.length - 40} more`)
}

console.log("")
if (errors.length > 0 || !pythonOk) {
  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`)
    for (const error of errors.slice(0, 60)) console.log(`  - ${error}`)
    if (errors.length > 60) console.log(`  ...and ${errors.length - 60} more`)
  }
  console.log("")
  console.log("VALIDATION FAILED")
  process.exit(1)
}

console.log("VALIDATION PASSED")

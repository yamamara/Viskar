/**
 * Render every section of the course through the real student components.
 *
 * This catches what type checking cannot: a component that throws on some shape
 * of real content — a stage with no examples, a question with one option, an
 * annotation pointing past the end of a program. It renders the first state a
 * student sees, which is the one that must never fail.
 *
 * Run with:  npx tsx scripts/render-check.tsx
 */
import { renderToStaticMarkup } from "react-dom/server"
import { createElement } from "react"
import { StageActivity } from "@/components/learn/activities"
import { curriculum } from "@/lib/curriculum"
import { sectionKicker, STAGE_KIND_INFO, type Stage } from "@/lib/curriculum-types"

interface Failure {
  where: string
  message: string
}

/**
 * The state a section holds once the learner has answered it. Rendering this too
 * exercises the branches that only appear after an answer — the prediction
 * comparison, the explanation panels, the per-option feedback.
 */
function answeredState(stage: Stage): Record<string, unknown> {
  switch (stage.kind) {
    case "concept":
      return stage.check
        ? { check_value: stage.check.correct, check_submitted: true }
        : { confirmed: true }
    case "example":
      return {
        ran: true,
        ...(stage.question ? { question_value: stage.question.correct, question_submitted: true } : {}),
      }
    case "predict":
      // Deliberately a wrong answer: that branch has its own comparison panel.
      return { predict_value: [stage.question.correct[0] === 0 ? 1 : 0], predict_submitted: true, ran: true }
    case "trace":
      return {
        answers: stage.steps.map((step) => step.answers[0]),
        checked: stage.steps.map(() => true),
      }
    case "recall":
      return {
        values: Object.fromEntries(stage.questions.map((question) => [question.id, question.correct])),
        submitted: Object.fromEntries(stage.questions.map((question) => [question.id, true])),
      }
    case "debug":
    case "exercise":
      return { code: stage.kind === "debug" ? stage.brokenCode : stage.starterCode, passed: true }
    case "recap":
      return { ticked: stage.points.map(() => true), confirmed: true }
    case "checkpoint":
      return {
        fields: Object.fromEntries((stage.fields || []).map((field) => [field.id, "x".repeat(field.minLength ?? 1)])),
        checklist: (stage.checklist || []).map(() => true),
        passed: true,
      }
    case "reflect":
      return {
        fields: Object.fromEntries(stage.fields.map((field) => [field.id, "x".repeat(field.minLength ?? 1)])),
      }
  }
}

const failures: Failure[] = []
const empty: string[] = []
let rendered = 0
const byKind = new Map<string, number>()

for (const module of curriculum) {
  for (const lesson of module.lessons) {
    for (const stage of lesson.stages) {
      const number = `${module.id}.${lesson.id}.${stage.id}`
      const where = `${sectionKicker(stage, number)} — ${stage.title}`
      try {
        const html = renderToStaticMarkup(
          createElement(StageActivity, {
            stage: stage as Stage,
            state: {},
            onStateChange: () => {},
            onComplete: () => {},
            completed: false,
          }),
        )
        rendered += 1
        byKind.set(stage.kind, (byKind.get(stage.kind) ?? 0) + 1)

        // A section that renders almost nothing would be a silent hole in the book.
        const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
        if (text.length < 40) empty.push(`${where} (only ${text.length} characters of text)`)
        if (html.includes("not available in this version")) {
          failures.push({ where, message: `unknown section kind "${stage.kind}"` })
        }

        // Curriculum markdown must never reach the page as raw punctuation.
        const prose = html.replace(/<table[\s\S]*?<\/table>/g, "").replace(/<pre[\s\S]*?<\/pre>/g, "")
        const strayTicks = (prose.match(/`/g) || []).length
        if (strayTicks > 0) {
          failures.push({ where, message: `${strayTicks} literal backtick(s) shown to the student` })
        }
      } catch (error) {
        failures.push({ where, message: error instanceof Error ? error.message : String(error) })
      }

      // Second pass: the state after the learner has answered.
      try {
        const html = renderToStaticMarkup(
          createElement(StageActivity, {
            stage: stage as Stage,
            state: answeredState(stage as Stage),
            onStateChange: () => {},
            onComplete: () => {},
            completed: true,
          }),
        )
        const prose = html.replace(/<table[\s\S]*?<\/table>/g, "").replace(/<pre[\s\S]*?<\/pre>/g, "")
        const strayTicks = (prose.match(/`/g) || []).length
        if (strayTicks > 0) {
          failures.push({ where, message: `${strayTicks} literal backtick(s) after answering` })
        }
      } catch (error) {
        failures.push({
          where: `${where} (after answering)`,
          message: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }
}

// How much of the course reads as interleaved prose and code, and how much still
// uses a single body string with its apparatus underneath. Sections that never had
// prose — a recap, a set of review questions — are not counted either way.
const perChapter = new Map<number, { flowed: number; legacy: number }>()
for (const module of curriculum) {
  const row = { flowed: 0, legacy: 0 }
  for (const lesson of module.lessons) {
    for (const stage of lesson.stages) {
      if (stage.content && stage.content.length > 0) row.flowed += 1
      else if ("body" in stage && (stage.body ?? "").trim().length > 0) row.legacy += 1
    }
  }
  perChapter.set(module.id, row)
}
const flowed = [...perChapter.values()].reduce((sum, row) => sum + row.flowed, 0)
const legacy = [...perChapter.values()].reduce((sum, row) => sum + row.legacy, 0)

console.log(`rendered ${rendered} sections`)
console.log(`prose sections: ${flowed} interleaved, ${legacy} still a single body string`)
const mixed = [...perChapter.entries()].filter(([, row]) => row.flowed > 0 && row.legacy > 0)
const done = [...perChapter.entries()].filter(([, row]) => row.flowed > 0 && row.legacy === 0)
console.log(`  fully interleaved chapters: ${done.map(([id]) => id).join(", ") || "none"}`)
console.log(`  mixed chapters: ${mixed.map(([id, row]) => `${id} (${row.legacy} left)`).join(", ") || "none"}`)

for (const kind of Object.keys(STAGE_KIND_INFO)) {
  const count = byKind.get(kind) ?? 0
  if (count > 0) console.log(`  ${STAGE_KIND_INFO[kind as keyof typeof STAGE_KIND_INFO].label.padEnd(20)} ${count}`)
}

if (empty.length > 0) {
  console.log(`\nsuspiciously empty: ${empty.length}`)
  for (const item of empty) console.log(`  ${item}`)
}

console.log(`\nfailures: ${failures.length}`)
for (const failure of failures) console.log(`  ${failure.where}\n    ${failure.message}`)

process.exit(failures.length > 0 || empty.length > 0 ? 1 : 0)

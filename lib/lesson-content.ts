import { z } from "zod"
import type { Module } from "@/lib/lessons-data"
import { modules as defaultModules } from "@/lib/lessons-data"
import { CURRICULUM_VERSION } from "@/lib/curriculum-version"

const testCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  description: z.string(),
  match: z.union([z.literal("exact"), z.literal("contains"), z.literal("regex")]).optional(),
})

const stageSchema = z.object({
  id: z.number().int().positive(),
  type: z.union([z.literal("exercise"), z.literal("lesson")]),
  title: z.string(),
  description: z.string(),
  instructions: z.string(),
  starterCode: z.string().optional(),
  testCases: z.array(testCaseSchema).optional(),
  hint: z.string().optional(),
})

const lessonSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  stages: z.array(stageSchema),
})

const moduleSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  lessons: z.array(lessonSchema),
})

export const modulesSchema = z.array(moduleSchema)

export interface LessonsContentDocument {
  id: string
  /** Curriculum version this document was written against. */
  version?: number
  modules: Module[]
  updatedAt: string
  updatedBy: string
  updatedByEmail: string
}

export function parseModules(input: unknown): Module[] {
  return modulesSchema.parse(input)
}

export function getDefaultModules(): Module[] {
  return parseModules(defaultModules)
}

/**
 * Decides whether a stored curriculum document may be served.
 *
 * A document is only usable when it was written against the current bundled
 * curriculum version. Anything older (or unversioned, which means it predates
 * versioning entirely) describes a course that has since been replaced.
 */
export function isCurrentCurriculumDocument(
  document: Pick<LessonsContentDocument, "version"> | null | undefined,
): boolean {
  return typeof document?.version === "number" && document.version >= CURRICULUM_VERSION
}

/**
 * Resolves the curriculum the application should serve. The stored document
 * wins only when it is current; otherwise the bundled curriculum is used and
 * the stale document is left untouched in the database.
 */
export function resolveModules(document: LessonsContentDocument | null | undefined): {
  modules: Module[]
  source: "remote" | "bundled"
} {
  if (document && isCurrentCurriculumDocument(document)) {
    try {
      return { modules: parseModules(document.modules), source: "remote" }
    } catch {
      // A stored document that no longer satisfies the schema is not usable.
      return { modules: getDefaultModules(), source: "bundled" }
    }
  }

  return { modules: getDefaultModules(), source: "bundled" }
}

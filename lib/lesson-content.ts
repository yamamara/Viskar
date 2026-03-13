import { z } from "zod"
import type { Module } from "@/lib/lessons-data"
import { modules as defaultModules } from "@/lib/lessons-data"

const testCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
  description: z.string(),
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

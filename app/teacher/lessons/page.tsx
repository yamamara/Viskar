"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { type Module, type Lesson, type Stage, type TestCase, type MatchMode } from "@/lib/lessons-data"
import { loadLessons, saveLessons } from "@/lib/client-api"
import { Plus, Trash2, ArrowLeft, Save, GraduationCap, ChevronRight, ChevronDown, PlusCircle } from "lucide-react"
import { TeacherAuthGuard } from "@/components/teacher-auth-guard"

function LessonManagerContent() {
  const [modules, setModules] = useState<Module[]>([])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadLessons()
      .then(setModules)
      .catch(err => console.error('Failed to load lessons:', err))
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await saveLessons(modules)

      alert("Lessons saved successfully.")
    } catch (error) {
      console.error('Error saving lessons:', error)
      alert(error instanceof Error ? error.message : "Error saving lessons.")
    } finally {
      setIsSaving(false)
    }
  }

  const modulesArray = Array.isArray(modules) ? modules : []

  const addModule = () => {
    const newModule: Module = {
      id: modulesArray.length + 1,
      title: "New Module",
      description: "Description of the new module",
      lessons: [],
    }
    setModules([...modulesArray, newModule])
  }

  const removeModule = (moduleId: number) => {
    setModules(modulesArray.filter((m) => m.id !== moduleId).map((m, i) => ({ ...m, id: i + 1 })))
  }

  const addLesson = (moduleId: number) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          const newLesson: Lesson = {
            id: m.lessons.length + 1,
            title: "New Lesson",
            description: "Description of the new lesson",
            stages: [],
          }
          return { ...m, lessons: [...m.lessons, newLesson] }
        }
        return m
      }),
    )
  }

  const removeLesson = (moduleId: number, lessonId: number) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.filter((l) => l.id !== lessonId).map((l, i) => ({ ...l, id: i + 1 })),
          }
        }
        return m
      }),
    )
  }

  const addStage = (moduleId: number, lessonId: number) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lessonId) {
                const newStage: Stage = {
                  id: l.stages.length + 1,
                  type: "exercise",
                  title: "New Stage",
                  description: "Description of the new stage",
                  instructions: "Explain what the student should do here",
                  starterCode: "# Write your code here",
                  testCases: [{ input: "", expectedOutput: "", description: "Test Case 1" }],
                  hint: "",
                }
                return { ...l, stages: [...l.stages, newStage] }
              }
              return l
            }),
          }
        }
        return m
      }),
    )
  }

  const removeStage = (moduleId: number, lessonId: number, stageId: number) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lessonId) {
                return {
                  ...l,
                  stages: l.stages.filter((s) => s.id !== stageId).map((s, i) => ({ ...s, id: i + 1 })),
                }
              }
              return l
            }),
          }
        }
        return m
      }),
    )
  }

  const updateModule = (moduleId: number, updates: Partial<Module>) => {
    setModules(modulesArray.map((m) => (m.id === moduleId ? { ...m, ...updates } : m)))
  }

  const updateLesson = (moduleId: number, lessonId: number, updates: Partial<Lesson>) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, ...updates } : l)),
          }
        }
        return m
      }),
    )
  }

  const updateStage = (moduleId: number, lessonId: number, stageId: number, updates: Partial<Stage>) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lessonId) {
                return {
                  ...l,
                  stages: l.stages.map((s) => (s.id === stageId ? { ...s, ...updates } : s)),
                }
              }
              return l
            }),
          }
        }
        return m
      }),
    )
  }

  const addTestCase = (moduleId: number, lessonId: number, stageId: number) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lessonId) {
                return {
                  ...l,
                  stages: l.stages.map((s) => {
                    if (s.id === stageId) {
                      const newTestCase: TestCase = { input: "", expectedOutput: "", description: "", match: "exact" }
                      return { ...s, testCases: [...(s.testCases || []), newTestCase] }
                    }
                    return s
                  }),
                }
              }
              return l
            }),
          }
        }
        return m
      }),
    )
  }

  const updateTestCase = (moduleId: number, lessonId: number, stageId: number, index: number, updates: Partial<TestCase>) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lessonId) {
                return {
                  ...l,
                  stages: l.stages.map((s) => {
                    if (s.id === stageId) {
                      const newTestCases = [...(s.testCases || [])]
                      newTestCases[index] = { ...newTestCases[index], ...updates }
                      return { ...s, testCases: newTestCases }
                    }
                    return s
                  }),
                }
              }
              return l
            }),
          }
        }
        return m
      }),
    )
  }

  const removeTestCase = (moduleId: number, lessonId: number, stageId: number, index: number) => {
    setModules(
      modulesArray.map((m) => {
        if (m.id === moduleId) {
          return {
            ...m,
            lessons: m.lessons.map((l) => {
              if (l.id === lessonId) {
                return {
                  ...l,
                  stages: l.stages.map((s) => {
                    if (s.id === stageId) {
                      return { ...s, testCases: (s.testCases || []).filter((_, i) => i !== index) }
                    }
                    return s
                  }),
                }
              }
              return l
            }),
          }
        }
        return m
      }),
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/teacher/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Lesson Manager</h1>
          </div>
          <Button onClick={handleSave} className="shadow-elegant" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Curriculum Structure</h2>
            <p className="text-muted-foreground">Manage your modules, lessons, and stages below.</p>
          </div>
          <Button onClick={addModule} variant="outline" className="bg-card hover:bg-muted transition-colors">
            <Plus className="h-4 w-4 mr-2" />
            Add New Module
          </Button>
        </div>

        <Accordion type="multiple" className="space-y-4">
          {modulesArray.map((module) => (
            <Card key={module.id} className="border border-border shadow-sm overflow-hidden bg-card">
              <AccordionItem value={`module-${module.id}`} className="border-none">
                <div className="p-4 flex items-center gap-4 border-b bg-card">
                   <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground uppercase">Module {module.id}</span>
                        <Input
                          value={module.title}
                          onChange={(e) => updateModule(module.id, { title: e.target.value })}
                          className="h-8 font-bold border-transparent hover:border-input focus:border-input"
                        />
                     </div>
                     <Input
                        value={module.description}
                        onChange={(e) => updateModule(module.id, { description: e.target.value })}
                        className="h-8 text-sm text-muted-foreground border-transparent hover:border-input focus:border-input"
                     />
                   </div>
                   <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => addLesson(module.id)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Lesson
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => removeModule(module.id)} className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <AccordionTrigger className="hover:no-underline" />
                   </div>
                </div>
                <AccordionContent className="p-4 bg-muted/40">
                   <div className="space-y-4">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-card border rounded-lg p-4 shadow-sm">
                           <div className="flex items-start justify-between gap-4 mb-4">
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-muted-foreground">Lesson {lesson.id}</span>
                                  <Input
                                    value={lesson.title}
                                    onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                                    className="h-8 font-semibold bg-background"
                                  />
                                </div>
                                <Input
                                  value={lesson.description}
                                  onChange={(e) => updateLesson(module.id, lesson.id, { description: e.target.value })}
                                  className="h-8 text-sm bg-background"
                                />
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => removeLesson(module.id, lesson.id)} className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>

                           <div className="ml-6 space-y-4">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Stages</h4>
                                <Button variant="outline" size="sm" onClick={() => addStage(module.id, lesson.id)} className="bg-background">
                                  <Plus className="h-3 w-3 mr-2" />
                                  Add Stage
                                </Button>
                              </div>

                              <div className="space-y-4">
                                 {lesson.stages.map((stage) => (
                                   <Card key={stage.id} className="bg-muted/30 border-border">
                                      <CardHeader className="p-3 border-b flex flex-row items-center justify-between space-y-0 bg-card/50">
                                        <div className="flex items-center gap-3 flex-1">
                                          <span className="font-mono text-xs text-muted-foreground">Stage {stage.id}</span>
                                          <Input
                                            value={stage.title}
                                            onChange={(e) => updateStage(module.id, lesson.id, stage.id, { title: e.target.value })}
                                            className="h-7 text-sm font-medium bg-background"
                                          />
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => removeStage(module.id, lesson.id, stage.id)} className="text-destructive h-7 w-7 p-0 hover:bg-destructive/10">
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </CardHeader>
                                      <CardContent className="p-4 space-y-4">
                                         <div className="space-y-3">
                                            <label className="text-xs font-bold uppercase text-foreground/70">Stage Type</label>
                                            <div className="flex gap-4">
                                               <Button 
                                                 variant={stage.type === 'exercise' ? 'default' : 'outline'} 
                                                 size="sm" 
                                                 onClick={() => updateStage(module.id, lesson.id, stage.id, { type: 'exercise' })}
                                                 className="flex-1"
                                               >
                                                 Exercise (Coding)
                                               </Button>
                                               <Button 
                                                 variant={stage.type === 'lesson' ? 'default' : 'outline'} 
                                                 size="sm" 
                                                 onClick={() => updateStage(module.id, lesson.id, stage.id, { type: 'lesson' })}
                                                 className="flex-1"
                                               >
                                                 Lesson (Theory)
                                               </Button>
                                            </div>
                                         </div>

                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                               <label className="text-xs font-semibold text-foreground/80">Description</label>
                                               <Input
                                                  value={stage.description}
                                                  onChange={(e) => updateStage(module.id, lesson.id, stage.id, { description: e.target.value })}
                                                  className="h-8 text-sm bg-background"
                                               />
                                            </div>
                                            {stage.type === 'exercise' && (
                                              <div className="space-y-2">
                                                 <label className="text-xs font-semibold text-foreground/80">Hint (Optional)</label>
                                                 <Input
                                                    value={stage.hint || ""}
                                                    onChange={(e) => updateStage(module.id, lesson.id, stage.id, { hint: e.target.value })}
                                                    className="h-8 text-sm bg-background"
                                                 />
                                              </div>
                                            )}
                                         </div>
                                         <div className="space-y-2">
                                            <label className="text-xs font-semibold text-foreground/80">Instructions (Markdown)</label>
                                            <Textarea
                                              value={stage.instructions}
                                              onChange={(e) => updateStage(module.id, lesson.id, stage.id, { instructions: e.target.value })}
                                              className="min-h-[100px] text-sm bg-background"
                                            />
                                         </div>

                                         {stage.type === 'exercise' && (
                                           <>
                                             <div className="space-y-2 animate-in">
                                                <label className="text-xs font-semibold text-foreground/80">Starter Code (Python) - Optional</label>
                                                <Textarea
                                                  value={stage.starterCode || ""}
                                                  onChange={(e) => updateStage(module.id, lesson.id, stage.id, { starterCode: e.target.value })}
                                                  className="min-h-[100px] font-mono text-sm bg-muted text-foreground p-4 border-border"
                                                  placeholder="# Write starter code here (optional for lessons)"
                                                />
                                             </div>

                                             <div className="space-y-3 pt-2 animate-in">
                                                <div className="flex items-center justify-between">
                                                   <h5 className="text-xs font-bold uppercase text-foreground/70">Test Cases</h5>
                                                   <Button variant="ghost" size="xs" className="h-6 text-xs hover:bg-primary/10 hover:text-primary" onClick={() => addTestCase(module.id, lesson.id, stage.id)}>
                                                      <Plus className="h-3 w-3 mr-1" />
                                                      Add Test
                                                   </Button>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">
                                                  Each test runs the program from scratch. Input is fed to{" "}
                                                  <code className="font-mono">input()</code> one line at a time, and output is
                                                  compared exactly unless a different match mode is chosen.
                                                </p>
                                                {stage.testCases?.map((tc, idx) => (
                                                  <div key={idx} className="grid grid-cols-12 gap-2 items-start bg-card p-2 border border-border rounded-md">
                                                     <div className="col-span-11 space-y-2">
                                                        <Input
                                                          placeholder="What this test checks"
                                                          value={tc.description}
                                                          onChange={(e) => updateTestCase(module.id, lesson.id, stage.id, idx, { description: e.target.value })}
                                                          className="h-7 text-xs bg-background"
                                                        />
                                                        <div className="grid grid-cols-2 gap-2">
                                                          <div className="space-y-1">
                                                            <label className="text-[10px] uppercase text-muted-foreground">Input (stdin)</label>
                                                            <Textarea
                                                              placeholder="One value per line"
                                                              value={tc.input}
                                                              onChange={(e) => updateTestCase(module.id, lesson.id, stage.id, idx, { input: e.target.value })}
                                                              className="min-h-[60px] text-xs font-mono bg-background"
                                                            />
                                                          </div>
                                                          <div className="space-y-1">
                                                            <label className="text-[10px] uppercase text-muted-foreground">Expected output</label>
                                                            <Textarea
                                                              placeholder="Exact expected output"
                                                              value={tc.expectedOutput}
                                                              onChange={(e) => updateTestCase(module.id, lesson.id, stage.id, idx, { expectedOutput: e.target.value })}
                                                              className="min-h-[60px] text-xs font-mono bg-background"
                                                            />
                                                          </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                          <label className="text-[10px] uppercase text-muted-foreground">Match</label>
                                                          <select
                                                            value={tc.match ?? "exact"}
                                                            onChange={(e) =>
                                                              updateTestCase(module.id, lesson.id, stage.id, idx, {
                                                                match: e.target.value as MatchMode,
                                                              })
                                                            }
                                                            className="h-7 rounded border border-input bg-background px-2 text-xs"
                                                          >
                                                            <option value="exact">Exact</option>
                                                            <option value="contains">Contains</option>
                                                            <option value="regex">Regular expression</option>
                                                          </select>
                                                        </div>
                                                     </div>
                                                     <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      onClick={() => removeTestCase(module.id, lesson.id, stage.id, idx)}
                                                      className="text-destructive h-7 w-7 p-0 hover:bg-destructive/10"
                                                     >
                                                       <Trash2 className="h-3 w-3" />
                                                     </Button>
                                                  </div>
                                                ))}
                                             </div>
                                           </>
                                         )}
                                      </CardContent>
                                   </Card>
                                 ))}
                              </div>
                           </div>
                        </div>
                      ))}
                   </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      </main>
    </div>
  )
}

export default function LessonManagerPage() {
  return (
    <TeacherAuthGuard>
      <LessonManagerContent />
    </TeacherAuthGuard>
  )
}

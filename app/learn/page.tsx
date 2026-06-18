"use client"

import { useEffect, useState, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { memo } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PythonIDE } from "@/components/python-ide"
import { type Module } from "@/lib/lessons-data"
import { fetchJson, fetchStudentJson } from "@/lib/client-api"
import { markSkipAutoResumeOnce } from "@/lib/home-navigation"
import { loadStudentSession, persistStudentSession } from "@/lib/student-session"
import type { StudentRecord } from "@/lib/app-types"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Home, Settings, BookOpen, Lightbulb, Menu, X, Check } from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

const NavigationCircles = memo(
  ({
    stages,
    currentStageId,
    onJump,
    isStageCompleted,
  }: {
    stages: Array<{ id: number }>
    currentStageId: number
    onJump: (id: number) => void
    isStageCompleted: (id: number) => boolean
  }) => {
    return (
      <div className="flex gap-2.5">
        {stages.map((stage) => {
          const completed = isStageCompleted(stage.id)
          const isCurrent = stage.id === currentStageId

          return (
            <button
              key={stage.id}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300 ease-in-out",
                isCurrent ? "w-10 bg-primary" : "w-2.5 bg-muted",
                completed && !isCurrent ? "bg-success" : "",
                isCurrent && completed ? "bg-success" : "",
              )}
              onClick={() => onJump(stage.id)}
              aria-label={`Go to stage ${stage.id}`}
            />
          )
        })}
      </div>
    )
  },
)

NavigationCircles.displayName = "NavigationCircles"

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    const onChange = () => setIsDesktop(mql.matches)
    mql.addEventListener("change", onChange)
    setIsDesktop(mql.matches)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return isDesktop
}

function LearnPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const classCode = String(searchParams.get("code") || "").toUpperCase()
  const [student, setStudent] = useState<StudentRecord | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [showHint, setShowHint] = useState(false)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [allowNextPage, setAllowNextPage] = useState(false)
  const [wasCompletedOnArrival, setWasCompletedOnArrival] = useState(false)
  const [isSavingProgress, setIsSavingProgress] = useState(false)
  const isDesktop = useIsDesktop()

  const modulesArray = Array.isArray(modules) ? modules : []
  const currentModule = student ? modulesArray.find((module) => module.id === student.currentModule) : null
  const currentLesson = currentModule?.lessons.find((lesson) => lesson.id === student?.currentLesson)
  const currentStage = currentLesson?.stages.find((stage) => stage.id === student?.currentStage)
  const stageKey = student ? `${student.currentModule}-${student.currentLesson}-${student.currentStage}` : ""

  const loadStudent = useCallback(async () => {
    if (!classCode) {
      router.push("/")
      return null
    }

    const studentSession = loadStudentSession(classCode)
    if (!studentSession?.studentId || !studentSession.sessionToken) {
      router.push("/")
      return null
    }

    try {
      const studentRecord = await fetchStudentJson<StudentRecord>(classCode, `/api/students/session?classCode=${classCode}`)
      setStudent(studentRecord)
      return studentRecord
    } catch {
      persistStudentSession(classCode, null)
      router.push("/")
      return null
    }
  }, [classCode, router])

  const updateProgress = useCallback(
    async ({
      currentModule,
      currentLesson,
      currentStage,
      completedStageKey,
    }: {
      currentModule: number
      currentLesson: number
      currentStage: number
      completedStageKey?: string
    }) => {
      if (!student) return null

      setIsSavingProgress(true)
      try {
        const updatedStudent = await fetchStudentJson<StudentRecord>(student.classCode, "/api/students/progress", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classCode: student.classCode,
            currentModule,
            currentLesson,
            currentStage,
            completedStageKey,
          }),
        })
        setStudent(updatedStudent)
        return updatedStudent
      } finally {
        setIsSavingProgress(false)
      }
    },
    [student],
  )

  useEffect(() => {
    fetch("/api/lessons")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setModules(data)
        }
      })
      .catch((err) => console.error("Failed to load lessons:", err))
  }, [])

  useEffect(() => {
    loadStudent()
  }, [loadStudent])

  useEffect(() => {
    if (student && currentStage) {
      const completed = student.completedStages.includes(
        `${student.currentModule}-${student.currentLesson}-${student.currentStage}`,
      )
      setWasCompletedOnArrival(completed)
    }
  }, [currentStage, stageKey, student])

  const isStageCompleted = useCallback(
    (moduleId: number, lessonId: number, stageId: number) => {
      if (!student) return false
      return student.completedStages.includes(`${moduleId}-${lessonId}-${stageId}`)
    },
    [student],
  )

  const onComplete = useCallback(async () => {
    if (!student || !currentStage) return

    await updateProgress({
      currentModule: student.currentModule,
      currentLesson: student.currentLesson,
      currentStage: student.currentStage,
      completedStageKey: `${student.currentModule}-${student.currentLesson}-${student.currentStage}`,
    })
    setAllowNextPage(true)
  }, [currentStage, student, updateProgress])

  const getFurthestStage = useCallback(() => {
    if (!student) return { moduleId: 1, lessonId: 1, stageId: 1 }

    for (const module of modulesArray) {
      for (const lesson of module.lessons) {
        for (const stage of lesson.stages) {
          if (!isStageCompleted(module.id, lesson.id, stage.id)) {
            return { moduleId: module.id, lessonId: lesson.id, stageId: stage.id }
          }
        }
      }
    }

    const lastModule = modulesArray[modulesArray.length - 1]
    const lastLesson = lastModule.lessons[lastModule.lessons.length - 1]
    const lastStage = lastLesson.stages[lastLesson.stages.length - 1]
    return { moduleId: lastModule.id, lessonId: lastLesson.id, stageId: lastStage.id }
  }, [isStageCompleted, modulesArray, student])

  const canAccessStage = useCallback(
    (moduleId: number, lessonId: number, stageId: number) => {
      const furthest = getFurthestStage()
      if (moduleId < furthest.moduleId) return true
      if (moduleId === furthest.moduleId && lessonId < furthest.lessonId) return true
      if (moduleId === furthest.moduleId && lessonId === furthest.lessonId && stageId <= furthest.stageId) return true
      return false
    },
    [getFurthestStage],
  )

  useEffect(() => {
    setShowHint(false)
  }, [student?.currentLesson, student?.currentModule, student?.currentStage])

  useEffect(() => {
    if (!student || !currentStage) return

    const completed = isStageCompleted(student.currentModule, student.currentLesson, student.currentStage)

    if (currentStage.type === "lesson") {
      if (!completed) {
        const timer = setTimeout(() => {
          onComplete()
        }, 100)
        return () => clearTimeout(timer)
      }
      setAllowNextPage(true)
      return
    }

    setAllowNextPage(completed)
  }, [currentStage, isStageCompleted, onComplete, student])

  useEffect(() => {
    if (student && selectedModule === null) {
      setSelectedModule(student.currentModule)
    }
  }, [selectedModule, student])

  useEffect(() => {
    if (!student || modulesArray.length === 0) return

    const currentStudent = student

    async function syncProgress() {
      const module = modulesArray.find((item) => item.id === currentStudent.currentModule)
      if (!module) {
        const firstModule = modulesArray[0]
        await updateProgress({
          currentModule: firstModule.id,
          currentLesson: 1,
          currentStage: 1,
        })
        return
      }

      const lesson = module.lessons.find((item) => item.id === currentStudent.currentLesson)
      if (!lesson) {
        await updateProgress({
          currentModule: module.id,
          currentLesson: module.lessons[0].id,
          currentStage: 1,
        })
        return
      }

      const stage = lesson.stages.find((item) => item.id === currentStudent.currentStage)
      if (!stage) {
        await updateProgress({
          currentModule: module.id,
          currentLesson: lesson.id,
          currentStage: lesson.stages[0].id,
        })
      }
    }

    syncProgress()
  }, [modulesArray, student, updateProgress])

  if (!student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground animate-pulse">Loading student profile...</p>
      </div>
    )
  }

  if (modulesArray.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground animate-pulse">Fetching curriculum...</p>
      </div>
    )
  }

  if (!currentModule || !currentLesson || !currentStage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 p-6 text-center">
        <BookOpen className="h-12 w-12 text-primary/50" />
        <h2 className="text-xl font-semibold text-foreground">Content Syncing...</h2>
        <p className="text-muted-foreground max-w-xs">
          Your progress is being matched with the latest curriculum. One moment please.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            markSkipAutoResumeOnce()
            router.push("/")
          }}
          className="mt-4"
        >
          Return to Login
        </Button>
      </div>
    )
  }

  const handleStageComplete = async () => {
    if (!student) return

    const currentStageKey = `${student.currentModule}-${student.currentLesson}-${student.currentStage}`
    const isLastStage = student.currentStage === currentLesson.stages.length
    let nextPosition = {
      currentModule: student.currentModule,
      currentLesson: student.currentLesson,
      currentStage: student.currentStage,
    }

    if (isLastStage) {
      const isLastLesson = student.currentLesson === currentModule.lessons.length
      if (isLastLesson) {
        const isLastModule = student.currentModule === modulesArray.length
        if (isLastModule) {
          await updateProgress({
            ...nextPosition,
            completedStageKey: currentStageKey,
          })
          alert("Congratulations! You've completed all lessons!")
          return
        }

        nextPosition = {
          currentModule: student.currentModule + 1,
          currentLesson: 1,
          currentStage: 1,
        }
      } else {
        nextPosition = {
          currentModule: student.currentModule,
          currentLesson: student.currentLesson + 1,
          currentStage: 1,
        }
      }
    } else {
      nextPosition = {
        currentModule: student.currentModule,
        currentLesson: student.currentLesson,
        currentStage: student.currentStage + 1,
      }
    }

    const nextStudent = await updateProgress({
      ...nextPosition,
      completedStageKey: currentStageKey,
    })

    if (nextStudent && nextStudent.currentModule !== student.currentModule) {
      setSelectedModule(nextStudent.currentModule)
    }
  }

  const goToPreviousStage = async () => {
    if (!student) return

    if (student.currentStage > 1) {
      await updateProgress({
        currentModule: student.currentModule,
        currentLesson: student.currentLesson,
        currentStage: student.currentStage - 1,
      })
      return
    }

    if (student.currentLesson > 1) {
      const previousLesson = currentModule.lessons.find((lesson) => lesson.id === student.currentLesson - 1)
      if (previousLesson) {
        await updateProgress({
          currentModule: student.currentModule,
          currentLesson: student.currentLesson - 1,
          currentStage: previousLesson.stages.length,
        })
      }
      return
    }

    if (student.currentModule > 1) {
      const previousModule = modulesArray.find((module) => module.id === student.currentModule - 1)
      if (previousModule) {
        const lastLesson = previousModule.lessons[previousModule.lessons.length - 1]
        await updateProgress({
          currentModule: student.currentModule - 1,
          currentLesson: lastLesson.id,
          currentStage: lastLesson.stages.length,
        })
      }
    }
  }

  const calculateProgress = () => {
    let totalStages = 0
    let completedStages = 0

    modulesArray.forEach((module) => {
      module.lessons.forEach((lesson) => {
        lesson.stages.forEach((stage) => {
          totalStages += 1
          const progressStageId = `${module.id}-${lesson.id}-${stage.id}`
          if (student.completedStages.includes(progressStageId)) {
            completedStages += 1
          }
        })
      })
    })

    return Math.round((completedStages / totalStages) * 100)
  }

  const jumpToStage = async (moduleId: number, lessonId: number, stageId: number) => {
    if (!canAccessStage(moduleId, lessonId, stageId)) return

    await updateProgress({
      currentModule: moduleId,
      currentLesson: lessonId,
      currentStage: stageId,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <header className="border-b border-border/50 glass-effect sticky top-0 z-50 shadow-elegant">
        <div className="w-full px-4 py-4">
          <div className="flex items-center w-full">
            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-accent/10"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <Link
                href="/"
                onClick={(event) => {
                  event.preventDefault()
                  markSkipAutoResumeOnce()
                  router.push("/")
                }}
                className="flex items-center gap-2.5 hover:opacity-80 transition-all duration-300 group"
              >
                <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-foreground tracking-tight">Viskar</span>
              </Link>
            </div>

            <div className="flex-1 px-6">
              <Progress value={calculateProgress()} className="h-2.5" />
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{student.name}</span>
                <span className="text-muted-foreground/50">•</span>
                <span>{calculateProgress()}% Complete</span>
              </div>

              <Link href={`/settings?code=${student.classCode}`}>
                <Button variant="ghost" size="sm" className="hover:bg-accent/10 transition-all duration-300">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10">
        {isDesktop ? (
          <ResizablePanelGroup direction="horizontal" autoSaveId="learn-sidebar" className="min-h-[calc(100vh-73px)]">
            <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
              <div className="sticky h-[calc(100vh-73px)] overflow-y-auto">
                <div className="p-6 border-b border-border/50 bg-card/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Modules</h2>
                    </div>
                  </div>
                </div>
                <div className="p-3 space-y-1">
                  {modulesArray.map((module) => (
                    <div key={module.id}>
                      <Button
                        variant={selectedModule === module.id ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left transition-all duration-200 active:scale-[0.98]",
                          module.id === student.currentModule && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary",
                        )}
                        onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                      >
                        <span className="font-medium text-sm truncate">
                          {module.id}. {module.title}
                        </span>
                      </Button>

                      {selectedModule === module.id && (
                        <div className="ml-4 mt-2 space-y-1 animate-in">
                          {module.lessons.map((lesson) => {
                            const lessonAccessible = canAccessStage(module.id, lesson.id, 1)

                            return (
                              <div key={lesson.id}>
                                <button
                                  className={cn(
                                    "w-full text-left text-xs py-2 px-3 rounded-lg hover:bg-muted transition-all duration-200",
                                    !lessonAccessible && "opacity-50 cursor-not-allowed",
                                    module.id === student.currentModule &&
                                      lesson.id === student.currentLesson &&
                                      "bg-muted font-medium",
                                  )}
                                  onClick={() => {
                                    if (lessonAccessible) {
                                      jumpToStage(module.id, lesson.id, 1)
                                    }
                                  }}
                                  disabled={!lessonAccessible}
                                >
                                  {lesson.id}. {lesson.title}
                                </button>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex flex-col min-h-[calc(100vh-73px)]">
                <div className={cn("p-6 bg-card/30", currentStage.type === "lesson" && "flex-1 overflow-y-auto")}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                        Module {currentModule.id} • Lesson {currentLesson.id} • Stage {currentStage.id} of{" "}
                        {currentLesson.stages.length}
                      </div>
                      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{currentStage.title}</h1>
                      <div className="text-base leading-relaxed text-muted-foreground prose dark:prose-invert max-w-none prose-sm">
                        <ReactMarkdown>{currentStage.description}</ReactMarkdown>
                      </div>
                    </div>
                    {currentStage.hint && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowHint(!showHint)}
                        className="flex-shrink-0 hover:bg-warning/10 transition-all duration-300 group"
                      >
                        <Lightbulb className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        Hint
                      </Button>
                    )}
                  </div>

                  {showHint && currentStage.hint && (
                    <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/20 animate-in">
                      <p className="text-sm text-foreground leading-relaxed">{currentStage.hint}</p>
                    </div>
                  )}

                  <div className="mt-8">
                    {currentStage.type === "exercise" ? (
                      <PythonIDE
                        starterCode={currentStage.starterCode || ""}
                        testCases={currentStage.testCases || []}
                        onSuccess={onComplete}
                      />
                    ) : (
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{currentStage.instructions}</ReactMarkdown>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/50 p-4 bg-card/60">
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={goToPreviousStage}
                      disabled={isSavingProgress}
                      className="hover:bg-accent/10 transition-all duration-300 bg-transparent"
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>

                    <NavigationCircles
                      stages={currentLesson.stages}
                      currentStageId={currentStage.id}
                      onJump={(id) => jumpToStage(currentModule.id, currentLesson.id, id)}
                      isStageCompleted={(stageId) => isStageCompleted(currentModule.id, currentLesson.id, stageId)}
                    />

                    <Button
                      onClick={handleStageComplete}
                      disabled={!allowNextPage || isSavingProgress}
                      className="shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
                    >
                      {wasCompletedOnArrival || allowNextPage ? (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          Complete to Continue
                          <Check className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="min-h-[calc(100vh-73px)]">
            {showSidebar && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setShowSidebar(false)} />
            )}

            <div
              className={cn(
                "fixed left-0 top-[73px] h-[calc(100vh-73px)] w-80 bg-card border-r border-border/50 z-50 transform transition-transform duration-300 lg:hidden",
                showSidebar ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Modules</h2>
                </div>
              </div>
              <div className="p-3 space-y-1 overflow-y-auto h-[calc(100%-73px)]">
                {modulesArray.map((module) => (
                  <div key={module.id}>
                    <Button
                      variant={selectedModule === module.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left transition-all duration-200",
                        module.id === student.currentModule && "bg-primary/10 text-primary",
                      )}
                      onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                    >
                      <span className="font-medium text-sm truncate">
                        {module.id}. {module.title}
                      </span>
                    </Button>

                    {selectedModule === module.id && (
                      <div className="ml-4 mt-2 space-y-1">
                        {module.lessons.map((lesson) => {
                          const lessonAccessible = canAccessStage(module.id, lesson.id, 1)
                          return (
                            <button
                              key={lesson.id}
                              className={cn(
                                "w-full text-left text-xs py-2 px-3 rounded-lg hover:bg-muted transition-all duration-200",
                                !lessonAccessible && "opacity-50 cursor-not-allowed",
                                module.id === student.currentModule &&
                                  lesson.id === student.currentLesson &&
                                  "bg-muted font-medium",
                              )}
                              onClick={() => {
                                if (lessonAccessible) {
                                  jumpToStage(module.id, lesson.id, 1)
                                  setShowSidebar(false)
                                }
                              }}
                              disabled={!lessonAccessible}
                            >
                              {lesson.id}. {lesson.title}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 space-y-6">
              <div className="space-y-3">
                <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                  Module {currentModule.id} • Lesson {currentLesson.id} • Stage {currentStage.id} of{" "}
                  {currentLesson.stages.length}
                </div>
                <h1 className="text-2xl font-bold tracking-tight">{currentStage.title}</h1>
                <div className="text-base leading-relaxed text-muted-foreground prose dark:prose-invert max-w-none prose-sm">
                  <ReactMarkdown>{currentStage.description}</ReactMarkdown>
                </div>
              </div>

              {currentStage.hint && (
                <div>
                  <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Hint
                  </Button>
                  {showHint && (
                    <div className="mt-4 p-4 rounded-xl bg-warning/10 border border-warning/20">
                      <p className="text-sm text-foreground leading-relaxed">{currentStage.hint}</p>
                    </div>
                  )}
                </div>
              )}

              {currentStage.type === "exercise" ? (
                <PythonIDE
                  starterCode={currentStage.starterCode || ""}
                  testCases={currentStage.testCases || []}
                  onSuccess={onComplete}
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{currentStage.instructions}</ReactMarkdown>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-2">
                <Button variant="outline" onClick={goToPreviousStage} disabled={isSavingProgress}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handleStageComplete} disabled={!allowNextPage || isSavingProgress}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LearnPageContent />
    </Suspense>
  )
}

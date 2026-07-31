"use client"

import { useEffect, useState, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { memo, type ReactNode } from "react"
import ReactMarkdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { PythonIDE } from "@/components/python-ide"
import { LessonCodeBlock } from "@/components/lesson-code-block"
import { LessonCallout } from "@/components/lesson-callout"
import { type Module } from "@/lib/lessons-data"
import { fetchJson, fetchStudentJson } from "@/lib/client-api"
import { markSkipAutoResumeOnce } from "@/lib/home-navigation"
import { loadStudentSession, persistStudentSession } from "@/lib/student-session"
import type { StudentRecord } from "@/lib/app-types"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Settings,
  BookOpen,
  Lightbulb,
  Menu,
  X,
  Check,
} from "lucide-react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

function nodeToText(node: unknown): string {
  if (node == null) return ""
  if (typeof node === "string") return node
  if (Array.isArray(node)) return node.map(nodeToText).join("")
  if (typeof node === "object" && "props" in (node as any)) {
    return nodeToText((node as any).props?.children)
  }
  return String(node)
}

/**
 * Fenced code blocks in lesson copy render as the design's interactive editor
 * card rather than a bare <pre>.
 */
const lessonMarkdownComponents = {
  pre: ({ children }: { children?: ReactNode }) => {
    const codeElement: any = Array.isArray(children) ? children[0] : children
    const props = codeElement?.props ?? {}
    const language = /language-(\w+)/.exec(String(props.className ?? ""))?.[1]

    return <LessonCodeBlock code={nodeToText(props.children).replace(/\n+$/, "")} language={language} />
  },
  blockquote: ({ children }: { children?: ReactNode }) => <LessonCallout>{children}</LessonCallout>,
}

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
      <div className="flex items-center gap-2">
        {stages.map((stage) => {
          const completed = isStageCompleted(stage.id)
          const isCurrent = stage.id === currentStageId

          return (
            <button
              key={stage.id}
              className={cn(
                "h-2 rounded-full transition-all duration-300 ease-in-out",
                isCurrent ? "w-6 bg-primary" : completed ? "w-2 bg-primary/40" : "w-2 bg-on-surface-variant/20",
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

const ModuleNav = memo(
  ({
    modules,
    student,
    selectedModule,
    onToggleModule,
    canAccessStage,
    onSelectLesson,
  }: {
    modules: Module[]
    student: StudentRecord
    selectedModule: number | null
    onToggleModule: (moduleId: number) => void
    canAccessStage: (moduleId: number, lessonId: number, stageId: number) => boolean
    onSelectLesson: (moduleId: number, lessonId: number) => void
  }) => {
    return (
      <nav className="flex flex-col gap-1 p-2">
        {modules.map((module) => {
          const isExpanded = selectedModule === module.id
          const isCurrentModule = module.id === student.currentModule

          return (
            <div key={module.id} className="group">
              <button
                onClick={() => onToggleModule(module.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-left transition-all",
                  isCurrentModule
                    ? "bg-surface-variant text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high",
                )}
              >
                <span className="w-4 shrink-0 font-mono text-code-sm opacity-50">{module.id}.</span>
                <span className="flex-1 truncate text-label-md tracking-normal">{module.title}</span>
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 transition-transform", isExpanded && "rotate-180")}
                />
              </button>

              {isExpanded && (
                <div className="mt-1 flex flex-col gap-1 animate-in pl-12 pr-4">
                  {module.lessons.map((lesson) => {
                    const accessible = canAccessStage(module.id, lesson.id, 1)
                    const isCurrentLesson = isCurrentModule && lesson.id === student.currentLesson

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => accessible && onSelectLesson(module.id, lesson.id)}
                        disabled={!accessible}
                        className={cn(
                          "relative py-1.5 text-left text-sm transition-colors",
                          isCurrentLesson
                            ? "font-medium text-primary before:absolute before:left-[-16px] before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full before:bg-primary"
                            : "text-on-surface-variant hover:text-primary",
                          !accessible && "cursor-not-allowed opacity-60 hover:text-on-surface-variant",
                        )}
                      >
                        {lesson.id}. {lesson.title}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    )
  },
)

ModuleNav.displayName = "ModuleNav"

function SidebarHeading() {
  return (
    <div className="flex items-center gap-2 border-b border-outline-variant/10 px-6 py-5">
      <BookOpen className="h-5 w-5 text-on-surface-variant" />
      <h2 className="text-lg font-bold text-on-surface">Modules</h2>
    </div>
  )
}

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
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b border-outline-variant/10 bg-surface-dim px-4 md:px-6">
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary"
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
            className="group flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <GraduationCap className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-bold text-on-surface">Viskar</span>
          </Link>
        </div>

        <div className="mx-8 hidden max-w-xl flex-1 items-center md:flex">
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-[width] duration-500 ease-out"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden items-center gap-3 md:flex">
            <span className="text-sm text-on-surface-variant">{calculateProgress()}% Complete</span>
            <div className="h-4 w-px bg-outline-variant/30" />
            <span className="text-sm text-on-surface">{student.name}</span>
          </div>

          <Link href={`/settings?code=${student.classCode}`}>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="relative z-10">
        {isDesktop ? (
          <ResizablePanelGroup direction="horizontal" autoSaveId="learn-sidebar" className="min-h-[calc(100vh-64px)]">
            <ResizablePanel defaultSize={22} minSize={16} maxSize={40}>
              <div className="custom-scrollbar sticky h-[calc(100vh-64px)] overflow-y-auto border-r border-outline-variant/10 bg-surface-container-low">
                <SidebarHeading />
                <ModuleNav
                  modules={modulesArray}
                  student={student}
                  selectedModule={selectedModule}
                  onToggleModule={(moduleId) =>
                    setSelectedModule(selectedModule === moduleId ? null : moduleId)
                  }
                  canAccessStage={canAccessStage}
                  onSelectLesson={(moduleId, lessonId) => jumpToStage(moduleId, lessonId, 1)}
                />
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel>
              <div className="flex min-h-[calc(100vh-64px)] flex-col bg-background">
                <div
                  className={cn(
                    "custom-scrollbar px-6 py-10 md:px-12",
                    currentStage.type === "lesson" && "flex-1 overflow-y-auto",
                  )}
                >
                  <div className="mx-auto w-full max-w-content">
                    <nav className="mb-8 flex items-center gap-2 text-label-md uppercase text-on-surface-variant/70">
                      <span>Module {currentModule.id}</span>
                      <ChevronRight className="h-3 w-3" />
                      <span>Lesson {currentLesson.id}</span>
                      <ChevronRight className="h-3 w-3" />
                      <span className="text-primary">{currentLesson.title}</span>
                    </nav>

                    <div className="mb-10 flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <h1 className="mb-4 text-headline-lg-mobile text-on-surface md:text-headline-lg">
                          {currentStage.title}
                        </h1>
                        <div className="prose prose-obsidian prose-obsidian-lead prose-lg max-w-none">
                          <ReactMarkdown>{currentStage.description}</ReactMarkdown>
                        </div>
                      </div>
                      {currentStage.hint && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowHint(!showHint)}
                          className="group shrink-0 border-outline-variant/30 bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary"
                        >
                          <Lightbulb className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                          Hint
                        </Button>
                      )}
                    </div>

                    {showHint && currentStage.hint && (
                      <div className="mb-8 flex animate-in items-start gap-4 rounded-r-xl border-l-4 border-tertiary bg-surface-container-high/50 p-6">
                        <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-tertiary" />
                        <div>
                          <h4 className="mb-1 text-base font-bold text-on-surface">Hint</h4>
                          <p className="text-body-md text-on-surface-variant">{currentStage.hint}</p>
                        </div>
                      </div>
                    )}

                    <div className="prose prose-obsidian prose-lg max-w-none">
                      <ReactMarkdown components={lessonMarkdownComponents}>{currentStage.instructions}</ReactMarkdown>
                    </div>

                    {currentStage.type === "exercise" && (
                      <div className="mt-8">
                        <PythonIDE
                          key={stageKey}
                          starterCode={currentStage.starterCode || ""}
                          testCases={currentStage.testCases || []}
                          onSuccess={onComplete}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="sticky bottom-0 z-10 mt-auto w-full border-t border-outline-variant/10 bg-surface-dim/80 px-6 py-4 backdrop-blur-md md:px-12">
                  <div className="mx-auto flex w-full max-w-content items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={goToPreviousStage}
                      disabled={isSavingProgress}
                      className="border-outline-variant/30 bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
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
                      className="bg-primary text-on-primary shadow-elegant transition-colors hover:bg-primary-fixed"
                    >
                      {wasCompletedOnArrival || allowNextPage ? (
                        <>
                          Next
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Complete to Continue
                          <Check className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="min-h-[calc(100vh-64px)]">
            {showSidebar && (
              <div
                className="fixed inset-0 z-40 bg-surface-container-lowest/80 backdrop-blur-sm lg:hidden"
                onClick={() => setShowSidebar(false)}
              />
            )}

            <div
              className={cn(
                "fixed left-0 top-16 z-50 h-[calc(100vh-64px)] w-80 transform border-r border-outline-variant/10 bg-surface-container-low transition-transform duration-300 lg:hidden",
                showSidebar ? "translate-x-0" : "-translate-x-full",
              )}
            >
              <SidebarHeading />
              <div className="custom-scrollbar h-[calc(100%-69px)] overflow-y-auto">
                <ModuleNav
                  modules={modulesArray}
                  student={student}
                  selectedModule={selectedModule}
                  onToggleModule={(moduleId) =>
                    setSelectedModule(selectedModule === moduleId ? null : moduleId)
                  }
                  canAccessStage={canAccessStage}
                  onSelectLesson={(moduleId, lessonId) => {
                    jumpToStage(moduleId, lessonId, 1)
                    setShowSidebar(false)
                  }}
                />
              </div>
            </div>

            <div className="space-y-8 px-4 py-8">
              <nav className="flex items-center gap-2 text-label-md uppercase text-on-surface-variant/70">
                <span>Module {currentModule.id}</span>
                <ChevronRight className="h-3 w-3" />
                <span>Lesson {currentLesson.id}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-primary">{currentLesson.title}</span>
              </nav>

              <div>
                <h1 className="mb-4 text-headline-lg-mobile text-on-surface">{currentStage.title}</h1>
                <div className="prose prose-obsidian prose-obsidian-lead max-w-none">
                  <ReactMarkdown>{currentStage.description}</ReactMarkdown>
                </div>
              </div>

              {currentStage.hint && (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="border-outline-variant/30 bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-tertiary"
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Hint
                  </Button>
                  {showHint && (
                    <div className="mt-4 flex items-start gap-4 rounded-r-xl border-l-4 border-tertiary bg-surface-container-high/50 p-4">
                      <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-tertiary" />
                      <p className="text-body-md text-on-surface-variant">{currentStage.hint}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="prose prose-obsidian max-w-none">
                <ReactMarkdown components={lessonMarkdownComponents}>{currentStage.instructions}</ReactMarkdown>
              </div>

              {currentStage.type === "exercise" && (
                <PythonIDE
                  key={stageKey}
                  starterCode={currentStage.starterCode || ""}
                  testCases={currentStage.testCases || []}
                  onSuccess={onComplete}
                />
              )}

              <div className="flex items-center justify-between gap-3 border-t border-outline-variant/10 pt-6">
                <Button
                  variant="outline"
                  onClick={goToPreviousStage}
                  disabled={isSavingProgress}
                  className="border-outline-variant/30 bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
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
                  className="bg-primary text-on-primary hover:bg-primary-fixed"
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
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

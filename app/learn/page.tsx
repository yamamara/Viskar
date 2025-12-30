"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PythonIDE } from "@/components/python-ide"
import { storage } from "@/lib/storage"
import { modules } from "@/lib/lessons-data"
import { ChevronLeft, ChevronRight, Home, Settings, BookOpen, Lightbulb, Menu, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

function LearnPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const classCode = searchParams.get("code")

  const [student, setStudent] = useState<ReturnType<typeof storage.getStudent> | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [selectedModule, setSelectedModule] = useState<number | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  const [allowNextPage, setAllowNextPage] = useState(false)

  useEffect(() => {
    if (!classCode) {
      router.push("/")
      return
    }

    const studentData = storage.getStudent(classCode)
    if (!studentData) {
      router.push("/")
      return
    }

    setStudent(studentData)
  }, [classCode, router])

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const currentModule = modules.find((m) => m.id === student.currentModule)
  const currentLesson = currentModule?.lessons.find((l) => l.id === student.currentLesson)
  const currentStage = currentLesson?.stages.find((s) => s.id === student.currentStage)

  if (!currentModule || !currentLesson || !currentStage) {
    return <div className="min-h-screen flex items-center justify-center">Error loading lesson</div>
  }

  const onComplete = () => {
    setAllowNextPage(true)
  }

  const handleStageComplete = () => {
    const stageId = `${student.currentModule}-${student.currentLesson}-${student.currentStage}`

    // Check if this is the last stage of the lesson
    const isLastStage = student.currentStage === currentLesson.stages.length

    if (isLastStage) {
      // Check if this is the last lesson of the module
      const isLastLesson = student.currentLesson === currentModule.lessons.length

      if (isLastLesson) {
        // Check if this is the last module
        const isLastModule = student.currentModule === modules.length

        if (isLastModule) {
          // Completed everything!
          alert("Congratulations! You've completed all lessons!")
        } else {
          // Move to next module
          storage.updateStudentProgress(student.classCode, student.currentModule + 1, 1, 1, true)
        }
      } else {
        // Move to next lesson
        storage.updateStudentProgress(student.classCode, student.currentModule, student.currentLesson + 1, 1, true)
      }
    } else {
      // Move to next stage
      storage.updateStudentProgress(
        student.classCode,
        student.currentModule,
        student.currentLesson,
        student.currentStage + 1,
        true,
      )
    }

    setStudent(storage.getStudent(student.classCode))
    setAllowNextPage(false)
    setShowHint(false)
  }

  const goToPreviousStage = () => {
    if (student.currentStage > 1) {
      storage.updateStudentProgress(
        student.classCode,
        student.currentModule,
        student.currentLesson,
        student.currentStage - 1,
        false,
      )
    } else if (student.currentLesson > 1) {
      const prevLesson = currentModule.lessons.find((l) => l.id === student.currentLesson - 1)
      if (prevLesson) {
        storage.updateStudentProgress(
          student.classCode,
          student.currentModule,
          student.currentLesson - 1,
          prevLesson.stages.length,
          false,
        )
      }
    } else if (student.currentModule > 1) {
      const prevModule = modules.find((m) => m.id === student.currentModule - 1)
      if (prevModule) {
        const lastLesson = prevModule.lessons[prevModule.lessons.length - 1]
        storage.updateStudentProgress(
          student.classCode,
          student.currentModule - 1,
          lastLesson.id,
          lastLesson.stages.length,
          false,
        )
      }
    }

    setStudent(storage.getStudent(student.classCode))
    setAllowNextPage(true)
    setShowHint(false)
  }

  const calculateProgress = () => {
    let totalStages = 0
    let completedStages = 0

    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        lesson.stages.forEach((stage) => {
          totalStages++
          const stageId = `${module.id}-${lesson.id}-${stage.id}`
          if (student.completedStages.includes(stageId)) {
            completedStages++
          }
        })
      })
    })

    return Math.round((completedStages / totalStages) * 100)
  }

  const lessonUnlocked = (moduleId: number, lessonId: number) => {
    return student.completedStages.some((id) =>
            id.startsWith(`${moduleId}-${lessonId}-`)
        ) ||
        moduleId < student.currentModule ||
        (moduleId === student.currentModule && lessonId <= student.currentLesson)
  }

  const isStageCompleted = (moduleId: number, lessonId: number, stageId: number) => {
    return student.completedStages.includes(`${moduleId}-${lessonId}-${stageId}`)
  }

  const canAccessStage = (moduleId: number, lessonId: number, stageId: number) => {
    // Can always access current and previous stages
    if (moduleId < student.currentModule) return true
    if (moduleId === student.currentModule && lessonId < student.currentLesson) return true
    if (moduleId === student.currentModule && lessonId === student.currentLesson && stageId <= student.currentStage)
      return true
    return false
  }

  const jumpToStage = (moduleId: number, lessonId: number, stageId: number) => {
    if (canAccessStage(moduleId, lessonId, stageId)) {
      storage.updateStudentProgress(student.classCode, moduleId, lessonId, stageId, false)
      setStudent(storage.getStudent(student.classCode))
      setSelectedModule(null)
      setShowHint(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <header className="border-b border-border/50 glass-effect sticky top-0 z-50 shadow-elegant">
        <div className="w-full px-4 py-4">
          <div className="flex items-center w-full">
            {/* LEFT */}
            <div className="flex items-center gap-3 shrink-0">
              <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden hover:bg-accent/10"
                  onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all duration-300 group">
                <Home className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-foreground tracking-tight">PyLearn</span>
              </Link>
            </div>

            {/* CENTER (progress bar only) */}
            <div className="flex-1 px-6">
              <Progress value={calculateProgress()} className="h-2.5" />
            </div>

            {/* RIGHT */}
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
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Sidebar */}
          <div
              className={cn(
                  "lg:col-span-3 border-r border-border/50 lg:min-h-[calc(100vh-73px)]",
                  "fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto",
                  "bg-background lg:bg-transparent",
                  "transition-transform duration-300 lg:transition-none",
                  showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
              )}
          >
            <div className="sticky top-[73px] lg:top-[73px] h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-6 border-b border-border/50 bg-card/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Modules</h2>
                </div>
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setShowSidebar(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              </div>
              <div className="p-3 space-y-1">
                {modules.map((module) => (
                  <div key={module.id}>
                    <Button
                      variant={selectedModule === module.id ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start text-left transition-all duration-200 hover:translate-x-1",
                        module.id === student.currentModule && "border-l-2 border-primary bg-primary/5",
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
                          const lessonAccessible = lessonUnlocked(module.id, lesson.id)

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
                                    setShowSidebar(false)
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
          </div>

          {/* Main Content */}
          {showSidebar && (
              <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setShowSidebar(false)} />
          )}
          <div className="lg:col-span-9 flex flex-col min-h-[calc(100vh-73px)]">
            {/* Lesson Info */}
            <div className="p-6 bg-card/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                    Module {currentModule.id} • Lesson {currentLesson.id} • Stage {currentStage.id} of{" "}
                    {currentLesson.stages.length}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{currentStage.title}</h1>
                  <p className="text-base leading-relaxed text-muted-foreground">{currentStage.description}</p>
                </div>
                {currentStage.hint && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="flex-shrink-0 hover:bg-warning/10 transition-all duration-300 group"
                  >
                    <Lightbulb className={cn("h-4 w-4 mr-2 transition-all", showHint && "text-warning")} />
                    {showHint ? "Hide" : "Hint"}
                  </Button>
                )}
              </div>

              {showHint && currentStage.hint && (
                <div className="mt-4 p-4 bg-warning/10 border border-warning/30 rounded-xl animate-in">
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong className="text-warning">Hint:</strong> {currentStage.hint}
                  </p>
                </div>
              )}

              <div className="mt-4 prose prose-sm max-w-none">
                <p className="text-foreground text-base leading-relaxed">{currentStage.instructions}</p>
              </div>
            </div>

            {/* IDE Section */}
            <div className="flex-1 flex flex-col border-b border-border/50">
               <PythonIDE
                 starterCode={currentStage.starterCode}
                 testCases={currentStage.testCases}
                 onSuccess={onComplete}
                 className="flex-1"
               />
            </div>

            {/* Navigation Section */}
            <div className="p-6 bg-card/50">
              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousStage}
                  disabled={student.currentModule === 1 && student.currentLesson === 1 && student.currentStage === 1}
                  className="hover:bg-accent/10 transition-all duration-300 bg-transparent"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2.5">
                  {currentLesson.stages.map((stage) => (
                      <button
                          key={stage.id}
                          className={cn(
                              "h-2.5 rounded-full transition-all duration-300",
                              stage.id === currentStage.id ? "w-10" : "w-2.5",
                              isStageCompleted(student.currentModule, student.currentLesson, stage.id)
                                  ? "bg-success"
                                  : "bg-muted",
                          )}
                          onClick={() =>
                              canAccessStage(student.currentModule, student.currentLesson, stage.id) &&
                              jumpToStage(student.currentModule, student.currentLesson, stage.id)
                          }
                          disabled={!canAccessStage(student.currentModule, student.currentLesson, stage.id)}
                      />
                  ))}
                </div>

                <Button
                  variant="default"
                  onClick={handleStageComplete}
                  disabled={!allowNextPage }
                  className="shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
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

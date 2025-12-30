"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { storage } from "@/lib/storage"
import type { Teacher, Student, ClassCode } from "@/lib/storage"
import { modules } from "@/lib/lessons-data"
import { Plus, Copy, LogOut, GraduationCap, Users, Settings, Check } from "lucide-react"

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [teacher, setTeacher] = useState<Teacher | null>(null)
  const [classData, setClassData] = useState<Map<string, { code: ClassCode; students: Student[] }>>(new Map())
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    const teacherEmail = sessionStorage.getItem("teacherEmail")

    if (!teacherEmail) {
      router.push("/teacher/login")
      return
    }

    const teacherData = storage.getTeacher(teacherEmail)

    if (!teacherData) {
      router.push("/teacher/login")
      return
    }

    setTeacher(teacherData)

    // Load all class data
    const classMap = new Map<string, { code: ClassCode; students: Student[] }>()
    teacherData.classCodes.forEach((code) => {
      const codeData = storage.getClassCode(code)
      if (codeData) {
        const students = storage.getAllStudentsForClass(code)
        classMap.set(code, { code: codeData, students })
      }
    })
    setClassData(classMap)
  }, [router])

  const handleGenerateClassCode = () => {
    if (!teacher) return

    const newCode = storage.generateClassCode()

    const newClassCode: ClassCode = {
      code: newCode,
      teacherId: teacher.id,
      createdAt: new Date().toISOString(),
      students: [],
    }

    storage.setClassCode(newClassCode)

    teacher.classCodes.push(newCode)
    storage.setTeacher(teacher)

    setTeacher({ ...teacher })
    setClassData(new Map(classData.set(newCode, { code: newClassCode, students: [] })))
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleLogout = () => {
    sessionStorage.removeItem("teacherEmail")
    router.push("/teacher/login")
  }

  const getStudentProgress = (student: Student) => {
    const currentModule = modules.find((m) => m.id === student.currentModule)
    const currentLesson = currentModule?.lessons.find((l) => l.id === student.currentLesson)

    if (!currentModule || !currentLesson) return "Module 1, Lesson 1"

    return `Module ${currentModule.id}: ${currentModule.title}, Lesson ${currentLesson.id}: ${currentLesson.title}`
  }

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <header className="border-b border-border/50 glass-effect sticky top-0 z-50 shadow-elegant">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-elegant group-hover:scale-105 transition-transform">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">PyLearn Teacher</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{teacher.email}</span>
              </div>
              <Link href={`/settings?teacher=true`}>
                <Button variant="ghost" size="sm" className="hover:bg-accent/10 transition-all duration-300">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-destructive/10 transition-all duration-300 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-10 relative z-10">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground text-lg">Manage your classes and track student progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border border-border/50 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
            <CardHeader className="pb-3 space-y-2">
              <CardDescription className="text-sm font-medium">Total Classes</CardDescription>
              <CardTitle className="text-4xl font-bold">{teacher.classCodes.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border border-border/50 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
            <CardHeader className="pb-3 space-y-2">
              <CardDescription className="text-sm font-medium">Total Students</CardDescription>
              <CardTitle className="text-4xl font-bold">
                {Array.from(classData.values()).reduce((sum, data) => sum + data.students.length, 0)}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="border border-border/50 shadow-elegant hover:shadow-elegant-lg transition-all duration-300">
            <CardHeader className="pb-3 space-y-2">
              <CardDescription className="text-sm font-medium">Active Modules</CardDescription>
              <CardTitle className="text-4xl font-bold">{modules.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="border border-border/50 shadow-elegant mb-10">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Create New Class</CardTitle>
            <CardDescription className="text-base">Generate a class code that students can use to join</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleGenerateClassCode}
              className="shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate Class Code
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {teacher.classCodes.length === 0 ? (
            <Card className="border border-border/50 shadow-elegant">
              <CardContent className="py-16 text-center">
                <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-5" />
                <h3 className="text-xl font-semibold text-foreground mb-3">No Classes Yet</h3>
                <p className="text-muted-foreground text-base mb-6">Generate your first class code to get started</p>
                <Button
                  onClick={handleGenerateClassCode}
                  className="shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Class Code
                </Button>
              </CardContent>
            </Card>
          ) : (
            teacher.classCodes.map((code) => {
              const data = classData.get(code)
              if (!data) return null

              return (
                <Card
                  key={code}
                  className="border border-border/50 shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2">
                        <CardTitle className="text-2xl tracking-tight">Class {code}</CardTitle>
                        <CardDescription className="text-base">
                          {data.students.length} students enrolled
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode(code)}
                        className="flex-shrink-0 hover:bg-accent/10 transition-all duration-300"
                      >
                        {copiedCode === code ? (
                          <>
                            <Check className="h-4 w-4 mr-2 text-success" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Code
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {data.students.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p className="text-base">No students have joined this class yet</p>
                        <p className="text-sm mt-3">
                          Share the class code: <span className="font-mono font-semibold text-foreground">{code}</span>
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-border/50">
                        <Table>
                          <TableHeader>
                            <TableRow className="hover:bg-transparent">
                              <TableHead className="font-semibold">Student Name</TableHead>
                              <TableHead className="hidden md:table-cell font-semibold">Current Progress</TableHead>
                              <TableHead className="text-right font-semibold">Stages Completed</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {data.students.map((student) => (
                              <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="font-medium">{student.name}</TableCell>
                                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                                  {getStudentProgress(student)}
                                </TableCell>
                                <TableCell className="text-right font-semibold">
                                  {student.completedStages.length}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Moon, Sun, Home, GraduationCap } from "lucide-react"
import { storage } from "@/lib/storage"

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const classCode = searchParams.get("code")
  const isTeacher = searchParams.get("teacher") === "true"

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [student, setStudent] = useState(classCode ? storage.getStudent(classCode) : null)
  const [teacherEmail, setTeacherEmail] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)

    if (isTeacher) {
      const email = sessionStorage.getItem("teacherEmail")
      setTeacherEmail(email)

      if (!email) {
        router.push("/teacher/login")
      }
    } else if (classCode) {
      const studentData = storage.getStudent(classCode)
      if (!studentData) {
        router.push("/")
      } else {
        setStudent(studentData)
      }
    } else {
      router.push("/")
    }
  }, [classCode, isTeacher, router])

  const handleResetProgress = () => {
    if (!student) return

    const confirmed = confirm("Are you sure you want to reset your progress? This cannot be undone.")

    if (confirmed) {
      storage.updateStudentProgress(student.classCode, 1, 1, 1, false)
      const updatedStudent = {
        ...student,
        completedStages: [],
        currentModule: 1,
        currentLesson: 1,
        currentStage: 1,
      }
      storage.setStudent(updatedStudent)
      alert("Progress has been reset!")
      router.push(`/learn?code=${student.classCode}`)
    }
  }

  if (!mounted) {
    return null
  }

  const backLink = isTeacher ? "/teacher/dashboard" : classCode ? `/learn?code=${classCode}` : "/"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              {isTeacher ? (
                <>
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="font-semibold text-foreground">PyLearn Teacher</span>
                </>
              ) : (
                <>
                  <Home className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">PyLearn</span>
                </>
              )}
            </Link>

            <Link href={backLink}>
              <Button variant="outline" size="sm">
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Choose your preferred color theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light Mode
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark Mode
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Settings */}
          {student && !isTeacher && (
            <>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle>Student Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    <p className="text-base font-medium text-foreground">{student.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Class Code</Label>
                    <p className="text-base font-mono font-medium text-foreground">{student.classCode}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground">Completed Stages</Label>
                    <p className="text-base font-medium text-foreground">{student.completedStages.length}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="destructive" onClick={handleResetProgress}>
                    Reset All Progress
                  </Button>
                  <p className="text-sm text-muted-foreground mt-3">
                    This will reset all your progress and start you back at the first lesson.
                  </p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Teacher Settings */}
          {isTeacher && teacherEmail && (
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Teacher Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground">Email</Label>
                  <p className="text-base font-medium text-foreground">{teacherEmail}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* About */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>About PyLearn</CardTitle>
              <CardDescription>Interactive Python learning platform</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                PyLearn is an educational platform designed to help students learn Python programming through
                interactive lessons and hands-on coding exercises. Built with Next.js and Pyodide.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  )
}

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, GraduationCap } from "lucide-react"
import { useTeacherAuth } from "@/components/teacher-auth-provider"

export default function TeacherLoginPage() {
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signupConfirm, setSignupConfirm] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { login, signup, session, loading } = useTeacherAuth()

  useEffect(() => {
    if (!loading && session) {
      router.replace("/teacher/dashboard")
    }
  }, [loading, router, session])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      await login(loginEmail, loginPassword)
      router.push("/teacher/dashboard")
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Failed to sign in"
      if (message === "INVALID_LOGIN_CREDENTIALS") {
        setError("Incorrect email or password")
      } else {
        setError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!signupEmail || !signupPassword || !signupConfirm) {
      setError("Please fill in all fields")
      return
    }

    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match")
      return
    }

    if (signupPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsSubmitting(true)
    try {
      await signup(signupEmail, signupPassword)
      router.push("/teacher/dashboard")
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : "Failed to create account"
      if (message === "EMAIL_EXISTS") {
        setError("An account with this email already exists")
      } else {
        setError(message)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <GraduationCap className="h-7 w-7 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">Viskar</span>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">Teacher Portal</h1>
          <p className="text-muted-foreground">Manage your classes and track student progress</p>
        </div>

        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your teacher account or create a new one</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value)
                        setError("")
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value)
                        setError("")
                      }}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="teacher@example.com"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value)
                        setError("")
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => {
                        setSignupPassword(e.target.value)
                        setError("")
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirm Password</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupConfirm}
                      onChange={(e) => {
                        setSignupConfirm(e.target.value)
                        setError("")
                      }}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      <p>{error}</p>
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

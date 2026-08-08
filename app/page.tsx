import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AutoStudentRedirect } from "@/components/auto-student-redirect"
import { Users } from "lucide-react"
import { ClassCodeForm } from "@/components/class-code-form"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 relative">
      <AutoStudentRedirect />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <header className="flex items-center justify-between mb-16 md:mb-24">
          <div className="flex items-center gap-3">
            <span className="text-xl md:text-2xl font-bold text-foreground tracking-tight">[Viskar]</span>
          </div>
          <Link href="/teacher/login">
            <Button
              variant="outline"
              size="sm"
              className="text-sm glass-effect hover:bg-accent/10 transition-all duration-300 bg-transparent"
            >
              Teacher Login
            </Button>
          </Link>
        </header>

        {/* Hero Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 md:mb-20 animate-in">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 md:mb-8 text-balance leading-[1.1] tracking-tight">
              Learn Python With
              <div></div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-secondary">
                [Viskar]
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              The world's best interactive python course, with lessons designed for <strong>beginners</strong>
            </p>
          </div>

          <div className="max-w-md mx-auto animate-in" style={{ animationDelay: "0.1s" }}>
            <Card className="border border-border/50 shadow-elegant-lg">
              <CardHeader className="text-center space-y-3 pb-6">
                <CardTitle className="text-3xl">Get Started</CardTitle>
                <CardDescription className="text-base">Enter your class code to begin learning</CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <ClassCodeForm />
              </CardContent>
            </Card>

            <div className="mt-10 text-center">
              <p className="text-sm text-muted-foreground mb-4">Are you a teacher?</p>
              <Link href="/teacher/login">
                <Button variant="link" className="text-primary hover:text-primary/80 transition-colors group">
                  <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Create and manage classes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

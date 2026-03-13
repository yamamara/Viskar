"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TestCase } from "@/lib/lessons-data"
import { getPyodide } from "@/lib/pyodide"

interface PythonIDEProps {
  starterCode: string
  testCases: TestCase[]
  onSuccess?: () => void
  className?: string
}

const PYTHON_KEYWORDS = [
  "and", "as", "assert", "break", "class", "continue", "def", "del", "elif",
  "else", "except", "False", "finally", "for", "from", "global", "if",
  "import", "in", "is", "lambda", "None", "nonlocal", "not", "or", "pass",
  "raise", "return", "True", "try", "while", "with", "yield",
]

const PYTHON_BUILTINS = [
  "print", "input", "len", "range", "str", "int", "float", "list", "dict",
  "tuple", "set", "abs", "max", "min", "sum", "sorted", "reversed",
  "enumerate", "zip", "map", "filter", "any", "all", "type", "isinstance",
  "open", "read", "write", "append",
]

export function PythonIDE({ starterCode, testCases, onSuccess, className }: PythonIDEProps) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; description: string }>>([])
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const pyodideRef = useRef<any>(null)
  const [pyodideLoading, setPyodideLoading] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)
  const editorWrapperRef = useRef<HTMLDivElement>(null)

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    let mounted = true;
    getPyodide().then(pyodide => {
      if (mounted) {
        pyodideRef.current = pyodide
        setPyodideLoading(false)
      }
    }).catch(err => {
      console.error("Failed to load Pyodide:", err)
      if (mounted) setPyodideLoading(false)
    })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    setCode(starterCode)
    setOutput("")
    setTestResults([])
    setAllTestsPassed(false)
  }, [starterCode])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          editorWrapperRef.current &&
          !editorWrapperRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const runCode = async () => {
    if (!pyodideRef.current) {
      setOutput("Python interpreter is still loading. Please wait...")
      return
    }

    setIsRunning(true)
    setOutput("")
    setTestResults([])

    try {
      // Capture stdout
      const result = await pyodideRef.current.runPythonAsync(`
import sys
from io import StringIO

# Redirect stdout
sys.stdout = StringIO()

try:
${code
  .split("\n")
  .map((line: string) => `    ${line}`)
  .join("\n")}
except Exception as e:
    print(f"Error: {e}")

# Get the output
output = sys.stdout.getvalue()
output
      `)

      setOutput(result || "(No output)")

      // Run test cases
      if (testCases.length > 0) {
        const results = testCases.map((testCase) => {
          const regex = new RegExp(testCase.expectedOutput)
          const passed = regex.test(result)
          return {
            passed,
            description: testCase.description,
          }
        })

        setTestResults(results)
        const allPassed = results.every((r) => r.passed)
        setAllTestsPassed(allPassed)

        if (allPassed && onSuccess) {
          setTimeout(() => {
            onSuccess()
          }, 1000)
        }
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const resetCode = () => {
    setCode(starterCode)
    setOutput("")
    setTestResults([])
    setAllTestsPassed(false)
  }

  const getWordAtCursor = (text: string, position: number) => {
    const beforeCursor = text.substring(0, position)
    const match = beforeCursor.match(/[\w.]+$/)
    return match ? match[0] : ""
  }

  const getCaretCoordinates = (textarea: HTMLTextAreaElement, position: number) => {
    if (!mirrorRef.current) return { top: 0, left: 0 }

    const mirror = mirrorRef.current
    const style = window.getComputedStyle(textarea)

    mirror.style.font = style.font
    mirror.style.padding = style.padding
    mirror.style.border = style.border
    mirror.style.whiteSpace = "pre-wrap"
    mirror.style.wordWrap = "break-word"
    mirror.style.width = textarea.offsetWidth + "px"

    const textBeforeCaret = textarea.value.substring(0, position)

    mirror.textContent = textBeforeCaret

    const span = document.createElement("span")
    span.textContent = "\u200b" // zero-width space = caret
    mirror.appendChild(span)

    const rect = span.getBoundingClientRect()
    const mirrorRect = mirror.getBoundingClientRect()

    return {
      top: rect.top - mirrorRect.top - textarea.scrollTop,
      left: rect.left - mirrorRect.left - textarea.scrollLeft,
    }
  }

  const updateSuggestions = (text: string, position: number) => {
    const word = getWordAtCursor(text, position)

    if (word.length < 1) {
      setShowSuggestions(false)
      return
    }

    const allSuggestions = [...PYTHON_KEYWORDS, ...PYTHON_BUILTINS]
    const filtered = allSuggestions.filter((s) => s.toLowerCase().startsWith(word.toLowerCase()) && s !== word)

    if (filtered.length > 0) {
      setSuggestions(filtered)
      setShowSuggestions(true)
      setSelectedSuggestion(0)

      // Calculate cursor position for dropdown
      if (textareaRef.current) {
        const coords = getCaretCoordinates(textareaRef.current, position)
        setCursorPosition(coords)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const applySuggestion = (suggestion: string) => {
    if (!textareaRef.current) return

    const position = textareaRef.current.selectionStart
    const word = getWordAtCursor(code, position)
    const newCode = code.substring(0, position - word.length) + suggestion + code.substring(position)

    setCode(newCode)
    setShowSuggestions(false)

    setTimeout(() => {
      if (textareaRef.current) {
        const newPosition = position - word.length + suggestion.length
        textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPosition
        textareaRef.current.focus()
      }
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev + 1) % suggestions.length)
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedSuggestion((prev) => (prev - 1 + suggestions.length) % suggestions.length)
        return
      }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault()
        applySuggestion(suggestions[selectedSuggestion])
        return
      }
      if (e.key === "Escape") {
        setShowSuggestions(false)
        return
      }
    }

    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + "    " + code.substring(end)
      setCode(newCode)

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value
    const position = e.target.selectionStart

    setCode(newCode)
    updateSuggestions(newCode, position)
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="bg-card border-b border-border/50">
        <div className="flex items-center justify-between p-4 border-b border-border/50">
          <span className="text-sm font-semibold text-muted-foreground tracking-wide">Code Editor</span>
          <div className="flex gap-2.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCode}
              disabled={isRunning || pyodideLoading}
              className="hover:bg-accent/10 transition-all duration-300"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={runCode}
              disabled={isRunning || pyodideLoading}
              size="sm"
              className="shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : pyodideLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </div>
        <div ref={editorWrapperRef} className="relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={handleCodeChange}
            onKeyDown={handleKeyDown}
            onClick={() => setShowSuggestions(false)}
            className="flex-1 w-full min-h-[250px] md:min-h-[300px] p-4 font-mono text-sm bg-muted/4 border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none transition-all duration-200"
            spellCheck={false}
            disabled={isRunning || pyodideLoading}
          />
          <div
              ref={mirrorRef}
              className="absolute top-0 left-0 invisible pointer-events-none whitespace-pre-wrap break-words"
              aria-hidden
          />

          {showSuggestions && (
            <div
              className="absolute z-50 bg-popover border border-border rounded-lg shadow-elegant-lg overflow-hidden"
              style={{
                top: cursorPosition.top + 25, // below caret
                left: cursorPosition.left - 10
              }}
            >
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm font-mono hover:bg-accent transition-colors",
                    index === selectedSuggestion && "bg-accent",
                  )}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => applySuggestion(suggestion)}
                  onMouseEnter={() => setSelectedSuggestion(index)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border-b border-border/50">
        <div className="p-4 border-b border-border/50">
          <span className="text-sm font-semibold text-muted-foreground tracking-wide">Output</span>
        </div>
        <div className="p-4">
          <div className="min-h-[120px] p-4 font-mono text-sm bg-muted/40 rounded-xl border border-input whitespace-pre-wrap break-words leading-relaxed">
            {output || (pyodideLoading ? "Loading Python interpreter..." : "Click 'Run Code' to see output")}
          </div>
        </div>
      </div>

      {testResults.length > 0 && (
        <div
          className={cn(
            "p-4 border-b border-border/50 transition-all duration-300",
            allTestsPassed ? "bg-success/5" : "bg-card",
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold tracking-wide">Test Results</span>
            {allTestsPassed && (
              <div className="flex items-center gap-2.5 text-success font-semibold animate-in">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm">All tests passed!</span>
              </div>
            )}
          </div>
          <div className="space-y-2.5">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 p-3.5 rounded-xl transition-all duration-300 animate-in",
                  result.passed
                    ? "bg-success/10 border border-success/20"
                    : "bg-destructive/10 border border-destructive/20",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {result.passed ? (
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className={cn("text-sm font-semibold", result.passed ? "text-success" : "text-destructive")}>
                    Test {index + 1}: {result.passed ? "Passed" : "Failed"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{result.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

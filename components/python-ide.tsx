"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Play, RotateCcw, Loader2, CheckCircle2, XCircle, Terminal, FlaskConical } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TestCase } from "@/lib/lessons-data"
import { getPyodide } from "@/lib/pyodide"
import { runProgram, runTestCases, normalizeOutput, type TestOutcome } from "@/lib/python-runner"

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

function DiffRow({ label, value, tone }: { label: string; value: string; tone?: "error" }) {
  return (
    <div>
      <div className="mb-1 text-label-md uppercase text-on-surface-variant/70">{label}</div>
      <pre
        className={cn(
          "m-0 overflow-x-auto whitespace-pre-wrap break-words rounded bg-surface-container-lowest p-2.5",
          tone === "error" ? "text-error" : "text-on-surface",
        )}
      >
        {value}
      </pre>
    </div>
  )
}

export function PythonIDE({ starterCode, testCases, onSuccess, className }: PythonIDEProps) {
  const [code, setCode] = useState(starterCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const [testResults, setTestResults] = useState<TestOutcome[]>([])
  const [allTestsPassed, setAllTestsPassed] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const mirrorRef = useRef<HTMLDivElement>(null)
  const editorWrapperRef = useRef<HTMLDivElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    let mounted = true
    getPyodide()
      .then(() => {
        if (mounted) setPyodideLoading(false)
      })
      .catch((err) => {
        console.error("Failed to load Pyodide:", err)
        if (mounted) setPyodideLoading(false)
      })
    return () => {
      mounted = false
    }
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

  /**
   * Runs the program once so the student can see its output. When the exercise
   * has test cases, the first case's input is supplied, otherwise `input()`
   * would immediately hit end-of-file.
   */
  const runCode = async () => {
    if (pyodideLoading) {
      setOutput("Python interpreter is still loading. Please wait...")
      return
    }

    setIsRunning(true)
    setOutput("")
    setTestResults([])

    try {
      const sampleInput = testCases[0]?.input ?? ""
      const result = await runProgram(code, sampleInput)
      setOutput(result.ok ? result.stdout || "(No output)" : result.error)
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  /**
   * Grades the exercise. Every test case runs the program from scratch with its
   * own input, so the cases genuinely exercise different paths.
   */
  const runTests = async () => {
    if (pyodideLoading || testCases.length === 0) return

    setIsTesting(true)
    setOutput("")
    setTestResults([])

    try {
      const outcomes = await runTestCases(code, testCases)
      setTestResults(outcomes)

      const allPassed = outcomes.every((outcome) => outcome.passed)
      setAllTestsPassed(allPassed)

      const firstFailure = outcomes.find((outcome) => !outcome.passed)
      if (firstFailure?.error) {
        setOutput(firstFailure.error)
      }

      if (allPassed && onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 800)
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsTesting(false)
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

  const lineCount = code.split("\n").length
  const busy = isRunning || isTesting || pyodideLoading

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Editor — a Level 1 container sitting above the page surface */}
      <div className="overflow-hidden rounded-xl border border-outline-variant/20 bg-surface-container-low">
        <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-highest px-4 py-2">
          <span className="flex items-center gap-2 text-label-md uppercase text-on-surface-variant">
            <Terminal className="h-4 w-4" />
            Editor
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetCode}
              disabled={busy}
              className="h-7 rounded-md px-3 text-label-md uppercase text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
            <Button
              variant="ghost"
              onClick={runCode}
              disabled={busy}
              size="sm"
              className="h-7 rounded-md px-3 text-label-md uppercase text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Running
                </>
              ) : pyodideLoading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Loading
                </>
              ) : (
                <>
                  <Play className="mr-1.5 h-3.5 w-3.5" />
                  Run
                </>
              )}
            </Button>
            {testCases.length > 0 && (
              <Button
                variant="ghost"
                onClick={runTests}
                disabled={busy}
                size="sm"
                className="h-7 rounded-md bg-primary/10 px-3 text-label-md uppercase text-primary hover:bg-primary/20 hover:text-primary"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Checking
                  </>
                ) : (
                  <>
                    <FlaskConical className="mr-1.5 h-3.5 w-3.5" />
                    Check
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <div ref={editorWrapperRef} className="flex">
          {/* Line-number gutter, kept in sync with the textarea's scroll */}
          <div
            ref={gutterRef}
            aria-hidden
            className="select-none overflow-hidden bg-surface-container-lowest/50 py-4 pl-4 pr-3 text-right font-mono text-code-sm text-outline-variant/60"
          >
            {Array.from({ length: lineCount }, (_, index) => (
              <div key={index}>{index + 1}</div>
            ))}
          </div>

          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={handleCodeChange}
              onKeyDown={handleKeyDown}
              onClick={() => setShowSuggestions(false)}
              onScroll={(event) => {
                if (gutterRef.current) {
                  gutterRef.current.scrollTop = event.currentTarget.scrollTop
                }
              }}
              className="block min-h-[250px] w-full resize-none border-0 bg-transparent px-4 py-4 font-mono text-code-sm text-on-surface caret-primary focus:outline-none focus:ring-0 md:min-h-[300px]"
              spellCheck={false}
              disabled={busy}
            />
            <div
              ref={mirrorRef}
              className="invisible pointer-events-none absolute left-0 top-0 whitespace-pre-wrap break-words"
              aria-hidden
            />

            {showSuggestions && (
              <div
                className="absolute z-50 overflow-hidden rounded-lg border border-outline-variant/30 bg-popover shadow-elegant-lg"
                style={{
                  top: cursorPosition.top + 25, // below caret
                  left: cursorPosition.left - 10,
                }}
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    className={cn(
                      "w-full px-3 py-2 text-left font-mono text-code-sm transition-colors hover:bg-surface-variant",
                      index === selectedSuggestion && "bg-surface-variant text-primary",
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

        {/* Console */}
        <div className="border-t border-outline-variant/10 bg-surface-container-lowest p-4 font-mono text-code-sm">
          <div className="mb-2 select-none text-label-md uppercase text-outline-variant/70">Console Output</div>
          <div className="whitespace-pre-wrap break-words text-on-surface/90">
            {output || (
              <span className="text-outline">
                {pyodideLoading ? "Loading Python interpreter…" : "Run your code to see output here."}
              </span>
            )}
          </div>
        </div>
      </div>

      {testResults.length > 0 && (
        <div
          className={cn(
            "rounded-xl border p-4 transition-colors duration-300",
            allTestsPassed ? "border-success/30 bg-success/5" : "border-outline-variant/20 bg-surface-container-low",
          )}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="text-label-md uppercase text-on-surface-variant">Test Results</span>
            {allTestsPassed && (
              <div className="flex animate-in items-center gap-2 font-semibold text-success">
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
                  "flex animate-in items-start gap-3 rounded-lg p-3.5",
                  result.passed
                    ? "border border-success/20 bg-success/10"
                    : "border border-destructive/20 bg-destructive/10",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {result.passed ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-destructive" />
                )}
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm font-semibold", result.passed ? "text-success" : "text-destructive")}>
                    Test {index + 1}: {result.passed ? "Passed" : "Failed"}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-on-surface-variant">{result.description}</p>

                  {/* On failure, show exactly what was compared */}
                  {!result.passed && (
                    <div className="mt-3 space-y-2 font-mono text-code-sm">
                      {result.input.trim() !== "" && (
                        <DiffRow label="Input" value={result.input} />
                      )}
                      {result.error ? (
                        <DiffRow label="Error" value={result.error} tone="error" />
                      ) : (
                        <>
                          <DiffRow label="Expected" value={normalizeOutput(result.expected)} />
                          <DiffRow
                            label="Your output"
                            value={normalizeOutput(result.actual) || "(nothing was printed)"}
                            tone="error"
                          />
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

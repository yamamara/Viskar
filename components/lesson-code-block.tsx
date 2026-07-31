"use client"

import { useState } from "react"
import { Play, Terminal, Loader2 } from "lucide-react"
import { getPyodide } from "@/lib/pyodide"
import { highlightPython } from "@/lib/python-highlight"

interface LessonCodeBlockProps {
  code: string
  language?: string
  label?: string
}

/**
 * A read-only code sample rendered as the design system's interactive editor:
 * a Level 1 container with a header strip, line-number gutter, syntax
 * highlighting, and a console that fills in when the sample is run.
 */
export function LessonCodeBlock({ code, language, label }: LessonCodeBlockProps) {
  const [output, setOutput] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const isPython = language === "python" || language === "py"
  const lines = code.split("\n")

  const runCode = async () => {
    setIsRunning(true)
    try {
      const pyodide = await getPyodide()
      const result = await pyodide.runPythonAsync(`
import sys
from io import StringIO

sys.stdout = StringIO()

try:
${code
  .split("\n")
  .map((line) => `    ${line}`)
  .join("\n")}
except Exception as e:
    print(f"Error: {e}")

output = sys.stdout.getvalue()
output
      `)
      setOutput(result || "(No output)")
    } catch (error: any) {
      setOutput(`Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <div className="not-prose my-8 overflow-hidden rounded-lg border border-outline-variant/20 bg-surface-container-low">
      <div className="flex items-center justify-between border-b border-outline-variant/10 bg-surface-container-highest px-4 py-2">
        <span className="flex items-center gap-2 text-label-md text-on-surface-variant">
          <Terminal className="h-3.5 w-3.5" />
          {label ?? "Example"}
        </span>
        {isPython && (
          <button
            onClick={runCode}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded px-3 py-1 text-label-md text-primary transition-colors hover:bg-primary/20 disabled:opacity-50 bg-primary/10"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Running
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Run
              </>
            )}
          </button>
        )}
      </div>

      <div className="flex">
        <div
          aria-hidden
          className="select-none py-4 pl-4 pr-3 text-right font-mono text-code-sm text-outline-variant/60 bg-surface-container-lowest/50"
        >
          {lines.map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>
        <pre className="m-0 flex-1 overflow-x-auto bg-transparent p-4 font-mono text-code-sm text-on-surface">
          <code>{isPython ? highlightPython(code) : code}</code>
        </pre>
      </div>

      {isPython && (
        <div className="border-t border-outline-variant/10 bg-surface-container-lowest p-4 font-mono text-code-sm">
          <div className="mb-2 select-none text-label-md text-outline-variant/70">Console Output</div>
          {output === null ? (
            <div className="text-outline">Run the example to see its output.</div>
          ) : (
            <div className="whitespace-pre-wrap break-words text-on-surface">
              {output
                .replace(/\n$/, "")
                .split("\n")
                .map((line, index) => (
                  <div key={index}>&gt; {line}</div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

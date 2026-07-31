import { getPyodide } from "@/lib/pyodide"
import type { TestCase } from "@/lib/lessons-data"

/**
 * The Python side of the runner. Each execution gets:
 *
 *   - a fresh globals dict, so names cannot leak between test cases
 *   - stdout and stderr captured into one buffer, restored in `finally`
 *   - `input()` fed from the test's stdin text rather than a browser prompt
 *   - a fresh working directory, so files written by one test are invisible
 *     to the next
 *
 * `__name__` is set to `"__main__"` so that programs guarded by
 * `if __name__ == "__main__":` actually execute.
 */
const HARNESS = `
import sys, io, os, json, builtins, traceback, tempfile, shutil

def __viskar_run(code, stdin_text):
    out = io.StringIO()
    stdin = io.StringIO(stdin_text)
    real_stdout, real_stderr, real_stdin = sys.stdout, sys.stderr, sys.stdin
    real_input = builtins.input
    real_cwd = os.getcwd()
    workdir = tempfile.mkdtemp(prefix="viskar_")

    def fake_input(prompt=""):
        if prompt:
            out.write(str(prompt))
        line = stdin.readline()
        if line == "":
            raise EOFError("EOF when reading a line")
        return line.rstrip("\\n")

    result = {"ok": True, "stdout": "", "error": ""}
    try:
        os.chdir(workdir)
        sys.stdout = out
        sys.stderr = out
        sys.stdin = stdin
        builtins.input = fake_input
        namespace = {"__name__": "__main__", "__builtins__": builtins}
        exec(compile(code, "program.py", "exec"), namespace)
    except SystemExit:
        pass
    except SyntaxError as exc:
        result["ok"] = False
        label = type(exc).__name__
        if exc.lineno:
            result["error"] = "Line %d: %s: %s" % (exc.lineno, label, exc.msg)
        else:
            result["error"] = "%s: %s" % (label, exc.msg)
    except BaseException as exc:
        result["ok"] = False
        line_no = None
        tb = exc.__traceback__
        while tb is not None:
            if tb.tb_frame.f_code.co_filename == "program.py":
                line_no = tb.tb_lineno
            tb = tb.tb_next
        detail = "".join(traceback.format_exception_only(type(exc), exc)).strip()
        result["error"] = ("Line %d: %s" % (line_no, detail)) if line_no else detail
    finally:
        sys.stdout, sys.stderr, sys.stdin = real_stdout, real_stderr, real_stdin
        builtins.input = real_input
        os.chdir(real_cwd)
        shutil.rmtree(workdir, ignore_errors=True)

    result["stdout"] = out.getvalue()
    return json.dumps(result)
`

export interface RunResult {
  ok: boolean
  stdout: string
  error: string
}

export interface TestOutcome {
  passed: boolean
  description: string
  input: string
  expected: string
  actual: string
  error: string
}

let harnessLoaded = false

async function loadHarness() {
  const pyodide = await getPyodide()
  if (!harnessLoaded) {
    pyodide.runPython(HARNESS)
    harnessLoaded = true
  }
  return pyodide
}

/**
 * Runs `code` once with the supplied stdin and returns whatever it printed.
 */
export async function runProgram(code: string, stdin = ""): Promise<RunResult> {
  const pyodide = await loadHarness()
  const run = pyodide.globals.get("__viskar_run")
  try {
    return JSON.parse(run(code, stdin)) as RunResult
  } finally {
    run?.destroy?.()
  }
}

/**
 * Collapses differences that no reasonable exercise should grade on: Windows
 * line endings, trailing spaces at the end of a line, and trailing blank lines
 * at the end of the program's output. Everything else is compared literally.
 */
export function normalizeOutput(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n+$/, "")
}

function compare(actual: string, testCase: TestCase): boolean {
  const expected = normalizeOutput(testCase.expectedOutput)
  const received = normalizeOutput(actual)

  switch (testCase.match) {
    case "contains":
      return received.includes(expected)
    case "regex":
      // Only ever a regular expression when the curriculum explicitly asks.
      try {
        return new RegExp(testCase.expectedOutput).test(received)
      } catch {
        return false
      }
    default:
      return received === expected
  }
}

/**
 * Runs the student's program once per test case, each in isolation, and reports
 * the outcome of every case rather than stopping at the first failure.
 */
export async function runTestCases(code: string, testCases: TestCase[]): Promise<TestOutcome[]> {
  const outcomes: TestOutcome[] = []

  for (const testCase of testCases) {
    const result = await runProgram(code, testCase.input ?? "")
    outcomes.push({
      passed: result.ok && compare(result.stdout, testCase),
      description: testCase.description,
      input: testCase.input ?? "",
      expected: testCase.expectedOutput,
      actual: result.stdout,
      error: result.error,
    })
  }

  return outcomes
}

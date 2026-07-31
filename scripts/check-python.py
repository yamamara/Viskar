"""
Python-level curriculum checks, driven by scripts/validate-curriculum.ts.

Reads a JSON payload on stdin describing every exercise (starter code, hidden
reference solution, and test cases) and every ```python example in the lesson
prose, then verifies that:

  * each fenced example compiles
  * each exercise's starter code compiles, so a student never opens an editor
    that is broken before they have typed anything
  * each reference solution compiles, runs, and produces exactly the expected
    output for every one of its test cases

The execution harness mirrors lib/python-runner.ts: a fresh globals dict, stdin
fed to input(), captured stdout, and a scratch working directory per run, so
tests cannot leak state into one another.

Exits non-zero if any check fails.
"""

import builtins
import io
import json
import os
import re
import shutil
import sys
import tempfile
import traceback

UNAVAILABLE_IMPORTS = {
    "pytest",
    "requests",
    "numpy",
    "pandas",
    "matplotlib",
    "bs4",
    "flask",
    "django",
    "scipy",
    "PIL",
}


def run(code, stdin_text):
    """Execute `code` with `stdin_text` on stdin; return (ok, stdout, error)."""
    out = io.StringIO()
    stdin = io.StringIO(stdin_text)
    real_stdout, real_stderr, real_stdin = sys.stdout, sys.stderr, sys.stdin
    real_input = builtins.input
    real_cwd = os.getcwd()
    workdir = tempfile.mkdtemp(prefix="viskar_check_")

    def fake_input(prompt=""):
        if prompt:
            out.write(str(prompt))
        line = stdin.readline()
        if line == "":
            raise EOFError("EOF when reading a line")
        return line.rstrip("\n")

    ok, error = True, ""
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
    except BaseException as exc:  # noqa: BLE001 - the point is to report anything
        ok = False
        error = "".join(traceback.format_exception_only(type(exc), exc)).strip()
    finally:
        sys.stdout, sys.stderr, sys.stdin = real_stdout, real_stderr, real_stdin
        builtins.input = real_input
        os.chdir(real_cwd)
        shutil.rmtree(workdir, ignore_errors=True)

    return ok, out.getvalue(), error


def normalize(text):
    """Match lib/python-runner.ts normalizeOutput exactly."""
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    text = re.sub(r"[ \t]+$", "", text, flags=re.MULTILINE)
    return re.sub(r"\n+$", "", text)


def compare(actual, expected, mode):
    if mode == "contains":
        return normalize(expected) in normalize(actual)
    if mode == "regex":
        try:
            return re.search(expected, normalize(actual)) is not None
        except re.error:
            return False
    return normalize(actual) == normalize(expected)


def unavailable_imports(code):
    found = set()
    for match in re.finditer(r"^\s*(?:import|from)\s+([A-Za-z_][\w.]*)", code, flags=re.MULTILINE):
        root = match.group(1).split(".")[0]
        if root in UNAVAILABLE_IMPORTS:
            found.add(root)
    return sorted(found)


def main():
    payload = json.load(sys.stdin)
    failures = []
    checked_snippets = 0
    checked_solutions = 0
    checked_tests = 0

    for snippet in payload.get("snippets", []):
        where, code = snippet["where"], snippet["code"]
        checked_snippets += 1
        try:
            compile(code, "example.py", "exec")
        except SyntaxError as exc:
            failures.append("example does not compile at %s: line %s: %s" % (where, exc.lineno, exc.msg))
        missing = unavailable_imports(code)
        if missing:
            failures.append("example at %s imports unavailable package(s): %s" % (where, ", ".join(missing)))

    for exercise in payload.get("exercises", []):
        where = exercise["where"]

        starter = exercise.get("starterCode", "")
        starter_broken_on_purpose = exercise.get("starterIsBroken", False)
        try:
            compile(starter, "starter.py", "exec")
            if starter_broken_on_purpose:
                failures.append(
                    "starter code at %s is flagged starterIsBroken but compiles cleanly" % where
                )
        except SyntaxError as exc:
            if not starter_broken_on_purpose:
                failures.append(
                    "starter code does not compile at %s: line %s: %s" % (where, exc.lineno, exc.msg)
                )

        solution = exercise.get("solution", "")
        if not solution.strip():
            failures.append("no reference solution for %s" % where)
            continue

        try:
            compile(solution, "solution.py", "exec")
        except SyntaxError as exc:
            failures.append("solution does not compile at %s: line %s: %s" % (where, exc.lineno, exc.msg))
            continue

        missing = unavailable_imports(solution)
        if missing:
            failures.append("solution at %s imports unavailable package(s): %s" % (where, ", ".join(missing)))

        checked_solutions += 1
        for index, test in enumerate(exercise.get("tests", []), start=1):
            checked_tests += 1
            ok, stdout, error = run(solution, test.get("input", ""))
            if not ok:
                failures.append("solution raised an error at %s test %d: %s" % (where, index, error))
                continue
            if not compare(stdout, test["expectedOutput"], test.get("match", "exact")):
                failures.append(
                    "solution output mismatch at %s test %d\n      expected: %r\n      actual:   %r"
                    % (where, index, normalize(test["expectedOutput"]), normalize(stdout))
                )

    print("Python checks")
    print("  examples compiled     %5d" % checked_snippets)
    print("  solutions executed    %5d" % checked_solutions)
    print("  solution test runs    %5d" % checked_tests)

    if failures:
        print("")
        print("Python check failures (%d):" % len(failures))
        for failure in failures[:60]:
            print("  - %s" % failure)
        if len(failures) > 60:
            print("  ...and %d more" % (len(failures) - 60))
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())

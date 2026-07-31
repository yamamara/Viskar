# Python Curriculum

This document is the authoritative description of the course delivered by this
application. It supersedes the previous `curriculumoutline.docx`, which
described a different and now-removed course.

Current curriculum version: **2** (see `lib/curriculum-version.ts`).

## Course purpose

A complete introduction to programming in Python for people who have never
written a line of code. The course takes a learner from "what is an
instruction?" to designing, testing, and documenting a multi-function program
that reads and writes structured data.

The aim is genuine programming ability rather than syntax recognition. A learner
who finishes should be able to read unfamiliar Python, decompose a problem into
functions, write and run tests, handle bad input deliberately, work with files
and structured formats, and judge which language feature suits a problem.

## Intended audience

Adults and older secondary students with no programming experience. The writing
assumes intelligence and no prior knowledge: every technical term is defined
before use, and nothing relies on familiarity with terminals, file systems, or
mathematics beyond arithmetic.

## Prerequisites

- Comfortable reading English prose.
- Basic arithmetic.
- A web browser.

Nothing is installed. Python runs in the browser via Pyodide, so learners write
and run real Python from the first stage without configuring anything.

## Learning outcomes

On completion, a learner can:

1. Explain what a program is and how an interpreter processes source code.
2. Use values, variables, expressions, and Python's core types correctly, and
   explain why a string of digits is not a number.
3. Write conditional logic with correct boundary behaviour and combine
   conditions with Boolean operators.
4. Write `while` and `for` loops, choose between them, and trace them by hand.
5. Choose appropriately between lists, tuples, dictionaries, and sets, and
   explain aliasing and copying.
6. Decompose a problem into named functions with clear inputs and outputs, and
   structure a program around `main()`.
7. Diagnose faults methodically, read a traceback, and use `try`/`except` and
   `raise` deliberately.
8. Use the standard library, import correctly, and keep unpredictability at the
   edges of a program.
9. Write test cases covering normal, boundary, degenerate, and invalid inputs,
   and refactor safely under test.
10. Read and write text, CSV, and JSON files, validating external data at the
    boundary.
11. Use regular expressions for validation and extraction, and recognise when a
    string method or a proper parser is the better tool.
12. Design classes with enforced invariants, and judge when not to use one.
13. Plan, build, test, and document a complete program.

## Module map

| # | Module | Lessons | Stages | Exercises | Words |
|---|--------|---------|--------|-----------|-------|
| 1 | Computers, Code, and Your First Program | 4 | 17 | 9 | 6,452 |
| 2 | Values, Variables, Input, and Functions | 5 | 22 | 11 | 8,237 |
| 3 | Decisions and Boolean Logic | 5 | 16 | 9 | 6,290 |
| 4 | Repetition and Loops | 3 | 12 | 6 | 5,183 |
| 5 | Collections and Structured Data | 5 | 19 | 10 | 7,737 |
| 6 | Functions and Program Design | 4 | 14 | 7 | 6,211 |
| 7 | Debugging, Validation, and Exceptions | 3 | 10 | 4 | 5,350 |
| 8 | Modules, Libraries, and Program Interfaces | 3 | 10 | 5 | 4,716 |
| 9 | Testing and Code Quality | 3 | 10 | 5 | 4,680 |
| 10 | Files, CSV, and JSON | 3 | 11 | 5 | 5,124 |
| 11 | Regular Expressions and Text Processing | 3 | 10 | 5 | 4,361 |
| 12 | Classes and Object-Oriented Design | 3 | 10 | 4 | 5,266 |
| 13 | Practical Python Patterns and Capstone | 4 | 19 | 12 | 7,556 |

Totals: 13 modules, 48 lessons, 180 stages, 92 graded exercises, 305 test
cases, roughly 77,000 words of instructional content.

### What each module covers

**1 — Computers, Code, and Your First Program.** Instructions and ambiguity,
source code, the interpreter, `print()`, strings and quotation marks, comments,
syntax errors and how to read them, predicting output, the edit-run-observe
cycle.

**2 — Values, Variables, Input, and Functions.** Values, types, `type()`,
variables and assignment, arithmetic and precedence, string methods, f-strings,
`input()`, conversion, `def`, `return`, printing versus returning, scope, side
effects.

**3 — Decisions and Boolean Logic.** Comparison operators, `==` versus `=`,
`if`/`elif`/`else`, indentation as structure, `and`/`or`/`not` with truth
tables, chained comparisons, membership, identity versus equality, validation,
guard clauses, `match`.

**4 — Repetition and Loops.** `while`, loop state, counters and accumulators,
sentinel loops, infinite loops, `for` and `range`, iterating strings, `break`
and `continue`, nested loops, tracing, off-by-one errors.

**5 — Collections and Structured Data.** Lists, indexing and slicing,
mutability, list methods, sorting, tuples and unpacking, dictionaries, sets,
nested collections, choosing a collection, comprehensions, aliasing and copying.

**6 — Functions and Program Design.** Keyword arguments, defaults, the mutable
default trap, composition, helper functions, decomposition, designing from
examples, `main()` and the `__name__` guard, docstrings, type hints, refactoring.

**7 — Debugging, Validation, and Exceptions.** The three kinds of error, reading
tracebacks, reproduce-reduce-hypothesise, inspecting values, `try`/`except`,
specific exceptions, `else`/`finally`, `raise`, fail-fast design, assertions,
anti-patterns.

**8 — Modules, Libraries, and Program Interfaces.** Imports and namespaces,
`math`, `statistics`, `datetime`, `random` and seeding, writing your own
modules, `sys.argv` and `argparse`, `pip` and third-party packages, APIs and
JSON conceptually.

**9 — Testing and Code Quality.** Why manual checking fails, choosing test
cases, `assert`, test naming, arrange-act-assert, testing exceptions, pytest
concepts, regression tests, refactoring under test, PEP 8, readability.

**10 — Files, CSV, and JSON.** Paths, `open()`, modes, `with`, reading and
writing, file exceptions, encodings, the `csv` module, `DictReader` and
`DictWriter`, the `json` module, validating imported data.

**11 — Regular Expressions and Text Processing.** The problem regex solves, raw
strings, character classes, quantifiers and greediness, anchors, `fullmatch`
versus `search`, groups and named groups, `findall`, `sub`, maintainability, and
when not to use regex.

**12 — Classes and Object-Oriented Design.** Why classes exist, `__init__` and
`self`, attributes and methods, invariants, properties, encapsulation, `__str__`
and `__repr__`, equality, operator overloading, class variables, class and
static methods, composition, inheritance and `super()`, custom exceptions,
dataclasses, and when not to use a class.

**13 — Practical Python Patterns and Capstone.** Comprehensions, unpacking,
`enumerate`, `zip`, `any`/`all`, sorting keys, `lambda`, `map`/`filter`,
`*args`/`**kwargs`, generators, decorators, project structure, requirements and
milestones, responsible software, and a six-stage capstone.

## Pedagogical principles

**Nothing is used before it is defined.** Terms are introduced with a plain
definition, then syntax, then a traced example.

**Concepts are developed, not announced.** Each new idea starts from a concrete
problem, shows why it matters, contrasts with a common misconception, and ends
with a decision rule.

**Prediction before revelation.** Instructional stages ask the learner to decide
what a program will do before the answer is given.

**Frequently confused ideas are separated explicitly**, including code versus
output, assignment versus equality, a name versus its value, definition versus
call, argument versus parameter, printing versus returning, a digit string
versus an integer, an index versus an item, mutation versus creating a new
value, the three kinds of error, validation versus exception handling, a module
versus a package, a class versus an object, and equality versus identity.

**Spiral revisiting.** Important ideas return in more demanding settings.
Functions appear in Module 2 and are re-examined in Module 6; validation appears
in Module 3 and returns in Modules 7 and 10; the pure-function discipline
introduced in Module 2 is the reason testing works in Module 9.

**One design thread runs throughout**: keep logic in pure functions, and keep
printing, input, randomness, and time at the edges. This is motivated four
separate times, from four different directions.

**Recurring projects** provide continuity without forcing a single narrative: a
study planner, a reading log, an expense tracker, a habit tracker, and a
text-cleaning utility recur across modules.

## Assessment structure

Each lesson holds two to four instructional stages and at least two graded
exercises. Every module ends with a cumulative checkpoint combining skills from
that module and earlier ones.

Exercises span output prediction, code reading, completing a program, writing
from requirements, debugging, refactoring, function design, input validation,
collection processing, testing existing code, file and structured-data work, and
mini-projects.

Every exercise carries a precise title, a concise description, complete visible
instructions with requirements and examples, valid starter code, a hint that
gives a productive next step rather than the answer, and one or more test cases
with meaningful descriptions.

A stage is complete only when every test passes.

### Conventions

- Graded exercises read input with bare `input()` and no prompt string, because
  a prompt becomes part of the program's output and output is compared exactly.
  Prompts are taught in prose and used in examples.
- Programs that use randomness always set a seed, so results are reproducible.
- Exercises never depend on the current date or time, network access, or
  third-party packages.
- File exercises create the data they need; each test runs in its own
  scratch directory, so nothing leaks between stages or between tests.

## Technical curriculum format

The application consumes `lib/lessons.json`: an array of modules.

```
Module   { id, title, description, lessons[] }
Lesson   { id, title, description, stages[] }
Stage    { id, type, title, description, instructions,
           starterCode?, testCases?, hint? }
TestCase { input, expectedOutput, description, match? }
```

`type` is `"lesson"` or `"exercise"`. Exercise stages carry `starterCode`,
`hint`, and `testCases`.

IDs are consecutive integers starting at 1: module IDs across the course, lesson
IDs within each module, stage IDs within each lesson. They are assigned from
array position by the build script, so they cannot drift.

`match` selects how `expectedOutput` is compared: `"exact"` (the default and
omitted from the data), `"contains"`, or `"regex"`. Exact comparison is the
default because expected output routinely contains brackets, dots, and
backslashes that a regular expression would misread.

`input` is newline-delimited standard input, supplied to the program's `input()`
calls. Each test case runs the program from scratch.

Instructions are Markdown rendered by react-markdown: `##` and `###` headings,
short paragraphs, inline code, fenced `python` blocks (rendered as runnable
examples) and `text` blocks (rendered as output), and blockquotes opening with a
bold label for callouts. Tables and raw HTML are not supported and the validator
rejects both.

## Authoring, validating, and publishing

The curriculum is authored as TypeScript under `curriculum/` and compiled into
`lib/lessons.json`. The application reads the committed JSON directly and never
runs a build step at runtime.

```
curriculum/types.ts          authoring types and helpers
curriculum/index.ts          the ordered list of modules
curriculum/modules/*.ts      one file per module
scripts/build-curriculum.ts  compiles to lib/lessons.json
scripts/validate-curriculum.ts   structural and editorial checks
scripts/check-python.py      compiles examples, runs reference solutions
```

Exercises carry a `solution` field in the authoring source. The build strips it,
so reference solutions are validated on every run but never shipped to students.

### Commands

Both scripts run under Node's native TypeScript support; no extra dependency is
required.

```
node scripts/build-curriculum.ts      # regenerate lib/lessons.json
node scripts/validate-curriculum.ts   # validate the built curriculum
```

Run the build after any content change, then the validator, then commit both the
source and the regenerated `lib/lessons.json`. The build is deterministic:
rebuilding unchanged content produces a byte-identical file.

### What the validator checks

Valid JSON and schema conformance; consecutive IDs at all three levels; no empty
modules, lessons, or stages; required fields per stage type; starter code, hints
and test cases present on every exercise; non-empty test descriptions; duplicate
titles within a parent; placeholder text; corrupted titles; empty expected output
that has not been explicitly marked; balanced code fences with known languages;
Markdown tables and raw HTML; unsupported stage types; and the course-size
minimums.

It then invokes `scripts/check-python.py`, which compiles every fenced `python`
example, compiles every exercise's starter code, and runs every reference
solution against every one of its test cases using an execution harness matching
the browser runner. Examples and solutions importing packages unavailable in
Pyodide are rejected.

Starter code that is deliberately broken — repair exercises — is marked
`starterIsBroken` in the authoring source, and the validator asserts that such
code really does fail to compile so the marker cannot go stale.

### Publishing

`GET /api/lessons` prefers a curriculum document stored in Firestore at
`content/lessons`, but only when that document's `version` matches
`CURRICULUM_VERSION` from `lib/curriculum-version.ts`. A document with a missing
or older version belongs to a superseded course and is ignored in favour of the
bundled `lib/lessons.json`. Nothing is deleted; the stale document is simply not
served.

Teacher edits saved through `/teacher/lessons` are stamped with the current
version, so they take effect immediately and survive.

To publish a replacement course: author it, rebuild, validate, increment
`CURRICULUM_VERSION`, and deploy. Any teacher edits made against the previous
course stop being served at that point, which is the intended behaviour — they
describe lessons that no longer exist.

## Originality

All prose, examples, exercises, scenarios, names, and datasets in this course
are original to it. Scope and rigour are informed by well-regarded introductory
courses, but no lecture, note, exercise, specification, problem name, or
distinctive wording has been copied or paraphrased from any of them.

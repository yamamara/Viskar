import { module, lesson, type ModuleSource } from "../types.ts"

const moduleSix: ModuleSource = module(
  "Functions and Program Design",
  "Designing programs out of well-chosen functions: arguments in depth, decomposition, structure, documentation, and refactoring.",
  [
    lesson(
      "Arguments in Depth",
      "Positional and keyword arguments, defaults, and returning several results.",
      [
        {
          type: "lesson",
          title: "Keyword Arguments and Defaults",
          description: "Naming arguments at the call site, and making parameters optional.",
          instructions: `## The problem with positions

A function with several parameters becomes hard to call correctly:

\`\`\`python
def format_entry(title, pages, finished, starred):
    return f"{title} | {pages}p | done={finished} | star={starred}"


print(format_entry("Tidal Systems", 320, True, False))
\`\`\`

\`\`\`text
Tidal Systems | 320p | done=True | star=False
\`\`\`

The call site is a row of bare values. A reader cannot tell what \`True, False\` means without going to find the definition, and swapping the two produces a wrong result with no error.

## Keyword arguments

You can name arguments at the call:

\`\`\`python
def format_entry(title, pages, finished, starred):
    return f"{title} | {pages}p | done={finished} | star={starred}"


print(format_entry("Tidal Systems", 320, finished=True, starred=False))
print(format_entry(title="Coastal Birds", pages=180, starred=True, finished=False))
\`\`\`

\`\`\`text
Tidal Systems | 320p | done=True | star=False
Coastal Birds | 180p | done=False | star=True
\`\`\`

Two things changed. The meaning of each value is now visible, and the order no longer matters — the second call supplies \`starred\` before \`finished\` and still works.

The rule is that **positional arguments must come before keyword arguments**. \`format_entry(title="x", 320)\` is a syntax error.

The convention worth adopting: pass the obvious arguments positionally, and name anything whose meaning would not be clear at a glance. A bare \`True\` or \`False\` in a call is almost always worth naming.

## Default values

A parameter may have a default, used when the caller omits it:

\`\`\`python
def format_entry(title, pages, finished=False, starred=False):
    return f"{title} | {pages}p | done={finished} | star={starred}"


print(format_entry("Tidal Systems", 320))
print(format_entry("Coastal Birds", 180, finished=True))
\`\`\`

\`\`\`text
Tidal Systems | 320p | done=False | star=False
Coastal Birds | 180p | done=True | star=False
\`\`\`

Defaults make the common case short while keeping the unusual case possible. Choose the default that is right most of the time.

Parameters with defaults must come **after** those without, since Python could not otherwise tell which positional argument belongs where.

## A trap: mutable defaults

This looks reasonable and is a genuine bug:

\`\`\`python
def add_reading(value, readings=[]):
    readings.append(value)
    return readings


print(add_reading(1))
print(add_reading(2))
\`\`\`

\`\`\`text
[1]
[1, 2]
\`\`\`

The second call was expected to produce \`[2]\`. Instead it produced \`[1, 2]\`.

The default value is created **once**, when the function is defined, not each time it is called. Every call that omits the argument shares one list, and appending to it accumulates across calls.

The fix is to default to \`None\` and create the list inside:

\`\`\`python
def add_reading(value, readings=None):
    if readings is None:
        readings = []
    readings.append(value)
    return readings


print(add_reading(1))
print(add_reading(2))
\`\`\`

\`\`\`text
[1]
[2]
\`\`\`

Note \`is None\` rather than \`== None\`: this is exactly the case where identity is the right test, as promised in Module 3.

> **Key idea**
> Never use a list, dictionary, or set as a default value. Default to \`None\` and create the collection inside the function.

## Reading a call correctly

You have been using keyword arguments since Module 5 without the name:

\`\`\`python
words = ["banana", "fig", "cherry"]
print(sorted(words, key=len, reverse=True))
\`\`\`

\`\`\`text
['banana', 'cherry', 'fig']
\`\`\`

\`key\` and \`reverse\` are parameters of \`sorted\` with defaults. Supplying them by name is why that call reads clearly. Now you can write functions with the same quality of interface.

## Summary

Keyword arguments name values at the call site, making meaning visible and order irrelevant. Defaults make parameters optional and must follow non-default parameters. Never default to a mutable value; use \`None\` and create it inside.`,
        },
        {
          type: "lesson",
          title: "Composition and Multiple Returns",
          description: "Building larger operations by combining small ones.",
          instructions: `## Functions calling functions

A function may call another. This is how programs are built: small, reliable operations combined into larger ones.

\`\`\`python
def clean(text):
    return text.strip().lower()


def is_yes(text):
    return clean(text) in ("y", "yes")


print(is_yes("  YES  "))
print(is_yes("no"))
\`\`\`

\`\`\`text
True
False
\`\`\`

\`is_yes\` does not know how cleaning works, only that \`clean\` does it. If the cleaning rule changes — say, also removing full stops — one function changes and every caller benefits.

## Composition

**Composition** means using the output of one function as the input to another:

\`\`\`python
def words_of(text):
    return text.lower().split()


def unique_count(items):
    return len(set(items))


print(unique_count(words_of("Red blue RED green")))
\`\`\`

\`\`\`text
3
\`\`\`

Read the last line from the inside out: \`words_of\` produces a list, which \`unique_count\` receives.

This only works because both functions are pure: they take input and return output without printing or modifying anything. A function that printed instead of returning could not be composed at all. That is the practical payoff of the rule introduced in Module 2.

## Helper functions

A **helper function** exists to make another function simpler. It is usually small and specific.

Consider validating and summarising a set of readings. Written as one function:

\`\`\`python
def summarise(raw):
    values = []
    for part in raw.split():
        if part.lstrip("-").isdigit():
            values.append(int(part))
    if not values:
        return "No valid readings"
    total = sum(values)
    mean = total / len(values)
    return f"{len(values)} readings, total {total}, mean {mean:.1f}"


print(summarise("12 x 8 -4"))
\`\`\`

\`\`\`text
3 readings, total 16, mean 5.3
\`\`\`

It works, but it does two unrelated jobs: parsing text and computing statistics. Split them:

\`\`\`python
def parse_readings(raw):
    values = []
    for part in raw.split():
        if part.lstrip("-").isdigit():
            values.append(int(part))
    return values


def describe(values):
    if not values:
        return "No valid readings"
    total = sum(values)
    mean = total / len(values)
    return f"{len(values)} readings, total {total}, mean {mean:.1f}"


print(describe(parse_readings("12 x 8 -4")))
\`\`\`

\`\`\`text
3 readings, total 16, mean 5.3
\`\`\`

The behaviour is identical. What improved is that each function can now be understood, tested, and changed on its own. \`describe\` can summarise readings from anywhere, not only from a string.

\`part.lstrip("-")\` removes leading hyphens so that \`-4\` is recognised as a number; \`isdigit()\` alone would reject it.

## Returning several values

Module 5 introduced returning a tuple. It is worth revisiting as a design tool:

\`\`\`python
def split_valid(parts):
    good = []
    bad = []
    for part in parts:
        if part.isdigit():
            good.append(int(part))
        else:
            bad.append(part)
    return good, bad


numbers, rejected = split_valid(["12", "x", "8"])
print(numbers)
print(rejected)
\`\`\`

\`\`\`text
[12, 8]
['x']
\`\`\`

One pass, two results, no global state, and the caller decides what to do with each. That is often better than two functions that each iterate, or one that prints its findings.

Keep the number small. A function returning five values is usually one that should return a dictionary, or that is trying to do too much.

## How small should a function be?

There is no fixed number of lines. Two questions are more useful.

*Can you name it precisely?* If the honest name is \`process_data\` or \`do_everything\`, the function has no single purpose and should be split.

*Can you describe what it does in one sentence, without using "and"?* If not, that sentence's "and" marks the seam.

By that test, \`parse_readings\` reads "extracts whole numbers from a string" and \`describe\` reads "summarises a list of numbers as a sentence". Both pass. The original \`summarise\` needed an "and", which is why splitting improved it.

> **Key idea**
> A function should do one thing you can name. When the natural description contains "and", you have found where to split it.

## Summary

Functions call other functions, and composition passes one's result to another. Helper functions keep each piece nameable and testable. Return a tuple for a small number of related results. Judge a function's size by whether you can name it precisely.`,
        },
        {
          type: "exercise",
          title: "Build a Flexible Formatter",
          description: "Write a function with default parameters that callers can override by name.",
          instructions: `## The problem

Write a function that formats a label and a value, with several presentation options.

## Requirements

Define a function \`render(label, value, width=12, fill=".", upper=False)\` that **returns** a string:

1. The label, left-aligned in a field of \`width\` characters, padded with the \`fill\` character.
2. Followed immediately by the value.
3. If \`upper\` is true, the label is converted to uppercase **before** padding.

## Then

Print exactly four lines, calling \`render\` with:

1. \`render("pages", 320)\`
2. \`render("title", "Tidal Systems", width=8)\`
3. \`render("status", "ok", fill="-")\`
4. \`render("total", 45, width=10, upper=True)\`

## Expected output

\`\`\`text
pages.......320
title...Tidal Systems
status------ok
TOTAL.....45
\`\`\`

Check the last line against its call. It overrides \`width\` and \`upper\` but not \`fill\`, so it keeps the default \`.\` and pads the uppercased label to ten characters.

## Guidance

An f-string can take the width and fill from variables using nested braces: \`f"{label:{fill}<{width}}"\` pads \`label\` to \`width\` characters with \`fill\`, left-aligned.

Apply the uppercase conversion before padding, or the field width will be applied to the wrong text.

## Constraints

The function must return its result. Do not print inside it.`,
          starterCode: `def render(label, value, width=12, fill=".", upper=False):
    return ""


print(render("pages", 320))
`,
          hint: "Inside the function: text = label.upper() if upper else label, then return f\"{text:{fill}<{width}}{value}\". The nested braces let the fill character and width come from parameters.",
          tests: [
            {
              expectedOutput: "pages.......320\ntitle...Tidal Systems\nstatus------ok\nTOTAL.....45",
              description: "All four calls use the correct mixture of defaults and overridden keyword arguments",
            },
          ],
          solution: `def render(label, value, width=12, fill=".", upper=False):
    text = label.upper() if upper else label
    return f"{text:{fill}<{width}}{value}"


print(render("pages", 320))
print(render("title", "Tidal Systems", width=8))
print(render("status", "ok", fill="-"))
print(render("total", 45, width=10, upper=True))
`,
        },
        {
          type: "exercise",
          title: "Split One Function Into Two",
          description: "Refactor a function that does two jobs into two composable functions.",
          instructions: `## The problem

The function in the editor works. It does two unrelated things: it extracts numbers from a string, and it summarises them. Because those jobs are fused, neither can be used on its own.

## Your task

Split it into two functions, then compose them.

## Requirements

1. Define \`parse_scores(raw)\` which takes a string and **returns a list of integers**, keeping only the whitespace-separated parts made entirely of digits.
2. Define \`describe(values)\` which takes a list of integers and **returns a string**:
   - \`No valid scores\` when the list is empty.
   - Otherwise \`3 scores, highest 90, mean 76.7\` with the mean to one decimal place.
3. Read one line of input and print the result of composing the two.

## Examples

Given \`70 x 90 -5 70\`, the output is:

\`\`\`text
3 scores, highest 90, mean 76.7
\`\`\`

The \`x\` is not numeric and \`-5\` contains a hyphen, so neither is kept.

Given \`nothing here\`, the output is:

\`\`\`text
No valid scores
\`\`\`

## Guidance

\`isdigit()\` is true only when every character is a digit, which is exactly the rule required: it rejects \`x\` and \`-5\` alike.

Guard the empty case at the top of \`describe\` before calling \`max\` or dividing, both of which fail on an empty list.

## Why this matters

After the split, \`describe\` can summarise scores from any source, and \`parse_scores\` can feed anything. That is the practical value of separating jobs, and the tests prove the behaviour did not change.`,
          starterCode: `def summarise(raw):
    values = []
    for part in raw.split():
        if part.isdigit():
            values.append(int(part))
    if not values:
        return "No valid scores"
    mean = sum(values) / len(values)
    return f"{len(values)} scores, highest {max(values)}, mean {mean:.1f}"


print(summarise(input()))
`,
          hint: "Move the loop into parse_scores and have it return values. Move everything after it into describe(values). The last line becomes print(describe(parse_scores(input()))).",
          tests: [
            {
              input: "70 x 90 -5 70\n",
              expectedOutput: "3 scores, highest 90, mean 76.7",
              description: "Non-numeric and negative parts are skipped and the rest summarised",
            },
            {
              input: "nothing here\n",
              expectedOutput: "No valid scores",
              description: "A line with no numbers reports the empty message",
            },
            {
              input: "100\n",
              expectedOutput: "1 scores, highest 100, mean 100.0",
              description: "A single score is summarised correctly",
            },
            {
              input: "\n",
              expectedOutput: "No valid scores",
              description: "An entirely empty line is handled by the guard",
            },
          ],
          solution: `def parse_scores(raw):
    values = []
    for part in raw.split():
        if part.isdigit():
            values.append(int(part))
    return values


def describe(values):
    if not values:
        return "No valid scores"
    mean = sum(values) / len(values)
    return f"{len(values)} scores, highest {max(values)}, mean {mean:.1f}"


print(describe(parse_scores(input())))
`,
        },
      ],
    ),

    lesson(
      "Decomposition and Design",
      "Turning a stated problem into a set of functions before writing any code.",
      [
        {
          type: "lesson",
          title: "Breaking a Problem Down",
          description: "A method for getting from a requirement to a structure.",
          instructions: `## Starting from a requirement

Beginners usually begin typing at line 1 and work downwards, discovering the structure as they go. For anything past twenty lines this produces a tangle.

The alternative is not to plan everything in advance — that fails for different reasons — but to spend a few minutes identifying the *pieces* before writing any of them.

Take a requirement:

> Read a series of study sessions, each with a subject and a duration in minutes. Report total time per subject, sorted by time spent, and identify the subject with the longest single session.

## Step one: find the nouns and verbs

The nouns suggest the data: sessions, subject, duration, totals.

The verbs suggest the operations: read, group, total, sort, identify.

That is not yet a design, but it is a list of things the program must do, which is more than a blank editor offers.

## Step two: name the operations

Turn each verb into a function name, and say what goes in and what comes out:

1. \`parse_session(line)\` — takes a line of text, returns a subject and a duration.
2. \`group_sessions(sessions)\` — takes many sessions, returns a dictionary of subject to list of durations.
3. \`totals_by_subject(grouped)\` — takes that dictionary, returns subject-and-total pairs sorted by total.
4. \`longest_session(grouped)\` — takes that dictionary, returns the subject with the largest single duration.

Naming the inputs and outputs is the part that does the work. If you cannot say what a function returns, you do not yet understand the piece.

## Step three: write the outline

Sketch the whole program as calls, before implementing any of them:

\`\`\`python
def parse_session(line):
    return ("", 0)


def group_sessions(lines):
    return {}


def report(grouped):
    return []


lines = ["history 40", "biology 25"]
grouped = group_sessions(lines)
for line in report(grouped):
    print(line)
\`\`\`

That program runs. It produces nothing useful, but it establishes the shape, and every function has a signature you can now fill in one at a time, testing as you go.

This is called writing a **stub**: a function with the right name and shape whose body is a placeholder. Stubs let you check that the pieces fit before investing in any of them.

## Step four: implement one piece at a time

Take the innermost, most independent function first — usually the one that depends on nothing else. Implement it, test it directly, and move on.

\`\`\`python
def parse_session(line):
    subject, minutes = line.split()
    return subject, int(minutes)


print(parse_session("history 40"))
print(parse_session("biology 25"))
\`\`\`

\`\`\`text
('history', 40)
('biology', 25)
\`\`\`

Two calls with known answers confirm it works. That takes fifteen seconds and eliminates it as a suspect for the rest of the session.

Working outwards from the bottom means that at every moment you are building on something already verified. Working top-down means everything is unverified until the very end, when a single wrong answer could come from any of five functions.

> **Key idea**
> Identify the pieces and their inputs and outputs before writing bodies. Implement from the bottom up, checking each piece as you finish it.

## Pseudocode

For an individual function whose logic is unclear, write the steps in English first:

\`\`\`text
group sessions:
  make an empty dictionary
  for each line:
    parse it into subject and minutes
    if the subject is new, start an empty list for it
    add the minutes to that subject's list
  return the dictionary
\`\`\`

Then translate line by line:

\`\`\`python
def parse_session(line):
    subject, minutes = line.split()
    return subject, int(minutes)


def group_sessions(lines):
    grouped = {}
    for line in lines:
        subject, minutes = parse_session(line)
        if subject not in grouped:
            grouped[subject] = []
        grouped[subject].append(minutes)
    return grouped


print(group_sessions(["history 40", "biology 25", "history 15"]))
\`\`\`

\`\`\`text
{'history': [40, 15], 'biology': [25]}
\`\`\`

The value of pseudocode is that it separates two hard things: deciding what the steps are, and expressing them in Python. Doing them one at a time is easier than doing both at once.

## Summary

Extract the nouns and verbs of a requirement to find the data and the operations. Name each function with its inputs and outputs, sketch the program as stubs, then implement from the bottom up, verifying each piece. Use pseudocode when a function's logic is unclear.`,
        },
        {
          type: "lesson",
          title: "Designing From Examples",
          description: "Using concrete cases to pin down behaviour before implementing it.",
          instructions: `## Vague requirements

A requirement like "format the duration nicely" cannot be implemented, because it does not say what "nicely" means. The fastest way to find out is to write down specific examples.

## Worked examples as a specification

Suppose you must format a duration in minutes. Write the cases:

\`\`\`text
0    -> "0m"
5    -> "5m"
60   -> "1h"
75   -> "1h 15m"
120  -> "2h"
\`\`\`

Writing five lines has already answered three questions the original requirement left open. Whole hours omit the minutes. Durations under an hour omit the hours. Zero produces \`0m\` rather than an empty string.

Those decisions had to be made by someone. Making them deliberately, in advance, is better than making them accidentally while typing.

## Examples become tests

Each example is a test you can run:

\`\`\`python
def format_duration(minutes):
    hours = minutes // 60
    remaining = minutes % 60
    if hours == 0:
        return f"{remaining}m"
    if remaining == 0:
        return f"{hours}h"
    return f"{hours}h {remaining}m"


print(format_duration(0))
print(format_duration(5))
print(format_duration(60))
print(format_duration(75))
print(format_duration(120))
\`\`\`

\`\`\`text
0m
5m
1h
1h 15m
2h
\`\`\`

Every example matches. Module 9 turns this into an automatic check; the habit starts here.

Note the shape of the function: two guard clauses handling the special cases, then the general case last. Working from examples tends to produce that structure naturally, because the examples are what reveal the special cases.

## Choosing examples deliberately

Not all examples are equally useful. Three categories are worth covering every time.

**Typical cases** — what the function will usually receive. \`75\` above.

**Boundary cases** — where behaviour changes. \`59\`, \`60\`, and \`61\` are all worth checking for a function that splits hours from minutes, because the rule changes between them.

**Degenerate cases** — the smallest or emptiest input. Zero, an empty string, an empty list. These are where most bugs live, and they are the ones people forget.

Consider a function averaging a list. The typical case is easy. The boundary case is a single item. The degenerate case is an empty list — and that one raises \`ZeroDivisionError\` unless you decided in advance what it should do.

> **Key idea**
> Before implementing, write down what the function should return for a typical input, a boundary input, and the emptiest possible input. The third almost always exposes a decision you had not made.

## An example of a decision surfaced early

Take "report the most common word in a line". Examples:

\`\`\`text
"red blue red"       -> "red"
"red blue"           -> ?
""                   -> ?
\`\`\`

The second and third have no obvious answer. Does a tie return the first alphabetically, or the first seen? Does empty input return an empty string, or a message?

There is no correct answer; there is only a decision. Finding it before implementing costs a minute. Finding it afterwards, because a test failed or a user complained, costs much more.

## Writing the specification down

For anything non-trivial, record the decisions in the function itself:

\`\`\`python
def most_common(text):
    """Return the most frequent word in text.

    Words are compared case-insensitively. Ties are broken alphabetically.
    Returns an empty string when text contains no words.
    """
    counts = {}
    for word in text.lower().split():
        counts[word] = counts.get(word, 0) + 1
    if not counts:
        return ""
    return sorted(counts, key=lambda word: (-counts[word], word))[0]


print(most_common("red blue red"))
print(most_common("blue red"))
print(most_common(""))
\`\`\`

\`\`\`text
red
blue
\`\`\`

The third call returns an empty string, so the third line of output is blank.

That triple-quoted text is a **docstring**, the subject of the next lesson. Note what it contains: not a description of how the code works, which the code already provides, but the decisions a reader could not otherwise recover.

## Summary

Turn a vague requirement into concrete examples before implementing. Cover typical, boundary, and degenerate inputs. The degenerate case usually exposes an unmade decision. Record the decisions where the next reader will find them.`,
        },
        {
          type: "exercise",
          title: "Implement From a Specification",
          description: "Write a function whose behaviour is fully pinned down by worked examples.",
          instructions: `## The problem

Implement a function that shortens a piece of text for display.

## Specification by example

\`\`\`text
shorten("Coastal Birds", 20)  -> "Coastal Birds"
shorten("Coastal Birds", 13)  -> "Coastal Birds"
shorten("Coastal Birds", 10)  -> "Coastal..."
shorten("Coastal Birds", 3)   -> "..."
shorten("Coastal Birds", 2)   -> ".."
shorten("", 5)                -> ""
\`\`\`

## The rules those examples imply

1. If the text already fits within \`limit\` characters, return it unchanged.
2. Otherwise, return the text cut short and ending with \`...\`, such that the result is **exactly** \`limit\` characters long.
3. When \`limit\` is 3 or less, there is no room for any text, so return only as many dots as fit.

## Requirements

Define \`shorten(text, limit)\` returning a string. Then read two lines — the text, then the limit as a whole number — and print the result.

## Examples

Given \`Coastal Birds\` and \`10\`, the output is \`Coastal...\`.

Given \`Coastal Birds\` and \`20\`, the output is \`Coastal Birds\`.

## Guidance

Work through the examples before writing code. The third rule only becomes visible once you ask what happens when the limit is smaller than the ellipsis itself — a degenerate case that is easy to miss and easy to test.

For the ordinary case, the amount of text you can keep is the limit minus the three characters the dots occupy.

## Constraints

The limit is always at least 0. The result must never be longer than the limit.`,
          starterCode: `def shorten(text, limit):
    return text


text = input()
limit = int(input())
print(shorten(text, limit))
`,
          hint: "Guard first: if len(text) <= limit, return text unchanged. Then if limit <= 3, return \".\" * limit. Otherwise return text[:limit - 3] + \"...\".",
          tests: [
            {
              input: "Coastal Birds\n20\n",
              expectedOutput: "Coastal Birds",
              description: "Text shorter than the limit is returned unchanged",
            },
            {
              input: "Coastal Birds\n13\n",
              expectedOutput: "Coastal Birds",
              description: "Text exactly at the limit is not shortened",
            },
            {
              input: "Coastal Birds\n10\n",
              expectedOutput: "Coastal...",
              description: "A shortened result is exactly the limit in length",
            },
            {
              input: "Coastal Birds\n3\n",
              expectedOutput: "...",
              description: "A limit of three leaves room only for the ellipsis",
            },
            {
              input: "Coastal Birds\n2\n",
              expectedOutput: "..",
              description: "A limit below three returns only as many dots as fit",
            },
            {
              input: "\n5\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "Empty text is returned unchanged whatever the limit",
            },
          ],
          solution: `def shorten(text, limit):
    if len(text) <= limit:
        return text
    if limit <= 3:
        return "." * limit
    return text[:limit - 3] + "..."


text = input()
limit = int(input())
print(shorten(text, limit))
`,
        },
        {
          type: "exercise",
          title: "Decompose a Reporting Task",
          description: "Turn a single requirement into three functions and compose them.",
          instructions: `## The problem

Build a small report from study session records, using the decomposition method from this lesson.

## Input

A series of lines, each in the form \`subject minutes\`, ending with the line \`end\`.

## Requirements

Write **three** functions:

1. \`parse_session(line)\` — returns a tuple of the subject and the minutes as an integer.
2. \`group_sessions(lines)\` — takes a list of session lines and returns a dictionary mapping each subject to a list of its durations.
3. \`format_report(grouped)\` — returns a **list of strings**, one per subject, sorted by total minutes descending and then by subject name, each in the form \`history: 55 minutes over 2 sessions\`.

Then read the lines, call the three functions, and print each line of the report.

## Example

Given \`history 40\`, \`biology 25\`, \`history 15\`, \`end\`, the output is:

\`\`\`text
history: 55 minutes over 2 sessions
biology: 25 minutes over 1 sessions
\`\`\`

Given only \`end\`, the output is nothing at all.

## Guidance

Collect the input lines into a list first, stopping at \`end\`. Then pass that list to \`group_sessions\`.

\`format_report\` returns a list of strings rather than printing. That is what allows the report to be tested, reused, or written to a file later without changing the function.

For the ordering, sort the subjects with a key returning a tuple of the negative total and the name.

## Constraints

Only the final loop prints. All three functions return their results.

Note that the output says \`1 sessions\` rather than \`1 session\`. Match the specification exactly, even where the English is imperfect — a specification you disagree with is still the specification.`,
          starterCode: `def parse_session(line):
    return ("", 0)


def group_sessions(lines):
    return {}


def format_report(grouped):
    return []


lines = []
line = input()
`,
          hint: "Collect lines until \"end\". In group_sessions, call parse_session for each line and append into a dictionary of lists. In format_report, sort with key=lambda name: (-sum(grouped[name]), name) and build one f-string per subject.",
          tests: [
            {
              input: "history 40\nbiology 25\nhistory 15\nend\n",
              expectedOutput: "history: 55 minutes over 2 sessions\nbiology: 25 minutes over 1 sessions",
              description: "Sessions are grouped, totalled, and ordered by time spent",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No sessions produces no output lines at all",
              match: "exact",
            },
            {
              input: "maths 30\nart 30\nend\n",
              expectedOutput: "art: 30 minutes over 1 sessions\nmaths: 30 minutes over 1 sessions",
              description: "Equal totals are broken alphabetically",
            },
            {
              input: "physics 90\nend\n",
              expectedOutput: "physics: 90 minutes over 1 sessions",
              description: "A single session is reported correctly",
            },
          ],
          solution: `def parse_session(line):
    subject, minutes = line.split()
    return subject, int(minutes)


def group_sessions(lines):
    grouped = {}
    for line in lines:
        subject, minutes = parse_session(line)
        if subject not in grouped:
            grouped[subject] = []
        grouped[subject].append(minutes)
    return grouped


def format_report(grouped):
    report = []
    ordered = sorted(grouped, key=lambda name: (-sum(grouped[name]), name))
    for subject in ordered:
        durations = grouped[subject]
        report.append(f"{subject}: {sum(durations)} minutes over {len(durations)} sessions")
    return report


lines = []
line = input()
while line != "end":
    lines.append(line)
    line = input()

for entry in format_report(group_sessions(lines)):
    print(entry)
`,
        },
      ],
    ),

    lesson(
      "Structuring a Program",
      "Where a program starts, how it is documented, and how types are declared.",
      [
        {
          type: "lesson",
          title: "main() and the Entry Point",
          description: "Separating definitions from the code that runs, and the standard Python idiom for it.",
          instructions: `## Definitions and actions mixed together

A program written without structure interleaves definitions and actions:

\`\`\`python
def clean(text):
    return text.strip().lower()


raw = "  Field Notes  "
print(clean(raw))


def shout(text):
    return text.upper()


print(shout(clean(raw)))
\`\`\`

\`\`\`text
field notes
FIELD NOTES
\`\`\`

It works, and it is hard to read. A reader cannot tell at a glance where the program actually begins, and the definitions are scattered among the statements that use them.

## Collecting the actions into main()

The convention is to put every action inside a function called \`main\`, defined last among the definitions and called at the very bottom:

\`\`\`python
def clean(text):
    return text.strip().lower()


def shout(text):
    return text.upper()


def main():
    raw = "  Field Notes  "
    print(clean(raw))
    print(shout(clean(raw)))


main()
\`\`\`

\`\`\`text
field notes
FIELD NOTES
\`\`\`

The file now reads in a predictable order: helper functions, then \`main\`, then a single line that starts everything. The last line of the file is where the program begins, and every reader of Python knows to look there.

There is a second benefit. Names created inside \`main\` are local to it, so a program structured this way has almost no global variables. That prevents a whole category of bug in which one part of a program quietly depends on a name another part happened to create.

## The __name__ guard

You will see this in nearly every real Python file:

\`\`\`python
def main():
    print("Running as a program")


if __name__ == "__main__":
    main()
\`\`\`

\`\`\`text
Running as a program
\`\`\`

\`__name__\` is a variable Python sets automatically. When a file is run directly, it is set to the string \`"__main__"\`. When a file is *imported* by another file, it is set to the module's name instead.

So the guard means: **run \`main()\` only when this file is being run directly, not when it is being imported.**

That matters because importing a module runs its top-level code. Without the guard, importing a file to reuse one of its functions would also execute its whole program — printing output, reading input, and generally causing chaos. Module 8 covers importing properly; the guard is what makes a file safe to import.

> **Key idea**
> Put the program's actions in \`main()\` and call it under \`if __name__ == "__main__":\`. This makes the entry point obvious and lets other files reuse your functions without running your program.

## The shape of a well-structured file

\`\`\`python
"""Summarise study sessions from a list of records."""


def parse_session(line):
    subject, minutes = line.split()
    return subject, int(minutes)


def total_minutes(sessions):
    return sum(minutes for _, minutes in sessions)


def main():
    lines = ["history 40", "biology 25"]
    sessions = [parse_session(line) for line in lines]
    print(f"Total: {total_minutes(sessions)} minutes")


if __name__ == "__main__":
    main()
\`\`\`

\`\`\`text
Total: 65 minutes
\`\`\`

Reading top to bottom: a description of the file, the helpers in dependency order, \`main\` describing the program as a sequence of steps, and the guard.

Note that \`main\` contains no clever logic. It reads almost like the pseudocode from the previous lesson. That is the goal: \`main\` coordinates, and the helpers do the work.

## In this course's exercises

The exercises here often read input at the top level rather than inside \`main\`, because they are small and the extra structure would obscure the point being taught. From this module on, when an exercise asks for a \`main\` function, structure it this way. The capstone in Module 13 requires it.

## Summary

Put actions in \`main()\` and definitions above it. Call \`main()\` under \`if __name__ == "__main__":\` so the file can be imported without running. This makes the entry point obvious and keeps variables out of the global scope.`,
        },
        {
          type: "lesson",
          title: "Docstrings and Type Hints",
          description: "Recording what a function promises, for readers and for tools.",
          instructions: `## Documenting a function

A **docstring** is a string placed as the first thing in a function body. By convention it uses triple quotes:

\`\`\`python
def format_duration(minutes):
    """Return minutes as a compact duration string such as '1h 15m'."""
    hours = minutes // 60
    remaining = minutes % 60
    if hours == 0:
        return f"{remaining}m"
    if remaining == 0:
        return f"{hours}h"
    return f"{hours}h {remaining}m"


print(format_duration(75))
print(format_duration.__doc__)
\`\`\`

\`\`\`text
1h 15m
Return minutes as a compact duration string such as '1h 15m'.
\`\`\`

Unlike a comment, a docstring is retained at runtime and available as \`__doc__\`. Tools use it: editors show it as you type a call, and \`help(format_duration)\` prints it.

## What to write in one

A useful docstring answers what a comment cannot recover from the code:

- What the function returns, stated as a claim.
- What its parameters mean, where the names are not self-explanatory.
- What it does in unusual cases.
- Anything a caller must know, such as an assumption or a side effect.

\`\`\`python
def mean(values):
    """Return the arithmetic mean of values.

    Returns 0.0 for an empty list rather than raising, so that callers
    summarising possibly-empty groups need no special case.
    """
    if not values:
        return 0.0
    return sum(values) / len(values)


print(mean([2, 4]))
print(mean([]))
\`\`\`

\`\`\`text
3.0
0.0
\`\`\`

The second paragraph records a *decision*. Nothing in the code explains why empty input returns zero rather than raising, and without the note a later reader might "fix" it and break every caller.

Write the first line as a command — "Return the mean" rather than "This function returns the mean" — and end it with a full stop. That is the widespread convention, and consistency helps more than elegance.

Not every function needs one. A three-line helper with an exact name may be entirely self-explanatory, and a docstring restating the name adds noise.

## Type hints

A **type hint** records what types a function expects and returns:

\`\`\`python
def format_duration(minutes: int) -> str:
    """Return minutes as a compact duration string."""
    if minutes < 60:
        return f"{minutes}m"
    return f"{minutes // 60}h {minutes % 60}m"


print(format_duration(75))
\`\`\`

\`\`\`text
1h 15m
\`\`\`

\`minutes: int\` says the parameter should be an integer. \`-> str\` says the function returns a string.

**Python does not enforce these.** Passing a string to \`format_duration\` will not raise a type error; the hint is documentation that tools can read. Editors use hints to offer completions and warn about mistakes, and separate checking tools can verify a whole program against them.

Hints for collections name what is inside:

\`\`\`python
def total(values: list[int]) -> int:
    """Return the sum of values."""
    return sum(values)


def lookup(prices: dict[str, int], name: str) -> int:
    """Return the price for name, or 0 when it is not stocked."""
    return prices.get(name, 0)


print(total([1, 2, 3]))
print(lookup({"bolt": 3}, "nut"))
\`\`\`

\`\`\`text
6
0
\`\`\`

\`list[int]\` is a list of integers; \`dict[str, int]\` maps strings to integers.

## When hints help most

Hints repay their cost on functions used from several places, on anything whose parameter types are not obvious from the names, and on code that will be maintained over time.

They are less useful on tiny local helpers, where they can be more clutter than clarity.

The important thing is that a hint is a promise. A function hinted \`-> int\` that sometimes returns \`None\` is worse than one with no hint at all, because a reader believed it.

> **Key idea**
> A docstring records what the code cannot say: decisions, assumptions, and unusual-case behaviour. A type hint records what types are expected. Neither is enforced, so both must be kept true.

## Summary

A docstring is the first string in a function body, retained at runtime and shown by tools. Write it as a claim about what the function returns and record decisions a reader could not recover. Type hints annotate parameters and return values, are not enforced, and must be kept accurate.`,
        },
        {
          type: "exercise",
          title: "Structure a Program Properly",
          description: "Reorganise a working script into documented functions with a main entry point.",
          instructions: `## The problem

The program in the editor works but is written as one undifferentiated block. Restructure it.

## Requirements

1. Define \`parse_entry(line: str) -> tuple[str, int]\` which splits a line of the form \`name score\` and returns the name and the score as an integer.
2. Define \`best_entry(entries: list[tuple[str, int]]) -> str\` which returns the name with the highest score. If several tie, return the one that is alphabetically first. If the list is empty, return \`none\`.
3. Define \`main() -> None\` containing all the reading and printing.
4. Call \`main()\` under an \`if __name__ == "__main__":\` guard.
5. Give \`best_entry\` a docstring that states what it returns **and** how ties and empty input are handled.

## Behaviour

Read lines of the form \`name score\` until the line \`end\`, then print exactly one line:

\`\`\`text
Winner: ana
\`\`\`

## Examples

Given \`ana 12\`, \`raj 9\`, \`end\`, the output is \`Winner: ana\`.

Given \`raj 9\`, \`ana 9\`, \`end\`, the output is \`Winner: ana\`, because the tie is broken alphabetically.

Given only \`end\`, the output is \`Winner: none\`.

## Guidance

For the tie-break, sorting by a tuple of the negative score and the name puts the highest score first and resolves ties alphabetically. Alternatively use \`min\` with the same key.

The docstring is graded only by your own judgement, but write it as if a colleague will rely on it — the tie-breaking rule is exactly the kind of decision that is invisible in the code.

## Constraints

All reading and printing happens inside \`main\`. The two other functions must return their results.`,
          starterCode: `entries = []
line = input()
while line != "end":
    parts = line.split()
    entries.append((parts[0], int(parts[1])))
    line = input()

if len(entries) == 0:
    print("Winner: none")
else:
    best = entries[0]
    for entry in entries:
        if entry[1] > best[1]:
            best = entry
    print(f"Winner: {best[0]}")
`,
          hint: "Move the parsing into parse_entry, the selection into best_entry with sorted(entries, key=lambda pair: (-pair[1], pair[0]))[0][0], and the loop plus print into main(). Finish with the __name__ guard.",
          tests: [
            {
              input: "ana 12\nraj 9\nend\n",
              expectedOutput: "Winner: ana",
              description: "The highest score wins",
            },
            {
              input: "raj 9\nana 9\nend\n",
              expectedOutput: "Winner: ana",
              description: "A tie is broken alphabetically rather than by input order",
            },
            {
              input: "end\n",
              expectedOutput: "Winner: none",
              description: "No entries reports the fallback value",
            },
            {
              input: "zoe 3\nabe 1\nmia 7\nend\n",
              expectedOutput: "Winner: mia",
              description: "The winner is found regardless of position in the input",
            },
          ],
          solution: `def parse_entry(line: str) -> tuple[str, int]:
    """Return the name and score parsed from a 'name score' line."""
    name, score = line.split()
    return name, int(score)


def best_entry(entries: list[tuple[str, int]]) -> str:
    """Return the name with the highest score.

    Ties are broken alphabetically, so the earliest name wins when several
    entries share the top score. Returns 'none' for an empty list rather
    than raising, so callers need no special case.
    """
    if not entries:
        return "none"
    ordered = sorted(entries, key=lambda pair: (-pair[1], pair[0]))
    return ordered[0][0]


def main() -> None:
    entries = []
    line = input()
    while line != "end":
        entries.append(parse_entry(line))
        line = input()
    print(f"Winner: {best_entry(entries)}")


if __name__ == "__main__":
    main()
`,
        },
      ],
    ),

    lesson(
      "Refactoring",
      "Improving the shape of working code without changing what it does.",
      [
        {
          type: "lesson",
          title: "Removing Repetition",
          description: "Recognising duplication and choosing what to extract.",
          instructions: `## What refactoring is

**Refactoring** means changing the structure of code without changing its behaviour. The program does the same thing before and after; it is easier to read, change, or test afterwards.

The requirement to preserve behaviour is what makes it safe. It is also what makes tests valuable: without them you are guessing that nothing broke. Module 9 supplies the tools; this lesson supplies the judgement.

## Duplication

The clearest signal that code needs restructuring is the same logic appearing more than once:

\`\`\`python
history_sessions = [40, 15]
biology_sessions = [25]

history_total = sum(history_sessions)
history_mean = history_total / len(history_sessions)
print(f"history: {history_total} minutes, mean {history_mean:.1f}")

biology_total = sum(biology_sessions)
biology_mean = biology_total / len(biology_sessions)
print(f"biology: {biology_total} minutes, mean {biology_mean:.1f}")
\`\`\`

\`\`\`text
history: 55 minutes, mean 27.5
biology: 25 minutes, mean 25.0
\`\`\`

The two blocks differ only in their data. Adding a third subject means copying the block again; changing the format means editing it in every copy, and missing one is how output becomes inconsistent.

## Extracting a function

The repeated logic becomes one function, and the differences become parameters:

\`\`\`python
def describe(subject, sessions):
    total = sum(sessions)
    mean = total / len(sessions)
    return f"{subject}: {total} minutes, mean {mean:.1f}"


print(describe("history", [40, 15]))
print(describe("biology", [25]))
\`\`\`

\`\`\`text
history: 55 minutes, mean 27.5
biology: 25 minutes, mean 25.0
\`\`\`

The rule now exists once. A change to the format happens in one place and applies everywhere, and the parallel variable names have gone.

## Extracting a loop

Once the logic is a function, repeated *calls* can often become a loop over data:

\`\`\`python
def describe(subject, sessions):
    total = sum(sessions)
    mean = total / len(sessions)
    return f"{subject}: {total} minutes, mean {mean:.1f}"


records = {
    "history": [40, 15],
    "biology": [25],
    "statistics": [60, 30, 30],
}

for subject, sessions in records.items():
    print(describe(subject, sessions))
\`\`\`

\`\`\`text
history: 55 minutes, mean 27.5
biology: 25 minutes, mean 25.0
statistics: 120 minutes, mean 40.0
\`\`\`

Adding a subject is now a data change, not a code change. That is usually the right end state: the structure is fixed and the content varies.

## What not to extract

Not all similar-looking code is duplication. Two blocks that look alike but exist for unrelated reasons will need to change independently, and merging them creates a function with a confused purpose and a growing list of flags.

The test is whether the two would always change together. If a change to one would necessarily mean the same change to the other, they are one rule written twice, and extraction is right. If not, leave them alone.

Beware in particular of a function that gains Boolean parameters to select between behaviours:

\`\`\`python
def report(values, as_total, as_mean, with_header):
    return f"{as_total} {as_mean} {with_header} {len(values)}"


print(report([1, 2], True, False, True))
\`\`\`

\`\`\`text
True False True 2
\`\`\`

A call like that is unreadable, and the function's body will be a thicket of conditionals. Two clear functions beat one that takes a mode.

> **Key idea**
> Extract when two pieces of code express the same rule and would always change together. Leave them separate when they merely resemble each other.

## Magic numbers and names

A second common improvement is replacing unexplained values with named ones:

\`\`\`python
def is_overdue(days_out):
    return days_out > 21


print(is_overdue(30))
\`\`\`

\`\`\`text
True
\`\`\`

Where did 21 come from? Naming it answers the question and puts the value in one place:

\`\`\`python
LOAN_PERIOD_DAYS = 21


def is_overdue(days_out):
    return days_out > LOAN_PERIOD_DAYS


print(is_overdue(30))
\`\`\`

\`\`\`text
True
\`\`\`

The capitals are a convention meaning "this is a constant, do not reassign it". Python does not enforce it, but every Python programmer reads it that way.

## Refactoring in small steps

Make one change, run the program, confirm the output is unchanged, and only then make the next. A refactoring that changes five things at once and produces wrong output gives you no information about which change caused it.

## Summary

Refactoring changes structure while preserving behaviour. Extract a function when the same rule appears twice and would always change together; do not merge code that merely looks similar. Replace unexplained literals with named constants. Work in small verified steps.`,
        },
        {
          type: "exercise",
          title: "Refactor Repeated Logic",
          description: "Remove duplication from a working program without changing its output.",
          instructions: `## The problem

The program in the editor produces correct output. It contains the same six-line calculation three times, differing only in its data.

## Your task

Refactor it so the calculation appears once.

## Requirements

1. Define a function that performs the calculation, taking the values that differ as parameters and **returning** the formatted line.
2. Replace the three repeated blocks with three calls, or with a loop over the data.
3. Replace the unexplained number \`60\` with a named constant in capitals.
4. The output must be **exactly** what the original produced.

## Expected output

\`\`\`text
history: 55 min (0.9h) over 2 sessions
biology: 25 min (0.4h) over 1 sessions
statistics: 120 min (2.0h) over 3 sessions
\`\`\`

## Guidance

Run the original first and copy its output somewhere. After each step of the refactoring, run again and compare. If the output changes, undo the last step rather than pressing on.

The hours figure is displayed to one decimal place. Keep that formatting exactly as it is.

## Why this matters

The test here checks only that the output is unchanged, which is precisely what a refactoring must guarantee. The improvement is in the code, and the test's job is to prove you did not break anything while making it.`,
          starterCode: `history = [40, 15]
total = sum(history)
hours = total / 60
print(f"history: {total} min ({hours:.1f}h) over {len(history)} sessions")

biology = [25]
total = sum(biology)
hours = total / 60
print(f"biology: {total} min ({hours:.1f}h) over {len(biology)} sessions")

statistics = [60, 30, 30]
total = sum(statistics)
hours = total / 60
print(f"statistics: {total} min ({hours:.1f}h) over {len(statistics)} sessions")
`,
          hint: "Write def describe(subject, sessions) returning the f-string, with MINUTES_PER_HOUR = 60 as a module-level constant. Then loop over a dictionary of the three subjects, or make three calls.",
          tests: [
            {
              expectedOutput:
                "history: 55 min (0.9h) over 2 sessions\nbiology: 25 min (0.4h) over 1 sessions\nstatistics: 120 min (2.0h) over 3 sessions",
              description: "The refactored program produces byte-identical output to the original",
            },
          ],
          solution: `MINUTES_PER_HOUR = 60


def describe(subject, sessions):
    total = sum(sessions)
    hours = total / MINUTES_PER_HOUR
    return f"{subject}: {total} min ({hours:.1f}h) over {len(sessions)} sessions"


records = {
    "history": [40, 15],
    "biology": [25],
    "statistics": [60, 30, 30],
}

for subject, sessions in records.items():
    print(describe(subject, sessions))
`,
        },
        {
          type: "exercise",
          title: "Module 6 Checkpoint: Reading Log Report",
          description: "Design a multi-function program from a specification, with main and documentation.",
          instructions: `## The problem

Build a reading log reporter, designing it as a set of functions rather than one block.

## Input

A series of lines, each in the form \`title|pages|status\` where status is \`done\` or \`reading\`. The sequence ends with the line \`end\`.

## Requirements

Write these functions:

1. \`parse_book(line: str) -> tuple[str, int, str]\` — splits a line on \`|\` and returns the title, the pages as an integer, and the status.
2. \`finished_pages(books: list) -> int\` — returns the total pages of books whose status is \`done\`.
3. \`longest_title(books: list) -> str\` — returns the longest title. Ties are broken alphabetically. Returns an empty string for an empty list. Give this function a docstring recording those two decisions.
4. \`main() -> None\` — reads the lines and prints the report.

Call \`main()\` under an \`if __name__ == "__main__":\` guard.

## Output

Exactly four lines:

\`\`\`text
Books: 3
Finished: 2
Pages read: 500
Longest title: Coastal Bird Atlas
\`\`\`

Where \`Books\` is the total number of records, \`Finished\` is how many have status \`done\`, \`Pages read\` is the total pages of finished books only, and \`Longest title\` is the longest title among **all** books.

## Example

Given:

\`\`\`text
Tidal Systems|320|done
Coastal Bird Atlas|180|done
Deep Water|400|reading
end
\`\`\`

the output is the four lines above.

## Edge case

Given only \`end\`, the output is:

\`\`\`text
Books: 0
Finished: 0
Pages read: 0
Longest title:
\`\`\`

Note the final line has nothing after the colon and a single space before it — that is what an empty title produces in the f-string.

## Guidance

Store each parsed book as a tuple and keep them in a list. Then each reporting function is a short loop or comprehension over that list.

For the longest title, sorting by a key of the negative length and then the title handles both rules at once.

## Constraints

Only \`main\` prints. Titles never contain the \`|\` character.`,
          starterCode: `def parse_book(line: str) -> tuple[str, int, str]:
    return ("", 0, "")


def finished_pages(books: list) -> int:
    return 0


def longest_title(books: list) -> str:
    return ""


def main() -> None:
    pass


if __name__ == "__main__":
    main()
`,
          hint: "In main, loop until \"end\" collecting parse_book(line) into a list. Count finished with a loop or sum. For longest_title, guard the empty list then use sorted(books, key=lambda b: (-len(b[0]), b[0]))[0][0].",
          tests: [
            {
              input: "Tidal Systems|320|done\nCoastal Bird Atlas|180|done\nDeep Water|400|reading\nend\n",
              expectedOutput: "Books: 3\nFinished: 2\nPages read: 500\nLongest title: Coastal Bird Atlas",
              description: "Only finished books contribute pages, and the longest title spans all books",
            },
            {
              input: "end\n",
              expectedOutput: "Books: 0\nFinished: 0\nPages read: 0\nLongest title:",
              description: "An empty log reports zeroes and an empty title",
            },
            {
              input: "Ab|10|done\nCd|20|done\nend\n",
              expectedOutput: "Books: 2\nFinished: 2\nPages read: 30\nLongest title: Ab",
              description: "Equal-length titles are broken alphabetically",
            },
            {
              input: "Only One|99|reading\nend\n",
              expectedOutput: "Books: 1\nFinished: 0\nPages read: 0\nLongest title: Only One",
              description: "An unfinished book counts as a book but contributes no pages",
            },
          ],
          solution: `def parse_book(line: str) -> tuple[str, int, str]:
    """Return the title, page count, and status parsed from a log line."""
    title, pages, status = line.split("|")
    return title, int(pages), status


def finished_pages(books: list) -> int:
    """Return the total pages across books whose status is 'done'."""
    total = 0
    for title, pages, status in books:
        if status == "done":
            total += pages
    return total


def longest_title(books: list) -> str:
    """Return the longest book title.

    Ties are broken alphabetically, so the earliest title wins when several
    share the greatest length. Returns an empty string for an empty list
    rather than raising, so callers need no special case.
    """
    if not books:
        return ""
    ordered = sorted(books, key=lambda book: (-len(book[0]), book[0]))
    return ordered[0][0]


def main() -> None:
    books = []
    line = input()
    while line != "end":
        books.append(parse_book(line))
        line = input()

    finished = 0
    for title, pages, status in books:
        if status == "done":
            finished += 1

    print(f"Books: {len(books)}")
    print(f"Finished: {finished}")
    print(f"Pages read: {finished_pages(books)}")
    print(f"Longest title: {longest_title(books)}")


if __name__ == "__main__":
    main()
`,
        },
      ],
    ),
  ],
)

export default moduleSix

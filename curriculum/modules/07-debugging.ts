import { module, lesson, type ModuleSource } from "../types.ts"

const moduleSeven: ModuleSource = module(
  "Debugging, Validation, and Exceptions",
  "Finding faults methodically, reading tracebacks, handling failures with try and except, and designing programs that fail clearly.",
  [
    lesson(
      "The Three Kinds of Error",
      "Distinguishing faults that stop a program from faults that quietly corrupt its answers.",
      [
        {
          type: "lesson",
          title: "Syntax, Runtime, and Logic Errors",
          description: "Three categories with different symptoms and different remedies.",
          instructions: `## Bugs are ordinary

Every working programmer produces defects continuously. Programming is not the act of writing correct code; it is the act of writing code, observing that it is wrong, and correcting it. The skill being developed is not avoidance but diagnosis.

Errors come in three kinds, and identifying which you have narrows the search enormously.

## Syntax errors

A **syntax error** means the text is not legal Python. The interpreter cannot begin, so **nothing runs**.

\`\`\`text
print("hello"
\`\`\`

Python reports \`SyntaxError: '(' was never closed\`. You met these in Module 1.

The symptom is unmistakable: no output at all, not even from lines above the mistake. The remedy is mechanical — count your pairs of quotes, brackets, and parentheses, and check for a missing colon at the end of an \`if\`, \`for\`, \`while\`, or \`def\` line.

Syntax errors are the least serious kind. They are found instantly and cannot reach a user.

## Runtime errors

A **runtime error** occurs while the program is running. The syntax was fine, so the program started; it stopped at the offending instruction.

\`\`\`python
values = [1, 2, 3]
print(values[1])
\`\`\`

\`\`\`text
2
\`\`\`

Asking for \`values[5]\` instead would raise \`IndexError: list index out of range\`.

The symptom is partial output: everything before the failure appeared, then execution stopped. That partial output is diagnostic information — the last line printed tells you how far the program got.

Common ones you have already met:

- \`NameError\` — a name was used before being assigned, or misspelled.
- \`TypeError\` — an operation was applied to the wrong type, such as \`"a" + 1\`.
- \`ValueError\` — the type was right but the content was not, such as \`int("abc")\`.
- \`IndexError\` — a list position does not exist.
- \`KeyError\` — a dictionary key does not exist.
- \`ZeroDivisionError\` — division by zero.
- \`AttributeError\` — a method was called on a value that has no such method, often because the value is \`None\`.

Runtime errors are more serious than syntax errors because they can reach a user, but they are still loud. Something told you the program failed.

## Logic errors

A **logic error** is code that runs perfectly and produces the wrong answer.

\`\`\`python
def mean(values):
    return sum(values) / len(values) - 1


print(mean([2, 4, 6]))
\`\`\`

\`\`\`text
3.0
\`\`\`

The mean of 2, 4, and 6 is 4.0. The function returns 3.0 because of a stray \`- 1\`. No error is raised. Nothing is highlighted. The program is confidently wrong.

This is the dangerous category. A logic error can survive for years, quietly producing wrong numbers that everyone downstream trusts.

Only two things find logic errors: comparing output against an independently known correct answer, and reasoning carefully about what the code says. Both are effortful, which is exactly why Module 9 automates the first.

> **Key idea**
> A syntax error stops the program before it starts. A runtime error stops it partway. A logic error does not stop it at all, which is why it is the most expensive kind.

## Using the category to narrow the search

Identifying the kind tells you where to look.

**No output at all?** Syntax error. Look for unbalanced pairs or a missing colon. Ignore your logic entirely; it was never reached.

**Output stops partway, with a message?** Runtime error. The message names the line and the cause. The error is at, or just before, the reported line.

**Full output, wrong values?** Logic error. The code is doing what you wrote. Find the first point where a value differs from what you expected, and work backwards from there.

That third instruction is the important one. Do not read the whole program looking for something that "looks wrong". Find a *specific* value that is *specifically* incorrect, then trace where it came from.

## An example of each

\`\`\`python
def average(values):
    total = 0
    for value in values:
        total += value
    return total / len(values)


print(average([2, 4, 6]))
\`\`\`

\`\`\`text
4.0
\`\`\`

That version is correct. Three plausible mistakes, one of each kind:

Writing \`for value in values\` without the colon gives a **syntax error** and no output.

Calling \`average([])\` gives a **runtime error**: \`ZeroDivisionError\`, because \`len(values)\` is zero.

Writing \`total = 1\` instead of \`total = 0\` gives a **logic error**: the answer becomes 4.33, with nothing to indicate a problem.

## Summary

Syntax errors prevent the program from starting. Runtime errors stop it partway and name themselves. Logic errors produce wrong answers silently. Identify the category first: it determines where to look and what to ignore.`,
        },
        {
          type: "lesson",
          title: "Reading a Traceback",
          description: "The report Python produces when a program fails, and how to extract the useful parts.",
          instructions: `## What Python tells you

When a runtime error occurs, Python prints a **traceback**: a report of what failed and the chain of calls that led there.

Consider a program with three functions, where the innermost fails:

\`\`\`python
def parse_value(raw):
    return int(raw)


def total_values(raw_values):
    total = 0
    for raw in raw_values:
        total += parse_value(raw)
    return total


print(total_values(["10", "20"]))
\`\`\`

\`\`\`text
30
\`\`\`

Passing \`["10", "x"]\` instead produces a traceback ending with:

\`\`\`text
ValueError: invalid literal for int() with base 10: 'x'
\`\`\`

## How to read it

A traceback has three parts, and they are best read in a specific order.

**Read the last line first.** It names the exception type and gives a message. That is the *what*.

**Read the line above it next.** It shows the actual line of code that failed. That is the *where*.

**Read the middle only if you need it.** The frames between show the chain of calls that reached the failure — which function called which. That is the *how you got there*, and it matters when the failing function is fine and the caller passed it something wrong.

The order matters because beginners tend to read a traceback top to bottom, get lost in unfamiliar frames, and give up before reaching the one line that explains everything.

> **Key idea**
> Read a traceback from the bottom up. The last line says what went wrong; the line above says where. Everything else is context you may not need.

## The message is specific

\`ValueError: invalid literal for int() with base 10: 'x'\` is dense but precise. Taken apart: \`int()\` was called; the thing it received was not a valid whole number in base 10; the offending value was \`'x'\`.

That tells you not only what failed but *with what data*, which is usually the fastest route to the cause. The value \`'x'\` came from somewhere, and finding where is now a targeted search rather than a general one.

In this application, errors are reported in a compressed form — the line number, the exception type, and the message — because the full traceback would be dominated by internal frames. The reading strategy is the same.

## Matching messages to causes

Some common messages and what they usually mean:

\`\`\`text
NameError: name 'totl' is not defined
\`\`\`

A misspelling, or a variable used before it was assigned. Python is telling you it has never heard of this name.

\`\`\`text
TypeError: can only concatenate str (not "int") to str
\`\`\`

A \`+\` between a string and a number. Either convert with \`str()\`, or use an f-string.

\`\`\`text
TypeError: 'NoneType' object is not subscriptable
\`\`\`

You indexed something that is \`None\`. Almost always this means a function you called returned \`None\` — often because it printed instead of returning, or because you assigned the result of a method like \`.sort()\` that returns nothing.

\`\`\`text
AttributeError: 'NoneType' object has no attribute 'append'
\`\`\`

The same cause, a different symptom. Any \`NoneType\` error means "something gave me nothing"; the fix is to find what.

\`\`\`text
IndexError: list index out of range
\`\`\`

Off by one, or an assumption that a list is longer than it is. Check the loop bounds and whether the list could be empty.

\`\`\`text
KeyError: 'biology'
\`\`\`

A dictionary lookup for a key that is absent. The message names the key, which usually reveals whether the key is wrong or the dictionary is incomplete.

## The error is not always where it is reported

Consider:

\`\`\`python
def find_total(records, key):
    return records[key]


data = {"history": 40}
print(find_total(data, "history"))
\`\`\`

\`\`\`text
40
\`\`\`

Calling \`find_total(data, "biology")\` raises \`KeyError\` inside \`find_total\`. But \`find_total\` is not wrong — it does exactly what it should. The mistake is at the call site, which asked for a key that does not exist.

This is why the chain of frames exists. When the failing line looks correct, move outwards: who called it, and with what?

## Summary

Read the last line for the exception type and message, the line above for the location, and the frames between only when the failing line looks correct. \`NoneType\` errors mean something returned nothing. The reported line is where the failure surfaced, not always where the mistake was made.`,
        },
        {
          type: "exercise",
          title: "Diagnose and Repair Three Failures",
          description: "Fix a program containing one error of each kind.",
          instructions: `## The problem

The program in the editor should read three whole numbers and report their total, their mean, and the largest.

It contains **three** defects: one runtime error and two logic errors. There are no syntax errors, so it will run.

## Expected output

For the input lines \`4\`, \`8\`, \`6\`:

\`\`\`text
Total: 18
Mean: 6.0
Largest: 8
\`\`\`

## Your task

Find and fix all three.

## Guidance

Run it first. The runtime error will announce itself with a message and a line number; deal with that one first, since the program cannot finish until it is gone.

Once it runs, compare each of the three output lines against the expected values above. Two of them will be wrong. For each, work out which expression produced it and what that expression actually computes.

## Hints about the categories

The runtime error is the kind that fires when a name has never been assigned — check your spelling carefully.

One logic error involves an operator that looks almost right but computes something different.

The other logic error involves a comparison whose direction is wrong, so a value is kept when it should be replaced.

## Constraints

Keep the overall structure. You are repairing this program, not rewriting it.`,
          starterCode: `values = []
for _ in range(3):
    values.append(int(input()))

total = 0
for value in values:
    total += value

mean = total // len(values)

largest = values[0]
for value in values:
    if value < largest:
        largest = value

print(f"Total: {totl}")
print(f"Mean: {mean}")
print(f"Largest: {largest}")
`,
          starterIsBroken: false,
          hint: "The NameError is a misspelling in the first print. The mean uses // which discards the fraction, so it should be /. The largest loop keeps the smaller value because the comparison is the wrong way round.",
          tests: [
            {
              input: "4\n8\n6\n",
              expectedOutput: "Total: 18\nMean: 6.0\nLargest: 8",
              description: "All three figures are correct for a typical set of values",
            },
            {
              input: "1\n1\n1\n",
              expectedOutput: "Total: 3\nMean: 1.0\nLargest: 1",
              description: "Identical values still report a float mean and the correct maximum",
            },
            {
              input: "10\n3\n7\n",
              expectedOutput: "Total: 20\nMean: 6.666666666666667\nLargest: 10",
              description: "A mean that does not divide evenly proves the division is not floor division",
            },
            {
              input: "-5\n-1\n-9\n",
              expectedOutput: "Total: -15\nMean: -5.0\nLargest: -1",
              description: "Negative values expose a maximum search that runs the wrong way",
            },
          ],
          solution: `values = []
for _ in range(3):
    values.append(int(input()))

total = 0
for value in values:
    total += value

mean = total / len(values)

largest = values[0]
for value in values:
    if value > largest:
        largest = value

print(f"Total: {total}")
print(f"Mean: {mean}")
print(f"Largest: {largest}")
`,
        },
      ],
    ),

    lesson(
      "A Method for Debugging",
      "Replacing guesswork with a repeatable procedure.",
      [
        {
          type: "lesson",
          title: "Reproduce, Reduce, Hypothesise",
          description: "The three steps that turn debugging from luck into method.",
          instructions: `## The unproductive approach

Faced with a bug, the natural instinct is to look at the code, spot something that seems suspicious, change it, and run again. This occasionally works. More often it produces a program with two bugs, because a change was made without understanding what it would do.

The alternative is a procedure. It is slower for the first thirty seconds and faster thereafter.

## Step one: reproduce

Before anything else, find an input that fails **reliably**.

If a program fails sometimes, you cannot tell whether a change fixed it or whether you were lucky. Every subsequent step depends on being able to trigger the fault whenever you want.

Write the failing input down. It becomes your test for the rest of the session, and — as Module 9 shows — a permanent test afterwards, so that this specific bug can never return unnoticed.

## Step two: reduce

Make the failing case as small as possible. Every element you remove without losing the failure is an element that cannot be responsible.

Suppose a program fails on a list of two hundred records. Try one hundred. Still fails? Try fifty. Continue until removing anything makes the failure disappear.

Reduction applies to code as well as data. Comment out lines. Replace a function call with a fixed value. Narrow the program until it is small enough to hold in your head.

This step feels like a detour. It is the single most effective debugging technique there is, because it converts "somewhere in this program" into "in these four lines".

## Step three: hypothesise and test

Now form a specific, falsifiable statement about the cause:

> "I believe \`total\` is zero at line 12 because the loop never runs."

A hypothesis must be checkable. "Something is wrong with the loop" is not; "the loop body runs zero times" is.

Then test it, most simply by printing:

\`\`\`python
values = []
total = 0

print(f"about to loop over {len(values)} values")
for value in values:
    print(f"processing {value}")
    total += value

print(f"total is {total}")
\`\`\`

\`\`\`text
about to loop over 0 values
total is 0
\`\`\`

The hypothesis is confirmed: the list is empty, so the body never ran. The question changes from "why is the total wrong" to "why is the list empty", which is a different and more tractable question.

> **Key idea**
> Debugging is not staring at code until the answer appears. It is reproducing the fault, reducing the case until few things could be responsible, and then testing specific predictions one at a time.

## Bisecting

When reduction is awkward, bisect instead. Put a print halfway through the program showing a value you can verify.

If the value is already wrong at the midpoint, the fault is in the first half. If it is still correct, the fault is in the second. Either way one check has halved the search.

Repeat, and a two-hundred-line program is narrowed to a single line in about eight checks. That is far faster than reading it all, and it requires no insight — only patience.

## Rubber-ducking

Explain the code aloud, line by line, to someone or something that is not listening. The technique is well known and sounds ridiculous, and it works.

The reason is that reading code silently lets you skim what you *believe* it says. Saying it aloud forces each line through language, and the sentence "and then this adds one to the counter" catches, because you can see it does not.

## When you are properly stuck

Two final options, both legitimate.

Stop and return later. Time away from a problem is unreasonably effective, and staring at the same twenty lines for an hour is not.

Revert to the last version that worked and reapply your changes one at a time, testing after each. This always finds the cause, because at some point one change breaks it, and it is the strongest argument for making small changes.

## Summary

Reproduce the fault reliably, reduce the case until few things can be responsible, then form and test specific hypotheses. Bisect with prints to halve the search. Explain the code aloud. If stuck, step away, or reapply changes one at a time from a working version.`,
        },
        {
          type: "lesson",
          title: "Inspecting Values",
          description: "Getting information out of a running program, and doing it well.",
          instructions: `## The print statement as an instrument

The simplest way to see inside a running program is to print. It is not primitive; it is the tool experienced programmers reach for most, because it is instant and needs no setup.

But there is a difference between printing carelessly and printing well.

## Label everything

An unlabelled value is nearly useless:

\`\`\`python
values = [4, 8]
total = 12
print(values)
print(total)
\`\`\`

\`\`\`text
[4, 8]
12
\`\`\`

With several prints in different places, you cannot tell which produced which. Label them:

\`\`\`python
values = [4, 8]
total = 12
print(f"[parse] values = {values}")
print(f"[sum] total = {total}")
\`\`\`

\`\`\`text
[parse] values = [4, 8]
[sum] total = 12
\`\`\`

Now each line identifies where it came from and what it shows. When you are looking at forty lines of diagnostic output, this is the difference between information and noise.

## Print the type when the value looks right

A value that appears correct may have the wrong type, and printing alone will not reveal it:

\`\`\`python
value = "42"
print(value)
print(f"value = {value!r}, type = {type(value).__name__}")
\`\`\`

\`\`\`text
42
value = '42', type = str
\`\`\`

The first line looks like a number. The second shows it is a string.

\`!r\` inside an f-string requests the **representation** rather than the display form. It is worth knowing because it makes invisible things visible:

\`\`\`python
name = "ada "
print(f"[{name}]")
print(f"{name!r}")
\`\`\`

\`\`\`text
[ada ]
'ada '
\`\`\`

Trailing spaces, empty strings, and \`None\` all look like nothing when printed plainly. \`!r\` shows the quotes, so \`''\` is distinguishable from a value that did not print at all. When a comparison "should match" and does not, print both sides with \`!r\` — the answer is usually visible immediately.

## Print inside loops, carefully

To see how a value evolves, print each repetition:

\`\`\`python
total = 0
for value in [4, 8, 6]:
    total += value
    print(f"[loop] value={value} total={total}")

print(f"[final] {total}")
\`\`\`

\`\`\`text
[loop] value=4 total=4
[loop] value=8 total=12
[loop] value=6 total=18
[final] 18
\`\`\`

The progression makes the logic visible. If \`total\` were wrong, you could see exactly which repetition first went astray.

For a loop with ten thousand repetitions, print only the interesting ones — the first few, or those meeting a condition — or you will drown in output.

## Check the boundaries, not the middle

When a loop produces nearly-correct results, examine the first and last repetitions. Off-by-one errors live at the edges; the middle is almost always fine.

\`\`\`python
items = ["a", "b", "c"]
for index in range(len(items)):
    print(f"index={index} item={items[index]}")
\`\`\`

\`\`\`text
index=0 item=a
index=1 item=b
index=2 item=c
\`\`\`

Seeing that the first index is \`0\` and the last is \`2\` — not \`1\` and \`3\` — settles a question that guessing does not.

## Remove them afterwards

Diagnostic prints are scaffolding. Left in place, they clutter real output and eventually confuse someone.

Delete them when the bug is fixed. A distinctive prefix like \`[debug]\` makes them easy to find and remove, and easy to spot if one escapes.

## Beyond print

Two other tools are worth knowing exist.

The \`logging\` module in the standard library records diagnostic messages that can be switched on and off by severity, without editing code. It is what production programs use instead of prints.

A **debugger** lets you pause a program and inspect any value, stepping through one line at a time. Python includes one called \`pdb\`, and editors provide graphical equivalents. Debuggers are powerful, and worth learning once printing starts feeling slow.

Neither is available in this in-browser environment, and neither is necessary for programs of the size you are writing. Printing carefully will carry you a long way.

## Summary

Label every diagnostic print with where it came from. Print types when a value looks right but behaves wrongly, and use \`!r\` to reveal whitespace, empty strings, and \`None\`. Trace loops at their boundaries. Remove the scaffolding when finished.`,
        },
        {
          type: "exercise",
          title: "Locate a Logic Error",
          description: "Use tracing to find why a correct-looking function returns a wrong answer.",
          instructions: `## The problem

The function \`running_totals\` should take a list of numbers and return a list of running totals, where each item is the sum of everything up to and including that position.

\`\`\`text
[3, 1, 4]  ->  [3, 4, 8]
\`\`\`

It runs without error and returns the wrong list.

## Your task

Find the fault and fix it.

## Expected behaviour

\`\`\`text
running_totals([3, 1, 4])  -> [3, 4, 8]
running_totals([5])        -> [5]
running_totals([])         -> []
running_totals([1, -1, 2]) -> [1, 0, 2]
\`\`\`

## Requirements

The program reads one line of whole numbers separated by spaces and prints the resulting list. That part works and should be left alone.

## Guidance

Do not read the function looking for something that seems wrong. Instead, add a labelled print inside the loop showing the current value, the running total, and the list so far. Run it with \`3 1 4\` and compare each repetition against what you expect.

The first repetition where reality diverges from your expectation is where the fault is.

## Guidance on the likely cause

Ask specifically: at the moment each item is appended, has the current value already been added to the total, or not yet? The order of two statements is the whole bug.

## Constraints

The function must return a list and must not print anything.`,
          starterCode: `def running_totals(values):
    totals = []
    running = 0
    for value in values:
        totals.append(running)
        running += value
    return totals


values = [int(part) for part in input().split()]
print(running_totals(values))
`,
          hint: "The append happens before the value is added, so every entry is the total of everything before it rather than including it. Swap the two statements inside the loop.",
          tests: [
            {
              input: "3 1 4\n",
              expectedOutput: "[3, 4, 8]",
              description: "Each entry includes the value at its own position",
            },
            {
              input: "5\n",
              expectedOutput: "[5]",
              description: "A single value returns itself rather than zero",
            },
            {
              input: "\n",
              expectedOutput: "[]",
              description: "An empty input produces an empty list",
            },
            {
              input: "1 -1 2\n",
              expectedOutput: "[1, 0, 2]",
              description: "Negative values are accumulated correctly",
            },
          ],
          solution: `def running_totals(values):
    totals = []
    running = 0
    for value in values:
        running += value
        totals.append(running)
    return totals


values = [int(part) for part in input().split()]
print(running_totals(values))
`,
        },
      ],
    ),

    lesson(
      "Exceptions",
      "Responding to failures that cannot be prevented by checking in advance.",
      [
        {
          type: "lesson",
          title: "try and except",
          description: "Catching a failure so the program can continue.",
          instructions: `## When checking first is not enough

Module 3 introduced validation: check the data before using it. That is the right approach whenever you can check.

Sometimes you cannot. A file may vanish between the moment you check it exists and the moment you open it. A conversion may fail for reasons too varied to enumerate. And sometimes the check is simply harder than attempting the operation.

For these, Python offers **exception handling**.

## The basic form

\`\`\`python
raw = "abc"

try:
    value = int(raw)
    print(f"Converted: {value}")
except ValueError:
    print("That is not a whole number")
\`\`\`

\`\`\`text
That is not a whole number
\`\`\`

The \`try\` block contains code that might fail. If it does, Python jumps to the matching \`except\` block instead of stopping the program.

If nothing fails, the \`except\` block is skipped entirely:

\`\`\`python
raw = "42"

try:
    value = int(raw)
    print(f"Converted: {value}")
except ValueError:
    print("That is not a whole number")
\`\`\`

\`\`\`text
Converted: 42
\`\`\`

## Execution stops at the point of failure

This is the detail most often missed:

\`\`\`python
try:
    print("before")
    value = int("abc")
    print("after")
except ValueError:
    print("caught")
\`\`\`

\`\`\`text
before
caught
\`\`\`

\`after\` never printed. When an exception occurs, the rest of the \`try\` block is abandoned immediately.

So a \`try\` block containing five statements may have run one, three, or all five. Any variable assigned after the failing line does not exist. This is why small \`try\` blocks matter.

## Catch specific exceptions

You can catch everything:

\`\`\`python
try:
    value = int("abc")
except:
    print("something went wrong")
\`\`\`

\`\`\`text
something went wrong
\`\`\`

Do not do this. A bare \`except\` catches every failure, including ones you did not anticipate — a misspelled variable name, a bug in your own logic — and hides them behind a vague message. Programs written this way are extraordinarily hard to debug, because the diagnostic information has been deliberately discarded.

Catch the specific exception you know how to handle:

\`\`\`python
try:
    value = int("abc")
except ValueError:
    print("not a whole number")
\`\`\`

\`\`\`text
not a whole number
\`\`\`

Now a \`NameError\` elsewhere in the block will still stop the program loudly, which is what you want, because you have no idea how to recover from it.

> **Key idea**
> Catch only exceptions you can actually do something about. A bare \`except\` silences the bugs you most need to see.

## Keep try blocks small

Wrap only the line that can fail:

\`\`\`python
raw = "12"

try:
    value = int(raw)
except ValueError:
    value = 0

doubled = value * 2
print(doubled)
\`\`\`

\`\`\`text
24
\`\`\`

The \`try\` covers one line. The rest of the work sits outside, where it is not at risk of being skipped and where an exception raised by it will not be silently swallowed by a handler intended for something else.

## Catching several kinds

Several \`except\` blocks may follow one \`try\`, and the first matching one runs:

\`\`\`python
prices = {"bolt": 3}

def price_of(name, quantity_raw):
    try:
        quantity = int(quantity_raw)
        return prices[name] * quantity
    except ValueError:
        return "quantity must be a whole number"
    except KeyError:
        return "unknown item"


print(price_of("bolt", "4"))
print(price_of("bolt", "x"))
print(price_of("spanner", "4"))
\`\`\`

\`\`\`text
12
quantity must be a whole number
unknown item
\`\`\`

Each failure gets a specific message, which is far more useful than one generic response.

To handle several types the same way, group them in a tuple:

\`\`\`python
try:
    value = int("abc")
except (ValueError, TypeError):
    value = 0

print(value)
\`\`\`

\`\`\`text
0
\`\`\`

## Inspecting the exception

\`as\` binds the exception to a name so you can read its message:

\`\`\`python
try:
    value = int("abc")
except ValueError as error:
    print(f"Conversion failed: {error}")
\`\`\`

\`\`\`text
Conversion failed: invalid literal for int() with base 10: 'abc'
\`\`\`

Useful for logging. Be careful about showing raw messages to users, who generally cannot act on them.

## Validation or exceptions?

Both have a place, and the choice is usually clear.

Use **validation** when you can check cheaply in advance and a failure is an expected, ordinary outcome. Checking whether a rating is between 1 and 5 needs no exception.

Use **exceptions** when the check is unreliable, unavailable, or more work than the operation itself, and when failure is genuinely exceptional rather than routine.

Converting user input sits on the boundary. \`raw.isdigit()\` is a reasonable check, but it rejects negative numbers and decimals, so \`try: int(raw)\` is often simpler and more correct. Judgement, not dogma.

## Summary

\`try\` runs code that might fail; a matching \`except\` handles it. The rest of the \`try\` block is abandoned at the point of failure. Catch specific exception types, keep \`try\` blocks small, and prefer validation when a cheap check is available.`,
        },
        {
          type: "lesson",
          title: "else, finally, and raise",
          description: "Completing the exception statement, and signalling failures of your own.",
          instructions: `## else: code that runs only on success

An \`else\` block after the \`except\` blocks runs only when the \`try\` block completed without an exception:

\`\`\`python
raw = "42"

try:
    value = int(raw)
except ValueError:
    print("not a number")
else:
    print(f"successfully parsed {value}")
\`\`\`

\`\`\`text
successfully parsed 42
\`\`\`

At first this seems pointless — why not put that line at the end of the \`try\`? The reason is precision. Code in the \`try\` block is *protected* by the handler; code in \`else\` is not.

\`\`\`python
values = {"a": 1}

try:
    number = int("1")
except ValueError:
    print("bad number")
else:
    print(values["missing"])
\`\`\`

That \`KeyError\` propagates normally instead of being mistaken for a conversion problem. Had the lookup been inside the \`try\`, a \`ValueError\` handler would not catch it either, but the intent would be muddier. \`else\` says exactly what is being guarded and what is not.

## finally: code that always runs

A \`finally\` block runs whether or not an exception occurred, and even if the \`try\` block returned:

\`\`\`python
def read_setting(raw):
    try:
        return int(raw)
    except ValueError:
        return 0
    finally:
        print("[finished attempting]")


print(read_setting("7"))
print(read_setting("x"))
\`\`\`

\`\`\`text
[finished attempting]
7
[finished attempting]
0
\`\`\`

Note the ordering: \`finally\` runs before the value is actually returned to the caller.

\`finally\` is for cleanup that must happen regardless — releasing a resource, closing a connection. In Module 10 you will meet \`with\`, which handles the most common case of this automatically and is preferred where it applies.

## Raising exceptions

Your own functions can signal failure by **raising** an exception:

\`\`\`python
def set_rating(value):
    if not 1 <= value <= 5:
        raise ValueError(f"rating must be 1 to 5, got {value}")
    return value


print(set_rating(4))
\`\`\`

\`\`\`text
4
\`\`\`

Calling \`set_rating(9)\` raises \`ValueError: rating must be 1 to 5, got 9\`.

\`raise\` creates an exception and stops the function immediately, propagating to the caller. If nothing catches it, the program stops with a traceback.

## Why raise instead of returning an error value?

Compare two designs:

\`\`\`python
def parse_rating(raw):
    if not raw.isdigit():
        return -1
    return int(raw)


print(parse_rating("4"))
print(parse_rating("x"))
\`\`\`

\`\`\`text
4
-1
\`\`\`

The \`-1\` is easy to ignore. A caller that forgets to check will happily use \`-1\` as a rating, and the bad value spreads through the program until it causes a confusing failure somewhere unrelated.

An exception cannot be ignored. Either the caller handles it deliberately, or the program stops at the point of the problem with a message naming it.

That is **fail-fast** design: when something is wrong, stop immediately and loudly, as close to the cause as possible. The alternative — continuing with a bad value — turns a clear failure into a mystery.

> **Key idea**
> Return values can be ignored; exceptions cannot. Raise when a caller has genuinely done something wrong, and let it stop the program rather than allowing a bad value to travel.

## Choosing the exception type

Use the built-in type that fits:

- \`ValueError\` — the type is right, the value is not. Out of range, wrong format.
- \`TypeError\` — the wrong type entirely.
- \`KeyError\` or \`IndexError\` — a lookup that does not exist.

Always include a message that says what was wrong and, where useful, what was received. \`raise ValueError("bad input")\` helps nobody; \`raise ValueError(f"rating must be 1 to 5, got {value}")\` tells the reader exactly what happened.

## Assertions

An **assertion** states something you believe to be true, and raises \`AssertionError\` if it is not:

\`\`\`python
def mean(values):
    assert len(values) > 0, "mean requires at least one value"
    return sum(values) / len(values)


print(mean([2, 4]))
\`\`\`

\`\`\`text
3.0
\`\`\`

Assertions are for internal checks — things that should be impossible if your own code is correct. They document assumptions and catch violations early.

They are *not* for validating external input. Python can be run with assertions disabled, so a program whose input validation lives in assertions would have no validation at all. Validate input with \`if\` and \`raise\`; use \`assert\` for "this cannot happen".

## Anti-patterns

Three habits to avoid, all of which are common:

**Swallowing exceptions.** \`except: pass\` discards the error and continues with unknown state. If you truly can ignore a failure, say why in a comment.

**Catching too broadly.** Catching \`Exception\` around a large block hides bugs you did not anticipate.

**Using exceptions for ordinary control flow.** An exception raised on every second call is not exceptional; that logic belongs in an \`if\`.

## Summary

\`else\` runs on success and is not protected by the handlers; \`finally\` always runs and is for cleanup. \`raise\` signals failure in a way a caller cannot ignore, and fail-fast design stops at the cause rather than propagating bad values. Use \`assert\` for internal impossibilities, never for input validation.`,
        },
        {
          type: "exercise",
          title: "Convert Input Safely",
          description: "Use try and except to handle values that cannot be converted.",
          instructions: `## The problem

Read a series of lines and total the ones that are valid whole numbers, reporting each failure without stopping.

## Input

A series of lines, ending with the line \`end\`. Each other line should be a whole number but may be anything.

## Requirements

1. For each line, attempt to convert it to an integer.
2. On success, add it to a running total and display nothing.
3. On failure, display \`Skipped: x\` where \`x\` is the offending line exactly as received.
4. After \`end\`, display exactly two lines:

\`\`\`text
Accepted: 3
Total: 27
\`\`\`

## Example

Given \`5\`, \`abc\`, \`12\`, \`\`, \`10\`, \`end\`, the output is:

\`\`\`text
Skipped: abc
Skipped:
Accepted: 3
Total: 27
\`\`\`

Note that the empty line produces \`Skipped:\` with nothing after it, since the offending value is an empty string.

## Guidance

Wrap only the conversion in the \`try\` block. Everything else — the counting, the totalling, the reading of the next line — belongs outside it, or an unrelated failure could be caught by the wrong handler.

Catch \`ValueError\` specifically. A bare \`except\` would also catch mistakes in your own code and hide them.

Negative numbers such as \`-4\` are valid and must be accepted, which is exactly why \`isdigit()\` is not good enough here and a conversion attempt is the right tool.

## Constraints

Do not use \`isdigit()\`. The point of the exercise is to attempt the conversion and handle its failure.`,
          starterCode: `total = 0
accepted = 0

line = input()
`,
          hint: "Inside the sentinel loop: try: value = int(line) except ValueError: print(f\"Skipped: {line}\") else: total += value and accepted += 1. Read the next line after the try statement.",
          tests: [
            {
              input: "5\nabc\n12\n\n10\nend\n",
              expectedOutput: "Skipped: abc\nSkipped:\nAccepted: 3\nTotal: 27",
              description: "Invalid lines are reported and skipped while valid ones are totalled",
            },
            {
              input: "end\n",
              expectedOutput: "Accepted: 0\nTotal: 0",
              description: "No data at all reports zeroes",
            },
            {
              input: "-4\n8\nend\n",
              expectedOutput: "Accepted: 2\nTotal: 4",
              description: "Negative numbers are accepted, which a digit check would have rejected",
            },
            {
              input: "1.5\n2\nend\n",
              expectedOutput: "Skipped: 1.5\nAccepted: 1\nTotal: 2",
              description: "A decimal is not a valid whole number and is skipped",
            },
            {
              input: "x\ny\nend\n",
              expectedOutput: "Skipped: x\nSkipped: y\nAccepted: 0\nTotal: 0",
              description: "Every line failing still produces a clean summary",
            },
          ],
          solution: `total = 0
accepted = 0

line = input()
while line != "end":
    try:
        value = int(line)
    except ValueError:
        print(f"Skipped: {line}")
    else:
        total += value
        accepted += 1
    line = input()

print(f"Accepted: {accepted}")
print(f"Total: {total}")
`,
        },
        {
          type: "exercise",
          title: "Module 7 Checkpoint: Robust Record Parser",
          description: "Combine raising, catching, and specific messages into one resilient program.",
          instructions: `## The problem

Parse measurement records, rejecting bad ones with specific messages while continuing to process the rest.

## Input

A series of lines ending with \`end\`. A valid line has the form \`name:value\` where the value is a whole number from 0 to 100 inclusive.

## Requirements

Define a function \`parse_record(line: str) -> tuple[str, int]\` that returns the name and value, and **raises** \`ValueError\` with a specific message when the line is not valid:

1. No colon present: raise with message \`missing colon\`.
2. Empty name: raise with message \`empty name\`.
3. Value not a whole number: raise with message \`bad value\`.
4. Value outside 0 to 100: raise with message \`out of range\`.

Then, in the main program, process each line:

- On success, add the value to a running total and count the record.
- On \`ValueError\`, display \`Rejected <line> (<message>)\`.

After \`end\`, display exactly two lines:

\`\`\`text
Accepted: 2
Total: 130
\`\`\`

## Example

Given:

\`\`\`text
alpha:70
beta
:50
gamma:xyz
delta:200
epsilon:60
end
\`\`\`

the output is:

\`\`\`text
Rejected beta (missing colon)
Rejected :50 (empty name)
Rejected gamma:xyz (bad value)
Rejected delta:200 (out of range)
Accepted: 2
Total: 130
\`\`\`

## Guidance

Check the conditions in the order listed. A line with no colon cannot be split, so that guard must come first.

To detect a bad value, attempt the conversion inside \`parse_record\` and re-raise with your own message. Catching \`ValueError\` and raising a new \`ValueError\` is perfectly reasonable when the new message is more useful to the caller.

In the main loop, use \`as error\` to bind the exception so its message can be shown.

## Constraints

\`parse_record\` must raise rather than return an error value. The main program must not stop when a record is rejected.`,
          starterCode: `def parse_record(line: str) -> tuple[str, int]:
    raise ValueError("missing colon")


total = 0
accepted = 0

line = input()
`,
          hint: "In parse_record: guard on \":\" not in line, then split, then guard on an empty name, then try int(raw) except ValueError: raise ValueError(\"bad value\"), then guard the range. In the loop, catch ValueError as error and print f\"Rejected {line} ({error})\".",
          tests: [
            {
              input: "alpha:70\nbeta\n:50\ngamma:xyz\ndelta:200\nepsilon:60\nend\n",
              expectedOutput:
                "Rejected beta (missing colon)\nRejected :50 (empty name)\nRejected gamma:xyz (bad value)\nRejected delta:200 (out of range)\nAccepted: 2\nTotal: 130",
              description: "Each kind of invalid record produces its own message and processing continues",
            },
            {
              input: "end\n",
              expectedOutput: "Accepted: 0\nTotal: 0",
              description: "No records at all reports zeroes",
            },
            {
              input: "a:0\nb:100\nend\n",
              expectedOutput: "Accepted: 2\nTotal: 100",
              description: "Both range boundaries are accepted",
            },
            {
              input: "a:-1\nend\n",
              expectedOutput: "Rejected a:-1 (out of range)\nAccepted: 0\nTotal: 0",
              description: "A negative value converts successfully but fails the range check",
            },
            {
              input: "nocolonhere\nend\n",
              expectedOutput: "Rejected nocolonhere (missing colon)\nAccepted: 0\nTotal: 0",
              description: "A line without a colon is rejected before any splitting is attempted",
            },
          ],
          solution: `def parse_record(line: str) -> tuple[str, int]:
    """Return the name and value from a 'name:value' record.

    Raises ValueError with a specific message when the record is malformed,
    so that callers can report exactly which rule the line broke.
    """
    if ":" not in line:
        raise ValueError("missing colon")

    name, raw = line.split(":", 1)
    if name == "":
        raise ValueError("empty name")

    try:
        value = int(raw)
    except ValueError:
        raise ValueError("bad value")

    if not 0 <= value <= 100:
        raise ValueError("out of range")

    return name, value


total = 0
accepted = 0

line = input()
while line != "end":
    try:
        name, value = parse_record(line)
    except ValueError as error:
        print(f"Rejected {line} ({error})")
    else:
        total += value
        accepted += 1
    line = input()

print(f"Accepted: {accepted}")
print(f"Total: {total}")
`,
        },
      ],
    ),
  ],
)

export default moduleSeven

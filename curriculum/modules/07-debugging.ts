import { module, lesson, type ModuleSource } from "../types.ts"

const moduleSeven: ModuleSource = module(
  "Debugging, Validation, and Exceptions",
  "Finding faults with a method, reading tracebacks, handling failures with try and except, and designing programs that fail clearly.",
  [
    lesson(
      "The Three Kinds of Error",
      "Telling faults that stop a program apart from faults that quietly spoil its answers.",
      [
        {
          type: "lesson",
          title: "Syntax, Runtime, and Logic Errors",
          description: "Three kinds, with different signs and different repairs.",
          instructions: `## Bugs are normal

Every working programmer makes mistakes all day long. Programming is not the act of writing correct code. It is the act of writing code, seeing that it is wrong, and correcting it. The skill you are building is not avoiding mistakes. It is finding them.

Errors come in three kinds, and knowing which kind you have makes the search far smaller.

## Syntax errors

A **syntax error** means the text is not legal Python. The interpreter cannot start, so **nothing runs**.

\`\`\`text
print("hello"
\`\`\`

Python reports \`SyntaxError: '(' was never closed\`. You met these in Module 1.

The sign is easy to recognise: no output at all, not even from the lines above the mistake. The repair is a routine — count your pairs of quotes and brackets, and check for a missing colon at the end of an \`if\`, \`for\`, \`while\`, or \`def\` line.

Syntax errors are the least serious kind. You find them at once, and they can never reach a user.

## Runtime errors

A **runtime error** happens while the program is running. The syntax was fine, so the program started. It stopped at the instruction that failed.

\`\`\`python
values = [1, 2, 3]
print(values[1])
\`\`\`

\`\`\`text
2
\`\`\`

Asking for \`values[5]\` instead would raise \`IndexError: list index out of range\`.

The sign is partial output. Everything before the failure appeared, and then the program stopped. That partial output is useful information: the last line printed tells you how far the program got.

Here are common ones you have already met:

- \`NameError\` — a name was used before it was assigned, or it was spelled wrongly.
- \`TypeError\` — an operation was used on the wrong type, such as \`"a" + 1\`.
- \`ValueError\` — the type was right but the content was not, such as \`int("abc")\`.
- \`IndexError\` — a list position does not exist.
- \`KeyError\` — a dictionary key does not exist.
- \`ZeroDivisionError\` — division by zero.
- \`AttributeError\` — a method was called on a value that has no such method, often because the value is \`None\`.

Runtime errors are more serious than syntax errors, because they can reach a user. But they are still loud. Something told you that the program failed.

## Logic errors

A **logic error** is code that runs perfectly and gives the wrong answer.

\`\`\`python
def mean(values):
    return sum(values) / len(values) - 1


print(mean([2, 4, 6]))
\`\`\`

\`\`\`text
3.0
\`\`\`

The average of 2, 4, and 6 is 4.0. The function returns 3.0 because of a stray \`- 1\`. No error is raised. Nothing is marked. The program is confidently wrong.

This is the dangerous kind. A logic error can live for years, quietly producing wrong numbers that everyone else trusts.

Only two things find logic errors: comparing the output with an answer you worked out separately, and thinking carefully about what the code says. Both take effort, and that is exactly why Module 9 makes the first one automatic.

> **Key idea**
> A syntax error stops the program before it starts. A runtime error stops it partway. A logic error does not stop it at all, and that is why it costs the most.

## Using the kind to narrow the search

Knowing the kind tells you where to look.

**No output at all?** A syntax error. Look for unmatched pairs or a missing colon. Ignore your logic completely, because it was never reached.

**Output stops partway, with a message?** A runtime error. The message names the line and the cause. The mistake is at, or just before, the line it reports.

**Full output, but wrong values?** A logic error. The code is doing what you wrote. Find the first point where a value is different from what you expected, and work backwards from there.

That third instruction is the important one. Do not read the whole program hunting for something that "looks wrong". Find a *particular* value that is *definitely* wrong, then trace where it came from.

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

That version is correct. Here are three likely mistakes, one of each kind.

Writing \`for value in values\` without the colon gives a **syntax error** and no output at all.

Calling \`average([])\` gives a **runtime error**: \`ZeroDivisionError\`, because \`len(values)\` is zero.

Writing \`total = 1\` instead of \`total = 0\` gives a **logic error**. The answer becomes 4.33, and nothing shows that there is a problem.

## Summary

Syntax errors stop the program from starting. Runtime errors stop it partway and name themselves. Logic errors give wrong answers in silence. Work out the kind first: it decides where to look and what to ignore.`,
        },
        {
          type: "lesson",
          title: "Reading a Traceback",
          description: "The report Python prints when a program fails, and how to take the useful parts from it.",
          instructions: `## What Python tells you

When a runtime error happens, Python prints a **traceback**. It is a report of what failed and of the chain of calls that led there.

Here is a program with three functions, where the innermost one fails:

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

Passing \`["10", "x"]\` instead gives a traceback that ends with:

\`\`\`text
ValueError: invalid literal for int() with base 10: 'x'
\`\`\`

## How to read it

A traceback has three parts, and it is best to read them in a particular order.

**Read the last line first.** It names the kind of error and gives a message. That is the *what*.

**Read the line above it next.** It shows the line of code that failed. That is the *where*.

**Read the middle only if you need it.** The frames in between show the chain of calls that reached the failure: which function called which. That is *how you got there*, and it matters when the failing function is fine and the caller passed it something wrong.

The order matters because beginners tend to read a traceback from top to bottom, get lost among unfamiliar frames, and give up before they reach the one line that explains everything.

> **Key idea**
> Read a traceback from the bottom upwards. The last line says what went wrong. The line above says where. Everything else is background you may not need.

## The message is exact

\`ValueError: invalid literal for int() with base 10: 'x'\` is packed tight but exact. Taken apart: \`int()\` was called; what it received was not a valid whole number in base 10; and the value that caused the trouble was \`'x'\`.

That tells you not only what failed but *with what data*, and that is usually the fastest way to the cause. The value \`'x'\` came from somewhere, and finding where is now a narrow search instead of a wide one.

In this application, errors are shown in a shortened form: the line number, the kind of error, and the message. The full traceback would be filled with internal frames. The way you read it stays the same.

## Matching messages to causes

Here are some common messages and what they usually mean.

\`\`\`text
NameError: name 'totl' is not defined
\`\`\`

A spelling mistake, or a variable used before it was assigned. Python is telling you it has never heard of this name.

\`\`\`text
TypeError: can only concatenate str (not "int") to str
\`\`\`

A \`+\` between a string and a number. Either convert with \`str()\`, or use an f-string.

\`\`\`text
TypeError: 'NoneType' object is not subscriptable
\`\`\`

You used an index on something that is \`None\`. Almost always this means a function you called returned \`None\`, often because it printed instead of returning, or because you assigned the result of a method like \`.sort()\` that gives nothing back.

\`\`\`text
AttributeError: 'NoneType' object has no attribute 'append'
\`\`\`

The same cause with a different sign. Any \`NoneType\` error means "something gave me nothing", and the repair is to find what.

\`\`\`text
IndexError: list index out of range
\`\`\`

Off by one, or an assumption that a list is longer than it really is. Check the limits of your loop, and check whether the list could be empty.

\`\`\`text
KeyError: 'biology'
\`\`\`

A dictionary lookup for a key that is not there. The message names the key, which usually shows you whether the key is wrong or the dictionary is incomplete.

## The mistake is not always where it is reported

Look at this:

\`\`\`python
def find_total(records, key):
    return records[key]


data = {"history": 40}
print(find_total(data, "history"))
\`\`\`

\`\`\`text
40
\`\`\`

Calling \`find_total(data, "biology")\` raises \`KeyError\` inside \`find_total\`. But \`find_total\` is not wrong. It does exactly what it should. The mistake is where it was called, because that code asked for a key that does not exist.

This is why the chain of frames is there. When the failing line looks correct, move outwards and ask: who called it, and with what?

## Summary

Read the last line for the kind of error and its message, the line above for the place, and the frames in between only when the failing line looks correct. \`NoneType\` errors mean something gave back nothing. The line reported is where the failure appeared, and that is not always where the mistake was made.`,
        },
        {
          type: "exercise",
          title: "Diagnose and Repair Three Failures",
          description: "Fix a program that holds one error of each kind.",
          instructions: `## The problem

The program in the editor should read three whole numbers and report their total, their average, and the largest.

It holds **three** faults: one runtime error and two logic errors. There is no syntax error, so it will run.

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

Run it first. The runtime error will announce itself with a message and a line number. Deal with that one first, because the program cannot finish until it is gone.

Once it runs, compare each of the three output lines with the expected values above. Two of them will be wrong. For each one, work out which expression produced it, and what that expression really calculates.

## Hints about the kinds

The runtime error is the kind that fires when a name has never been assigned. Check your spelling carefully.

One logic error uses an operator that looks almost right but calculates something different.

The other logic error uses a comparison that points the wrong way, so a value is kept when it should be replaced.

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
          hint: "The NameError is a spelling mistake in the first print. The mean uses // which throws away the fraction, so it should be /. The largest loop keeps the smaller value, because the comparison points the wrong way.",
          tests: [
            {
              input: "4\n8\n6\n",
              expectedOutput: "Total: 18\nMean: 6.0\nLargest: 8",
              description: "All three figures are correct for an ordinary set of values",
            },
            {
              input: "1\n1\n1\n",
              expectedOutput: "Total: 3\nMean: 1.0\nLargest: 1",
              description: "Identical values still give a float average and the correct largest value",
            },
            {
              input: "10\n3\n7\n",
              expectedOutput: "Total: 20\nMean: 6.666666666666667\nLargest: 10",
              description: "An average that does not divide evenly proves the division is not floor division",
            },
            {
              input: "-5\n-1\n-9\n",
              expectedOutput: "Total: -15\nMean: -5.0\nLargest: -1",
              description: "Negative values show up a search for the largest that runs the wrong way",
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
      "Replacing guesswork with a routine you can repeat.",
      [
        {
          type: "lesson",
          title: "Reproduce, Reduce, Hypothesise",
          description: "The three steps that turn debugging from luck into method.",
          instructions: `## The unhelpful approach

When you meet a bug, the natural instinct is to look at the code, notice something that seems suspicious, change it, and run again. Now and then this works. More often it gives you a program with two bugs, because you made a change without understanding what it would do.

The other way is to follow a routine. It is slower for the first thirty seconds and faster after that.

## Step one: reproduce

Before anything else, find an input that fails **every time**.

If a program fails only sometimes, you cannot tell whether a change fixed it or whether you were lucky. Every step after this depends on being able to cause the fault whenever you want.

Write the failing input down. It becomes your test for the rest of the session. And, as Module 9 shows, it becomes a permanent test afterwards, so that this exact bug can never come back unnoticed.

## Step two: reduce

Make the failing case as small as you can. Every part you remove without losing the failure is a part that cannot be to blame.

Suppose a program fails on a list of two hundred records. Try one hundred. Still failing? Try fifty. Carry on until removing anything makes the failure go away.

Reducing works on code as well as on data. Switch lines off with \`#\`. Replace a function call with a fixed value. Make the program smaller until it is small enough to hold in your head.

This step feels like a detour. It is the single most effective debugging technique there is, because it turns "somewhere in this program" into "in these four lines".

## Step three: make a guess you can test

Now form an exact statement about the cause, one that can be proved wrong:

> "I believe \`total\` is zero at line 12 because the loop never runs."

A guess must be checkable. "Something is wrong with the loop" is not checkable. "The loop body runs zero times" is.

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

The guess is confirmed. The list is empty, so the body never ran. The question changes from "why is the total wrong" to "why is the list empty", and that is a different and much easier question.

> **Key idea**
> Debugging is not staring at code until the answer appears. It is causing the fault on purpose, cutting the case down until few things could be to blame, and then testing exact guesses one at a time.

## Cutting in half

When reducing is awkward, cut the program in half instead. Put a print in the middle showing a value you can check.

If the value is already wrong at the middle, the fault is in the first half. If it is still correct, the fault is in the second half. Either way, one check has halved the search.

Repeat, and a two-hundred-line program narrows to a single line in about eight checks. That is far faster than reading all of it, and it needs no flash of insight, only patience.

## Explaining it aloud

Explain the code aloud, line by line, to a person or an object that is not listening. The technique is well known, it sounds silly, and it works.

The reason is that reading code silently lets you skim what you *believe* it says. Saying it aloud forces every line through language, and the sentence "and then this adds one to the counter" catches in your throat, because you can see that it does not.

## When you are truly stuck

Two more options, and both are fair.

Stop and come back later. Time away from a problem works surprisingly well, and staring at the same twenty lines for an hour does not.

Or go back to the last version that worked and put your changes back one at a time, testing after each one. This always finds the cause, because at some point one change breaks it. It is also the strongest argument for making small changes.

## Summary

Cause the fault reliably, cut the case down until few things can be to blame, then form and test exact guesses. Cut the search in half with prints. Explain the code aloud. If you are stuck, step away, or put your changes back one at a time starting from a version that worked.`,
        },
        {
          type: "lesson",
          title: "Inspecting Values",
          description: "Getting information out of a running program, and doing it well.",
          instructions: `## print as an instrument

The simplest way to see inside a running program is to print. This is not a beginner's tool. It is the tool experienced programmers reach for most often, because it is instant and needs no setting up.

But there is a difference between printing carelessly and printing well.

## Label everything

A value with no label is nearly useless:

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

With several prints in different places, you cannot tell which line produced which. Label them:

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

Now each line says where it came from and what it shows. When you are looking at forty lines of diagnostic output, this is the difference between information and noise.

## Print the type when the value looks right

A value that looks correct may have the wrong type, and printing it alone will not show that:

\`\`\`python
value = "42"
print(value)
print(f"value = {value!r}, type = {type(value).__name__}")
\`\`\`

\`\`\`text
42
value = '42', type = str
\`\`\`

The first line looks like a number. The second shows that it is a string.

\`!r\` inside an f-string asks for the **representation** rather than the display form. It is worth knowing, because it makes invisible things visible:

\`\`\`python
name = "ada "
print(f"[{name}]")
print(f"{name!r}")
\`\`\`

\`\`\`text
[ada ]
'ada '
\`\`\`

Spaces at the end, empty strings, and \`None\` all look like nothing when printed plainly. \`!r\` shows the quotes, so \`''\` can be told apart from a value that did not print at all. When a comparison "should match" and does not, print both sides with \`!r\`. The answer is usually visible at once.

## Print inside loops, but carefully

To watch how a value changes, print it on every repeat:

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

The steps make the logic visible. If \`total\` were wrong, you could see exactly which repeat first went astray.

For a loop with ten thousand repeats, print only the interesting ones — the first few, or the ones that meet a condition — or you will drown in output.

## Check the edges, not the middle

When a loop gives nearly-correct results, look at the first and the last repeat. Off-by-one errors live at the edges. The middle is almost always fine.

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

Seeing that the first index is \`0\` and the last is \`2\`, not \`1\` and \`3\`, settles a question that guessing never settles.

## Remove them afterwards

Diagnostic prints are scaffolding. If you leave them in, they clutter the real output and confuse someone later.

Delete them once the bug is fixed. A clear prefix like \`[debug]\` makes them easy to find and remove, and easy to spot if one escapes.

## Beyond print

Two other tools are worth knowing about.

The \`logging\` module in the standard library records diagnostic messages that you can switch on and off by importance, without editing your code. It is what finished programs use instead of prints.

A **debugger** lets you pause a program and look at any value, stepping through one line at a time. Python includes one called \`pdb\`, and editors offer versions with buttons and windows. Debuggers are powerful, and they are worth learning once printing starts to feel slow.

Neither is available in this browser environment, and neither is needed for programs of the size you are writing. Careful printing will carry you a long way.

## Summary

Label every diagnostic print with where it came from. Print types when a value looks right but behaves wrongly, and use \`!r\` to show spaces, empty strings, and \`None\`. Trace loops at their edges. Take the scaffolding out when you have finished.`,
        },
        {
          type: "exercise",
          title: "Locate a Logic Error",
          description: "Use tracing to find why a function that looks correct returns the wrong answer.",
          instructions: `## The problem

The function \`running_totals\` should take a list of numbers and return a list of running totals. Each item is the sum of everything up to and including that position.

\`\`\`text
[3, 1, 4]  ->  [3, 4, 8]
\`\`\`

It runs without any error, and it returns the wrong list.

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

The program reads one line of whole numbers separated by spaces and prints the resulting list. That part works, so leave it alone.

## Guidance

Do not read the function hunting for something that looks wrong. Instead, add a labelled print inside the loop showing the current value, the running total, and the list so far. Run it with \`3 1 4\` and compare every repeat with what you expected.

The first repeat where reality parts company with your expectation is where the fault is.

## Guidance on the likely cause

Ask one exact question. At the moment each item is added to the list, has the current value already been added to the total, or not yet? The order of two statements is the whole bug.

## Constraints

The function must return a list, and it must not print anything.`,
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
          hint: "The append happens before the value is added, so every entry is the total of everything before it, instead of including it. Swap the two statements inside the loop.",
          tests: [
            {
              input: "3 1 4\n",
              expectedOutput: "[3, 4, 8]",
              description: "Every entry includes the value at its own position",
            },
            {
              input: "5\n",
              expectedOutput: "[5]",
              description: "A single value gives back itself, not zero",
            },
            {
              input: "\n",
              expectedOutput: "[]",
              description: "Empty input gives an empty list",
            },
            {
              input: "1 -1 2\n",
              expectedOutput: "[1, 0, 2]",
              description: "Negative values are added up correctly",
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
      "Answering failures that you cannot prevent by checking in advance.",
      [
        {
          type: "lesson",
          title: "try and except",
          description: "Catching a failure so that the program can carry on.",
          instructions: `## When checking first is not enough

Module 3 showed you validation: check the data before you use it. That is the right approach whenever you can check.

Sometimes you cannot. A file may disappear between the moment you check that it exists and the moment you open it. A conversion may fail for more reasons than you can list. And sometimes checking is simply more work than trying the operation.

For these cases, Python offers **exception handling**.

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

The \`try\` block holds code that might fail. If it does fail, Python jumps to the matching \`except\` block instead of stopping the program.

If nothing fails, the \`except\` block is skipped completely:

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

## The program stops at the point of failure

This is the detail people miss most often:

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

\`after\` never printed. When an exception happens, the rest of the \`try\` block is dropped at once.

So a \`try\` block with five statements may have run one, three, or all five of them. Any variable assigned after the failing line does not exist. This is why small \`try\` blocks matter.

## Catch exact exceptions

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

Do not do this. A bare \`except\` catches every failure, including ones you never thought of — a misspelled variable name, a bug in your own logic — and hides them behind a vague message. Programs written this way are extremely hard to debug, because the useful information has been thrown away on purpose.

Catch the exact exception that you know how to handle:

\`\`\`python
try:
    value = int("abc")
except ValueError:
    print("not a whole number")
\`\`\`

\`\`\`text
not a whole number
\`\`\`

Now a \`NameError\` somewhere in the block will still stop the program loudly. That is what you want, because you have no idea how to recover from it.

> **Key idea**
> Catch only the exceptions you can really do something about. A bare \`except\` silences the bugs you most need to see.

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

The \`try\` covers one line. The rest of the work sits outside, where it cannot be skipped, and where an exception it raises will not be quietly swallowed by a handler meant for something else.

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

Each failure gets its own message, which is far more useful than one general answer.

To handle several types in the same way, group them in a tuple:

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

## Looking at the exception

\`as\` attaches the exception to a name, so that you can read its message:

\`\`\`python
try:
    value = int("abc")
except ValueError as error:
    print(f"Conversion failed: {error}")
\`\`\`

\`\`\`text
Conversion failed: invalid literal for int() with base 10: 'abc'
\`\`\`

This is useful for keeping a record. Be careful about showing raw messages to users, who usually cannot act on them.

## Validation or exceptions?

Both have their place, and the choice is usually clear.

Use **validation** when you can check cheaply in advance and a failure is an ordinary, expected outcome. Checking whether a rating is between 1 and 5 needs no exception.

Use **exceptions** when the check is unreliable, not available, or more work than the operation itself, and when a failure really is unusual rather than routine.

Converting user input sits on the border. \`raw.isdigit()\` is a fair check, but it refuses negative numbers and decimals, so \`try: int(raw)\` is often simpler and more correct. This is a matter of judgement, not of rules.

## Summary

\`try\` runs code that might fail, and a matching \`except\` handles the failure. The rest of the \`try\` block is dropped at the point of failure. Catch exact exception types, keep \`try\` blocks small, and prefer validation when a cheap check is available.`,
        },
        {
          type: "lesson",
          title: "else, finally, and raise",
          description: "Finishing the exception statement, and reporting failures of your own.",
          instructions: `## else: code that runs only when nothing failed

An \`else\` block after the \`except\` blocks runs only when the \`try\` block finished with no exception:

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

At first this looks pointless. Why not put that line at the end of the \`try\`? The reason is precision. Code in the \`try\` block is *protected* by the handler. Code in \`else\` is not.

\`\`\`python
values = {"a": 1}

try:
    number = int("1")
except ValueError:
    print("bad number")
else:
    print(values["missing"])
\`\`\`

That \`KeyError\` travels up normally instead of being taken for a conversion problem. If the lookup had been inside the \`try\`, a \`ValueError\` handler would not have caught it either, but your intention would be less clear. \`else\` says exactly what is being guarded and what is not.

## finally: code that always runs

A \`finally\` block runs whether or not an exception happened, and even if the \`try\` block returned:

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

Look at the order: \`finally\` runs before the value actually reaches the caller.

\`finally\` is for cleaning up, when the cleaning must happen whatever else occurs: freeing a resource, closing a connection. In Module 10 you will meet \`with\`, which does the most common case of this for you, and which is better wherever it fits.

## Raising exceptions

Your own functions can report a failure by **raising** an exception:

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

\`raise\` creates an exception and stops the function at once, passing the problem up to the caller. If nothing catches it, the program stops with a traceback.

## Why raise, instead of returning an error value?

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

The \`-1\` is easy to ignore. A caller that forgets to check will happily use \`-1\` as a rating, and the bad value then spreads through the program until it causes a confusing failure somewhere unrelated.

An exception cannot be ignored. Either the caller handles it on purpose, or the program stops at the point of the problem with a message that names it.

That is **fail-fast** design. When something is wrong, stop at once and loudly, as close to the cause as possible. The other choice — carrying on with a bad value — turns a clear failure into a mystery.

> **Key idea**
> A returned value can be ignored. An exception cannot. Raise one when a caller has truly done something wrong, and let it stop the program instead of letting a bad value travel onwards.

## Choosing the type of exception

Use the built-in type that fits:

- \`ValueError\` — the type is right but the value is not. Out of range, or the wrong format.
- \`TypeError\` — completely the wrong type.
- \`KeyError\` or \`IndexError\` — a lookup for something that does not exist.

Always include a message that says what was wrong and, where it helps, what was received. \`raise ValueError("bad input")\` helps nobody. \`raise ValueError(f"rating must be 1 to 5, got {value}")\` tells the reader exactly what happened.

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

Assertions are for internal checks: things that should be impossible if your own code is correct. They write down your assumptions and catch broken ones early.

They are *not* for checking data from outside. Python can be run with assertions switched off, so a program whose input checks live in assertions would have no checks at all. Check input with \`if\` and \`raise\`. Use \`assert\` for "this cannot happen".

## Habits to avoid

Three habits, all common, all worth avoiding.

**Swallowing exceptions.** \`except: pass\` throws the error away and carries on with a state you do not know. If you really can ignore a failure, say why in a comment.

**Catching too widely.** Catching \`Exception\` around a large block hides bugs you never thought of.

**Using exceptions for ordinary decisions.** An exception raised on every second call is not exceptional. That logic belongs in an \`if\`.

## Summary

\`else\` runs when nothing failed, and it is not protected by the handlers. \`finally\` always runs and is for cleaning up. \`raise\` reports a failure in a way the caller cannot ignore, and fail-fast design stops at the cause instead of passing bad values onwards. Use \`assert\` for internal impossibilities, never for checking input.`,
        },
        {
          type: "exercise",
          title: "Convert Input Safely",
          description: "Use try and except to deal with values that cannot be converted.",
          instructions: `## The problem

Read a series of lines and add up the ones that are valid whole numbers, reporting each failure without stopping.

## Input

A series of lines, ending with the line \`end\`. Every other line should be a whole number, but it may be anything at all.

## Requirements

1. For each line, try to convert it to an integer.
2. When that works, add it to a running total and show nothing.
3. When it fails, show \`Skipped: x\`, where \`x\` is the offending line exactly as it arrived.
4. After \`end\`, show exactly two lines:

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

Note that the empty line gives \`Skipped:\` with nothing after it, because the offending value is an empty string.

## Guidance

Wrap only the conversion in the \`try\` block. Everything else — counting, adding up, and reading the next line — belongs outside it. Otherwise an unrelated failure could be caught by the wrong handler.

Catch \`ValueError\` exactly. A bare \`except\` would also catch mistakes in your own code and hide them.

Negative numbers such as \`-4\` are valid and must be accepted. That is exactly why \`isdigit()\` is not good enough here, and why trying the conversion is the right tool.

## Constraints

Do not use \`isdigit()\`. The point of this exercise is to try the conversion and handle its failure.`,
          starterCode: `total = 0
accepted = 0

line = input()
`,
          hint: "Inside the sentinel loop: try: value = int(line), except ValueError: print(f\"Skipped: {line}\"), else: total += value and accepted += 1. Read the next line after the try statement.",
          tests: [
            {
              input: "5\nabc\n12\n\n10\nend\n",
              expectedOutput: "Skipped: abc\nSkipped:\nAccepted: 3\nTotal: 27",
              description: "Bad lines are reported and skipped, while good ones are added up",
            },
            {
              input: "end\n",
              expectedOutput: "Accepted: 0\nTotal: 0",
              description: "No data at all reports zeros",
            },
            {
              input: "-4\n8\nend\n",
              expectedOutput: "Accepted: 2\nTotal: 4",
              description: "Negative numbers are accepted, although a digit check would have refused them",
            },
            {
              input: "1.5\n2\nend\n",
              expectedOutput: "Skipped: 1.5\nAccepted: 1\nTotal: 2",
              description: "A decimal is not a valid whole number and is skipped",
            },
            {
              input: "x\ny\nend\n",
              expectedOutput: "Skipped: x\nSkipped: y\nAccepted: 0\nTotal: 0",
              description: "Even when every line fails, the summary is still clean",
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
          description: "Put raising, catching, and exact messages together in one sturdy program.",
          instructions: `## The problem

Read measurement records, refuse the bad ones with exact messages, and carry on with the rest.

## Input

A series of lines ending with \`end\`. A valid line has the form \`name:value\`, where the value is a whole number from 0 to 100, including both.

## Requirements

Define a function \`parse_record(line: str) -> tuple[str, int]\` that returns the name and the value, and that **raises** \`ValueError\` with an exact message when the line is not valid:

1. No colon in the line: raise with the message \`missing colon\`.
2. Empty name: raise with the message \`empty name\`.
3. Value is not a whole number: raise with the message \`bad value\`.
4. Value outside 0 to 100: raise with the message \`out of range\`.

Then, in the main program, deal with each line:

- When it works, add the value to a running total and count the record.
- On \`ValueError\`, show \`Rejected <line> (<message>)\`.

After \`end\`, show exactly two lines:

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

To find a bad value, try the conversion inside \`parse_record\` and raise again with your own message. Catching \`ValueError\` and raising a new \`ValueError\` is perfectly reasonable when the new message is more useful to the caller.

In the main loop, use \`as error\` to attach the exception to a name, so that its message can be shown.

## Constraints

\`parse_record\` must raise instead of returning an error value. The main program must not stop when a record is refused.`,
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
              description: "Each kind of bad record gives its own message, and the program carries on",
            },
            {
              input: "end\n",
              expectedOutput: "Accepted: 0\nTotal: 0",
              description: "No records at all reports zeros",
            },
            {
              input: "a:0\nb:100\nend\n",
              expectedOutput: "Accepted: 2\nTotal: 100",
              description: "Both ends of the allowed range are accepted",
            },
            {
              input: "a:-1\nend\n",
              expectedOutput: "Rejected a:-1 (out of range)\nAccepted: 0\nTotal: 0",
              description: "A negative value converts successfully but fails the range check",
            },
            {
              input: "nocolonhere\nend\n",
              expectedOutput: "Rejected nocolonhere (missing colon)\nAccepted: 0\nTotal: 0",
              description: "A line with no colon is refused before any splitting is tried",
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

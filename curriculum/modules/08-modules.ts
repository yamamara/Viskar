import { module, lesson, type ModuleSource } from "../types.ts"

const moduleEight: ModuleSource = module(
  "Modules, Libraries, and Program Interfaces",
  "Reusing code you did not write: importing, the standard library, writing your own modules, and how programs receive input from the outside world.",
  [
    lesson(
      "Importing and Namespaces",
      "Bringing other people's code into your program, and keeping names from colliding.",
      [
        {
          type: "lesson",
          title: "Modules and import",
          description: "Where Python's built-in functionality lives, and how to reach it.",
          instructions: `## Code you do not have to write

Every function you have written so far, you wrote. That does not scale, and it is not how programs are built. Most of the code in any real program was written by someone else.

Python ships with a large collection of ready-made code called the **standard library**. It handles mathematics, dates, random numbers, file formats, text processing, and much more. Using it is not a shortcut; it is the normal way to work, and library code is far more thoroughly tested than anything you will write for a single program.

## Modules and packages

A **module** is a single file of Python code intended to be used by other code. \`math\` is a module.

A **package** is a directory of related modules, grouped under one name. \`json\` and \`email\` are packages.

The distinction rarely matters in practice — both are imported the same way — but the words are used precisely in documentation, so it is worth knowing which is which.

## The import statement

\`import\` makes a module available:

\`\`\`python
import math

print(math.sqrt(144))
print(math.floor(3.7))
print(math.pi)
\`\`\`

\`\`\`text
12.0
3
3.141592653589793
\`\`\`

After importing, everything in the module is reached through the module name and a dot. \`math.sqrt\` means "the \`sqrt\` function belonging to \`math\`".

This is the same dot you have used for methods, and the same idea: it means "belonging to".

Import statements conventionally go at the very top of a file, before any other code. Python allows them anywhere, but putting them together at the top means a reader can see at a glance what a file depends on.

## Namespaces

A **namespace** is a collection of names. Each module has its own, which is why the dot is required.

This solves a real problem. Suppose two modules both define a function called \`load\`. Without namespaces, importing both would leave you with one \`load\` and no way to reach the other. With them, \`first.load\` and \`second.load\` are unambiguous.

It also protects your own names:

\`\`\`python
import math

pi = "my own value"
print(pi)
print(math.pi)
\`\`\`

\`\`\`text
my own value
3.141592653589793
\`\`\`

Your \`pi\` and the module's \`pi\` coexist without interference.

> **Key idea**
> A module's contents live in its own namespace, reached through the module name. This is why two modules can define the same name without conflict.

## Importing specific names

\`from ... import ...\` brings individual names directly into your namespace:

\`\`\`python
from math import sqrt, floor

print(sqrt(144))
print(floor(3.7))
\`\`\`

\`\`\`text
12.0
3
\`\`\`

Now \`sqrt\` is used without a prefix. This is shorter, and it is the right choice when you use one or two names from a module repeatedly.

The cost is that the origin is no longer visible. Seeing \`sqrt(x)\` in the middle of a long file, a reader cannot tell where it came from; seeing \`math.sqrt(x)\`, they can.

It also creates the possibility of collision:

\`\`\`python
from math import floor

def floor(value):
    return "my own floor"

print(floor(3.7))
\`\`\`

\`\`\`text
my own floor
\`\`\`

Your definition replaced the imported one silently. Nothing warns you.

## Importing everything

\`from math import *\` imports every public name from the module. Do not use it. It floods your namespace with names you did not choose, any of which may quietly shadow your own, and a reader has no way to tell what was imported. It appears in old tutorials and is now firmly discouraged.

## Aliases

\`as\` renames an import:

\`\`\`python
import statistics as stats

print(stats.mean([2, 4, 6]))
\`\`\`

\`\`\`text
4.0
\`\`\`

Aliases are worth using for long module names, and some have conventional short forms that every practitioner recognises. Inventing your own alias for a short name only obscures things.

## Which style to choose

A practical rule:

Use \`import module\` by default. It keeps origins visible and cannot collide.

Use \`from module import name\` when a small number of names are used often enough that the prefix becomes noise.

Never use \`import *\`.

## Finding out what a module offers

\`dir()\` lists the names in a module and \`help()\` prints documentation:

\`\`\`python
import math

names = [name for name in dir(math) if not name.startswith("_")]
print(len(names) > 20)
print("sqrt" in names)
\`\`\`

\`\`\`text
True
True
\`\`\`

The filter removes names beginning with an underscore, which are internal by convention.

These are useful for a quick look, but the official documentation at the Python website is better for learning what a module is *for*. Reading documentation is a core programming skill, and it improves with practice like any other.

## Summary

The standard library provides tested code you do not have to write. \`import module\` makes it available under its own namespace; \`from module import name\` brings names in directly at the cost of visible origins. Avoid \`import *\`. Put imports at the top of the file.`,
        },
        {
          type: "lesson",
          title: "math, statistics, and datetime",
          description: "Three standard modules, and the habit of checking before writing it yourself.",
          instructions: `## math

\`math\` provides mathematical functions beyond the basic operators:

\`\`\`python
import math

print(math.sqrt(81))
print(math.floor(3.9))
print(math.ceil(3.1))
print(math.fabs(-4.5))
\`\`\`

\`\`\`text
9.0
4
4
4.5
\`\`\`

\`floor\` rounds down, \`ceil\` rounds up, and \`fabs\` gives the absolute value as a float. Note that plain \`abs\` is built in and needs no import.

Contrast these with \`round\`, which rounds to nearest:

\`\`\`python
import math

value = 3.5
print(round(value))
print(math.floor(value))
print(math.ceil(value))
\`\`\`

\`\`\`text
4
3
4
\`\`\`

Choosing the right one matters. Charging for 3.2 hours of parking should use \`ceil\`; reporting how many complete hours were used should use \`floor\`.

\`math\` also provides constants:

\`\`\`python
import math

radius = 3
print(f"{math.pi * radius ** 2:.2f}")
\`\`\`

\`\`\`text
28.27
\`\`\`

## statistics

\`statistics\` computes summary measures:

\`\`\`python
import statistics

values = [4, 8, 6, 5, 3, 8]
print(statistics.mean(values))
print(statistics.median(values))
print(statistics.mode(values))
print(f"{statistics.stdev(values):.2f}")
\`\`\`

\`\`\`text
5.666666666666667
5.5
8
2.07
\`\`\`

\`mean\` is the arithmetic average, \`median\` the middle value when sorted, and \`mode\` the most common. \`stdev\` is the sample standard deviation.

You wrote a mean by hand in Module 5, and that was the right way to learn it. Now that you understand it, use the library version: it is tested, it handles edge cases, and it states its intent more clearly than \`sum(values) / len(values)\`.

These functions raise on empty input:

\`\`\`python
import statistics

values = []
if values:
    print(statistics.mean(values))
else:
    print("no data")
\`\`\`

\`\`\`text
no data
\`\`\`

\`statistics.mean([])\` raises \`StatisticsError\`. Guarding first is the usual approach.

## datetime

\`datetime\` handles dates and times:

\`\`\`python
from datetime import date

start = date(2024, 3, 1)
end = date(2024, 7, 15)
difference = end - start

print(start)
print(difference.days)
\`\`\`

\`\`\`text
2024-03-01
136
\`\`\`

Subtracting two dates gives a \`timedelta\`, whose \`.days\` attribute is the number of days between them. Doing that arithmetic by hand would require handling month lengths and leap years — a classic example of a problem that looks simple and is not.

Formatting uses \`strftime\`:

\`\`\`python
from datetime import date

day = date(2024, 7, 15)
print(day.strftime("%d/%m/%Y"))
print(day.strftime("%B %Y"))
\`\`\`

\`\`\`text
15/07/2024
July 2024
\`\`\`

The codes are cryptic and worth looking up rather than memorising: \`%d\` day, \`%m\` month number, \`%Y\` four-digit year, \`%B\` month name.

## A warning about the current time

\`date.today()\` and \`datetime.now()\` give the current date and time. They are essential in real programs and poison in tests, because their result changes every run.

A program whose output depends on today's date cannot be tested by comparing against expected output. The standard solution is to pass the date in as a parameter:

\`\`\`python
from datetime import date

def days_until(target, reference):
    return (target - reference).days


print(days_until(date(2024, 12, 25), date(2024, 12, 1)))
\`\`\`

\`\`\`text
24
\`\`\`

The function is now testable, because the caller supplies both dates. Only the outermost layer of the program calls \`date.today()\`.

This is a specific instance of a general principle: push sources of unpredictability to the edges, and keep the computing parts deterministic. It applies equally to random numbers, which are next.

> **Key idea**
> A function whose result depends on the current time cannot be tested by comparing output. Take the time as a parameter and let the caller supply it.

## Look before you write

Before writing a non-trivial function, spend a minute checking whether the standard library already has it. Averages, sorting, date arithmetic, random selection, file formats, text search — all are already there.

Library code is tested by many people over many years. Yours is tested by you, this afternoon.

## Summary

\`math\` provides mathematical functions and constants; \`statistics\` provides summary measures that raise on empty input; \`datetime\` handles dates and intervals. Keep the current date and time out of computing functions so they stay testable.`,
        },
        {
          type: "exercise",
          title: "Summarise With the Standard Library",
          description: "Replace hand-written calculations with library functions.",
          instructions: `## The problem

Report several statistics about a set of measurements, using the standard library rather than writing the calculations yourself.

## Input

One line of whole numbers separated by spaces. The line may be empty.

## Requirements

1. Import \`statistics\` and \`math\`.
2. If there are no values, display exactly \`No data\` and nothing else.
3. Otherwise display exactly four lines:

\`\`\`text
Mean: 5.67
Median: 5.5
Rounded up: 6
Spread: 2.07
\`\`\`

Where:

- \`Mean\` is \`statistics.mean\`, shown to **two** decimal places.
- \`Median\` is \`statistics.median\`, shown as Python prints it, with no formatting.
- \`Rounded up\` is the mean passed through \`math.ceil\`.
- \`Spread\` is \`statistics.stdev\`, shown to **two** decimal places.

## Example

Given \`4 8 6 5 3 8\`, the output is the four lines above.

Given an empty line, the output is:

\`\`\`text
No data
\`\`\`

## Guidance

Guard the empty case before calling any statistics function; they raise \`StatisticsError\` on an empty list.

\`stdev\` requires at least two values. You may assume the input, when not empty, always contains at least two.

## Constraints

Do not compute the mean, median, or standard deviation by hand. Use the library.`,
          starterCode: `import math
import statistics

values = [int(part) for part in input().split()]
`,
          hint: "Guard with if not values: print(\"No data\") then return or use else. Format with {statistics.mean(values):.2f} and pass the mean to math.ceil for the rounded line.",
          tests: [
            {
              input: "4 8 6 5 3 8\n",
              expectedOutput: "Mean: 5.67\nMedian: 5.5\nRounded up: 6\nSpread: 2.07",
              description: "A typical set of measurements produces all four statistics",
            },
            {
              input: "\n",
              expectedOutput: "No data",
              description: "An empty input is guarded before any statistics function is called",
            },
            {
              input: "10 20\n",
              expectedOutput: "Mean: 15.00\nMedian: 15.0\nRounded up: 15\nSpread: 7.07",
              description: "Two values give a whole mean that still shows two decimal places",
            },
            {
              input: "1 2 3 4\n",
              expectedOutput: "Mean: 2.50\nMedian: 2.5\nRounded up: 3\nSpread: 1.29",
              description: "An even count gives a median between two values",
            },
          ],
          solution: `import math
import statistics

values = [int(part) for part in input().split()]

if not values:
    print("No data")
else:
    mean = statistics.mean(values)
    print(f"Mean: {mean:.2f}")
    print(f"Median: {statistics.median(values)}")
    print(f"Rounded up: {math.ceil(mean)}")
    print(f"Spread: {statistics.stdev(values):.2f}")
`,
        },
      ],
    ),

    lesson(
      "Randomness and Determinism",
      "Generating unpredictable values, and making them predictable again for testing.",
      [
        {
          type: "lesson",
          title: "The random Module",
          description: "Producing random values, and why they are not really random.",
          instructions: `## Generating random values

\`random\` produces values that appear unpredictable:

\`\`\`python
import random

random.seed(1)
print(random.randint(1, 6))
print(random.random() < 1.0)
print(random.choice(["red", "blue", "green"]))
\`\`\`

\`\`\`text
2
True
red
\`\`\`

\`randint(a, b)\` gives a whole number from \`a\` to \`b\` **inclusive** — unlike \`range\`, both ends are included. \`random()\` gives a float from 0.0 up to but not including 1.0. \`choice\` picks one item from a sequence.

Two more that are frequently useful:

\`\`\`python
import random

random.seed(7)
items = [1, 2, 3, 4, 5]
random.shuffle(items)
print(items)
print(random.sample([1, 2, 3, 4, 5], 3))
\`\`\`

\`\`\`text
[5, 1, 4, 2, 3]
[1, 5, 2]
\`\`\`

\`shuffle\` rearranges a list **in place** and returns \`None\` — the same rule as \`sort\`. \`sample\` returns a new list of distinct items chosen at random.

## Not actually random

The values are produced by an arithmetic formula. Given a starting point, the entire sequence that follows is completely determined. This is called a **pseudo-random** generator, and the starting point is called the **seed**.

Normally Python seeds from something unpredictable, so each run differs. But you can set the seed yourself:

\`\`\`python
import random

random.seed(42)
print(random.randint(1, 100))
print(random.randint(1, 100))
\`\`\`

\`\`\`text
82
15
\`\`\`

Run that a thousand times and it produces \`82\` then \`15\` every time. The seed determines everything.

> **Key idea**
> Random values come from a formula with a starting point. Fix the seed and the whole sequence is fixed, which turns unpredictable code into testable code.

## Why this matters for testing

A program using unseeded randomness cannot be checked by comparing its output, because the output differs each run. That is a genuine problem: the parts of a program that use randomness are often exactly the parts most worth testing.

Seeding solves it. Every exercise in this course that uses \`random\` sets a seed, so results are reproducible.

Note carefully: the *same* seed gives the same sequence within one version of Python, which is what makes the exercises here work. Across major versions the algorithm can change, so a seeded sequence is a testing tool rather than a permanent guarantee.

## Where to seed

Seed once, at the start of the program:

\`\`\`python
import random

def roll_dice(count):
    return [random.randint(1, 6) for _ in range(count)]


random.seed(3)
print(roll_dice(5))
\`\`\`

\`\`\`text
[2, 5, 5, 2, 3]
\`\`\`

Seeding inside \`roll_dice\` would reset the generator on every call, so every call would produce the same sequence — a subtle bug that makes randomness far less random than it appears.

## Randomness at the edges

The principle from the previous lesson applies here too. A function that generates its own random values is hard to test. A function that *receives* values is easy:

\`\`\`python
def score_rolls(rolls):
    return sum(rolls) + len([r for r in rolls if r == 6]) * 10


print(score_rolls([1, 6, 3]))
print(score_rolls([6, 6]))
\`\`\`

\`\`\`text
20
32
\`\`\`

\`score_rolls\` contains the interesting logic and no randomness at all, so it can be tested with hand-picked inputs including the tricky ones. A thin outer layer generates the rolls and passes them in.

This is the same shape as separating computation from printing, and from taking the date as a parameter. The pattern generalises: **keep unpredictability at the edges and logic in the middle.**

## A note on security

\`random\` is not suitable for anything security-related — passwords, tokens, keys. Its sequence is predictable to anyone who can observe enough output. Python provides the \`secrets\` module for those uses. This will not matter for the programs in this course, but it matters a great deal in real systems, and the mistake is common.

## Summary

\`random\` provides \`randint\`, \`random\`, \`choice\`, \`shuffle\`, and \`sample\`. The values come from a seeded formula, so setting the seed makes a program reproducible and testable. Seed once at the start, and keep randomness out of the functions containing your logic.`,
        },
        {
          type: "exercise",
          title: "Deterministic Random Sampling",
          description: "Use a fixed seed so a program using randomness produces reproducible output.",
          instructions: `## The problem

Simulate rolling dice and report on the results. The program must produce identical output every time it runs.

## Input

Two lines:

1. A whole number, the seed.
2. A whole number, how many dice to roll.

## Requirements

1. Import \`random\` and call \`random.seed\` with the supplied seed, **once**, before any rolling.
2. Roll that many dice, each a whole number from 1 to 6 inclusive, using \`random.randint\`.
3. Display exactly four lines:

\`\`\`text
Rolls: [2, 5, 1, 3, 1]
Total: 12
Highest: 5
Sixes: 0
\`\`\`

## Example

Given seed \`1\` and count \`5\`, the output is exactly the four lines above.

Given seed \`42\` and count \`3\`, the output is:

\`\`\`text
Rolls: [6, 1, 1]
Total: 8
Highest: 6
Sixes: 1
\`\`\`

## Guidance

Seed once, before the loop that generates the rolls. Seeding inside the loop would reset the generator each time and produce the same number repeatedly.

Collect the rolls into a list first, then compute the three summary figures from that list using built-in functions.

## Constraints

Use \`random.randint(1, 6)\` for each roll, called once per die, in order. The count is always at least 1.`,
          starterCode: `import random

seed = int(input())
count = int(input())
`,
          hint: "random.seed(seed) first, then build rolls with a loop calling random.randint(1, 6). Use sum(), max(), and rolls.count(6) for the summary lines.",
          tests: [
            {
              input: "1\n5\n",
              expectedOutput: "Rolls: [2, 5, 1, 3, 1]\nTotal: 12\nHighest: 5\nSixes: 0",
              description: "A fixed seed reproduces an exact sequence of rolls",
            },
            {
              input: "42\n3\n",
              expectedOutput: "Rolls: [6, 1, 1]\nTotal: 8\nHighest: 6\nSixes: 1",
              description: "A different seed produces a different but equally reproducible sequence, here containing a six",
            },
            {
              input: "7\n1\n",
              expectedOutput: "Rolls: [3]\nTotal: 3\nHighest: 3\nSixes: 0",
              description: "A single roll is summarised correctly",
            },
            {
              input: "3\n8\n",
              expectedOutput: "Rolls: [2, 5, 5, 2, 3, 5, 4, 6]\nTotal: 32\nHighest: 6\nSixes: 1",
              description: "A longer sequence containing a six is counted correctly",
            },
          ],
          solution: `import random

seed = int(input())
count = int(input())

random.seed(seed)
rolls = []
for _ in range(count):
    rolls.append(random.randint(1, 6))

print(f"Rolls: {rolls}")
print(f"Total: {sum(rolls)}")
print(f"Highest: {max(rolls)}")
print(f"Sixes: {rolls.count(6)}")
`,
        },
        {
          type: "exercise",
          title: "Separate Randomness From Logic",
          description: "Refactor a function so its logic can be tested without randomness.",
          instructions: `## The problem

The function in the editor generates random rolls and scores them in one step. Because it generates its own values, its result cannot be predicted, and its scoring rule cannot be tested with chosen inputs.

## Your task

Split it so the logic is testable.

## Requirements

1. Define \`score_rolls(rolls: list[int]) -> int\` which takes a list of rolls and **returns** a score, containing no randomness at all. The scoring rule is: the sum of the rolls, plus 10 bonus points for each six.
2. Define \`generate_rolls(count: int) -> list[int]\` which returns a list of \`count\` random rolls from 1 to 6 using \`random.randint\`.
3. Read a seed and a count, seed once, generate the rolls, and display exactly two lines:

\`\`\`text
Rolls: [2, 5, 1, 3, 1]
Score: 12
\`\`\`

## Examples

Given seed \`1\` and count \`5\`, the output is the two lines above.

Given seed \`3\` and count \`8\`, the rolls contain one six, so the score is the sum plus 10.

## Guidance

The point of the split is that \`score_rolls\` can now be checked directly. Before submitting, call it yourself with \`[6]\` and confirm you get 16, and with \`[1, 2]\` and confirm you get 3. That takes ten seconds and eliminates it as a source of error.

## Why this matters

Once the logic is separated from the randomness, the scoring rule can be tested exhaustively with hand-chosen inputs — including the interesting cases like all sixes or an empty list — none of which you could reliably produce by rolling dice.

## Constraints

\`score_rolls\` must not import or call anything from \`random\`.`,
          starterCode: `import random


def rolls_and_score(count):
    total = 0
    for _ in range(count):
        roll = random.randint(1, 6)
        total += roll
        if roll == 6:
            total += 10
    return total


seed = int(input())
count = int(input())
random.seed(seed)
print(f"Score: {rolls_and_score(count)}")
`,
          hint: "generate_rolls builds and returns the list. score_rolls loops over a given list adding each value plus 10 when it is a six. Main code: seed, rolls = generate_rolls(count), then print both lines.",
          tests: [
            {
              input: "1\n5\n",
              expectedOutput: "Rolls: [2, 5, 1, 3, 1]\nScore: 12",
              description: "Rolls with no sixes score their plain total",
            },
            {
              input: "3\n8\n",
              expectedOutput: "Rolls: [2, 5, 5, 2, 3, 5, 4, 6]\nScore: 42",
              description: "Sixes each add ten bonus points to the total",
            },
            {
              input: "42\n3\n",
              expectedOutput: "Rolls: [6, 1, 1]\nScore: 18",
              description: "A leading six is scored with its bonus",
            },
            {
              input: "9\n1\n",
              expectedOutput: "Rolls: [4]\nScore: 4",
              description: "A single roll produces a score equal to its value",
            },
          ],
          solution: `import random


def score_rolls(rolls: list[int]) -> int:
    """Return the total of rolls, with 10 bonus points for each six."""
    total = 0
    for roll in rolls:
        total += roll
        if roll == 6:
            total += 10
    return total


def generate_rolls(count: int) -> list[int]:
    """Return count random dice rolls between 1 and 6 inclusive."""
    rolls = []
    for _ in range(count):
        rolls.append(random.randint(1, 6))
    return rolls


seed = int(input())
count = int(input())
random.seed(seed)
rolls = generate_rolls(count)
print(f"Rolls: {rolls}")
print(f"Score: {score_rolls(rolls)}")
`,
        },
      ],
    ),

    lesson(
      "Writing and Using Your Own Modules",
      "Splitting a program across files, and what happens when one is imported.",
      [
        {
          type: "lesson",
          title: "Creating a Module",
          description: "Turning a file of functions into something other files can use.",
          instructions: `## Any file is a module

There is nothing special about a module. Any \`.py\` file can be imported by another.

Suppose a file named \`durations.py\` contains:

\`\`\`text
"""Helpers for formatting time durations."""

MINUTES_PER_HOUR = 60


def format_duration(minutes):
    """Return minutes as a compact duration string such as '1h 15m'."""
    hours = minutes // MINUTES_PER_HOUR
    remaining = minutes % MINUTES_PER_HOUR
    if hours == 0:
        return f"{remaining}m"
    if remaining == 0:
        return f"{hours}h"
    return f"{hours}h {remaining}m"
\`\`\`

Another file in the same directory can then use it:

\`\`\`text
import durations

print(durations.format_duration(75))
print(durations.MINUTES_PER_HOUR)
\`\`\`

which would display:

\`\`\`text
1h 15m
60
\`\`\`

Note that these two blocks are shown as plain text rather than as runnable examples, because they describe two separate files. The in-browser environment used by this course runs a single program at a time, so you cannot create a second file here. The idea still matters, and it is exactly how you will organise programs on your own machine.

## The import name

The module name is the filename without \`.py\`. A file called \`durations.py\` is imported as \`durations\`.

This has a practical consequence worth knowing before it bites you: **never name a file after a standard library module.** A file called \`random.py\` in your project directory will be found before the real \`random\` module, and every import of \`random\` anywhere in your program will get your file instead. The resulting errors are baffling. The same applies to \`math.py\`, \`json.py\`, \`string.py\`, and any other name from the library.

## Importing runs the file

This is the crucial mechanic. When a module is imported, Python **executes the whole file** from top to bottom. That is how the definitions come into existence: \`def\` statements run, creating the functions.

But every *other* top-level statement runs too. If \`durations.py\` ended with:

\`\`\`text
print("loading durations")
\`\`\`

then importing it would print that message.

This is why the guard from Module 6 exists:

\`\`\`python
def format_duration(minutes):
    """Return minutes as a compact duration string."""
    if minutes < 60:
        return f"{minutes}m"
    return f"{minutes // 60}h {minutes % 60}m"


def main():
    print(format_duration(75))


if __name__ == "__main__":
    main()
\`\`\`

\`\`\`text
1h 15m
\`\`\`

Run directly, \`__name__\` is \`"__main__"\`, so \`main()\` runs. Imported by another file, \`__name__\` is \`"durations"\`, so \`main()\` does not run and only the definitions are created.

The guard is what lets a single file be both a usable program and a reusable library. Without it, you must choose.

> **Key idea**
> Importing a module executes every top-level statement in it. Put your program's actions inside \`main()\` under the \`__name__\` guard so that importing gives you the functions without running the program.

## A module is imported once

Python caches modules. Importing the same module several times executes the file only the first time; later imports reuse what is already loaded.

This means module-level code runs exactly once per program, no matter how many files import it — which is usually what you want, and occasionally surprising when you expect a re-import to pick up an edit.

## How to split a program

For a program of a few hundred lines, a reasonable division is by *responsibility*:

- One module for the core logic — the pure functions doing the real work.
- One for input and output — reading files, formatting output.
- One that coordinates and holds \`main\`.

The test of a good split is whether you can describe each file in a sentence. If a file's honest description is "various things", it needs dividing.

Do not split too early. A program of eighty lines belongs in one file, and dividing it makes it harder to read, not easier.

## Summary

Any \`.py\` file is importable under its filename without the extension. Importing executes the whole file, so put actions inside \`main()\` under the \`__name__\` guard. Never name a file after a standard library module. Split by responsibility, and only once a file is genuinely doing too much.`,
        },
        {
          type: "lesson",
          title: "Program Interfaces and the Wider Ecosystem",
          description: "Command-line arguments, third-party packages, and what an API is.",
          instructions: `## How programs receive input

You have used \`input()\`, which asks a person for a value while the program runs. That suits interactive programs and suits almost nothing else.

Most command-line programs receive their input as **arguments** supplied when they are started:

\`\`\`text
python report.py sessions.txt --format brief
\`\`\`

Here \`report.py\` is the program and everything after it is an argument. The program can read them and act accordingly, without pausing to ask.

This matters because it makes programs **composable**. A program that reads arguments can be run automatically, scheduled, or chained with others. A program that stops to ask questions cannot.

## sys.argv

The raw arguments are available as a list:

\`\`\`text
import sys

print(sys.argv)
\`\`\`

Run as \`python report.py sessions.txt brief\`, that would display:

\`\`\`text
['report.py', 'sessions.txt', 'brief']
\`\`\`

The first item is always the program name, so the actual arguments start at index 1. Every item is a string, exactly like \`input()\`, so numbers must be converted.

A program using \`sys.argv\` directly must check the list length before indexing, or it raises \`IndexError\` when arguments are missing:

\`\`\`python
argv = ["report.py"]

if len(argv) < 2:
    print("usage: report.py FILENAME")
else:
    print(f"reading {argv[1]}")
\`\`\`

\`\`\`text
usage: report.py FILENAME
\`\`\`

That example simulates \`sys.argv\` with an ordinary list, since this environment runs programs without command-line arguments. The logic is identical to the real thing.

## argparse

For anything beyond one or two arguments, the standard library provides \`argparse\`, which handles named options, defaults, type conversion, error messages, and a generated help text.

A sketch of its use:

\`\`\`text
import argparse

parser = argparse.ArgumentParser(description="Summarise study sessions.")
parser.add_argument("filename", help="the sessions file to read")
parser.add_argument("--limit", type=int, default=10, help="maximum rows to show")
args = parser.parse_args()

print(args.filename, args.limit)
\`\`\`

From that description, \`argparse\` produces a program that rejects missing arguments with a clear message, converts \`--limit\` to an integer automatically, and responds to \`--help\` with usage text — none of which you have to write.

The lesson generalises beyond \`argparse\`: when a task is common enough that a standard tool exists, the tool is nearly always better than a hand-rolled version.

## Third-party packages

The standard library is large but finite. The wider Python ecosystem contains hundreds of thousands of **third-party packages** published on the Python Package Index.

They are installed with \`pip\`, Python's package installer:

\`\`\`text
pip install requests
\`\`\`

After that, \`import requests\` works in your programs.

Real projects list their dependencies in a file, conventionally \`requirements.txt\`, so that anyone can install the same set:

\`\`\`text
requests==2.31.0
rich==13.7.0
\`\`\`

Pinning exact versions matters: a program that works today can break tomorrow if a dependency changes underneath it.

**None of this is available in this course's environment**, which runs Python in your browser with the standard library only. Every exercise here is solvable without third-party packages, and the validator checks that.

## Choosing a dependency responsibly

Adding a dependency is not free. Each one is code you did not write and cannot fully review, that may stop being maintained, that can carry security flaws, and that must be kept up to date.

Reasonable questions before adding one:

- Is it actively maintained, with recent activity?
- How widely is it used?
- How much of it do I actually need — could twenty lines of my own do the job?
- What does it depend on in turn?

The answer is often still "use the package". Cryptography and date parsing are two areas where writing your own is a serious mistake. But the decision should be made rather than defaulted into.

## APIs, HTTP, and JSON

An **API**, an application programming interface, is a defined way for one program to use another. A library's functions are an API. So is a web service that answers requests over the network.

Web APIs typically work over **HTTP**, the protocol browsers use. A program sends a request to a URL and receives a response. The response is usually **JSON**, a text format for structured data:

\`\`\`text
{
  "subject": "history",
  "minutes": 40,
  "tags": ["revision", "essay"]
}
\`\`\`

JSON's shapes map almost directly onto Python's: objects become dictionaries, arrays become lists, and strings and numbers are themselves. Python's \`json\` module converts between the two, and Module 10 covers it in full.

Network access is not available in this environment, so no exercise here makes a request. The concepts still matter: a very large proportion of practical programming consists of asking another service for data and doing something useful with the reply.

## Summary

Command-line arguments arrive in \`sys.argv\` as strings, with the program name first; \`argparse\` handles anything non-trivial. Third-party packages are installed with \`pip\` and pinned in \`requirements.txt\`, and each one is a commitment worth weighing. An API is a defined interface between programs, commonly HTTP carrying JSON.`,
        },
        {
          type: "exercise",
          title: "Parse Simulated Command-Line Arguments",
          description: "Interpret an argument list the way a command-line program would.",
          instructions: `## The problem

Write the argument-handling logic of a command-line program. Since this environment cannot supply real command-line arguments, the argument list is read from input instead — but the logic is exactly what \`sys.argv\` would require.

## Input

One line containing the arguments separated by spaces, **including** the program name as the first item. The line is never empty.

## Requirements

Define \`parse_args(argv: list[str]) -> str\` which returns a message:

1. If there is no argument after the program name, return \`usage: report.py FILENAME [--limit N]\`.
2. Otherwise the first argument after the program name is the filename.
3. If \`--limit\` appears, the item immediately after it is the limit, which must be a whole number. If \`--limit\` is present but not followed by anything, return \`error: --limit needs a value\`. If the value is not a whole number, return \`error: limit must be a whole number\`.
4. If \`--limit\` is absent, the limit defaults to \`10\`.
5. On success return \`reading FILENAME with limit N\`.

Then read the line, split it, call the function, and print the result.

## Examples

Given \`report.py sessions.txt\`, the output is:

\`\`\`text
reading sessions.txt with limit 10
\`\`\`

Given \`report.py sessions.txt --limit 5\`, the output is:

\`\`\`text
reading sessions.txt with limit 5
\`\`\`

Given \`report.py\`, the output is:

\`\`\`text
usage: report.py FILENAME [--limit N]
\`\`\`

Given \`report.py data.txt --limit\`, the output is:

\`\`\`text
error: --limit needs a value
\`\`\`

Given \`report.py data.txt --limit abc\`, the output is:

\`\`\`text
error: limit must be a whole number
\`\`\`

## Guidance

Remember that \`argv[0]\` is the program name, so the real arguments begin at index 1.

Use \`in\` to test whether \`--limit\` is present, and \`index\` to find where. Then check that a further item exists before reading it — this is exactly the length check that prevents \`IndexError\`.

Use guard clauses throughout; each failure returns immediately.

## Constraints

The function must return every message. Print exactly once, outside it.`,
          starterCode: `def parse_args(argv: list[str]) -> str:
    return ""


argv = input().split()
print(parse_args(argv))
`,
          hint: "Guard on len(argv) < 2 first. Then filename = argv[1] and limit = 10. If \"--limit\" in argv: position = argv.index(\"--limit\"); guard that position + 1 < len(argv); then try int() and catch ValueError to return the message.",
          tests: [
            {
              input: "report.py sessions.txt\n",
              expectedOutput: "reading sessions.txt with limit 10",
              description: "A filename with no options uses the default limit",
            },
            {
              input: "report.py sessions.txt --limit 5\n",
              expectedOutput: "reading sessions.txt with limit 5",
              description: "An explicit limit overrides the default",
            },
            {
              input: "report.py\n",
              expectedOutput: "usage: report.py FILENAME [--limit N]",
              description: "No filename produces the usage message",
            },
            {
              input: "report.py data.txt --limit\n",
              expectedOutput: "error: --limit needs a value",
              description: "A trailing option with no value is detected before indexing past the end",
            },
            {
              input: "report.py data.txt --limit abc\n",
              expectedOutput: "error: limit must be a whole number",
              description: "A non-numeric limit is rejected with its own message",
            },
            {
              input: "report.py data.txt --limit 0\n",
              expectedOutput: "reading data.txt with limit 0",
              description: "A limit of zero is a valid whole number",
            },
          ],
          solution: `def parse_args(argv: list[str]) -> str:
    """Return a message describing the parsed arguments, or an error."""
    if len(argv) < 2:
        return "usage: report.py FILENAME [--limit N]"

    filename = argv[1]
    limit = 10

    if "--limit" in argv:
        position = argv.index("--limit")
        if position + 1 >= len(argv):
            return "error: --limit needs a value"
        try:
            limit = int(argv[position + 1])
        except ValueError:
            return "error: limit must be a whole number"

    return f"reading {filename} with limit {limit}"


argv = input().split()
print(parse_args(argv))
`,
        },
        {
          type: "exercise",
          title: "Module 8 Checkpoint: Seeded Study Planner",
          description: "Combine several standard library modules into one deterministic program.",
          instructions: `## The problem

Build a study planner that allocates a set of subjects across days, using library functions and producing reproducible output.

## Input

Three lines:

1. A whole number, the seed.
2. Subject names separated by spaces.
3. A whole number, the total minutes available.

## Requirements

1. Import \`random\`, \`math\`, and \`statistics\`.
2. Seed the generator once with the supplied seed.
3. Shuffle the subject list with \`random.shuffle\`.
4. Allocate minutes: each subject gets the total divided by the number of subjects, rounded **down** with \`math.floor\`. Any remaining minutes go to the **first** subject in the shuffled order.
5. Display one line per subject in shuffled order:

\`\`\`text
history: 34 min
biology: 33 min
statistics: 33 min
\`\`\`

6. Then display one final line with the mean allocation to two decimal places:

\`\`\`text
Mean: 33.33
\`\`\`

## Example

Given seed \`5\`, subjects \`history biology statistics\`, and \`100\` minutes, the shuffled order determines which subject receives the extra minute.

## Guidance

Compute the base allocation with \`math.floor(total / len(subjects))\`, then the remainder as \`total - base * len(subjects)\`. Add the remainder to the first subject only.

Use \`statistics.mean\` over the list of allocations for the final line.

\`random.shuffle\` modifies the list in place and returns \`None\`, so call it as a statement rather than assigning its result.

## Constraints

There is always at least one subject and the total is always at least 0.`,
          starterCode: `import math
import random
import statistics

seed = int(input())
subjects = input().split()
total = int(input())
`,
          hint: "random.seed(seed) then random.shuffle(subjects) as a statement. base = math.floor(total / len(subjects)); remainder = total - base * len(subjects). Build a list of allocations where index 0 gets base + remainder.",
          tests: [
            {
              input: "5\nhistory biology statistics\n100\n",
              expectedOutput: "history: 34 min\nbiology: 33 min\nstatistics: 33 min\nMean: 33.33",
              description: "The extra minute goes to the first subject after shuffling",
            },
            {
              input: "1\nmaths\n50\n",
              expectedOutput: "maths: 50 min\nMean: 50.00",
              description: "A single subject receives everything",
            },
            {
              input: "2\na b\n10\n",
              expectedOutput: "b: 5 min\na: 5 min\nMean: 5.00",
              description: "An evenly divisible total leaves no remainder to distribute",
            },
            {
              input: "9\nx y z\n0\n",
              expectedOutput: "x: 0 min\nz: 0 min\ny: 0 min\nMean: 0.00",
              description: "A zero total allocates nothing but still lists every subject",
            },
          ],
          solution: `import math
import random
import statistics

seed = int(input())
subjects = input().split()
total = int(input())

random.seed(seed)
random.shuffle(subjects)

base = math.floor(total / len(subjects))
remainder = total - base * len(subjects)

allocations = []
for index in range(len(subjects)):
    if index == 0:
        allocations.append(base + remainder)
    else:
        allocations.append(base)

for subject, minutes in zip(subjects, allocations):
    print(f"{subject}: {minutes} min")

print(f"Mean: {statistics.mean(allocations):.2f}")
`,
        },
      ],
    ),
  ],
)

export default moduleEight

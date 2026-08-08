import { module, lesson, type ModuleSource } from "../types.ts"

const moduleEight: ModuleSource = module(
  "Modules, Libraries, and Program Interfaces",
  "Using code you did not write: importing, the standard library, writing your own modules, and how programs take in information from outside.",
  [
    lesson(
      "Importing and Namespaces",
      "Bringing other people's code into your program, and keeping names from clashing.",
      [
        {
          type: "lesson",
          title: "Modules and import",
          description: "Where Python's ready-made code lives, and how to reach it.",
          instructions: `## Code you do not have to write

Every function you have used so far, you wrote yourself. That does not work for long, and it is not how programs are built. Most of the code in any real program was written by someone else.

Python comes with a large collection of ready-made code called the **standard library**. It covers mathematics, dates, random numbers, file formats, text processing, and much more. Using it is not a shortcut. It is the normal way to work, and library code has been tested far more carefully than anything you will write for a single program.

## Modules and packages

A **module** is one file of Python code, meant to be used by other code. \`math\` is a module.

A **package** is a folder of related modules, grouped under one name. \`json\` and \`email\` are packages.

The difference rarely matters in practice, because you import both in the same way. But the two words are used exactly in documentation, so it is worth knowing which is which.

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

After importing, you reach everything in the module through the module name and a dot. \`math.sqrt\` means "the \`sqrt\` function belonging to \`math\`".

This is the same dot you have used for methods, with the same meaning: "belonging to".

By habit, import statements go at the very top of a file, before any other code. Python allows them anywhere, but keeping them together at the top lets a reader see at a glance what a file depends on.

## Namespaces

A **namespace** is a collection of names. Each module has its own, and that is why the dot is needed.

This solves a real problem. Suppose two modules both define a function called \`load\`. Without namespaces, importing both would leave you with one \`load\` and no way to reach the other. With namespaces, \`first.load\` and \`second.load\` are perfectly clear.

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

Your \`pi\` and the module's \`pi\` live side by side without any trouble.

> **Key idea**
> The contents of a module live in the module's own namespace, and you reach them through the module name. That is why two modules can define the same name without a clash.

## Importing particular names

\`from ... import ...\` brings single names straight into your own namespace:

\`\`\`python
from math import sqrt, floor

print(sqrt(144))
print(floor(3.7))
\`\`\`

\`\`\`text
12.0
3
\`\`\`

Now you use \`sqrt\` with no prefix. This is shorter, and it is the right choice when you use one or two names from a module again and again.

The cost is that you can no longer see where the name came from. If a reader sees \`sqrt(x)\` in the middle of a long file, they cannot tell its source. If they see \`math.sqrt(x)\`, they can.

It also makes a clash possible:

\`\`\`python
from math import floor

def floor(value):
    return "my own floor"

print(floor(3.7))
\`\`\`

\`\`\`text
my own floor
\`\`\`

Your definition replaced the imported one in silence. Nothing warns you.

## Importing everything

\`from math import *\` imports every public name from the module. Do not use it. It fills your namespace with names you did not choose, any of which may quietly hide one of your own, and a reader has no way to tell what came in. You will see it in old tutorials, and it is now firmly discouraged.

## Other names for imports

\`as\` gives an import a different name:

\`\`\`python
import statistics as stats

print(stats.mean([2, 4, 6]))
\`\`\`

\`\`\`text
4.0
\`\`\`

This is worth doing for long module names, and some modules have short forms that every practitioner recognises. Inventing your own short name for an already short name only makes things harder to follow.

## Which style to choose

Here is a practical rule.

Use \`import module\` most of the time. It keeps sources visible and cannot clash.

Use \`from module import name\` when a small number of names are used so often that the prefix becomes noise.

Never use \`import *\`.

## Finding out what a module offers

\`dir()\` lists the names in a module, and \`help()\` prints documentation:

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

The filter removes names that begin with an underscore, which are internal by habit.

These are useful for a quick look, but the official documentation on the Python website is better for learning what a module is *for*. Reading documentation is a core programming skill, and it improves with practice like any other.

## Summary

The standard library gives you tested code that you do not have to write. \`import module\` makes it available under its own namespace. \`from module import name\` brings names in directly, at the cost of hiding where they came from. Avoid \`import *\`. Put imports at the top of the file.`,
        },
        {
          type: "lesson",
          title: "math, statistics, and datetime",
          description: "Three standard modules, and the habit of checking before you write it yourself.",
          instructions: `## math

\`math\` gives you mathematical functions beyond the basic operators:

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

\`floor\` rounds down, \`ceil\` rounds up, and \`fabs\` gives the size of a number without its sign, as a float. Note that plain \`abs\` is built in and needs no import.

Compare these with \`round\`, which goes to the nearest whole number:

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

Choosing the right one matters. Charging for 3.2 hours of parking should use \`ceil\`. Reporting how many complete hours were used should use \`floor\`.

\`math\` also gives you constants:

\`\`\`python
import math

radius = 3
print(f"{math.pi * radius ** 2:.2f}")
\`\`\`

\`\`\`text
28.27
\`\`\`

## statistics

\`statistics\` works out summary measures:

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

\`mean\` is the ordinary average. \`median\` is the middle value once the data is sorted. \`mode\` is the most common value. \`stdev\` is the sample standard deviation.

You wrote a mean by hand in Module 5, and that was the right way to learn it. Now that you understand it, use the library version. It is tested, it deals with unusual cases, and it says what you mean more clearly than \`sum(values) / len(values)\`.

These functions raise an error on empty input:

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

\`statistics.mean([])\` raises \`StatisticsError\`. Guarding first is the usual answer.

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

Subtracting one date from another gives a \`timedelta\`, and its \`.days\` attribute is the number of days between them. Doing that arithmetic by hand would mean handling the length of each month and leap years. It is a classic example of a problem that looks simple and is not.

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

The codes are hard to guess and worth looking up rather than learning by heart: \`%d\` day, \`%m\` month number, \`%Y\` four-digit year, \`%B\` month name.

## A warning about the current time

\`date.today()\` and \`datetime.now()\` give the current date and time. They are essential in real programs and poison in tests, because their result changes on every run.

A program whose output depends on today's date cannot be tested by comparing it with expected output. The standard answer is to pass the date in as a parameter:

\`\`\`python
from datetime import date

def days_until(target, reference):
    return (target - reference).days


print(days_until(date(2024, 12, 25), date(2024, 12, 1)))
\`\`\`

\`\`\`text
24
\`\`\`

The function can now be tested, because the caller supplies both dates. Only the outermost layer of the program calls \`date.today()\`.

This is one example of a general rule: push everything unpredictable to the edges, and keep the calculating parts steady. The same rule applies to random numbers, which come next.

> **Key idea**
> A function whose answer depends on the current time cannot be tested by comparing output. Take the time as a parameter and let the caller supply it.

## Look before you write

Before you write any function that is not trivial, spend a minute checking whether the standard library already has it. Averages, sorting, date arithmetic, random choices, file formats, text searching — they are all already there.

Library code has been tested by many people over many years. Yours has been tested by you, this afternoon.

## Summary

\`math\` gives mathematical functions and constants. \`statistics\` gives summary measures and raises an error on empty input. \`datetime\` handles dates and the gaps between them. Keep the current date and time out of your calculating functions, so that they stay testable.`,
        },
        {
          type: "exercise",
          title: "Summarise With the Standard Library",
          description: "Replace calculations you wrote by hand with library functions.",
          instructions: `## The problem

Report several statistics about a set of measurements, using the standard library instead of writing the calculations yourself.

## Input

One line of whole numbers separated by spaces. The line may be empty.

## Requirements

1. Import \`statistics\` and \`math\`.
2. If there are no values, show exactly \`No data\` and nothing else.
3. Otherwise show exactly four lines:

\`\`\`text
Mean: 5.67
Median: 5.5
Rounded up: 6
Spread: 2.07
\`\`\`

Where:

- \`Mean\` is \`statistics.mean\`, shown to **two** decimal places.
- \`Median\` is \`statistics.median\`, shown exactly as Python prints it, with no formatting.
- \`Rounded up\` is the mean passed through \`math.ceil\`.
- \`Spread\` is \`statistics.stdev\`, shown to **two** decimal places.

## Example

Given \`4 8 6 5 3 8\`, the output is the four lines above.

Given an empty line, the output is:

\`\`\`text
No data
\`\`\`

## Guidance

Guard the empty case before you call any statistics function. They raise \`StatisticsError\` on an empty list.

\`stdev\` needs at least two values. You may assume that the input, when it is not empty, always holds at least two.

## Constraints

Do not work out the mean, the median, or the standard deviation by hand. Use the library.`,
          starterCode: `import math
import statistics

values = [int(part) for part in input().split()]
`,
          hint: "Guard with if not values: print(\"No data\"), and put the rest in the else branch. Format with {statistics.mean(values):.2f}, and pass the mean to math.ceil for the rounded line.",
          tests: [
            {
              input: "4 8 6 5 3 8\n",
              expectedOutput: "Mean: 5.67\nMedian: 5.5\nRounded up: 6\nSpread: 2.07",
              description: "An ordinary set of measurements gives all four statistics",
            },
            {
              input: "\n",
              expectedOutput: "No data",
              description: "Empty input is guarded before any statistics function is called",
            },
            {
              input: "10 20\n",
              expectedOutput: "Mean: 15.00\nMedian: 15.0\nRounded up: 15\nSpread: 7.07",
              description: "Two values give a whole mean that still shows two decimal places",
            },
            {
              input: "1 2 3 4\n",
              expectedOutput: "Mean: 2.50\nMedian: 2.5\nRounded up: 3\nSpread: 1.29",
              description: "An even count gives a median that sits between two values",
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
      "Making values that cannot be predicted, and then making them predictable again for testing.",
      [
        {
          type: "lesson",
          title: "The random Module",
          description: "Producing random values, and why they are not really random.",
          instructions: `## Making random values

\`random\` produces values that look unpredictable:

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

\`randint(a, b)\` gives a whole number from \`a\` to \`b\`, and it **includes both ends**. That is unlike \`range\`. \`random()\` gives a float from 0.0 up to but not including 1.0. \`choice\` picks one item from a sequence.

Two more that are often useful:

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

\`shuffle\` mixes a list **in place** and returns \`None\`. That is the same rule as \`sort\`. \`sample\` returns a new list of different items picked at random.

## Not really random

The values come from an arithmetic formula. Given a starting point, the whole sequence that follows is completely fixed. This is called a **pseudo-random** generator, and the starting point is called the **seed**.

Normally Python takes its seed from something unpredictable, so every run is different. But you can set the seed yourself:

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

Run that a thousand times and it gives \`82\` then \`15\` every single time. The seed decides everything.

> **Key idea**
> Random values come from a formula with a starting point. Fix the seed and the whole sequence is fixed, which turns unpredictable code into code you can test.

## Why this matters for testing

A program that uses randomness with no seed cannot be checked by comparing its output, because the output changes on every run. That is a real problem, because the parts of a program that use randomness are often exactly the parts most worth testing.

Setting the seed solves it. Every exercise in this course that uses \`random\` sets a seed, so the results can be repeated.

Note one thing carefully. The *same* seed gives the same sequence within one version of Python, and that is what makes these exercises work. Across major versions the formula can change, so a seeded sequence is a testing tool, not a permanent promise.

## Where to set the seed

Set it once, at the start of the program:

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

Setting the seed inside \`roll_dice\` would reset the generator on every call, so every call would give the same sequence. That is a quiet bug which makes randomness far less random than it looks.

## Randomness at the edges

The rule from the previous lesson applies here too. A function that makes its own random values is hard to test. A function that *receives* values is easy:

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

\`score_rolls\` holds the interesting logic and no randomness at all, so you can test it with inputs you choose by hand, including the difficult ones. A thin outer layer makes the rolls and passes them in.

This is the same shape as keeping calculation apart from printing, and as taking the date as a parameter. The pattern is general: **keep the unpredictable parts at the edges and the logic in the middle.**

## A note on security

\`random\` is not suitable for anything to do with security: passwords, tokens, or keys. Its sequence can be predicted by anyone who watches enough output. Python gives you the \`secrets\` module for those uses. This will not matter for the programs in this course, but it matters a great deal in real systems, and the mistake is common.

## Summary

\`random\` gives you \`randint\`, \`random\`, \`choice\`, \`shuffle\`, and \`sample\`. The values come from a formula with a seed, so setting the seed makes a program repeatable and testable. Set the seed once at the start, and keep randomness out of the functions that hold your logic.`,
        },
        {
          type: "exercise",
          title: "Deterministic Random Sampling",
          description: "Use a fixed seed so that a program using randomness gives the same output every time.",
          instructions: `## The problem

Act out the rolling of dice and report the results. The program must give exactly the same output every time it runs.

## Input

Two lines:

1. A whole number: the seed.
2. A whole number: how many dice to roll.

## Requirements

1. Import \`random\` and call \`random.seed\` with the given seed **once**, before any rolling.
2. Roll that many dice. Each roll is a whole number from 1 to 6, both included, from \`random.randint\`.
3. Show exactly four lines:

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

Set the seed once, before the loop that makes the rolls. Setting it inside the loop would reset the generator every time and give the same number again and again.

Collect the rolls into a list first. Then work out the three summary numbers from that list with built-in functions.

## Constraints

Use \`random.randint(1, 6)\` for each roll, called once for each die, in order. The count is always at least 1.`,
          starterCode: `import random

seed = int(input())
count = int(input())
`,
          hint: "Call random.seed(seed) first, then build rolls with a loop that calls random.randint(1, 6). Use sum(), max(), and rolls.count(6) for the summary lines.",
          tests: [
            {
              input: "1\n5\n",
              expectedOutput: "Rolls: [2, 5, 1, 3, 1]\nTotal: 12\nHighest: 5\nSixes: 0",
              description: "A fixed seed gives back an exact sequence of rolls",
            },
            {
              input: "42\n3\n",
              expectedOutput: "Rolls: [6, 1, 1]\nTotal: 8\nHighest: 6\nSixes: 1",
              description: "A different seed gives a different sequence, and it can be repeated just as exactly",
            },
            {
              input: "7\n1\n",
              expectedOutput: "Rolls: [3]\nTotal: 3\nHighest: 3\nSixes: 0",
              description: "A single roll is summarised correctly",
            },
            {
              input: "3\n8\n",
              expectedOutput: "Rolls: [2, 5, 5, 2, 3, 5, 4, 6]\nTotal: 32\nHighest: 6\nSixes: 1",
              description: "A longer sequence that holds a six is counted correctly",
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
          description: "Rework a function so that its logic can be tested without any randomness.",
          instructions: `## The problem

The function in the editor makes random rolls and scores them in one step. Because it makes its own values, its result cannot be predicted, and its scoring rule cannot be tested with inputs you choose.

## Your task

Split it, so that the logic can be tested.

## Requirements

1. Define \`score_rolls(rolls: list[int]) -> int\`, which takes a list of rolls and **returns** a score. It must hold no randomness at all. The scoring rule is: the total of the rolls, plus 10 extra points for each six.
2. Define \`generate_rolls(count: int) -> list[int]\`, which returns a list of \`count\` random rolls from 1 to 6, using \`random.randint\`.
3. Read a seed and a count, set the seed once, make the rolls, and show exactly two lines:

\`\`\`text
Rolls: [2, 5, 1, 3, 1]
Score: 12
\`\`\`

## Examples

Given seed \`1\` and count \`5\`, the output is the two lines above.

Given seed \`3\` and count \`8\`, the rolls hold one six, so the score is the total plus 10.

## Guidance

The point of the split is that \`score_rolls\` can now be checked directly. Before you submit, call it yourself with \`[6]\` and check that you get 16, and with \`[1, 2]\` and check that you get 3. That takes ten seconds, and it removes the function from your list of suspects.

## Why this matters

Once the logic is kept apart from the randomness, the scoring rule can be tested completely, with inputs you choose by hand. That includes the interesting cases, such as all sixes or an empty list, and you could not produce any of those reliably by rolling dice.

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
          hint: "generate_rolls builds and returns the list. score_rolls loops over a list it is given, adding each value, plus 10 when the value is a six. In the main code: set the seed, call rolls = generate_rolls(count), then print both lines.",
          tests: [
            {
              input: "1\n5\n",
              expectedOutput: "Rolls: [2, 5, 1, 3, 1]\nScore: 12",
              description: "Rolls with no sixes score their plain total",
            },
            {
              input: "3\n8\n",
              expectedOutput: "Rolls: [2, 5, 5, 2, 3, 5, 4, 6]\nScore: 42",
              description: "Each six adds ten extra points to the total",
            },
            {
              input: "42\n3\n",
              expectedOutput: "Rolls: [6, 1, 1]\nScore: 18",
              description: "A six at the start is scored with its bonus",
            },
            {
              input: "9\n1\n",
              expectedOutput: "Rolls: [4]\nScore: 4",
              description: "A single roll gives a score equal to its own value",
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
      "Splitting a program across files, and what happens when one file is imported.",
      [
        {
          type: "lesson",
          title: "Creating a Module",
          description: "Turning a file of functions into something that other files can use.",
          instructions: `## Any file is a module

There is nothing special about a module. Any \`.py\` file can be imported by another file.

Suppose a file named \`durations.py\` holds this:

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

Another file in the same folder can then use it:

\`\`\`text
import durations

print(durations.format_duration(75))
print(durations.MINUTES_PER_HOUR)
\`\`\`

which would show:

\`\`\`text
1h 15m
60
\`\`\`

Notice that these two blocks are shown as plain text, not as runnable examples, because they describe two separate files. The browser environment used by this course runs one program at a time, so you cannot make a second file here. The idea still matters, and it is exactly how you will arrange programs on your own machine.

## The name you import

The module name is the filename without \`.py\`. A file called \`durations.py\` is imported as \`durations\`.

This has one practical result that is worth knowing before it bites you. **Never name a file after a standard library module.** A file called \`random.py\` in your project folder will be found before the real \`random\` module, and every import of \`random\` anywhere in your program will get your file instead. The errors that follow make no sense at all. The same is true of \`math.py\`, \`json.py\`, \`string.py\`, and any other name from the library.

## Importing runs the file

This is the key mechanism. When a module is imported, Python **runs the whole file** from top to bottom. That is how the definitions come into being: the \`def\` statements run, and they create the functions.

But every *other* statement at the top level runs too. If \`durations.py\` ended with this:

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

The guard is what lets one file be both a working program and a library that others can use. Without it, you must choose one or the other.

> **Key idea**
> Importing a module runs every top-level statement in it. Put the actions of your program inside \`main()\` under the \`__name__\` guard, so that importing gives you the functions without running the program.

## A module is imported once

Python remembers the modules it has loaded. Importing the same module several times runs the file only the first time. Later imports use what is already loaded.

So module-level code runs exactly once for each program, no matter how many files import it. That is usually what you want, and it is occasionally surprising when you expect a fresh import to pick up an edit.

## How to split a program

For a program of a few hundred lines, a sensible split is by *responsibility*:

- One module for the core logic: the pure functions that do the real work.
- One for input and output: reading files, shaping output.
- One that arranges the work and holds \`main\`.

The test of a good split is whether you can describe each file in one sentence. If the honest description of a file is "various things", it needs dividing.

Do not split too early. A program of eighty lines belongs in one file, and dividing it makes it harder to read, not easier.

## Summary

Any \`.py\` file can be imported under its filename without the extension. Importing runs the whole file, so put actions inside \`main()\` under the \`__name__\` guard. Never name a file after a standard library module. Split by responsibility, and only once a file is truly doing too much.`,
        },
        {
          type: "lesson",
          title: "Program Interfaces and the Wider Ecosystem",
          description: "Command-line arguments, packages written by other people, and what an API is.",
          instructions: `## How programs take in information

You have used \`input()\`, which asks a person for a value while the program runs. That suits programs that talk to a person, and almost nothing else.

Most command-line programs take their input as **arguments**, given when the program is started:

\`\`\`text
python report.py sessions.txt --format brief
\`\`\`

Here \`report.py\` is the program, and everything after it is an argument. The program can read them and act on them, without stopping to ask.

This matters because it lets programs be joined together. A program that reads arguments can be run automatically, run on a schedule, or chained with others. A program that stops to ask questions cannot.

## sys.argv

The raw arguments arrive as a list:

\`\`\`text
import sys

print(sys.argv)
\`\`\`

Run as \`python report.py sessions.txt brief\`, that would show:

\`\`\`text
['report.py', 'sessions.txt', 'brief']
\`\`\`

The first item is always the program name, so the real arguments start at index 1. Every item is a string, exactly as with \`input()\`, so numbers must be converted.

A program that uses \`sys.argv\` directly must check the length of the list before using an index, or it raises \`IndexError\` when arguments are missing:

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

That example stands in for \`sys.argv\` with an ordinary list, because this environment runs programs without command-line arguments. The logic is the same as the real thing.

## argparse

For anything more than one or two arguments, the standard library gives you \`argparse\`. It handles named options, default values, type conversion, error messages, and a help text that it writes for you.

Here is a sketch of how it is used:

\`\`\`text
import argparse

parser = argparse.ArgumentParser(description="Summarise study sessions.")
parser.add_argument("filename", help="the sessions file to read")
parser.add_argument("--limit", type=int, default=10, help="maximum rows to show")
args = parser.parse_args()

print(args.filename, args.limit)
\`\`\`

From that description, \`argparse\` builds a program that refuses missing arguments with a clear message, converts \`--limit\` to an integer for you, and answers \`--help\` with usage text. You write none of that.

The lesson is wider than \`argparse\` itself. When a job is common enough that a standard tool exists, the tool is nearly always better than a version you write yourself.

## Packages written by other people

The standard library is large, but it does not hold everything. The wider Python world holds hundreds of thousands of **third-party packages**, published on the Python Package Index.

They are installed with \`pip\`, Python's package installer:

\`\`\`text
pip install requests
\`\`\`

After that, \`import requests\` works in your programs.

Real projects list the packages they need in a file, usually called \`requirements.txt\`, so that anyone can install the same set:

\`\`\`text
requests==2.31.0
rich==13.7.0
\`\`\`

Naming exact versions matters. A program that works today can break tomorrow if a package it depends on changes underneath it.

**None of this is available in this course's environment**, which runs Python in your browser with the standard library only. Every exercise here can be solved without outside packages, and the validator checks that.

## Choosing a package responsibly

Adding a package is not free. Each one is code you did not write and cannot fully read, that may stop being looked after, that can carry security faults, and that must be kept up to date.

Some fair questions before you add one:

- Is it still being looked after, with recent activity?
- How widely is it used?
- How much of it do I really need? Could twenty lines of my own do the job?
- What does it depend on in turn?

Often the answer is still "use the package". Cryptography and date parsing are two areas where writing your own is a serious mistake. But the decision should be made on purpose, not by drifting into it.

## APIs, HTTP, and JSON

An **API**, an application programming interface, is an agreed way for one program to use another. The functions of a library are an API. So is a web service that answers requests over a network.

Web APIs usually work over **HTTP**, the protocol that browsers use. A program sends a request to a URL and receives a reply. The reply is usually **JSON**, a text format for structured data:

\`\`\`text
{
  "subject": "history",
  "minutes": 40,
  "tags": ["revision", "essay"]
}
\`\`\`

The shapes of JSON match Python's almost exactly. Objects become dictionaries, arrays become lists, and strings and numbers stay as they are. Python's \`json\` module converts between the two, and Module 10 covers it in full.

Network access is not available in this environment, so no exercise here makes a request. The ideas still matter. A very large part of practical programming is asking another service for data and doing something useful with the reply.

## Summary

Command-line arguments arrive in \`sys.argv\` as strings, with the program name first. \`argparse\` handles anything more complicated. Third-party packages are installed with \`pip\` and named in \`requirements.txt\`, and each one is a promise worth weighing. An API is an agreed interface between programs, and it commonly uses HTTP carrying JSON.`,
        },
        {
          type: "exercise",
          title: "Parse Simulated Command-Line Arguments",
          description: "Read an argument list the way a command-line program would.",
          instructions: `## The problem

Write the argument-handling logic of a command-line program. This environment cannot give you real command-line arguments, so the argument list is read from input instead. The logic is exactly what \`sys.argv\` would need.

## Input

One line holding the arguments separated by spaces, **including** the program name as the first item. The line is never empty.

## Requirements

Define \`parse_args(argv: list[str]) -> str\`, which returns a message:

1. If there is no argument after the program name, return \`usage: report.py FILENAME [--limit N]\`.
2. Otherwise the first argument after the program name is the filename.
3. If \`--limit\` appears, the item straight after it is the limit, and it must be a whole number. If \`--limit\` is there but nothing follows it, return \`error: --limit needs a value\`. If the value is not a whole number, return \`error: limit must be a whole number\`.
4. If \`--limit\` is missing, the limit is \`10\`.
5. When everything is valid, return \`reading FILENAME with limit N\`.

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

Use \`in\` to test whether \`--limit\` is present, and \`index\` to find where it is. Then check that another item exists before you read it. That is exactly the length check that prevents \`IndexError\`.

Use guard clauses throughout. Every failure returns at once.

## Constraints

The function must return every message. Print exactly once, outside it.`,
          starterCode: `def parse_args(argv: list[str]) -> str:
    return ""


argv = input().split()
print(parse_args(argv))
`,
          hint: "Guard on len(argv) < 2 first. Then filename = argv[1] and limit = 10. If \"--limit\" in argv: position = argv.index(\"--limit\"), guard that position + 1 < len(argv), then try int() and catch ValueError to return the message.",
          tests: [
            {
              input: "report.py sessions.txt\n",
              expectedOutput: "reading sessions.txt with limit 10",
              description: "A filename with no options uses the default limit",
            },
            {
              input: "report.py sessions.txt --limit 5\n",
              expectedOutput: "reading sessions.txt with limit 5",
              description: "A limit given by the user replaces the default",
            },
            {
              input: "report.py\n",
              expectedOutput: "usage: report.py FILENAME [--limit N]",
              description: "No filename gives the usage message",
            },
            {
              input: "report.py data.txt --limit\n",
              expectedOutput: "error: --limit needs a value",
              description: "An option at the end with no value is caught before indexing past the end",
            },
            {
              input: "report.py data.txt --limit abc\n",
              expectedOutput: "error: limit must be a whole number",
              description: "A limit that is not a number is refused with its own message",
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
          description: "Put several standard library modules together in one program that repeats exactly.",
          instructions: `## The problem

Build a study planner that shares a set of subjects across the time available, using library functions and giving output that can be repeated.

## Input

Three lines:

1. A whole number: the seed.
2. Subject names separated by spaces.
3. A whole number: the total minutes available.

## Requirements

1. Import \`random\`, \`math\`, and \`statistics\`.
2. Set the seed once, using the seed that was given.
3. Mix the subject list with \`random.shuffle\`.
4. Share out the minutes. Each subject gets the total divided by the number of subjects, rounded **down** with \`math.floor\`. Any minutes left over go to the **first** subject in the mixed order.
5. Show one line for each subject, in the mixed order:

\`\`\`text
history: 34 min
biology: 33 min
statistics: 33 min
\`\`\`

6. Then show one last line with the average share, to two decimal places:

\`\`\`text
Mean: 33.33
\`\`\`

## Example

Given seed \`5\`, subjects \`history biology statistics\`, and \`100\` minutes, the mixed order decides which subject gets the extra minute.

## Guidance

Work out the base share with \`math.floor(total / len(subjects))\`, and then the leftover as \`total - base * len(subjects)\`. Add the leftover to the first subject only.

Use \`statistics.mean\` over the list of shares for the last line.

\`random.shuffle\` changes the list in place and returns \`None\`, so call it on its own line instead of assigning its result.

## Constraints

There is always at least one subject, and the total is always at least 0.`,
          starterCode: `import math
import random
import statistics

seed = int(input())
subjects = input().split()
total = int(input())
`,
          hint: "Call random.seed(seed), then random.shuffle(subjects) on its own line. base = math.floor(total / len(subjects)), remainder = total - base * len(subjects). Build a list of shares where index 0 gets base + remainder.",
          tests: [
            {
              input: "5\nhistory biology statistics\n100\n",
              expectedOutput: "history: 34 min\nbiology: 33 min\nstatistics: 33 min\nMean: 33.33",
              description: "The extra minute goes to the first subject after mixing",
            },
            {
              input: "1\nmaths\n50\n",
              expectedOutput: "maths: 50 min\nMean: 50.00",
              description: "A single subject receives everything",
            },
            {
              input: "2\na b\n10\n",
              expectedOutput: "b: 5 min\na: 5 min\nMean: 5.00",
              description: "A total that divides evenly leaves nothing over to share",
            },
            {
              input: "9\nx y z\n0\n",
              expectedOutput: "x: 0 min\nz: 0 min\ny: 0 min\nMean: 0.00",
              description: "A total of zero shares out nothing but still lists every subject",
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

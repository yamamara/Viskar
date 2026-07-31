import { module, lesson, type ModuleSource } from "../types.ts"

const moduleThirteen: ModuleSource = module(
  "Practical Python Patterns and Capstone",
  "The idioms experienced Python programmers use daily, the practices that keep a project healthy, and a capstone built in stages.",
  [
    lesson(
      "Idiomatic Python",
      "Shorter, clearer ways to express things you already know how to do.",
      [
        {
          type: "lesson",
          title: "Comprehensions",
          description: "Building a collection from another in one expression.",
          instructions: `## The pattern being replaced

You have written this shape many times:

\`\`\`python
numbers = [1, 2, 3, 4, 5]

squares = []
for number in numbers:
    squares.append(number * number)

print(squares)
\`\`\`

\`\`\`text
[1, 4, 9, 16, 25]
\`\`\`

Four lines: create an empty list, loop, transform, append. A **list comprehension** expresses the same thing in one:

\`\`\`python
numbers = [1, 2, 3, 4, 5]
squares = [number * number for number in numbers]
print(squares)
\`\`\`

\`\`\`text
[1, 4, 9, 16, 25]
\`\`\`

Read it as: "the square of each number, for each number in numbers". The expression comes first, then the loop that supplies its values.

## Filtering

An \`if\` at the end keeps only some items:

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
evens = [number for number in numbers if number % 2 == 0]
print(evens)
\`\`\`

\`\`\`text
[2, 4, 6]
\`\`\`

Transformation and filtering combine, with the filter applied first:

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
print([number * 10 for number in numbers if number % 2 == 0])
\`\`\`

\`\`\`text
[20, 40, 60]
\`\`\`

## Dictionary and set comprehensions

The same syntax with braces builds a dictionary, when the expression is a key–value pair:

\`\`\`python
words = ["alpha", "beta", "gamma"]
lengths = {word: len(word) for word in words}
print(lengths)
\`\`\`

\`\`\`text
{'alpha': 5, 'beta': 4, 'gamma': 5}
\`\`\`

Or a set, when it is a single expression:

\`\`\`python
words = ["alpha", "beta", "gamma"]
print(sorted({len(word) for word in words}))
\`\`\`

\`\`\`text
[4, 5]
\`\`\`

Note the sorting before display: sets have no order, so printing one directly gives no guaranteed arrangement.

You have seen both forms already — in Module 5's exercises and Module 12's \`subjects\` method.

## Comprehensions over dictionaries

\`\`\`python
totals = {"history": 55, "biology": 25, "statistics": 120}

long_sessions = {name: minutes for name, minutes in totals.items() if minutes > 30}
print(long_sessions)
\`\`\`

\`\`\`text
{'history': 55, 'statistics': 120}
\`\`\`

\`.items()\` supplies pairs, which unpack into two names exactly as in a \`for\` loop.

## When not to use one

A comprehension is better when it is *shorter and clearer*. It is worse when it becomes dense:

\`\`\`python
records = [("history", 90), ("biology", 45)]

summaries = [f"{name}: {minutes // 60}h {minutes % 60}m" for name, minutes in records if minutes > 30]
print(summaries)
\`\`\`

\`\`\`text
['history: 1h 30m', 'biology: 0h 45m']
\`\`\`

That line is at the edge of readable. Anything more complicated — nested loops, a conditional expression *and* a filter, calculations spanning several steps — belongs in an ordinary loop, or should call a well-named function:

\`\`\`python
def summarise(name, minutes):
    return f"{name}: {minutes // 60}h {minutes % 60}m"


records = [("history", 90), ("biology", 45)]
print([summarise(name, minutes) for name, minutes in records if minutes > 30])
\`\`\`

\`\`\`text
['history: 1h 30m', 'biology: 0h 45m']
\`\`\`

The comprehension now says what it does, and the details live in a function with a name.

> **Key idea**
> A comprehension replaces the create-loop-append pattern. Use one when it fits on a line and reads as a sentence; use a loop when it does not.

## Comprehensions do not replace every loop

A comprehension **builds a collection**. A loop that prints, accumulates into a single value, or performs side effects should stay a loop:

\`\`\`python
names = ["ana", "raj"]
[print(name) for name in names]
\`\`\`

\`\`\`text
ana
raj
\`\`\`

That works and is poor style: it builds a list of \`None\` values purely for the side effect, then discards it. A plain \`for\` loop says what is happening.

## Summary

A comprehension builds a list, dictionary, or set from an iterable in one expression, with an optional filter. Use one when it is shorter and reads clearly; use a loop for complex logic and for anything whose purpose is a side effect rather than a collection.`,
        },
        {
          type: "lesson",
          title: "Unpacking, enumerate, and zip",
          description: "Three tools that remove index arithmetic from ordinary code.",
          instructions: `## Unpacking, revisited

Module 5 introduced unpacking a tuple into names. It extends further.

A starred name absorbs everything left over:

\`\`\`python
values = [10, 20, 30, 40, 50]
first, *middle, last = values
print(first)
print(middle)
print(last)
\`\`\`

\`\`\`text
10
[20, 30, 40]
50
\`\`\`

\`*middle\` collects the remaining items as a list. Exactly one starred name is allowed, and it may appear anywhere in the pattern.

This is a clean way to separate a header from a body:

\`\`\`python
lines = ["name,score", "ana,12", "raj,9"]
header, *rows = lines
print(header)
print(rows)
\`\`\`

\`\`\`text
name,score
['ana,12', 'raj,9']
\`\`\`

The header came out on its own and every remaining line landed in \`rows\`, whatever the number of lines. Doing the same with slicing would mean \`lines[0]\` and \`lines[1:]\`, which works but says less about the intent.

## Unpacking into function calls

A star also unpacks a collection into positional arguments:

\`\`\`python
def describe(subject, minutes):
    return f"{subject}: {minutes}m"


record = ("history", 90)
print(describe(*record))
\`\`\`

\`\`\`text
history: 90m
\`\`\`

Two stars unpack a dictionary into keyword arguments:

\`\`\`python
def describe(subject, minutes):
    return f"{subject}: {minutes}m"


record = {"subject": "biology", "minutes": 45}
print(describe(**record))
\`\`\`

\`\`\`text
biology: 45m
\`\`\`

The dictionary keys must match the parameter names exactly.

## enumerate

Module 4 introduced \`enumerate\` for position and value together:

\`\`\`python
items = ["alpha", "beta", "gamma"]

for position, item in enumerate(items, start=1):
    print(f"{position}. {item}")
\`\`\`

\`\`\`text
1. alpha
2. beta
3. gamma
\`\`\`

\`start=1\` numbers from one, which is what people expect in output. The default is zero, matching index positions.

Whenever you find yourself writing \`for i in range(len(items))\` and then using \`items[i]\`, \`enumerate\` is the better tool: it cannot go out of bounds and it names the item.

## zip

\`zip\` walks several collections together:

\`\`\`python
names = ["ana", "raj", "kim"]
scores = [12, 9, 15]

for name, score in zip(names, scores):
    print(f"{name}: {score}")
\`\`\`

\`\`\`text
ana: 12
raj: 9
kim: 15
\`\`\`

This replaces indexing into two lists at once, which is easy to get wrong and hard to read.

\`zip\` stops at the shortest input:

\`\`\`python
names = ["ana", "raj", "kim"]
scores = [12, 9]
print(list(zip(names, scores)))
\`\`\`

\`\`\`text
[('ana', 12), ('raj', 9)]
\`\`\`

\`kim\` was dropped silently. When the lists should be the same length, that silence hides a bug; \`zip(names, scores, strict=True)\` raises instead, and is worth using when equal lengths are part of your assumptions.

\`zip\` also builds a dictionary neatly:

\`\`\`python
names = ["ana", "raj"]
scores = [12, 9]
print(dict(zip(names, scores)))
\`\`\`

\`\`\`text
{'ana': 12, 'raj': 9}
\`\`\`

> **Key idea**
> \`enumerate\` when you need a position, \`zip\` when you are walking two collections together. Both remove index arithmetic, and index arithmetic is where off-by-one errors live.

## any and all

Two functions reduce a collection of Booleans to one answer:

\`\`\`python
scores = [12, 9, 15]

print(any(score > 14 for score in scores))
print(all(score > 5 for score in scores))
print(any(score > 100 for score in scores))
\`\`\`

\`\`\`text
True
True
False
\`\`\`

\`any\` is true when at least one item is; \`all\` is true when every item is.

The expression inside is a **generator expression** — a comprehension without brackets. It produces values one at a time rather than building a list, so \`any\` can stop as soon as it finds a true value.

Note that \`all\` on an empty collection is \`True\`, and \`any\` on an empty collection is \`False\`. Both follow from the definitions and both occasionally surprise.

## Sorting with keys

Module 5 introduced \`key\`. A few patterns are worth having at hand:

\`\`\`python
records = [("history", 90), ("biology", 45), ("art", 90)]

print(sorted(records, key=lambda pair: pair[1]))
print(sorted(records, key=lambda pair: (-pair[1], pair[0])))
\`\`\`

\`\`\`text
[('biology', 45), ('history', 90), ('art', 90)]
[('art', 90), ('history', 90), ('biology', 45)]
\`\`\`

The second sorts by minutes descending, then by name ascending — the tuple-key idiom used throughout this course.

\`lambda\` creates a small unnamed function. It is appropriate here because the function is trivial and used once. If the key logic needs a comment or spans more than an expression, write a named function instead.

## Summary

Starred unpacking splits a sequence into parts; \`*\` and \`**\` unpack into arguments. \`enumerate\` supplies positions and \`zip\` walks collections together, both removing index arithmetic. \`any\` and \`all\` reduce conditions over a collection. Use \`lambda\` only for trivial one-off keys.`,
        },
        {
          type: "exercise",
          title: "Rewrite Loops as Comprehensions",
          description: "Replace three verbose loops with comprehensions of the right kind.",
          instructions: `## The problem

The program in the editor builds three collections with explicit loops. Rewrite each as a comprehension without changing the output.

## Requirements

1. \`lengths\` must become a **list** comprehension.
2. \`by_length\` must become a **dictionary** comprehension.
3. \`initials\` must become a **set** comprehension.
4. The output must be unchanged.

## Expected output

\`\`\`text
Lengths: [5, 4, 5, 3]
By length: {'alpha': 5, 'gamma': 5}
Initials: ['a', 'b', 'd', 'g']
\`\`\`

## Input

One line of words separated by spaces.

## Details

- \`lengths\` is the length of every word, in order.
- \`by_length\` maps each word of length 5 or more to its length.
- \`initials\` is the set of distinct first letters, displayed sorted.

## Guidance

Take them one at a time and run after each change. That is the refactoring discipline from Module 6: small steps, verified.

The set is displayed with \`sorted()\` because sets have no order, so printing one directly would not be reproducible.

## Constraints

No \`for\` statements may remain in your program. All three collections must be built with comprehensions.`,
          starterCode: `words = input().split()

lengths = []
for word in words:
    lengths.append(len(word))

by_length = {}
for word in words:
    if len(word) >= 5:
        by_length[word] = len(word)

initials = set()
for word in words:
    initials.add(word[0])

print(f"Lengths: {lengths}")
print(f"By length: {by_length}")
print(f"Initials: {sorted(initials)}")
`,
          hint: "lengths = [len(word) for word in words]. by_length = {word: len(word) for word in words if len(word) >= 5}. initials = {word[0] for word in words}.",
          tests: [
            {
              input: "alpha beta gamma dot\n",
              expectedOutput:
                "Lengths: [5, 4, 5, 3]\nBy length: {'alpha': 5, 'gamma': 5}\nInitials: ['a', 'b', 'd', 'g']",
              description: "All three comprehensions produce the same results as the original loops",
            },
            {
              input: "one two\n",
              expectedOutput: "Lengths: [3, 3]\nBy length: {}\nInitials: ['o', 't']",
              description: "No word reaches the length threshold, leaving an empty dictionary",
            },
            {
              input: "\n",
              expectedOutput: "Lengths: []\nBy length: {}\nInitials: []",
              description: "An empty input produces three empty collections",
            },
            {
              input: "aardvark apple\n",
              expectedOutput:
                "Lengths: [8, 5]\nBy length: {'aardvark': 8, 'apple': 5}\nInitials: ['a']",
              description: "A repeated initial appears only once in the set",
            },
          ],
          solution: `words = input().split()

lengths = [len(word) for word in words]

by_length = {word: len(word) for word in words if len(word) >= 5}

initials = {word[0] for word in words}

print(f"Lengths: {lengths}")
print(f"By length: {by_length}")
print(f"Initials: {sorted(initials)}")
`,
        },
        {
          type: "exercise",
          title: "Combine Collections With zip",
          description: "Walk two lists together and reduce them with any and all.",
          instructions: `## The problem

Two lists arrive: subject names and their scores. Report on them without indexing.

## Input

Two lines:

1. Subject names separated by spaces.
2. Scores separated by spaces, as whole numbers.

The two lines may have different lengths.

## Requirements

Display exactly four lines:

\`\`\`text
Pairs: [('history', 70), ('biology', 55)]
All passing: False
Any excellent: False
Best: history
\`\`\`

Where:

1. \`Pairs\` is the list of name-and-score tuples, produced with \`zip\`. Extra items in the longer list are dropped.
2. \`All passing\` is whether every paired score is 60 or above.
3. \`Any excellent\` is whether any paired score is 85 or above.
4. \`Best\` is the name with the highest score, ties broken alphabetically, or \`none\` when there are no pairs.

## Example

Given \`history biology art\` and \`70 55\`, the output is the four lines above — \`art\` is dropped because there is no third score.

Given \`maths\` and \`90\`:

\`\`\`text
Pairs: [('maths', 90)]
All passing: True
Any excellent: True
Best: maths
\`\`\`

## Guidance

Build the pairs once with \`list(zip(names, scores))\` and reuse that list for every question.

Use \`all\` and \`any\` with generator expressions over the pairs rather than writing loops.

Remember that \`all\` of an empty collection is \`True\` and \`any\` of an empty collection is \`False\` — check that your program produces those for empty input rather than special-casing them.

## Constraints

Do not index into either list. Use \`zip\`.`,
          starterCode: `names = input().split()
scores = [int(part) for part in input().split()]
`,
          hint: "pairs = list(zip(names, scores)). Then all(score >= 60 for name, score in pairs) and any(score >= 85 for name, score in pairs). For Best, guard the empty case then use sorted(pairs, key=lambda pair: (-pair[1], pair[0]))[0][0].",
          tests: [
            {
              input: "history biology art\n70 55\n",
              expectedOutput:
                "Pairs: [('history', 70), ('biology', 55)]\nAll passing: False\nAny excellent: False\nBest: history",
              description: "The unmatched third name is dropped by zip",
            },
            {
              input: "maths\n90\n",
              expectedOutput: "Pairs: [('maths', 90)]\nAll passing: True\nAny excellent: True\nBest: maths",
              description: "A single high score satisfies both conditions",
            },
            {
              input: "\n\n",
              expectedOutput: "Pairs: []\nAll passing: True\nAny excellent: False\nBest: none",
              description: "Empty input gives the empty-collection results for all and any",
            },
            {
              input: "a b\n60 60\n",
              expectedOutput:
                "Pairs: [('a', 60), ('b', 60)]\nAll passing: True\nAny excellent: False\nBest: a",
              description: "Equal scores are broken alphabetically and the pass boundary is inclusive",
            },
          ],
          solution: `names = input().split()
scores = [int(part) for part in input().split()]

pairs = list(zip(names, scores))

print(f"Pairs: {pairs}")
print(f"All passing: {all(score >= 60 for name, score in pairs)}")
print(f"Any excellent: {any(score >= 85 for name, score in pairs)}")

if not pairs:
    best = "none"
else:
    best = sorted(pairs, key=lambda pair: (-pair[1], pair[0]))[0][0]

print(f"Best: {best}")
`,
        },
      ],
    ),

    lesson(
      "Flexible Functions and Lazy Values",
      "Functions that accept any number of arguments, and values produced on demand.",
      [
        {
          type: "lesson",
          title: "args, kwargs, and Functions as Values",
          description: "Variable argument lists, and passing functions around as data.",
          instructions: `## Accepting any number of arguments

\`*args\` collects extra positional arguments into a tuple:

\`\`\`python
def total(*values):
    return sum(values)


print(total(1, 2))
print(total(1, 2, 3, 4))
print(total())
\`\`\`

\`\`\`text
3
10
0
\`\`\`

The name \`args\` is convention; the star does the work. Inside the function, \`values\` is an ordinary tuple.

\`**kwargs\` collects extra keyword arguments into a dictionary:

\`\`\`python
def describe(name, **details):
    parts = [f"{key}={value}" for key, value in sorted(details.items())]
    return f"{name}: {', '.join(parts)}"


print(describe("session", minutes=90, subject="history"))
print(describe("session"))
\`\`\`

\`\`\`text
session: minutes=90, subject=history
session:
\`\`\`

Sorting the items makes the output deterministic regardless of the order the arguments were supplied.

Both can appear together, and the order is fixed: normal parameters, then \`*args\`, then keyword parameters, then \`**kwargs\`.

## Use them sparingly

\`*args\` and \`**kwargs\` make a function's interface invisible. A reader cannot tell what it accepts without reading the body, and editors cannot help.

They earn their place when a function genuinely accepts an arbitrary number of things — like \`print\` — or when it passes arguments through to another function. For anything else, name the parameters.

## Functions are values

A function is an object like any other. It can be assigned, stored, and passed:

\`\`\`python
def double(value):
    return value * 2


operation = double
print(operation(21))
print(type(double).__name__)
\`\`\`

\`\`\`text
42
function
\`\`\`

Note that \`operation = double\` has no parentheses. \`double\` is the function; \`double(21)\` is the result of calling it. That distinction has appeared before — \`key=len\` in Module 5 — and it is the foundation of everything in this lesson.

## Passing functions as arguments

\`\`\`python
def apply_to_all(values, operation):
    return [operation(value) for value in values]


def double(value):
    return value * 2


def square(value):
    return value * value


print(apply_to_all([1, 2, 3], double))
print(apply_to_all([1, 2, 3], square))
\`\`\`

\`\`\`text
[2, 4, 6]
[1, 4, 9]
\`\`\`

One function, two behaviours, chosen by the caller. This is exactly what \`sorted(values, key=...)\` does.

## map and filter

Two built-ins apply a function across a collection:

\`\`\`python
values = [1, 2, 3, 4]

print(list(map(str, values)))
print(list(filter(lambda value: value % 2 == 0, values)))
\`\`\`

\`\`\`text
['1', '2', '3', '4']
[2, 4]
\`\`\`

\`map\` applies a function to every item; \`filter\` keeps items for which it returns true. Both return lazy objects, so \`list()\` is needed to see the results.

In Python, a comprehension is usually preferred:

\`\`\`python
values = [1, 2, 3, 4]

print([str(value) for value in values])
print([value for value in values if value % 2 == 0])
\`\`\`

\`\`\`text
['1', '2', '3', '4']
[2, 4]
\`\`\`

The comprehensions are clearer, particularly the filter, which needs no \`lambda\`. \`map\` remains reasonable when passing an existing named function, as in \`map(str, values)\`. You should recognise both, since existing code uses them.

## Returning a function

A function can return another function:

\`\`\`python
def multiplier(factor):
    def multiply(value):
        return value * factor
    return multiply


triple = multiplier(3)
print(triple(7))
print(multiplier(10)(7))
\`\`\`

\`\`\`text
21
70
\`\`\`

The inner function remembers \`factor\` from when it was created. That captured environment makes it a **closure**.

This is worth understanding because it is the mechanism behind decorators, which the next stage covers.

> **Key idea**
> A function without parentheses is a value that can be stored and passed; with parentheses it is a call. Functions taking or returning functions let behaviour be chosen by the caller.

## Summary

\`*args\` gathers extra positional arguments into a tuple and \`**kwargs\` gathers keyword arguments into a dictionary; use both sparingly. Functions are values that can be assigned and passed. \`map\` and \`filter\` apply functions across collections, though comprehensions usually read better. A function returning a function creates a closure.`,
        },
        {
          type: "lesson",
          title: "Generators and Decorators",
          description: "Producing values on demand, and wrapping a function in extra behaviour.",
          instructions: `## Building a whole list is sometimes wasteful

\`\`\`python
def first_squares(count):
    result = []
    for number in range(1, count + 1):
        result.append(number * number)
    return result


print(first_squares(5))
\`\`\`

\`\`\`text
[1, 4, 9, 16, 25]
\`\`\`

This builds the entire list before returning. For five items that is fine. For five million it consumes a great deal of memory, and if the caller only wanted the first three, most of the work was wasted.

## yield

A function containing \`yield\` is a **generator**. It produces values one at a time, pausing between them:

\`\`\`python
def squares(count):
    for number in range(1, count + 1):
        yield number * number


for value in squares(5):
    print(value)
\`\`\`

\`\`\`text
1
4
9
16
25
\`\`\`

The difference from \`return\` is that \`yield\` **suspends** the function rather than ending it. When the next value is requested, the function resumes where it left off, with its variables intact.

Nothing runs until values are requested:

\`\`\`python
def squares(count):
    print("starting")
    for number in range(1, count + 1):
        yield number * number


generator = squares(3)
print("created, nothing has run yet")
print(list(generator))
\`\`\`

\`\`\`text
created, nothing has run yet
starting
[1, 4, 9]
\`\`\`

Calling the function produced a generator object without executing the body. Only when values were requested — by \`list()\` — did \`starting\` appear.

This is **lazy evaluation**: work happens when results are needed, not before.

## A generator can be consumed once

\`\`\`python
def squares(count):
    for number in range(1, count + 1):
        yield number * number


generator = squares(3)
print(list(generator))
print(list(generator))
\`\`\`

\`\`\`text
[1, 4, 9]
[]
\`\`\`

The second call produced nothing: the generator was exhausted. This catches people out. If you need the values twice, store them in a list.

## Generator expressions

A comprehension without brackets is a generator expression:

\`\`\`python
values = [1, 2, 3, 4, 5]

squares = (value * value for value in values)
print(sum(squares))
\`\`\`

\`\`\`text
55
\`\`\`

No list was built. \`sum\` requested values one at a time. This is what \`any\` and \`all\` receive, and why they can stop early.

Use a generator expression when feeding a function that consumes values once, and a list comprehension when you need the collection itself.

## Decorators

A **decorator** wraps a function in extra behaviour. You have used two already — \`@property\` and \`@classmethod\` — and the mechanism is the closure from the previous stage.

A decorator is a function that takes a function and returns a replacement:

\`\`\`python
def announced(function):
    def wrapper(*args, **kwargs):
        print(f"calling {function.__name__}")
        result = function(*args, **kwargs)
        print(f"finished {function.__name__}")
        return result
    return wrapper


@announced
def add(a, b):
    return a + b


print(add(2, 3))
\`\`\`

\`\`\`text
calling add
finished add
5
\`\`\`

\`@announced\` above \`def add\` means \`add = announced(add)\`. The name \`add\` now refers to \`wrapper\`, which prints, calls the original, prints again, and returns the result.

\`*args, **kwargs\` in the wrapper is exactly the case where they belong: the wrapper does not know or care what arguments the wrapped function takes, and passes them through unchanged.

## What decorators are for

Decorators add behaviour that is *orthogonal* to what a function does: timing, logging, caching, access checks, retries. Each of those would otherwise be copied into every function needing it.

The standard library provides useful ones:

\`\`\`python
from functools import cache


@cache
def slow_square(value):
    print(f"computing {value}")
    return value * value


print(slow_square(4))
print(slow_square(4))
\`\`\`

\`\`\`text
computing 4
16
16
\`\`\`

The second call returned the stored result without recomputing — the message appeared only once.

Writing decorators is beyond what most beginners need. Reading them is not: you will meet them constantly, and knowing that \`@thing\` means "replace this function with \`thing(this function)\`" is enough to make sense of nearly all of them.

> **Key idea**
> \`yield\` produces values lazily, one at a time, and the generator is exhausted after one pass. \`@decorator\` above a definition means the function is replaced by \`decorator(function)\`.

## Summary

A generator uses \`yield\` to produce values on demand rather than building a whole collection, and can be consumed only once. Generator expressions are comprehensions without brackets. A decorator replaces a function with a wrapper, adding behaviour such as logging or caching without editing the function itself.`,
        },
        {
          type: "exercise",
          title: "Write a Generator",
          description: "Produce values lazily with yield and consume them.",
          instructions: `## The problem

Write a generator that produces a running total, and use it.

## Requirements

1. Define a generator function \`running_totals(values)\` that yields the cumulative total after each value.
2. Define a function \`first_over(values, threshold)\` that returns the **first** running total exceeding \`threshold\`, or \`-1\` if none does. It must consume the generator and stop as soon as it finds one.

## Then

Read two lines: whole numbers separated by spaces, then a threshold. Display exactly two lines:

\`\`\`text
Totals: [3, 8, 12, 20]
First over 10: 12
\`\`\`

## Examples

Given \`3 5 4 8\` and \`10\`, the output is the two lines above.

Given \`1 1\` and \`100\`:

\`\`\`text
Totals: [1, 2]
First over 100: -1
\`\`\`

## Guidance

\`running_totals\` accumulates and yields inside the loop — it never builds a list.

Because a generator is exhausted after one pass, you must call \`running_totals(values)\` **twice**: once to build the list for display, and once for the search. Reusing a single generator would leave the second consumer with nothing.

In \`first_over\`, return as soon as a total exceeds the threshold. That is what makes the laziness worthwhile: the generator stops producing.

## Constraints

\`running_totals\` must use \`yield\`. It must not build or return a list.`,
          starterCode: `def running_totals(values):
    yield 0


def first_over(values, threshold):
    return -1


values = [int(part) for part in input().split()]
threshold = int(input())
`,
          hint: "In running_totals: total = 0, then for value in values: total += value and yield total. In first_over, loop over running_totals(values) and return the first total that is greater than threshold, with return -1 after the loop.",
          tests: [
            {
              input: "3 5 4 8\n10\n",
              expectedOutput: "Totals: [3, 8, 12, 20]\nFirst over 10: 12",
              description: "The first running total above the threshold is found partway through",
            },
            {
              input: "1 1\n100\n",
              expectedOutput: "Totals: [1, 2]\nFirst over 100: -1",
              description: "No total exceeds the threshold, so the sentinel is returned",
            },
            {
              input: "\n5\n",
              expectedOutput: "Totals: []\nFirst over 5: -1",
              description: "An empty input yields nothing at all",
            },
            {
              input: "20\n10\n",
              expectedOutput: "Totals: [20]\nFirst over 10: 20",
              description: "The very first total already exceeds the threshold",
            },
          ],
          solution: `def running_totals(values):
    """Yield the cumulative total after each value."""
    total = 0
    for value in values:
        total += value
        yield total


def first_over(values, threshold):
    """Return the first running total above threshold, or -1 if none is."""
    for total in running_totals(values):
        if total > threshold:
            return total
    return -1


values = [int(part) for part in input().split()]
threshold = int(input())

print(f"Totals: {list(running_totals(values))}")
print(f"First over {threshold}: {first_over(values, threshold)}")
`,
        },
        {
          type: "exercise",
          title: "Write a Simple Decorator",
          description: "Wrap a function to count how many times it is called.",
          instructions: `## The problem

Write a decorator that counts calls to the function it wraps.

## Requirements

1. Define a decorator \`counted(function)\` that returns a wrapper which:
   - Increases a call count each time it runs.
   - Passes all arguments through unchanged and returns the wrapped function's result.
   - Exposes the count as an attribute named \`calls\` on the wrapper.
2. Apply it with \`@counted\` to a function \`area(width, height)\` returning \`width * height\`.

## Then

Read lines of the form \`width height\` ending with \`end\`. For each, print the area. After \`end\`, print the call count:

\`\`\`text
6
20
Calls: 2
\`\`\`

## Example

Given \`2 3\`, \`4 5\`, \`end\`, the output is the three lines above.

Given only \`end\`:

\`\`\`text
Calls: 0
\`\`\`

## Guidance

The wrapper needs somewhere to keep the count that survives between calls. The simplest approach is to set \`wrapper.calls = 0\` after defining the wrapper and increase \`wrapper.calls\` inside it. A function is an object, so it can carry attributes.

Use \`*args, **kwargs\` in the wrapper so it works whatever arguments the wrapped function takes — this is the case where they genuinely belong.

Remember that \`@counted\` above \`def area\` means \`area = counted(area)\`, so \`area.calls\` reaches the wrapper's attribute.

## Constraints

\`area\` itself must contain no counting logic. All the counting lives in the decorator.`,
          starterCode: `def counted(function):
    return function


@counted
def area(width, height):
    return width * height


line = input()
`,
          hint: "Inside counted, define def wrapper(*args, **kwargs) that does wrapper.calls += 1 then returns function(*args, **kwargs). Set wrapper.calls = 0 before returning wrapper.",
          tests: [
            {
              input: "2 3\n4 5\nend\n",
              expectedOutput: "6\n20\nCalls: 2",
              description: "Each call is counted and the results pass through unchanged",
            },
            {
              input: "end\n",
              expectedOutput: "Calls: 0",
              description: "A decorator that is never called reports zero",
            },
            {
              input: "1 1\n1 1\n1 1\nend\n",
              expectedOutput: "1\n1\n1\nCalls: 3",
              description: "Repeated identical calls each increase the count",
            },
          ],
          solution: `def counted(function):
    """Wrap function so that the number of calls is recorded on .calls."""

    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return function(*args, **kwargs)

    wrapper.calls = 0
    return wrapper


@counted
def area(width, height):
    return width * height


line = input()
while line != "end":
    width, height = line.split()
    print(area(int(width), int(height)))
    line = input()

print(f"Calls: {area.calls}")
`,
        },
      ],
    ),

    lesson(
      "Working on a Project",
      "Turning a vague idea into finished software, and the responsibilities that come with it.",
      [
        {
          type: "lesson",
          title: "Requirements, Milestones, and Structure",
          description: "How to start a project that is bigger than a single function.",
          instructions: `## From idea to requirements

"Build a habit tracker" is not something you can start writing. It is a direction, not a specification.

The first step is to write down what the program must actually do, in sentences specific enough to be checked:

\`\`\`text
1. Record that a habit was completed on a given day.
2. Show how many times each habit was completed this month.
3. Show the current unbroken streak for each habit.
4. Keep the data between runs.
5. Reject a habit name that is empty or already exists.
\`\`\`

Each is testable. "Be user-friendly" is not, and would need turning into something like "reject invalid input with a message naming the problem".

Equally important is writing down what it will **not** do. Without that, a project grows without limit and is never finished:

\`\`\`text
Not in this version: reminders, multiple users, editing past entries.
\`\`\`

## Milestones

Order the requirements so that each stage produces something that *works*, rather than building all the pieces and joining them at the end:

\`\`\`text
Milestone 1: record and list habits in memory.
Milestone 2: add completion tracking and counts.
Milestone 3: save to and load from a file.
Milestone 4: add streaks.
Milestone 5: validation and error messages.
\`\`\`

After milestone 1 you have a working program that does something small. After milestone 3 you have a genuinely useful one. If you stop early, you have working software rather than half a program.

The alternative — writing all the data structures, then all the logic, then all the input and output — means nothing works until everything does, and a mistake anywhere prevents you from testing anything.

> **Key idea**
> Order the work so each milestone leaves you with a working program. Never spend a long stretch with nothing that runs.

## Structure

For a project of a few hundred lines, separate by responsibility:

\`\`\`text
habits.py       core logic: pure functions over data
storage.py      reading and writing the data file
main.py         command handling, input and output
test_habits.py  tests for the core logic
\`\`\`

The important boundary is between \`habits.py\` and everything else. Core logic should be pure functions that take data and return data — no printing, no file access, no input. That is what makes it testable, and this course has been arranging for it since Module 2.

\`main.py\` holds \`main()\` under the \`__name__\` guard, reads input, calls the logic, and prints results. It should contain almost no logic of its own.

## Working incrementally

Within a milestone, the loop is the one from Module 1, at a larger scale:

1. Write the smallest piece that could work.
2. Run it.
3. Write a test for it.
4. Move on.

Commit or save a working version whenever you have one. Being able to return to the last state that worked is worth more than any debugging technique.

## When you are stuck on design

Two questions usually unstick a design problem.

*What are the nouns?* They become your data — habits, entries, dates.

*What are the verbs?* They become your functions — record, count, summarise, save.

If a function is hard to name, it is probably doing more than one thing. If a piece of data is hard to name, you may not yet understand what it represents.

## Documentation

A finished project has at least:

A **README** stating what the program does, how to run it, and what it expects. Write it early — if you cannot describe the program in a paragraph, the design is not settled.

**Docstrings** on anything whose behaviour is not obvious from its name, recording decisions rather than restating the code.

**Comments** where a choice would otherwise look arbitrary.

Documentation written at the end is written badly, because by then everything seems obvious to you. It will not seem obvious to a reader, or to you in six months.

## Summary

Turn a direction into specific, checkable requirements, and state what is out of scope. Order the work into milestones that each leave a working program. Separate pure logic from input, output, and storage. Save working versions often, and write documentation as you go.`,
        },
        {
          type: "lesson",
          title: "Responsible Software",
          description: "Consequences of the programs you write, and habits that reduce harm.",
          instructions: `## Programs affect people

A program that miscalculates a total produces a wrong number. A program used to decide who receives a service produces a wrong outcome for a person. The code is the same kind of thing; the consequences are not.

This is not a separate topic from correctness. It is what correctness is *for*.

## Data belongs to people

Any program handling personal information carries obligations, and a few principles cover most situations.

**Collect only what you need.** Data you never collected cannot be leaked, misused, or subpoenaed. A habit tracker does not need a date of birth.

**Keep it only while you need it.** Data kept indefinitely is data that will eventually be exposed.

**Do not store secrets in source code.** Passwords and keys in a file that gets shared or committed to version control are a common and serious mistake. Keep them in configuration outside the code — which is why this course's application keeps its credentials in a separate environment file that never appears in the source.

**Be honest about what you collect.** People should not be surprised by what a program records about them.

## Failure has consequences

Module 7 argued for failing fast on the grounds that it makes debugging easier. There is a stronger argument.

A program that silently continues after an error produces output that looks correct and is not. Someone will act on it. A program that stops with a clear message produces no output, which is obviously a problem and gets fixed.

\`\`\`python
def apply_discount(price, percent):
    if not 0 <= percent <= 100:
        raise ValueError(f"percent must be between 0 and 100, got {percent}")
    return price * (1 - percent / 100)


print(apply_discount(50, 20))

try:
    apply_discount(50, 150)
except ValueError as error:
    print(f"refused: {error}")
\`\`\`

\`\`\`text
40.0
refused: percent must be between 0 and 100
\`\`\`

Without the check, a percentage of 150 would produce a negative price and no complaint. Somewhere downstream, a system would act on it.

## Correctness where it matters most

Not all code deserves the same care. Test in proportion to consequence.

A script that formats your own notes can be sloppy. Code computing someone's pay, deciding an application, or controlling a physical device cannot. The same techniques apply; the standard of thoroughness differs.

Being able to say honestly "this part is well tested and that part is not" is a professional skill. Claiming everything is fine when you have not checked is not.

## Accessibility and assumptions

Programs encode assumptions about their users, often without the author noticing. Names have varied forms and lengths; not everyone has a surname, and some names do not fit \`first last\`. Dates, addresses, and phone numbers differ by country. Not everyone reads a screen the same way.

The habit worth building is to notice when you have assumed something about people and ask whether the assumption is necessary. Often a small change early removes a barrier that would be expensive to fix later.

## Attribution and licences

Code found online is written by someone and usually carries a licence stating how it may be used. Copying without attribution, or in violation of a licence, is both a legal and an ethical problem.

The same applies to the tools that generate code. Understanding what you ship is your responsibility: code you cannot explain is code you cannot maintain, debug, or vouch for.

> **Key idea**
> Collect the minimum data, fail loudly rather than continuing with bad values, test in proportion to consequences, and understand the code you ship.

## Saying no

Occasionally the right engineering decision is to decline: to say a deadline is not achievable without cutting something that matters, or that a feature would harm the people it is aimed at.

That is easier when the reasoning is concrete. "This would store personal data we have no reason to keep, and we would be responsible for it" is a professional argument. It is more persuasive than a general objection, and it is the kind of case you will be better placed to make for having thought about it before it arises.

## Summary

Programs have consequences for people. Collect the minimum data and keep secrets out of source code. Fail loudly rather than producing plausible wrong answers. Test in proportion to consequences, question assumptions encoded about users, respect licences, and be able to explain the code you ship.`,
        },
        {
          type: "exercise",
          title: "Validate Before Acting",
          description: "Apply fail-fast validation so a program cannot produce a plausible wrong answer.",
          instructions: `## The problem

The function in the editor applies a discount. It accepts any percentage, including nonsense, and produces plausible-looking wrong answers.

## Your task

Add validation so invalid input is refused rather than silently producing a wrong price.

## Requirements

1. \`apply_discount(price, percent)\` must raise \`ValueError\` with these messages:
   - \`price must not be negative\` when \`price\` is below zero.
   - \`percent must be between 0 and 100\` when \`percent\` is outside that inclusive range.
2. Check the price first.
3. Otherwise return the discounted price.

## Then

Read lines of the form \`price percent\` ending with \`end\`. For each, print the discounted price to **two** decimal places, or \`Refused: <message>\`.

## Example

Given \`50 20\`, \`50 150\`, \`-5 10\`, \`80 0\`, \`end\`:

\`\`\`text
40.00
Refused: percent must be between 0 and 100
Refused: price must not be negative
80.00
\`\`\`

## Guidance

Both values arrive as text and must be converted. They may have decimal parts, so use \`float\`.

Catch \`ValueError\` around the call so one bad line does not stop the program. Note that a conversion failure would raise the same exception type — for this exercise the input is always numeric, but in real code you would want to distinguish the two.

## Why this matters

Without the checks, \`apply_discount(50, 150)\` returns \`-25.0\`: a negative price, produced confidently and with no complaint. That is precisely the failure mode this module argues against.`,
          starterCode: `def apply_discount(price, percent):
    return price * (1 - percent / 100)


line = input()
`,
          hint: "Add two guard clauses at the top of the function, price first, each raising ValueError with the exact message. In the loop, wrap the call in try and print f\"Refused: {error}\" in the except block.",
          tests: [
            {
              input: "50 20\n50 150\n-5 10\n80 0\nend\n",
              expectedOutput:
                "40.00\nRefused: percent must be between 0 and 100\nRefused: price must not be negative\n80.00",
              description: "Invalid inputs are refused with their own messages while valid ones are computed",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No input produces no output",
            },
            {
              input: "100 100\nend\n",
              expectedOutput: "0.00",
              description: "A full discount is valid and produces zero",
            },
            {
              input: "10 -1\nend\n",
              expectedOutput: "Refused: percent must be between 0 and 100",
              description: "A negative percentage is outside the allowed range",
            },
            {
              input: "-1 200\nend\n",
              expectedOutput: "Refused: price must not be negative",
              description: "When both are invalid the price is checked first",
            },
          ],
          solution: `def apply_discount(price, percent):
    """Return price reduced by percent.

    Raises ValueError for a negative price or a percentage outside 0 to 100,
    so that a nonsensical discount cannot produce a plausible wrong price.
    """
    if price < 0:
        raise ValueError("price must not be negative")
    if not 0 <= percent <= 100:
        raise ValueError("percent must be between 0 and 100")
    return price * (1 - percent / 100)


line = input()
while line != "end":
    price_text, percent_text = line.split()
    try:
        result = apply_discount(float(price_text), float(percent_text))
    except ValueError as error:
        print(f"Refused: {error}")
    else:
        print(f"{result:.2f}")
    line = input()
`,
        },
        {
          type: "exercise",
          title: "Turn Requirements Into Milestones",
          description: "Implement a small feature set in the order a project would build it.",
          instructions: `## The problem

A project is specified by requirements. This exercise implements three of them, in the order that keeps a working program at every step.

## The requirements

1. Record a task with a name and a priority from 1 to 3.
2. Reject a task whose name is empty, or whose priority is outside that range.
3. Report the tasks grouped by priority, highest first.

## Input

Lines of the form \`name|priority\`, ending with \`end\`.

## Requirements

1. Define \`parse_task(line)\` returning \`(name, priority)\` or raising \`ValueError\` with \`empty name\` or \`bad priority\`, checked in that order. A priority that is not a whole number also counts as \`bad priority\`.
2. Define \`group_by_priority(tasks)\` returning a dictionary mapping each priority to a list of names in the order they arrived.
3. Define \`main()\` doing all input and output, called under an \`if __name__ == "__main__":\` guard.
4. For each rejected line print \`Rejected <line> (<message>)\`.
5. Then print one line per priority present, highest first:

\`\`\`text
3: write report
2: book room, order parts
\`\`\`

Names on a line are joined with \`, \`.

## Example

Given \`write report|3\`, \`book room|2\`, \`|1\`, \`order parts|2\`, \`fix sink|9\`, \`end\`, the output is:

\`\`\`text
Rejected |1 (empty name)
Rejected fix sink|9 (bad priority)
3: write report
2: book room, order parts
\`\`\`

## Guidance

Note that priority 1 does not appear at all, because no valid task had it. Only priorities actually present are reported.

Attempt the integer conversion inside \`try\` so a non-numeric priority produces \`bad priority\` rather than an unhandled exception.

## Constraints

All printing happens in \`main\`. The other two functions return their results.`,
          starterCode: `def parse_task(line):
    raise ValueError("empty name")


def group_by_priority(tasks):
    return {}


def main():
    pass


if __name__ == "__main__":
    main()
`,
          hint: "Split on \"|\" with maxsplit 1, strip the name and guard on it being empty, then try int(raw) except ValueError: raise ValueError(\"bad priority\"), then guard the 1 to 3 range. Report with for priority in sorted(grouped, reverse=True).",
          tests: [
            {
              input: "write report|3\nbook room|2\n|1\norder parts|2\nfix sink|9\nend\n",
              expectedOutput:
                "Rejected |1 (empty name)\nRejected fix sink|9 (bad priority)\n3: write report\n2: book room, order parts",
              description: "Invalid lines are rejected and valid tasks are grouped highest priority first",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No input produces no output at all",
            },
            {
              input: "a|1\nb|1\nend\n",
              expectedOutput: "1: a, b",
              description: "Several tasks at one priority are joined in arrival order",
            },
            {
              input: "x|abc\nend\n",
              expectedOutput: "Rejected x|abc (bad priority)",
              description: "A non-numeric priority is reported as a bad priority rather than crashing",
            },
            {
              input: "solo|2\nend\n",
              expectedOutput: "2: solo",
              description: "A single task is reported on its own line",
            },
          ],
          solution: `def parse_task(line):
    """Return (name, priority) from a 'name|priority' line, or raise ValueError."""
    name, _, raw = line.partition("|")
    name = name.strip()
    if name == "":
        raise ValueError("empty name")

    try:
        priority = int(raw)
    except ValueError:
        raise ValueError("bad priority")

    if not 1 <= priority <= 3:
        raise ValueError("bad priority")

    return name, priority


def group_by_priority(tasks):
    """Return a mapping of priority to the task names recorded at it."""
    grouped = {}
    for name, priority in tasks:
        if priority not in grouped:
            grouped[priority] = []
        grouped[priority].append(name)
    return grouped


def main():
    tasks = []
    line = input()
    while line != "end":
        try:
            tasks.append(parse_task(line))
        except ValueError as error:
            print(f"Rejected {line} ({error})")
        line = input()

    grouped = group_by_priority(tasks)
    for priority in sorted(grouped, reverse=True):
        print(f"{priority}: {', '.join(grouped[priority])}")


if __name__ == "__main__":
    main()
`,
        },
      ],
    ),

    lesson(
      "Capstone Project",
      "Planning, building, testing, and documenting a complete program in stages.",
      [
        {
          type: "lesson",
          title: "The Capstone Brief",
          description: "What you will build, the themes available, and how the stages fit together.",
          instructions: `## What the capstone is

The remaining stages build one complete program, in the order a real project would be built: parse, compute, test, persist, report, document.

Each stage is graded on its own, so a mistake in one does not block the next. Together they produce a program with a \`main()\`, several helper functions, tests for the core logic, input validation, a structured collection, and file persistence.

## Choose a theme

The graded stages use a **habit tracker**, specified precisely below so that automated tests are possible. Two alternative themes are given afterwards. They have the same structure, and once you have finished the graded path, rebuilding it under another theme is the single most useful thing you can do with this course's material — the second time through is where fluency comes from.

## Theme A: habit tracker (the graded path)

Records daily completions of named habits and reports on them.

Data: each entry is a habit name and a date. The working structure is a dictionary mapping a habit name to a sorted list of dates.

Operations: record an entry; count entries per habit; find the longest run of consecutive days; save and load as JSON; produce a report.

## Theme B: reading log

Records books with page counts and reading sessions.

Data: each book has a title, a total page count, and a list of sessions, each with a date and a number of pages.

Operations: add a book; record a session; compute percentage complete; find the book with the best reading pace; save and load; report.

## Theme C: expense tracker

Records spending by category and date.

Data: each entry is a category, an amount, and a date.

Operations: record an entry; total by category; find the largest single expense; compute a monthly total; save and load; report.

## Shared requirements

Whichever theme, a finished capstone has:

**A \`main()\` function** under an \`if __name__ == "__main__":\` guard, containing all input and output and no logic.

**At least three meaningful helper functions**, each pure: taking data and returning data, with no printing or file access.

**Tests for the core logic**, covering normal, boundary, and empty cases.

**Input validation** that rejects bad input with a message naming the problem, rather than crashing or silently accepting it.

**At least one structured collection** — a dictionary of lists, or a list of dictionaries.

**Persistence** to a file, in JSON or CSV, with the data read back and used.

**Documentation**: a module docstring stating what the program does, and docstrings on any function whose behaviour is not obvious.

## The date format

All themes use dates as text in the form \`YYYY-MM-DD\`. This sorts correctly as a string, which means no date library is needed — a small design decision that removes a dependency and a class of bugs.

Two dates are consecutive when the second is the day after the first. The graded stages give you a helper for this so you need not implement calendar arithmetic.

## How to work through the stages

Each stage states its own requirements and is tested independently. Read the whole brief before starting, so you know where each piece is going.

Build each stage the way this course has recommended throughout: write the examples down first, implement the smallest thing that could work, run it, and check the output against what you expected.

## A note on finishing

Real projects are finished when they are useful, not when they are perfect. The scope here is deliberately small enough to complete. If you extend it afterwards — and you should — add one requirement at a time, keeping the program working at every step.

## Summary

The capstone builds a habit tracker in graded stages, with two alternative themes for independent practice. Every version needs \`main()\`, pure helpers, tests, validation, a structured collection, persistence, and documentation. Dates are text in \`YYYY-MM-DD\` form, which sorts correctly without a date library.`,
        },
        {
          type: "exercise",
          title: "Capstone 1: Parse and Validate Entries",
          description: "Turn raw lines into validated records, rejecting bad input with specific messages.",
          instructions: `## The problem

Build the input layer of the habit tracker.

## The record format

Each entry is a line \`habit|date\`, where the date is \`YYYY-MM-DD\`.

## Requirements

1. Define \`parse_entry(line: str) -> tuple[str, str]\` returning the habit name (stripped) and the date, and **raising** \`ValueError\` with these messages:
   - \`missing separator\` when there is no \`|\`.
   - \`empty habit\` when the habit name is blank after stripping.
   - \`bad date\` when the date is not exactly four digits, a hyphen, two digits, a hyphen, two digits.
2. Check them in that order.
3. In the main code, read lines until \`end\`. Print \`Rejected <line> (<message>)\` for each failure, and count the successes.
4. After \`end\`, print \`Accepted: 2\`.

## Example

Given:

\`\`\`text
reading|2024-07-15
|2024-07-15
exercise|15-07-2024
exercise|2024-07-16
nodate
end
\`\`\`

the output is:

\`\`\`text
Rejected |2024-07-15 (empty habit)
Rejected exercise|15-07-2024 (bad date)
Rejected nodate (missing separator)
Accepted: 2
\`\`\`

## Guidance

Use a regular expression with \`fullmatch\` for the date check — this is exactly the kind of shape question regex is for.

Split on \`|\` with a maximum of one split, so a habit name containing the separator is not silently truncated.

Use guard clauses: check, raise, move on.

## Constraints

\`parse_entry\` must raise rather than return an error value.`,
          starterCode: `import re

DATE_PATTERN = re.compile(r"\\d{4}-\\d{2}-\\d{2}")


def parse_entry(line: str) -> tuple[str, str]:
    raise ValueError("missing separator")


accepted = 0
line = input()
`,
          hint: "Guard on \"|\" not in line first. Then habit, date = line.split(\"|\", 1); guard on habit.strip() being empty; then guard on DATE_PATTERN.fullmatch(date) being None. In the loop, catch ValueError as error.",
          tests: [
            {
              input:
                "reading|2024-07-15\n|2024-07-15\nexercise|15-07-2024\nexercise|2024-07-16\nnodate\nend\n",
              expectedOutput:
                "Rejected |2024-07-15 (empty habit)\nRejected exercise|15-07-2024 (bad date)\nRejected nodate (missing separator)\nAccepted: 2",
              description: "Each kind of malformed entry is rejected with its own message",
            },
            {
              input: "end\n",
              expectedOutput: "Accepted: 0",
              description: "No entries at all reports zero accepted",
            },
            {
              input: "  reading  |2024-01-01\nend\n",
              expectedOutput: "Accepted: 1",
              description: "Surrounding whitespace in the habit name is stripped rather than rejected",
            },
            {
              input: "a|2024-1-01\nend\n",
              expectedOutput: "Rejected a|2024-1-01 (bad date)\nAccepted: 0",
              description: "A single-digit month fails the exact digit count",
            },
          ],
          solution: `import re

DATE_PATTERN = re.compile(r"\\d{4}-\\d{2}-\\d{2}")


def parse_entry(line: str) -> tuple[str, str]:
    """Return the habit name and date from a 'habit|date' line.

    Raises ValueError naming the first rule the line breaks, so that callers
    can report precisely why an entry was refused.
    """
    if "|" not in line:
        raise ValueError("missing separator")

    habit, date = line.split("|", 1)
    habit = habit.strip()
    if habit == "":
        raise ValueError("empty habit")

    if DATE_PATTERN.fullmatch(date) is None:
        raise ValueError("bad date")

    return habit, date


accepted = 0
line = input()
while line != "end":
    try:
        parse_entry(line)
    except ValueError as error:
        print(f"Rejected {line} ({error})")
    else:
        accepted += 1
    line = input()

print(f"Accepted: {accepted}")
`,
        },
        {
          type: "exercise",
          title: "Capstone 2: Group and Count",
          description: "Build the structured collection at the heart of the tracker.",
          instructions: `## The problem

Turn a list of validated entries into the program's working data structure, and report counts.

## Requirements

1. Define \`group_entries(entries: list) -> dict\` taking a list of \`(habit, date)\` tuples and returning a dictionary mapping each habit to a **sorted list of distinct dates**. Duplicate entries for the same habit and date count once.
2. Define \`counts(grouped: dict) -> list\` returning a list of \`(habit, count)\` tuples sorted by count descending, then habit name ascending.
3. Read lines of the form \`habit|date\` until \`end\`, assuming all are well formed.
4. Display one line per habit:

\`\`\`text
reading: 3 days
exercise: 2 days
\`\`\`

5. Then a total line:

\`\`\`text
Total entries: 5
\`\`\`

counting distinct habit-and-date pairs.

## Example

Given \`reading|2024-07-15\`, \`exercise|2024-07-15\`, \`reading|2024-07-16\`, \`reading|2024-07-15\`, \`exercise|2024-07-17\`, \`reading|2024-07-18\`, \`end\`, the output is the lines above.

Note that \`reading|2024-07-15\` appears twice and counts once.

## Guidance

Because dates are text in \`YYYY-MM-DD\` form, sorting them as strings gives chronological order — no date library needed.

Use a set while collecting to remove duplicates, then sort into a list. Both structures earn their place: the set for uniqueness, the list for order.

\`group_entries\` and \`counts\` must be pure: no printing, no input.

## Constraints

Duplicates must be removed. The output order is defined by \`counts\`, not by insertion.`,
          starterCode: `def group_entries(entries: list) -> dict:
    return {}


def counts(grouped: dict) -> list:
    return []


entries = []
line = input()
`,
          hint: "In group_entries, build a dict of sets first, then convert each to sorted(dates). In counts, return sorted(((habit, len(dates)) for habit, dates in grouped.items()), key=lambda pair: (-pair[1], pair[0])).",
          tests: [
            {
              input:
                "reading|2024-07-15\nexercise|2024-07-15\nreading|2024-07-16\nreading|2024-07-15\nexercise|2024-07-17\nreading|2024-07-18\nend\n",
              expectedOutput: "reading: 3 days\nexercise: 2 days\nTotal entries: 5",
              description: "Duplicate habit and date pairs are counted once",
            },
            {
              input: "end\n",
              expectedOutput: "Total entries: 0",
              description: "No entries produces only the total line",
            },
            {
              input: "a|2024-01-01\nb|2024-01-01\nend\n",
              expectedOutput: "a: 1 days\nb: 1 days\nTotal entries: 2",
              description: "Equal counts are broken alphabetically",
            },
            {
              input: "solo|2024-12-31\nsolo|2024-12-31\nend\n",
              expectedOutput: "solo: 1 days\nTotal entries: 1",
              description: "A repeated identical entry collapses to one",
            },
          ],
          solution: `def group_entries(entries: list) -> dict:
    """Return a mapping of habit to its sorted list of distinct dates."""
    collected = {}
    for habit, date in entries:
        if habit not in collected:
            collected[habit] = set()
        collected[habit].add(date)
    return {habit: sorted(dates) for habit, dates in collected.items()}


def counts(grouped: dict) -> list:
    """Return (habit, count) pairs ordered by count descending, then name."""
    pairs = [(habit, len(dates)) for habit, dates in grouped.items()]
    return sorted(pairs, key=lambda pair: (-pair[1], pair[0]))


entries = []
line = input()
while line != "end":
    habit, date = line.split("|", 1)
    entries.append((habit.strip(), date))
    line = input()

grouped = group_entries(entries)
total = 0
for habit, count in counts(grouped):
    print(f"{habit}: {count} days")
    total += count

print(f"Total entries: {total}")
`,
        },
        {
          type: "exercise",
          title: "Capstone 3: Compute Streaks",
          description: "Implement the core algorithm and cover its boundary cases.",
          instructions: `## The problem

Compute the longest run of consecutive days for each habit.

## Supplied helper

The starter code includes \`next_day(date)\`, which returns the day after a date in \`YYYY-MM-DD\` form. Use it rather than writing calendar arithmetic.

## Requirements

1. Define \`longest_streak(dates: list) -> int\` taking a **sorted list of distinct dates** and returning the length of the longest run of consecutive days. Return \`0\` for an empty list.
2. Define \`streaks(grouped: dict) -> list\` returning \`(habit, streak)\` pairs sorted by streak descending, then habit name ascending.
3. Read lines of \`habit|date\` until \`end\`, group them, and display one line per habit:

\`\`\`text
reading: streak 3
exercise: streak 1
\`\`\`

## Example

Given \`reading\` on 2024-07-15, 16, and 17, and \`exercise\` on 2024-07-15 and 2024-07-20:

\`\`\`text
reading: streak 3
exercise: streak 1
\`\`\`

\`exercise\` has two entries but they are five days apart, so its longest run is 1.

## Boundary cases to think about

- An empty list returns 0.
- A single date returns 1.
- Dates spanning a month end, such as 2024-01-31 and 2024-02-01, are consecutive.
- The longest run may be at the start, middle, or end of the list.

## Guidance

Walk the sorted dates keeping a current run length and a best-so-far, exactly as in the Module 4 checkpoint. Extend the run when the next date equals \`next_day\` of the previous one; otherwise reset the run to 1.

Update the best **inside** the loop, immediately after extending. Checking only at the end misses a run that finishes before the last date.

## Constraints

Use the supplied \`next_day\`. Both functions must be pure.`,
          starterCode: `from datetime import date, timedelta


def next_day(day: str) -> str:
    """Return the calendar day after day, both in YYYY-MM-DD form."""
    year, month, number = (int(part) for part in day.split("-"))
    return (date(year, month, number) + timedelta(days=1)).isoformat()


def longest_streak(dates: list) -> int:
    return 0


def streaks(grouped: dict) -> list:
    return []


entries = {}
line = input()
`,
          hint: "In longest_streak: guard the empty list, set best = current = 1, then loop from index 1 comparing dates[index] with next_day(dates[index - 1]), extending or resetting, and updating best each time you extend.",
          tests: [
            {
              input:
                "reading|2024-07-15\nreading|2024-07-16\nreading|2024-07-17\nexercise|2024-07-15\nexercise|2024-07-20\nend\n",
              expectedOutput: "reading: streak 3\nexercise: streak 1",
              description: "A three-day run is found and non-consecutive dates give a streak of one",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No entries produces no output",
            },
            {
              input: "a|2024-01-31\na|2024-02-01\nend\n",
              expectedOutput: "a: streak 2",
              description: "Dates spanning a month boundary are consecutive",
            },
            {
              input: "b|2024-03-01\nb|2024-03-05\nb|2024-03-06\nb|2024-03-07\nend\n",
              expectedOutput: "b: streak 3",
              description: "The longest run is at the end rather than the start",
            },
            {
              input: "c|2024-05-05\nend\n",
              expectedOutput: "c: streak 1",
              description: "A single date is a streak of one",
            },
          ],
          solution: `from datetime import date, timedelta


def next_day(day: str) -> str:
    """Return the calendar day after day, both in YYYY-MM-DD form."""
    year, month, number = (int(part) for part in day.split("-"))
    return (date(year, month, number) + timedelta(days=1)).isoformat()


def longest_streak(dates: list) -> int:
    """Return the longest run of consecutive days in a sorted date list."""
    if not dates:
        return 0

    best = 1
    current = 1
    for index in range(1, len(dates)):
        if dates[index] == next_day(dates[index - 1]):
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best


def streaks(grouped: dict) -> list:
    """Return (habit, streak) pairs ordered by streak descending, then name."""
    pairs = [(habit, longest_streak(dates)) for habit, dates in grouped.items()]
    return sorted(pairs, key=lambda pair: (-pair[1], pair[0]))


entries = {}
line = input()
while line != "end":
    habit, day = line.split("|", 1)
    habit = habit.strip()
    if habit not in entries:
        entries[habit] = set()
    entries[habit].add(day)
    line = input()

grouped = {habit: sorted(days) for habit, days in entries.items()}
for habit, streak in streaks(grouped):
    print(f"{habit}: streak {streak}")
`,
        },
        {
          type: "exercise",
          title: "Capstone 4: Test the Core Logic",
          description: "Write tests covering the algorithm's normal, boundary, and empty cases.",
          instructions: `## The problem

The \`longest_streak\` function is supplied and **contains a defect**: it fails on one particular shape of input. Find it with tests, then fix it.

## Requirements

1. Write **at least five** test functions with descriptive \`test_\` names, covering:
   - an empty list
   - a single date
   - a fully consecutive run
   - dates with a gap, where the longest run is **not** the last one
   - dates spanning a month boundary
2. Call every test.
3. Fix \`longest_streak\` so all your tests pass.
4. Print exactly \`All tests passed\`.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

Write the tests before studying the function. The failing one will tell you the shape of input that breaks it, which is faster than reading the code.

Think carefully about the fourth case. If a run of three occurs early and a run of two occurs at the end, what should the answer be, and what would a function that only checks at the very end return?

## Why this matters

This is the regression-test discipline from Module 9 applied to your own project: a test that has failed once is a test you know is real, and keeping it means the defect cannot come back unnoticed.

## Constraints

Do not change the function's signature. Passing assertions print nothing, so the only output is the final line.`,
          starterCode: `from datetime import date, timedelta


def next_day(day: str) -> str:
    """Return the calendar day after day, both in YYYY-MM-DD form."""
    year, month, number = (int(part) for part in day.split("-"))
    return (date(year, month, number) + timedelta(days=1)).isoformat()


def longest_streak(dates: list) -> int:
    if not dates:
        return 0

    current = 1
    for index in range(1, len(dates)):
        if dates[index] == next_day(dates[index - 1]):
            current += 1
        else:
            current = 1
    return current


print("All tests passed")
`,
          hint: "The function returns the final run rather than the longest, so a long run followed by a short one gives the wrong answer. Track a best variable and update it whenever current increases.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "Every test passes once the function returns the longest run rather than the last",
            },
          ],
          solution: `from datetime import date, timedelta


def next_day(day: str) -> str:
    """Return the calendar day after day, both in YYYY-MM-DD form."""
    year, month, number = (int(part) for part in day.split("-"))
    return (date(year, month, number) + timedelta(days=1)).isoformat()


def longest_streak(dates: list) -> int:
    """Return the longest run of consecutive days in a sorted date list."""
    if not dates:
        return 0

    best = 1
    current = 1
    for index in range(1, len(dates)):
        if dates[index] == next_day(dates[index - 1]):
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best


def test_longest_streak_of_no_dates_is_zero():
    assert longest_streak([]) == 0


def test_longest_streak_of_one_date_is_one():
    assert longest_streak(["2024-07-15"]) == 1


def test_longest_streak_counts_a_full_run():
    assert longest_streak(["2024-07-15", "2024-07-16", "2024-07-17"]) == 3


def test_longest_streak_ignores_a_later_shorter_run():
    dates = ["2024-03-01", "2024-03-02", "2024-03-03", "2024-03-10", "2024-03-11"]
    assert longest_streak(dates) == 3


def test_longest_streak_spans_a_month_boundary():
    assert longest_streak(["2024-01-31", "2024-02-01"]) == 2


def test_longest_streak_handles_no_consecutive_days():
    assert longest_streak(["2024-01-01", "2024-06-01"]) == 1


test_longest_streak_of_no_dates_is_zero()
test_longest_streak_of_one_date_is_one()
test_longest_streak_counts_a_full_run()
test_longest_streak_ignores_a_later_shorter_run()
test_longest_streak_spans_a_month_boundary()
test_longest_streak_handles_no_consecutive_days()

print("All tests passed")
`,
        },
        {
          type: "exercise",
          title: "Capstone 5: Save and Load",
          description: "Add persistence so the tracker's data survives between runs.",
          instructions: `## The problem

Add the storage layer: write the grouped data to a JSON file and read it back.

## Requirements

1. Define \`save(grouped: dict, path: str) -> None\` writing the dictionary as JSON with \`indent=2\` and \`sort_keys=True\`.
2. Define \`load(path: str) -> dict\` returning the loaded dictionary, or an **empty dictionary** when the file does not exist.
3. Read lines of \`habit|date\` until \`end\`, group them into a dictionary of habit to sorted distinct dates.
4. Save to \`habits.json\`, then load it back into a fresh variable.
5. Display, from the **loaded** data, one line per habit in alphabetical order:

\`\`\`text
exercise: 2024-07-15, 2024-07-17
reading: 2024-07-15, 2024-07-16
\`\`\`

6. Then a final line:

\`\`\`text
Loaded 2 habits
\`\`\`

7. Finally, demonstrate the missing-file case by calling \`load("nothing.json")\` and printing:

\`\`\`text
Missing file gives 0 habits
\`\`\`

## Example

Given \`reading|2024-07-15\`, \`exercise|2024-07-15\`, \`reading|2024-07-16\`, \`exercise|2024-07-17\`, \`end\`, the output is the four lines above.

## Guidance

\`sort_keys=True\` makes the file's contents stable regardless of insertion order, which matters whenever output is compared or stored.

\`load\` must catch \`FileNotFoundError\` rather than checking whether the file exists — the reasoning from Module 10 applies.

Join each habit's dates with \`", "\`.

## Constraints

The report must be built from the loaded data, not from the dictionary you saved. That is what proves the round trip works.`,
          starterCode: `import json


def save(grouped: dict, path: str) -> None:
    pass


def load(path: str) -> dict:
    return {}


entries = {}
line = input()
`,
          hint: "save opens the path for writing and calls json.dump(grouped, handle, indent=2, sort_keys=True). load wraps json.load in try/except FileNotFoundError returning {}. Report with for habit in sorted(loaded).",
          tests: [
            {
              input:
                "reading|2024-07-15\nexercise|2024-07-15\nreading|2024-07-16\nexercise|2024-07-17\nend\n",
              expectedOutput:
                "exercise: 2024-07-15, 2024-07-17\nreading: 2024-07-15, 2024-07-16\nLoaded 2 habits\nMissing file gives 0 habits",
              description: "Data survives the round trip and a missing file loads as empty",
            },
            {
              input: "end\n",
              expectedOutput: "Loaded 0 habits\nMissing file gives 0 habits",
              description: "An empty tracker saves and loads as an empty dictionary",
            },
            {
              input: "solo|2024-01-01\nsolo|2024-01-01\nend\n",
              expectedOutput: "solo: 2024-01-01\nLoaded 1 habits\nMissing file gives 0 habits",
              description: "A duplicated entry is stored once",
            },
          ],
          solution: `import json


def save(grouped: dict, path: str) -> None:
    """Write grouped to path as JSON with stable key ordering."""
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(grouped, handle, indent=2, sort_keys=True)


def load(path: str) -> dict:
    """Return the tracker data at path, or {} when the file does not exist."""
    try:
        with open(path, encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        return {}


entries = {}
line = input()
while line != "end":
    habit, day = line.split("|", 1)
    habit = habit.strip()
    if habit not in entries:
        entries[habit] = set()
    entries[habit].add(day)
    line = input()

grouped = {habit: sorted(days) for habit, days in entries.items()}
save(grouped, "habits.json")
loaded = load("habits.json")

for habit in sorted(loaded):
    print(f"{habit}: {', '.join(loaded[habit])}")

print(f"Loaded {len(loaded)} habits")
print(f"Missing file gives {len(load('nothing.json'))} habits")
`,
        },
        {
          type: "exercise",
          title: "Capstone 6: Assemble the Finished Program",
          description: "Bring every piece together into a documented program with a main entry point.",
          instructions: `## The problem

Assemble the capstone: parsing, validation, grouping, streaks, persistence, and reporting, in one program structured the way this course has recommended throughout.

## Requirements

1. A **module docstring** at the top of the file stating what the program does.
2. At least these functions, all pure except \`save\` and \`load\`:
   - \`parse_entry(line)\` — returns \`(habit, date)\` or raises \`ValueError\` with \`missing separator\`, \`empty habit\`, or \`bad date\`, checked in that order.
   - \`group_entries(entries)\` — returns habit to sorted distinct dates.
   - \`longest_streak(dates)\` — returns the longest consecutive run.
   - \`build_report(grouped)\` — returns a **list of strings**, one per habit, sorted by day count descending then habit name ascending.
   - \`save(grouped, path)\` and \`load(path)\` — JSON persistence, with \`load\` returning \`{}\` for a missing file.
3. A \`main()\` function containing all input and output.
4. An \`if __name__ == "__main__":\` guard.
5. A docstring on \`build_report\` stating the ordering rule.

## Behaviour

Read lines until \`end\`. For each rejected line print \`Rejected <line> (<message>)\`. Then save to \`habits.json\`, load it back, and print the report from the loaded data, followed by a summary line.

Each report line has the form:

\`\`\`text
reading: 3 days, best streak 2
\`\`\`

The summary line is:

\`\`\`text
2 habits, 5 entries
\`\`\`

## Example

Given:

\`\`\`text
reading|2024-07-15
reading|2024-07-16
reading|2024-07-19
exercise|2024-07-15
exercise|2024-07-16
bad line
exercise|
end
\`\`\`

the output is:

\`\`\`text
Rejected bad line (missing separator)
Rejected exercise| (bad date)
reading: 3 days, best streak 2
exercise: 2 days, best streak 2
2 habits, 5 entries
\`\`\`

## Guidance

Reuse your work from the earlier capstone stages. This stage is about assembly and structure, not new algorithms.

\`main\` should read as a sequence of steps: collect, group, save, load, report. If it contains loops doing real work, that work belongs in a helper.

Build the report from the loaded data, so the persistence layer is genuinely exercised.

## Constraints

All printing happens in \`main\`. Every other function returns its result.`,
          starterCode: `"""Habit tracker: records daily habit completions and reports streaks."""

import json
import re
from datetime import date, timedelta

DATE_PATTERN = re.compile(r"\\d{4}-\\d{2}-\\d{2}")


def next_day(day: str) -> str:
    """Return the calendar day after day, both in YYYY-MM-DD form."""
    year, month, number = (int(part) for part in day.split("-"))
    return (date(year, month, number) + timedelta(days=1)).isoformat()


def main() -> None:
    pass


if __name__ == "__main__":
    main()
`,
          hint: "Assemble the pieces from capstone stages 1, 2, 3 and 5, then add build_report producing f\"{habit}: {len(dates)} days, best streak {longest_streak(dates)}\" sorted by (-len(dates), habit). main collects lines, groups, saves, loads, and prints.",
          tests: [
            {
              input:
                "reading|2024-07-15\nreading|2024-07-16\nreading|2024-07-19\nexercise|2024-07-15\nexercise|2024-07-16\nbad line\nexercise|\nend\n",
              expectedOutput:
                "Rejected bad line (missing separator)\nRejected exercise| (bad date)\nreading: 3 days, best streak 2\nexercise: 2 days, best streak 2\n2 habits, 5 entries",
              description: "The assembled program validates, groups, persists, and reports correctly",
            },
            {
              input: "end\n",
              expectedOutput: "0 habits, 0 entries",
              description: "An empty run reports zeroes with no report lines",
            },
            {
              input: "a|2024-01-01\na|2024-01-02\na|2024-01-03\nend\n",
              expectedOutput: "a: 3 days, best streak 3\n1 habits, 3 entries",
              description: "A single habit with an unbroken run",
            },
            {
              input: "b|2024-02-28\nb|2024-02-29\nc|2024-05-01\nend\n",
              expectedOutput:
                "b: 2 days, best streak 2\nc: 1 days, best streak 1\n2 habits, 3 entries",
              description: "A leap-day boundary is handled and habits are ordered by day count",
            },
            {
              input: "x|2024-01-01\ny|2024-01-01\nend\n",
              expectedOutput:
                "x: 1 days, best streak 1\ny: 1 days, best streak 1\n2 habits, 2 entries",
              description: "Equal day counts are broken alphabetically",
            },
          ],
          solution: `"""Habit tracker: records daily habit completions and reports streaks."""

import json
import re
from datetime import date, timedelta

DATE_PATTERN = re.compile(r"\\d{4}-\\d{2}-\\d{2}")


def next_day(day: str) -> str:
    """Return the calendar day after day, both in YYYY-MM-DD form."""
    year, month, number = (int(part) for part in day.split("-"))
    return (date(year, month, number) + timedelta(days=1)).isoformat()


def parse_entry(line: str) -> tuple[str, str]:
    """Return the habit and date from a 'habit|date' line, or raise ValueError."""
    if "|" not in line:
        raise ValueError("missing separator")

    habit, day = line.split("|", 1)
    habit = habit.strip()
    if habit == "":
        raise ValueError("empty habit")

    if DATE_PATTERN.fullmatch(day) is None:
        raise ValueError("bad date")

    return habit, day


def group_entries(entries: list) -> dict:
    """Return a mapping of habit to its sorted list of distinct dates."""
    collected = {}
    for habit, day in entries:
        if habit not in collected:
            collected[habit] = set()
        collected[habit].add(day)
    return {habit: sorted(days) for habit, days in collected.items()}


def longest_streak(dates: list) -> int:
    """Return the longest run of consecutive days in a sorted date list."""
    if not dates:
        return 0

    best = 1
    current = 1
    for index in range(1, len(dates)):
        if dates[index] == next_day(dates[index - 1]):
            current += 1
            if current > best:
                best = current
        else:
            current = 1
    return best


def build_report(grouped: dict) -> list:
    """Return one summary line per habit.

    Habits are ordered by number of recorded days descending, with ties
    broken alphabetically, so the most active habit appears first.
    """
    ordered = sorted(grouped, key=lambda habit: (-len(grouped[habit]), habit))
    return [
        f"{habit}: {len(grouped[habit])} days, best streak {longest_streak(grouped[habit])}"
        for habit in ordered
    ]


def save(grouped: dict, path: str) -> None:
    """Write grouped to path as JSON with stable key ordering."""
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(grouped, handle, indent=2, sort_keys=True)


def load(path: str) -> dict:
    """Return the tracker data at path, or {} when the file does not exist."""
    try:
        with open(path, encoding="utf-8") as handle:
            return json.load(handle)
    except FileNotFoundError:
        return {}


def main() -> None:
    entries = []
    line = input()
    while line != "end":
        try:
            entries.append(parse_entry(line))
        except ValueError as error:
            print(f"Rejected {line} ({error})")
        line = input()

    save(group_entries(entries), "habits.json")
    loaded = load("habits.json")

    for report_line in build_report(loaded):
        print(report_line)

    total = sum(len(days) for days in loaded.values())
    print(f"{len(loaded)} habits, {total} entries")


if __name__ == "__main__":
    main()
`,
        },
      ],
    ),
  ],
)

export default moduleThirteen

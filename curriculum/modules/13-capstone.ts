import { module, lesson, type ModuleSource } from "../types.ts"

const moduleThirteen: ModuleSource = module(
  "Practical Python Patterns and Capstone",
  "The habits that experienced Python programmers use every day, the practices that keep a project healthy, and a capstone project built in stages.",
  [
    lesson(
      "Idiomatic Python",
      "Shorter, clearer ways to write things you already know how to do.",
      [
        {
          type: "lesson",
          title: "Comprehensions",
          description: "Building one collection from another in a single expression.",
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

Four lines: make an empty list, loop, change each value, append. A **list comprehension** says the same thing in one line:

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

An \`if\` at the end keeps only some of the items:

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
evens = [number for number in numbers if number % 2 == 0]
print(evens)
\`\`\`

\`\`\`text
[2, 4, 6]
\`\`\`

Changing values and filtering can be combined, and the filter is applied first:

\`\`\`python
numbers = [1, 2, 3, 4, 5, 6]
print([number * 10 for number in numbers if number % 2 == 0])
\`\`\`

\`\`\`text
[20, 40, 60]
\`\`\`

## Dictionary and set comprehensions

The same notation with curly brackets builds a dictionary, when the expression is a key and a value:

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

Note the sorting before display. Sets have no order, so printing one directly promises nothing about the arrangement.

You have seen both forms already, in the exercises of Module 5 and in the \`subjects\` method of Module 12.

## Comprehensions over dictionaries

\`\`\`python
totals = {"history": 55, "biology": 25, "statistics": 120}

long_sessions = {name: minutes for name, minutes in totals.items() if minutes > 30}
print(long_sessions)
\`\`\`

\`\`\`text
{'history': 55, 'statistics': 120}
\`\`\`

\`.items()\` supplies pairs, and they unpack into two names exactly as they do in a \`for\` loop.

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

That line is at the edge of what can be read comfortably. Anything more complicated — nested loops, a conditional expression *and* a filter, or a calculation with several steps — belongs in an ordinary loop, or should call a well-named function:

\`\`\`python
def summarise(name, minutes):
    return f"{name}: {minutes // 60}h {minutes % 60}m"


records = [("history", 90), ("biology", 45)]
print([summarise(name, minutes) for name, minutes in records if minutes > 30])
\`\`\`

\`\`\`text
['history: 1h 30m', 'biology: 0h 45m']
\`\`\`

Now the comprehension says what it does, and the details live in a function with a name.

> **Key idea**
> A comprehension replaces the make-loop-append pattern. Use one when it fits on a line and reads like a sentence. Use a loop when it does not.

## A comprehension does not replace every loop

A comprehension **builds a collection**. A loop that prints, that builds up a single value, or that has some other effect should stay a loop:

\`\`\`python
names = ["ana", "raj"]
[print(name) for name in names]
\`\`\`

\`\`\`text
ana
raj
\`\`\`

That works, and it is poor style. It builds a list of \`None\` values purely for the side effect, and then throws the list away. A plain \`for\` loop says what is really happening.

## Summary

A comprehension builds a list, a dictionary, or a set from something you can loop over, in one expression, with an optional filter. Use one when it is shorter and reads clearly. Use a loop for complicated logic, and for anything whose purpose is an effect rather than a collection.`,
        },
        {
          type: "lesson",
          title: "Unpacking, enumerate, and zip",
          description: "Three tools that take index arithmetic out of ordinary code.",
          instructions: `## Unpacking, once more

Module 5 showed you how to unpack a tuple into names. It goes further than that.

A name with a star in front takes everything left over:

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

\`*middle\` collects the remaining items as a list. Exactly one starred name is allowed, and it may sit anywhere in the pattern.

This is a clean way to separate a header from the body:

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

The header came out on its own, and every remaining line landed in \`rows\`, whatever the number of lines. Doing the same with slices would mean \`lines[0]\` and \`lines[1:]\`, which works but says less about what you meant.

## Unpacking into a function call

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

The keys of the dictionary must match the parameter names exactly.

## enumerate

Module 4 introduced \`enumerate\`, which gives a position and a value together:

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

\`start=1\` numbers from one, which is what people expect to see in output. The default is zero, which matches index positions.

Whenever you find yourself writing \`for i in range(len(items))\` and then using \`items[i]\`, \`enumerate\` is the better tool. It cannot go past the end, and it gives the item a name.

## zip

\`zip\` walks through several collections at the same time:

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

\`kim\` was dropped in silence. When the two lists ought to be the same length, that silence hides a bug. \`zip(names, scores, strict=True)\` raises an error instead, and it is worth using when equal lengths are part of your assumptions.

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
> Use \`enumerate\` when you need a position, and \`zip\` when you are walking two collections together. Both remove index arithmetic, and index arithmetic is where off-by-one errors live.

## any and all

Two functions turn a collection of Booleans into a single answer:

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

\`any\` is true when at least one item is true. \`all\` is true when every item is true.

The expression inside is a **generator expression**, which is a comprehension without the brackets. It produces values one at a time instead of building a list, so \`any\` can stop as soon as it finds a true value.

Note that \`all\` on an empty collection is \`True\`, and \`any\` on an empty collection is \`False\`. Both follow from the definitions, and both surprise people now and then.

## Sorting with keys

Module 5 introduced \`key\`. A few patterns are worth keeping to hand:

\`\`\`python
records = [("history", 90), ("biology", 45), ("art", 90)]

print(sorted(records, key=lambda pair: pair[1]))
print(sorted(records, key=lambda pair: (-pair[1], pair[0])))
\`\`\`

\`\`\`text
[('biology', 45), ('history', 90), ('art', 90)]
[('art', 90), ('history', 90), ('biology', 45)]
\`\`\`

The second sorts by minutes with the highest first, then by name from A to Z. That is the tuple-key pattern used all through this course.

\`lambda\` makes a small function with no name. It suits this job because the function is tiny and used once. If the key logic needs a comment, or takes more than one expression, write a named function instead.

## Summary

Starred unpacking splits a sequence into parts, and \`*\` and \`**\` unpack into arguments. \`enumerate\` gives positions and \`zip\` walks collections together, and both remove index arithmetic. \`any\` and \`all\` reduce a set of conditions to one answer. Use \`lambda\` only for tiny keys used once.`,
        },
        {
          type: "exercise",
          title: "Rewrite Loops as Comprehensions",
          description: "Replace three long loops with comprehensions of the right kind.",
          instructions: `## The problem

The program in the editor builds three collections with ordinary loops. Rewrite each one as a comprehension, without changing the output.

## Requirements

1. \`lengths\` must become a **list** comprehension.
2. \`by_length\` must become a **dictionary** comprehension.
3. \`initials\` must become a **set** comprehension.
4. The output must not change.

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
- \`by_length\` joins each word of length 5 or more to its length.
- \`initials\` is the set of different first letters, shown in sorted order.

## Guidance

Take them one at a time and run the program after each change. That is the refactoring discipline from Module 6: small steps, each one checked.

The set is shown with \`sorted()\` because sets have no order, so printing one directly would not give the same result every time.

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
              description: "All three comprehensions give the same results as the original loops",
            },
            {
              input: "one two\n",
              expectedOutput: "Lengths: [3, 3]\nBy length: {}\nInitials: ['o', 't']",
              description: "No word reaches the required length, which leaves an empty dictionary",
            },
            {
              input: "\n",
              expectedOutput: "Lengths: []\nBy length: {}\nInitials: []",
              description: "Empty input gives three empty collections",
            },
            {
              input: "aardvark apple\n",
              expectedOutput:
                "Lengths: [8, 5]\nBy length: {'aardvark': 8, 'apple': 5}\nInitials: ['a']",
              description: "A first letter that appears twice shows only once in the set",
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

Two lists arrive: subject names, and their scores. Report on them without using any index.

## Input

Two lines:

1. Subject names separated by spaces.
2. Scores separated by spaces, as whole numbers.

The two lines may hold different numbers of items.

## Requirements

Show exactly four lines:

\`\`\`text
Pairs: [('history', 70), ('biology', 55)]
All passing: False
Any excellent: False
Best: history
\`\`\`

Where:

1. \`Pairs\` is the list of name-and-score tuples, made with \`zip\`. Extra items in the longer list are dropped.
2. \`All passing\` says whether every paired score is 60 or above.
3. \`Any excellent\` says whether any paired score is 85 or above.
4. \`Best\` is the name with the highest score. Ties are settled alphabetically, and the answer is \`none\` when there are no pairs.

## Example

Given \`history biology art\` and \`70 55\`, the output is the four lines above. \`art\` is dropped because there is no third score.

Given \`maths\` and \`90\`:

\`\`\`text
Pairs: [('maths', 90)]
All passing: True
Any excellent: True
Best: maths
\`\`\`

## Guidance

Build the pairs once with \`list(zip(names, scores))\`, and use that list for every question.

Use \`all\` and \`any\` with generator expressions over the pairs, instead of writing loops.

Remember that \`all\` of an empty collection is \`True\` and \`any\` of an empty collection is \`False\`. Check that your program gives those answers for empty input, rather than writing a special case for it.

## Constraints

Do not use an index on either list. Use \`zip\`.`,
          starterCode: `names = input().split()
scores = [int(part) for part in input().split()]
`,
          hint: "pairs = list(zip(names, scores)). Then all(score >= 60 for name, score in pairs) and any(score >= 85 for name, score in pairs). For Best, guard the empty case, then use sorted(pairs, key=lambda pair: (-pair[1], pair[0]))[0][0].",
          tests: [
            {
              input: "history biology art\n70 55\n",
              expectedOutput:
                "Pairs: [('history', 70), ('biology', 55)]\nAll passing: False\nAny excellent: False\nBest: history",
              description: "The third name with no score is dropped by zip",
            },
            {
              input: "maths\n90\n",
              expectedOutput: "Pairs: [('maths', 90)]\nAll passing: True\nAny excellent: True\nBest: maths",
              description: "A single high score satisfies both conditions",
            },
            {
              input: "\n\n",
              expectedOutput: "Pairs: []\nAll passing: True\nAny excellent: False\nBest: none",
              description: "Empty input gives the empty-collection answers for all and any",
            },
            {
              input: "a b\n60 60\n",
              expectedOutput:
                "Pairs: [('a', 60), ('b', 60)]\nAll passing: True\nAny excellent: False\nBest: a",
              description: "Equal scores are settled alphabetically, and the pass mark itself counts as passing",
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
      "Functions that accept any number of arguments, and values made only when they are needed.",
      [
        {
          type: "lesson",
          title: "args, kwargs, and Functions as Values",
          description: "Argument lists that vary in length, and passing functions around as data.",
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

The name \`args\` is only a habit. The star does the work. Inside the function, \`values\` is an ordinary tuple.

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

Sorting the items makes the output the same every time, whatever order the arguments were given in.

Both can appear together, and their order is fixed: ordinary parameters, then \`*args\`, then keyword parameters, then \`**kwargs\`.

## Use them sparingly

\`*args\` and \`**kwargs\` make the interface of a function invisible. A reader cannot tell what it accepts without reading the body, and an editor cannot help either.

They earn their place when a function really does accept any number of things, as \`print\` does, or when it passes its arguments straight through to another function. For anything else, name the parameters.

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

Note that \`operation = double\` has no brackets. \`double\` is the function. \`double(21)\` is the result of calling it. You have seen this difference before, in \`key=len\` in Module 5, and it is the foundation of everything in this lesson.

## Passing a function as an argument

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

One function, two behaviours, and the caller chooses. This is exactly what \`sorted(values, key=...)\` does.

## map and filter

Two built-in functions apply a function across a collection:

\`\`\`python
values = [1, 2, 3, 4]

print(list(map(str, values)))
print(list(filter(lambda value: value % 2 == 0, values)))
\`\`\`

\`\`\`text
['1', '2', '3', '4']
[2, 4]
\`\`\`

\`map\` applies a function to every item. \`filter\` keeps the items for which it gives a true answer. Both give back lazy objects, so \`list()\` is needed to see the results.

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

The comprehensions are clearer, and especially the filter, which needs no \`lambda\`. \`map\` is still reasonable when you pass a function that already has a name, as in \`map(str, values)\`. You should recognise both forms, because existing code uses them.

## Returning a function

A function can give back another function:

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

The inner function remembers \`factor\` from the moment it was created. That remembered surrounding makes it a **closure**.

This is worth understanding, because it is the machinery behind decorators, which the next stage covers.

> **Key idea**
> A function without brackets is a value that can be stored and passed. With brackets, it is a call. Functions that take or return functions let the caller choose the behaviour.

## Summary

\`*args\` gathers extra positional arguments into a tuple, and \`**kwargs\` gathers keyword arguments into a dictionary. Use both sparingly. Functions are values that can be assigned and passed. \`map\` and \`filter\` apply functions across collections, although comprehensions usually read better. A function that returns a function creates a closure.`,
        },
        {
          type: "lesson",
          title: "Generators and Decorators",
          description: "Producing values only when they are needed, and wrapping a function in extra behaviour.",
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

This builds the entire list before it returns. For five items that is fine. For five million it uses a great deal of memory, and if the caller only wanted the first three, most of the work was wasted.

## yield

A function that holds \`yield\` is a **generator**. It produces values one at a time, and it pauses between them:

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

The difference from \`return\` is that \`yield\` **pauses** the function instead of ending it. When the next value is asked for, the function starts again from where it stopped, with its variables still in place.

Nothing runs until values are asked for:

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

Calling the function made a generator object without running the body. Only when values were asked for, by \`list()\`, did \`starting\` appear.

This is **lazy evaluation**: the work happens when the results are needed, and not before.

## A generator can be used once

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

The second call gave nothing. The generator was used up. This catches people out. If you need the values twice, keep them in a list.

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

No list was built. \`sum\` asked for values one at a time. This is what \`any\` and \`all\` receive, and it is why they can stop early.

Use a generator expression when you feed a function that uses the values once, and a list comprehension when you need the collection itself.

## Decorators

A **decorator** wraps a function in extra behaviour. You have used two already, \`@property\` and \`@classmethod\`, and the machinery is the closure from the previous stage.

A decorator is a function that takes a function and returns a replacement for it:

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

\`@announced\` above \`def add\` means \`add = announced(add)\`. The name \`add\` now refers to \`wrapper\`, which prints, calls the original function, prints again, and gives back the result.

\`*args, **kwargs\` in the wrapper is exactly the case where they belong. The wrapper does not know or care what arguments the wrapped function takes, and it passes them straight through.

## What decorators are for

Decorators add behaviour that has nothing to do with what a function actually calculates: timing, keeping a record, remembering results, checking permission, trying again after a failure. Each of those would otherwise be copied into every function that needed it.

The standard library gives you some useful ones:

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

The second call gave back the stored result without working it out again, so the message appeared only once.

Writing decorators is beyond what most beginners need. Reading them is not. You will meet them constantly, and knowing that \`@thing\` means "replace this function with \`thing(this function)\`" is enough to make sense of nearly all of them.

> **Key idea**
> \`yield\` produces values lazily, one at a time, and the generator is used up after one pass. \`@decorator\` above a definition means the function is replaced by \`decorator(function)\`.

## Summary

A generator uses \`yield\` to produce values when they are needed, instead of building a whole collection, and it can be used only once. Generator expressions are comprehensions without brackets. A decorator replaces a function with a wrapper, adding behaviour such as record-keeping or remembering results, without editing the function itself.`,
        },
        {
          type: "exercise",
          title: "Write a Generator",
          description: "Produce values lazily with yield, and use them.",
          instructions: `## The problem

Write a generator that produces a running total, and then use it.

## Requirements

1. Define a generator function \`running_totals(values)\` that yields the total so far after each value.
2. Define a function \`first_over(values, threshold)\` that returns the **first** running total greater than \`threshold\`, or \`-1\` if there is none. It must use the generator and stop as soon as it finds one.

## Then

Read two lines: whole numbers separated by spaces, then a limit. Show exactly two lines:

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

\`running_totals\` adds up and yields inside the loop. It never builds a list.

Because a generator is used up after one pass, you must call \`running_totals(values)\` **twice**: once to build the list for the display, and once for the search. Using one generator for both would leave the second reader with nothing.

In \`first_over\`, return as soon as a total goes above the limit. That is what makes the laziness worth having: the generator stops producing values.

## Constraints

\`running_totals\` must use \`yield\`. It must not build or return a list.`,
          starterCode: `def running_totals(values):
    yield 0


def first_over(values, threshold):
    return -1


values = [int(part) for part in input().split()]
threshold = int(input())
`,
          hint: "In running_totals: total = 0, then for value in values: total += value and yield total. In first_over, loop over running_totals(values) and return the first total greater than threshold, with return -1 after the loop.",
          tests: [
            {
              input: "3 5 4 8\n10\n",
              expectedOutput: "Totals: [3, 8, 12, 20]\nFirst over 10: 12",
              description: "The first running total above the limit is found part of the way through",
            },
            {
              input: "1 1\n100\n",
              expectedOutput: "Totals: [1, 2]\nFirst over 100: -1",
              description: "No total goes above the limit, so the sentinel is returned",
            },
            {
              input: "\n5\n",
              expectedOutput: "Totals: []\nFirst over 5: -1",
              description: "Empty input yields nothing at all",
            },
            {
              input: "20\n10\n",
              expectedOutput: "Totals: [20]\nFirst over 10: 20",
              description: "The very first total is already above the limit",
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
          description: "Wrap a function so that it counts how many times it is called.",
          instructions: `## The problem

Write a decorator that counts the calls to the function it wraps.

## Requirements

1. Define a decorator \`counted(function)\` that returns a wrapper which:
   - Adds one to a count of calls each time it runs.
   - Passes all arguments straight through and gives back the result of the wrapped function.
   - Makes the count available as an attribute named \`calls\` on the wrapper.
2. Apply it with \`@counted\` to a function \`area(width, height)\` that returns \`width * height\`.

## Then

Read lines of the form \`width height\`, ending with \`end\`. For each one, print the area. After \`end\`, print the number of calls:

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

The wrapper needs somewhere to keep the count that survives between calls. The simplest way is to set \`wrapper.calls = 0\` after you define the wrapper, and to add to \`wrapper.calls\` inside it. A function is an object, so it can carry attributes.

Use \`*args, **kwargs\` in the wrapper, so that it works whatever arguments the wrapped function takes. This is the case where they truly belong.

Remember that \`@counted\` above \`def area\` means \`area = counted(area)\`, so \`area.calls\` reaches the attribute on the wrapper.

## Constraints

\`area\` itself must hold no counting logic. All the counting lives in the decorator.`,
          starterCode: `def counted(function):
    return function


@counted
def area(width, height):
    return width * height


line = input()
`,
          hint: "Inside counted, define def wrapper(*args, **kwargs) that does wrapper.calls += 1 and then returns function(*args, **kwargs). Set wrapper.calls = 0 before you return wrapper.",
          tests: [
            {
              input: "2 3\n4 5\nend\n",
              expectedOutput: "6\n20\nCalls: 2",
              description: "Each call is counted, and the results pass through unchanged",
            },
            {
              input: "end\n",
              expectedOutput: "Calls: 0",
              description: "A decorated function that is never called reports zero",
            },
            {
              input: "1 1\n1 1\n1 1\nend\n",
              expectedOutput: "1\n1\n1\nCalls: 3",
              description: "The same call repeated three times raises the count each time",
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
          instructions: `## From an idea to requirements

"Build a habit tracker" is not something you can start writing. It is a direction, not a specification.

The first step is to write down what the program must actually do, in sentences exact enough to be checked:

\`\`\`text
1. Record that a habit was completed on a given day.
2. Show how many times each habit was completed this month.
3. Show the current unbroken streak for each habit.
4. Keep the data between runs.
5. Reject a habit name that is empty or already exists.
\`\`\`

Every one of those can be tested. "Be user-friendly" cannot. It would have to become something like "reject invalid input with a message that names the problem".

Just as important is writing down what the program will **not** do. Without that, a project grows for ever and is never finished:

\`\`\`text
Not in this version: reminders, multiple users, editing past entries.
\`\`\`

## Milestones

Put the requirements in an order where each stage leaves you with something that *works*. Do not build all the pieces and join them at the end:

\`\`\`text
Milestone 1: record and list habits in memory.
Milestone 2: add completion tracking and counts.
Milestone 3: save to and load from a file.
Milestone 4: add streaks.
Milestone 5: validation and error messages.
\`\`\`

After milestone 1 you have a working program that does something small. After milestone 3 you have a genuinely useful one. If you stop early, you still have working software rather than half a program.

The other way — writing all the data structures, then all the logic, then all the input and output — means that nothing works until everything does, and one mistake anywhere stops you from testing anything.

> **Key idea**
> Order the work so that every milestone leaves you with a working program. Never spend a long stretch of time with nothing that runs.

## Structure

For a project of a few hundred lines, split the files by responsibility:

\`\`\`text
habits.py       core logic: pure functions over data
storage.py      reading and writing the data file
main.py         command handling, input and output
test_habits.py  tests for the core logic
\`\`\`

The important boundary is between \`habits.py\` and everything else. The core logic should be pure functions that take data and return data, with no printing, no files, and no input. That is what makes it testable, and this course has been preparing for it since Module 2.

\`main.py\` holds \`main()\` under the \`__name__\` guard. It reads input, calls the logic, and prints the results. It should hold almost no logic of its own.

## Working in small steps

Inside a milestone, the loop is the one from Module 1, on a larger scale:

1. Write the smallest piece that could work.
2. Run it.
3. Write a test for it.
4. Move on.

Save a working version whenever you have one. Being able to go back to the last state that worked is worth more than any debugging technique.

## When you are stuck on the design

Two questions usually free a stuck design.

*What are the nouns?* They become your data: habits, entries, dates.

*What are the verbs?* They become your functions: record, count, summarise, save.

If a function is hard to name, it is probably doing more than one thing. If a piece of data is hard to name, you may not yet understand what it stands for.

## Documentation

A finished project has at least these three things.

A **README** saying what the program does, how to run it, and what it expects. Write it early. If you cannot describe the program in a paragraph, the design is not settled yet.

**Docstrings** on anything whose behaviour is not obvious from its name, recording the decisions rather than repeating the code.

**Comments** wherever a choice would otherwise look strange.

Documentation written at the end is written badly, because by then everything seems obvious to you. It will not seem obvious to a reader, or to you in six months.

## Summary

Turn a direction into exact, checkable requirements, and say what is out of scope. Order the work into milestones that each leave a working program. Keep pure logic apart from input, output, and storage. Save working versions often, and write the documentation as you go.`,
        },
        {
          type: "lesson",
          title: "Responsible Software",
          description: "What the programs you write do to people, and habits that reduce harm.",
          instructions: `## Programs affect people

A program that adds up a total wrongly produces a wrong number. A program used to decide who receives a service produces a wrong outcome for a person. The code is the same kind of thing. The consequences are not.

This is not a separate topic from correctness. It is what correctness is *for*.

## Data belongs to people

Any program that handles personal information carries duties, and a few principles cover most situations.

**Collect only what you need.** Data you never collected cannot leak, cannot be misused, and cannot be demanded from you. A habit tracker does not need a date of birth.

**Keep it only as long as you need it.** Data kept for ever is data that will eventually be exposed.

**Do not put secrets in your source code.** Passwords and keys in a file that gets shared, or added to version control, are a common and serious mistake. Keep them in configuration outside the code. That is why this course's own application keeps its credentials in a separate environment file that never appears in the source.

**Be honest about what you collect.** People should not be surprised by what a program records about them.

## Failure has consequences

Module 7 argued for failing fast because it makes debugging easier. There is a stronger argument.

A program that quietly carries on after an error produces output that looks correct and is not. Somebody will act on it. A program that stops with a clear message produces no output at all, which is obviously a problem, so it gets fixed.

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

Without the check, a percentage of 150 would give a negative price and no complaint at all. Somewhere further along, a system would act on it.

## Correctness where it matters most

Not all code deserves the same care. Test in proportion to the consequences.

A script that tidies your own notes can be rough. Code that works out someone's pay, decides an application, or controls a physical machine cannot be. The techniques are the same. The standard of thoroughness is different.

Being able to say honestly "this part is well tested and that part is not" is a professional skill. Claiming that everything is fine when you have not checked is not.

## Access and assumptions

Programs carry assumptions about their users, often without the author noticing. Names come in many forms and lengths. Not everyone has a surname, and some names do not fit \`first last\`. Dates, addresses, and telephone numbers differ from country to country. Not everyone reads a screen in the same way.

The habit worth building is to notice when you have assumed something about people, and to ask whether that assumption is necessary. Often a small change early removes a barrier that would be expensive to remove later.

## Credit and licences

Code you find online was written by somebody, and it usually carries a licence saying how it may be used. Copying it without credit, or against its licence, is both a legal and an ethical problem.

The same applies to tools that generate code. Understanding what you ship is your responsibility. Code you cannot explain is code you cannot maintain, cannot debug, and cannot stand behind.

> **Key idea**
> Collect the least data you can, fail loudly instead of carrying on with bad values, test in proportion to the consequences, and understand the code you ship.

## Saying no

Now and then the right engineering decision is to refuse: to say that a deadline cannot be met without cutting something that matters, or that a feature would harm the very people it is aimed at.

That is easier when your reasoning is concrete. "This would store personal data that we have no reason to keep, and we would be responsible for it" is a professional argument. It persuades better than a general objection, and it is the kind of case you will be better placed to make because you thought about it before it arose.

## Summary

Programs have consequences for people. Collect the least data you can, and keep secrets out of source code. Fail loudly instead of producing believable wrong answers. Test in proportion to the consequences, question the assumptions your code makes about users, respect licences, and be able to explain the code you ship.`,
        },
        {
          type: "exercise",
          title: "Validate Before Acting",
          description: "Use fail-fast checking so that a program cannot give a believable wrong answer.",
          instructions: `## The problem

The function in the editor works out a discount. It accepts any percentage, including nonsense, and it produces wrong answers that look believable.

## Your task

Add checks, so that invalid input is refused instead of quietly giving a wrong price.

## Requirements

1. \`apply_discount(price, percent)\` must raise \`ValueError\` with these messages:
   - \`price must not be negative\` when \`price\` is below zero.
   - \`percent must be between 0 and 100\` when \`percent\` falls outside that range. Both 0 and 100 are allowed.
2. Check the price first.
3. Otherwise return the reduced price.

## Then

Read lines of the form \`price percent\`, ending with \`end\`. For each one, print the reduced price to **two** decimal places, or \`Refused: <message>\`.

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

Catch \`ValueError\` around the call, so that one bad line does not stop the program. Note that a failed conversion would raise the same kind of exception. In this exercise the input is always a number, but in real code you would want to tell the two apart.

## Why this matters

Without the checks, \`apply_discount(50, 150)\` returns \`-25.0\`: a negative price, produced confidently and with no complaint. That is exactly the kind of failure this module argues against.`,
          starterCode: `def apply_discount(price, percent):
    return price * (1 - percent / 100)


line = input()
`,
          hint: "Add two guard clauses at the top of the function, the price first, each raising ValueError with the exact message. In the loop, wrap the call in try and print f\"Refused: {error}\" in the except block.",
          tests: [
            {
              input: "50 20\n50 150\n-5 10\n80 0\nend\n",
              expectedOutput:
                "40.00\nRefused: percent must be between 0 and 100\nRefused: price must not be negative\n80.00",
              description: "Invalid inputs are refused with their own messages, while valid ones are worked out",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No input gives no output",
            },
            {
              input: "100 100\nend\n",
              expectedOutput: "0.00",
              description: "A full discount is valid and gives zero",
            },
            {
              input: "10 -1\nend\n",
              expectedOutput: "Refused: percent must be between 0 and 100",
              description: "A negative percentage is outside the allowed range",
            },
            {
              input: "-1 200\nend\n",
              expectedOutput: "Refused: price must not be negative",
              description: "When both values are invalid, the price is checked first",
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
          description: "Build a small set of features in the order that a project would build them.",
          instructions: `## The problem

A project is described by its requirements. This exercise builds three of them, in the order that keeps a working program at every step.

## The requirements

1. Record a task with a name and a priority from 1 to 3.
2. Refuse a task whose name is empty, or whose priority is outside that range.
3. Report the tasks grouped by priority, with the highest first.

## Input

Lines of the form \`name|priority\`, ending with \`end\`.

## Requirements

1. Define \`parse_task(line)\`, which returns \`(name, priority)\` or raises \`ValueError\` with \`empty name\` or \`bad priority\`, checked in that order. A priority that is not a whole number also counts as \`bad priority\`.
2. Define \`group_by_priority(tasks)\`, which returns a dictionary joining each priority to a list of names, in the order they arrived.
3. Define \`main()\`, which does all the input and output, called under an \`if __name__ == "__main__":\` guard.
4. For each refused line, print \`Rejected <line> (<message>)\`.
5. Then print one line for each priority that is present, with the highest first:

\`\`\`text
3: write report
2: book room, order parts
\`\`\`

The names on one line are joined with \`, \`.

## Example

Given \`write report|3\`, \`book room|2\`, \`|1\`, \`order parts|2\`, \`fix sink|9\`, \`end\`, the output is:

\`\`\`text
Rejected |1 (empty name)
Rejected fix sink|9 (bad priority)
3: write report
2: book room, order parts
\`\`\`

## Guidance

Note that priority 1 does not appear at all, because no valid task had it. Only the priorities that are really present are reported.

Try the conversion to an integer inside \`try\`, so that a priority which is not a number gives \`bad priority\` instead of an exception nobody handles.

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
          hint: "Split on \"|\" once, strip the name and guard on it being empty, then try int(raw) except ValueError: raise ValueError(\"bad priority\"), then guard the range 1 to 3. Report with for priority in sorted(grouped, reverse=True).",
          tests: [
            {
              input: "write report|3\nbook room|2\n|1\norder parts|2\nfix sink|9\nend\n",
              expectedOutput:
                "Rejected |1 (empty name)\nRejected fix sink|9 (bad priority)\n3: write report\n2: book room, order parts",
              description: "Bad lines are refused, and valid tasks are grouped with the highest priority first",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No input gives no output at all",
            },
            {
              input: "a|1\nb|1\nend\n",
              expectedOutput: "1: a, b",
              description: "Several tasks at one priority are joined in the order they arrived",
            },
            {
              input: "x|abc\nend\n",
              expectedOutput: "Rejected x|abc (bad priority)",
              description: "A priority that is not a number is reported as a bad priority instead of crashing",
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
          description: "What you will build, the themes you can choose, and how the stages fit together.",
          instructions: `## What the capstone is

The remaining stages build one complete program, in the order that a real project would be built: read the input, work things out, test, save, report, and document.

Each stage is graded on its own, so a mistake in one does not block the next. Together they produce a program with a \`main()\`, several helper functions, tests for the core logic, checking of input, a structured collection, and data saved to a file.

## Choose a theme

The graded stages use a **habit tracker**, described exactly below so that automatic tests are possible. Two other themes are given after it. They have the same structure. Once you have finished the graded path, building it again under another theme is the single most useful thing you can do with the material in this course. The second time through is where fluency comes from.

## Theme A: habit tracker (the graded path)

It records the days on which named habits were completed, and reports on them.

Data: each entry is a habit name and a date. The working structure is a dictionary joining a habit name to a sorted list of dates.

Operations: record an entry; count the entries for each habit; find the longest run of days one after another; save and load as JSON; produce a report.

## Theme B: reading log

It records books with page counts and reading sessions.

Data: each book has a title, a total page count, and a list of sessions, each with a date and a number of pages.

Operations: add a book; record a session; work out the percentage finished; find the book with the best reading pace; save and load; report.

## Theme C: expense tracker

It records spending by category and date.

Data: each entry is a category, an amount, and a date.

Operations: record an entry; total for each category; find the largest single expense; work out a monthly total; save and load; report.

## Requirements shared by every theme

Whichever theme you choose, a finished capstone has:

**A \`main()\` function** under an \`if __name__ == "__main__":\` guard, holding all the input and output, and no logic.

**At least three useful helper functions**, each of them pure: they take data and return data, with no printing and no files.

**Tests for the core logic**, covering normal cases, boundary cases, and empty cases.

**Checking of input** that refuses bad input with a message naming the problem, instead of crashing or quietly accepting it.

**At least one structured collection**: a dictionary of lists, or a list of dictionaries.

**Saving to a file**, in JSON or CSV, with the data read back and used.

**Documentation**: a docstring at the top of the file saying what the program does, and docstrings on any function whose behaviour is not obvious.

## The date format

All the themes write dates as text in the form \`YYYY-MM-DD\`. This sorts correctly as a string, which means you need no date library. That is a small design decision, and it removes both a dependency and a family of bugs.

Two dates are consecutive when the second is the day after the first. The graded stages give you a helper for this, so you do not have to work out calendar arithmetic.

## How to work through the stages

Each stage states its own requirements and is tested on its own. Read the whole brief before you start, so that you know where each piece is going.

Build each stage the way this course has recommended throughout. Write the examples down first, build the smallest thing that could work, run it, and compare the output with what you expected.

## A note on finishing

Real projects are finished when they are useful, not when they are perfect. The scope here is deliberately small enough to complete. If you extend it afterwards, and you should, add one requirement at a time and keep the program working at every step.

## Summary

The capstone builds a habit tracker in graded stages, with two other themes for practice on your own. Every version needs \`main()\`, pure helpers, tests, checking of input, a structured collection, saving to a file, and documentation. Dates are text in \`YYYY-MM-DD\` form, which sorts correctly without a date library.`,
        },
        {
          type: "exercise",
          title: "Capstone 1: Parse and Validate Entries",
          description: "Turn raw lines into checked records, refusing bad input with exact messages.",
          instructions: `## The problem

Build the input layer of the habit tracker.

## The record format

Each entry is a line \`habit|date\`, where the date is \`YYYY-MM-DD\`.

## Requirements

1. Define \`parse_entry(line: str) -> tuple[str, str]\`, which returns the habit name, stripped, and the date, and which **raises** \`ValueError\` with these messages:
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

Use a regular expression with \`fullmatch\` for the date check. This is exactly the kind of shape question that regex is for.

Split on \`|\` at most once, so that a habit name containing the separator is not quietly cut short.

Use guard clauses: check, raise, move on.

## Constraints

\`parse_entry\` must raise an error instead of returning an error value.`,
          starterCode: `import re

DATE_PATTERN = re.compile(r"\\d{4}-\\d{2}-\\d{2}")


def parse_entry(line: str) -> tuple[str, str]:
    raise ValueError("missing separator")


accepted = 0
line = input()
`,
          hint: "Guard on \"|\" not in line first. Then habit, date = line.split(\"|\", 1), guard on habit.strip() being empty, and then guard on DATE_PATTERN.fullmatch(date) being None. In the loop, catch ValueError as error.",
          tests: [
            {
              input:
                "reading|2024-07-15\n|2024-07-15\nexercise|15-07-2024\nexercise|2024-07-16\nnodate\nend\n",
              expectedOutput:
                "Rejected |2024-07-15 (empty habit)\nRejected exercise|15-07-2024 (bad date)\nRejected nodate (missing separator)\nAccepted: 2",
              description: "Each kind of badly formed entry is refused with its own message",
            },
            {
              input: "end\n",
              expectedOutput: "Accepted: 0",
              description: "No entries at all reports zero accepted",
            },
            {
              input: "  reading  |2024-01-01\nend\n",
              expectedOutput: "Accepted: 1",
              description: "Spaces around the habit name are stripped instead of causing a refusal",
            },
            {
              input: "a|2024-1-01\nend\n",
              expectedOutput: "Rejected a|2024-1-01 (bad date)\nAccepted: 0",
              description: "A one-digit month fails the exact digit count",
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
          description: "Build the structured collection that sits at the heart of the tracker.",
          instructions: `## The problem

Turn a list of checked entries into the working data structure of the program, and report the counts.

## Requirements

1. Define \`group_entries(entries: list) -> dict\`, which takes a list of \`(habit, date)\` tuples and returns a dictionary joining each habit to a **sorted list of different dates**. Repeated entries for the same habit and date count once.
2. Define \`counts(grouped: dict) -> list\`, which returns a list of \`(habit, count)\` tuples, sorted by count with the highest first, then by habit name from A to Z.
3. Read lines of the form \`habit|date\` until \`end\`, assuming that they are all well formed.
4. Show one line for each habit:

\`\`\`text
reading: 3 days
exercise: 2 days
\`\`\`

5. Then a total line:

\`\`\`text
Total entries: 5
\`\`\`

counting the different habit-and-date pairs.

## Example

Given \`reading|2024-07-15\`, \`exercise|2024-07-15\`, \`reading|2024-07-16\`, \`reading|2024-07-15\`, \`exercise|2024-07-17\`, \`reading|2024-07-18\`, \`end\`, the output is the lines above.

Note that \`reading|2024-07-15\` appears twice and is counted once.

## Guidance

Because the dates are text in \`YYYY-MM-DD\` form, sorting them as strings puts them in time order. No date library is needed.

Use a set while you collect, to remove repeats, then sort into a list. Both structures earn their place: the set for uniqueness, the list for order.

\`group_entries\` and \`counts\` must be pure: no printing, and no input.

## Constraints

Repeats must be removed. The order of the output is decided by \`counts\`, not by the order the entries arrived.`,
          starterCode: `def group_entries(entries: list) -> dict:
    return {}


def counts(grouped: dict) -> list:
    return []


entries = []
line = input()
`,
          hint: "In group_entries, build a dictionary of sets first, then turn each set into sorted(dates). In counts, return sorted(((habit, len(dates)) for habit, dates in grouped.items()), key=lambda pair: (-pair[1], pair[0])).",
          tests: [
            {
              input:
                "reading|2024-07-15\nexercise|2024-07-15\nreading|2024-07-16\nreading|2024-07-15\nexercise|2024-07-17\nreading|2024-07-18\nend\n",
              expectedOutput: "reading: 3 days\nexercise: 2 days\nTotal entries: 5",
              description: "A habit and date pair that appears twice is counted once",
            },
            {
              input: "end\n",
              expectedOutput: "Total entries: 0",
              description: "No entries gives only the total line",
            },
            {
              input: "a|2024-01-01\nb|2024-01-01\nend\n",
              expectedOutput: "a: 1 days\nb: 1 days\nTotal entries: 2",
              description: "Equal counts are settled alphabetically",
            },
            {
              input: "solo|2024-12-31\nsolo|2024-12-31\nend\n",
              expectedOutput: "solo: 1 days\nTotal entries: 1",
              description: "The same entry given twice becomes one",
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
          description: "Build the main algorithm and cover its boundary cases.",
          instructions: `## The problem

Work out the longest run of days one after another for each habit.

## The helper you are given

The starter code holds \`next_day(date)\`, which returns the day after a date in \`YYYY-MM-DD\` form. Use it instead of writing calendar arithmetic yourself.

## Requirements

1. Define \`longest_streak(dates: list) -> int\`, which takes a **sorted list of different dates** and returns the length of the longest run of days one after another. Return \`0\` for an empty list.
2. Define \`streaks(grouped: dict) -> list\`, which returns \`(habit, streak)\` pairs sorted by streak with the longest first, then by habit name from A to Z.
3. Read lines of \`habit|date\` until \`end\`, group them, and show one line for each habit:

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

\`exercise\` has two entries, but they are five days apart, so its longest run is 1.

## Boundary cases to think about

- An empty list gives 0.
- A single date gives 1.
- Dates across the end of a month, such as 2024-01-31 and 2024-02-01, are consecutive.
- The longest run may be at the start, in the middle, or at the end of the list.

## Guidance

Walk through the sorted dates, keeping the length of the current run and the best run so far. This is exactly the shape of the Module 4 checkpoint. Make the run longer when the next date equals \`next_day\` of the one before it. Otherwise set the run back to 1.

Update the best **inside** the loop, right after you make the run longer. Checking only at the end misses a run that finished before the last date.

## Constraints

Use the \`next_day\` you were given. Both functions must be pure.`,
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
          hint: "In longest_streak: guard the empty list, set best = current = 1, then loop from index 1 comparing dates[index] with next_day(dates[index - 1]), making the run longer or resetting it, and updating best each time you make it longer.",
          tests: [
            {
              input:
                "reading|2024-07-15\nreading|2024-07-16\nreading|2024-07-17\nexercise|2024-07-15\nexercise|2024-07-20\nend\n",
              expectedOutput: "reading: streak 3\nexercise: streak 1",
              description: "A three-day run is found, and dates far apart give a streak of one",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No entries gives no output",
            },
            {
              input: "a|2024-01-31\na|2024-02-01\nend\n",
              expectedOutput: "a: streak 2",
              description: "Dates across the end of a month are consecutive",
            },
            {
              input: "b|2024-03-01\nb|2024-03-05\nb|2024-03-06\nb|2024-03-07\nend\n",
              expectedOutput: "b: streak 3",
              description: "The longest run sits at the end rather than at the start",
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
          description: "Write tests that cover the normal, boundary, and empty cases of the algorithm.",
          instructions: `## The problem

The \`longest_streak\` function is given to you, and it **holds a fault**. It fails on one particular shape of input. Find it with tests, and then fix it.

## Requirements

1. Write **at least five** test functions with clear \`test_\` names, covering:
   - an empty list
   - a single date
   - a run with no gaps at all
   - dates with a gap, where the longest run is **not** the last one
   - dates across the end of a month
2. Call every test.
3. Fix \`longest_streak\` so that all your tests pass.
4. Print exactly \`All tests passed\`.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

Write the tests before you study the function. The one that fails will show you the shape of input that breaks it, and that is faster than reading the code.

Think carefully about the fourth case. If a run of three happens early and a run of two happens at the end, what should the answer be? And what would a function that only checks at the very end return?

## Why this matters

This is the bug-test discipline from Module 9, applied to your own project. A test that has failed once is a test you know is real, and keeping it means the fault cannot come back unnoticed.

## Constraints

Do not change the parameters of the function. Passing assertions print nothing, so the only output is the final line.`,
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
          hint: "The function returns the last run instead of the longest one, so a long run followed by a short one gives the wrong answer. Keep a best variable and update it whenever current grows.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "Every test passes once the function returns the longest run instead of the last one",
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
          description: "Add saving, so that the data of the tracker survives between runs.",
          instructions: `## The problem

Add the storage layer. Write the grouped data to a JSON file and read it back.

## Requirements

1. Define \`save(grouped: dict, path: str) -> None\`, which writes the dictionary as JSON with \`indent=2\` and \`sort_keys=True\`.
2. Define \`load(path: str) -> dict\`, which returns the loaded dictionary, or an **empty dictionary** when the file does not exist.
3. Read lines of \`habit|date\` until \`end\`, and group them into a dictionary from habit to a sorted list of different dates.
4. Save to \`habits.json\`, then load it back into a new variable.
5. Show, from the **loaded** data, one line for each habit in alphabetical order:

\`\`\`text
exercise: 2024-07-15, 2024-07-17
reading: 2024-07-15, 2024-07-16
\`\`\`

6. Then one final line:

\`\`\`text
Loaded 2 habits
\`\`\`

7. Last, show the missing-file case by calling \`load("nothing.json")\` and printing:

\`\`\`text
Missing file gives 0 habits
\`\`\`

## Example

Given \`reading|2024-07-15\`, \`exercise|2024-07-15\`, \`reading|2024-07-16\`, \`exercise|2024-07-17\`, \`end\`, the output is the four lines above.

## Guidance

\`sort_keys=True\` keeps the contents of the file the same whatever order the keys were added in, and that matters whenever output is compared or stored.

\`load\` must catch \`FileNotFoundError\` instead of checking whether the file exists. The reasoning from Module 10 applies here.

Join the dates of each habit with \`", "\`.

## Constraints

The report must be built from the loaded data, not from the dictionary you saved. That is what proves the journey out and back really works.`,
          starterCode: `import json


def save(grouped: dict, path: str) -> None:
    pass


def load(path: str) -> dict:
    return {}


entries = {}
line = input()
`,
          hint: "save opens the path for writing and calls json.dump(grouped, handle, indent=2, sort_keys=True). load wraps json.load in try/except FileNotFoundError and returns {}. Report with for habit in sorted(loaded).",
          tests: [
            {
              input:
                "reading|2024-07-15\nexercise|2024-07-15\nreading|2024-07-16\nexercise|2024-07-17\nend\n",
              expectedOutput:
                "exercise: 2024-07-15, 2024-07-17\nreading: 2024-07-15, 2024-07-16\nLoaded 2 habits\nMissing file gives 0 habits",
              description: "The data survives the journey out and back, and a missing file loads as empty",
            },
            {
              input: "end\n",
              expectedOutput: "Loaded 0 habits\nMissing file gives 0 habits",
              description: "An empty tracker is saved and loaded as an empty dictionary",
            },
            {
              input: "solo|2024-01-01\nsolo|2024-01-01\nend\n",
              expectedOutput: "solo: 2024-01-01\nLoaded 1 habits\nMissing file gives 0 habits",
              description: "An entry given twice is stored once",
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

Put the capstone together: reading the input, checking it, grouping, streaks, saving, and reporting, all in one program built the way this course has recommended throughout.

## Requirements

1. A **docstring at the top of the file** saying what the program does.
2. At least these functions, all of them pure except \`save\` and \`load\`:
   - \`parse_entry(line)\` — returns \`(habit, date)\`, or raises \`ValueError\` with \`missing separator\`, \`empty habit\`, or \`bad date\`, checked in that order.
   - \`group_entries(entries)\` — returns each habit joined to its sorted list of different dates.
   - \`longest_streak(dates)\` — returns the longest run of days one after another.
   - \`build_report(grouped)\` — returns a **list of strings**, one for each habit, sorted by the number of days with the highest first, then by habit name from A to Z.
   - \`save(grouped, path)\` and \`load(path)\` — saving in JSON, with \`load\` returning \`{}\` for a missing file.
3. A \`main()\` function holding all the input and output.
4. An \`if __name__ == "__main__":\` guard.
5. A docstring on \`build_report\` stating the rule for the order.

## Behaviour

Read lines until \`end\`. For each refused line, print \`Rejected <line> (<message>)\`. Then save to \`habits.json\`, load it back, and print the report from the loaded data, followed by a summary line.

Each report line has this form:

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

Use your work from the earlier capstone stages. This stage is about putting things together and structuring them, not about new algorithms.

\`main\` should read as a list of steps: collect, group, save, load, report. If it holds loops doing real work, that work belongs in a helper.

Build the report from the loaded data, so that the storage layer is truly exercised.

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
          hint: "Put together the pieces from capstone stages 1, 2, 3, and 5, then add build_report producing f\"{habit}: {len(dates)} days, best streak {longest_streak(dates)}\" sorted by (-len(dates), habit). main collects the lines, groups, saves, loads, and prints.",
          tests: [
            {
              input:
                "reading|2024-07-15\nreading|2024-07-16\nreading|2024-07-19\nexercise|2024-07-15\nexercise|2024-07-16\nbad line\nexercise|\nend\n",
              expectedOutput:
                "Rejected bad line (missing separator)\nRejected exercise| (bad date)\nreading: 3 days, best streak 2\nexercise: 2 days, best streak 2\n2 habits, 5 entries",
              description: "The finished program checks, groups, saves, and reports correctly",
            },
            {
              input: "end\n",
              expectedOutput: "0 habits, 0 entries",
              description: "An empty run reports zeros with no report lines",
            },
            {
              input: "a|2024-01-01\na|2024-01-02\na|2024-01-03\nend\n",
              expectedOutput: "a: 3 days, best streak 3\n1 habits, 3 entries",
              description: "A single habit with a run that is never broken",
            },
            {
              input: "b|2024-02-28\nb|2024-02-29\nc|2024-05-01\nend\n",
              expectedOutput:
                "b: 2 days, best streak 2\nc: 1 days, best streak 1\n2 habits, 3 entries",
              description: "A leap day is handled, and habits are ordered by the number of days",
            },
            {
              input: "x|2024-01-01\ny|2024-01-01\nend\n",
              expectedOutput:
                "x: 1 days, best streak 1\ny: 1 days, best streak 1\n2 habits, 2 entries",
              description: "Equal day counts are settled alphabetically",
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

import { module, lesson, type ModuleSource } from "../types.ts"

const moduleThree: ModuleSource = module(
  "Decisions and Boolean Logic",
  "Comparing values, joining conditions, and writing programs that take different paths for different data.",
  [
    lesson(
      "Booleans and Comparison",
      "The type with only two values, which lies under every decision a program makes.",
      [
        {
          type: "lesson",
          title: "Comparison Produces a Boolean",
          description: "Six operators that ask questions about values, and the type of the answers.",
          instructions: `## Programs that choose

Every program so far has done exactly the same thing on every run. Real programs behave differently for different data. A program that checks a password must do one thing when the password matches, and another thing when it does not.

Before a program can choose, it needs a way to ask a question and get an answer it can act on. Comparison gives it that way.

## The comparison operators

A **comparison operator** compares two values and produces a Boolean, which is \`True\` or \`False\`:

\`\`\`python
print(5 > 3)
print(5 < 3)
print(5 >= 5)
print(5 <= 4)
print(5 == 5)
print(5 != 5)
\`\`\`

\`\`\`text
True
False
True
False
True
False
\`\`\`

\`>\` is greater than. \`<\` is less than. \`>=\` is greater than or equal to. \`<=\` is less than or equal to. \`==\` asks whether two values are equal. \`!=\` asks whether they are different.

Each of those lines is an expression that produces a value, just as \`2 + 3\` produces \`5\`. Here the value is a Boolean.

## == is not =

Nearly every beginner makes this mistake at least once.

\`=\` is assignment. It attaches a name to a value, and it changes the state of your program.

\`==\` is a question. It compares two values and produces \`True\` or \`False\`. It changes nothing.

\`\`\`python
count = 5
print(count == 5)
print(count == 6)
print(count)
\`\`\`

\`\`\`text
True
False
5
\`\`\`

The comparisons asked questions and left \`count\` alone.

Python helps you here. Writing \`if count = 5:\` gives a syntax error, not a quiet bug, because assignment is not allowed where a condition is expected. That was a choice by the designers of the language, and it is a kind one.

> **Key idea**
> One equals sign gives an order: "make this name refer to that value." Two equals signs ask a question: "are these two values the same?"

## Comparing strings

Comparison works on strings too. Equality is exact, and capital letters matter:

\`\`\`python
print("yes" == "yes")
print("Yes" == "yes")
print("yes" == "yes ")
\`\`\`

\`\`\`text
True
False
False
\`\`\`

The second is \`False\` because of the capital letter. The third is \`False\` because of a space at the end. Both of these are very common reasons why a check that "should work" does not work. When you compare text that a person typed, tidy it first:

\`\`\`python
answer = "  Yes  "
print(answer.strip().lower() == "yes")
\`\`\`

\`\`\`text
True
\`\`\`

The operators \`<\` and \`>\` also work on strings. They compare them in an order like a dictionary, using the number code of each character. Be careful: all capital letters come before all small letters, so \`"Z" < "a"\` is \`True\`. That is rarely what a person means by alphabetical order, so make both sides small letters before you compare.

## Comparing different types

\`\`\`python
print(5 == "5")
\`\`\`

\`\`\`text
False
\`\`\`

An integer is never equal to a string, even a string with the same digits. This is the \`"7"\` and \`7\` difference again, and it is why a check against input can fail without any warning:

\`\`\`python
answer = "10"
print(answer == 10)
print(int(answer) == 10)
\`\`\`

\`\`\`text
False
True
\`\`\`

## A note on equality and identity

Python has a second operator that looks similar: \`is\`.

\`==\` asks whether two values are *equal*. \`is\` asks whether two names point to *the very same object in memory*.

For now the practical rule is short. Use \`==\` to compare values, and keep \`is\` for comparing with \`None\`, as in \`if result is None:\`. Using \`is\` to compare numbers or strings seems to work sometimes and then fails without any pattern, because whether two equal values are stored as one object is a detail of the language you should not depend on.

The difference becomes truly important in Module 5, where you meet values that can be changed in place.

## A warning about comparing floats

A float cannot hold every decimal exactly, so exact equality between two calculated floats is not safe:

\`\`\`python
print(0.1 + 0.2 == 0.3)
\`\`\`

\`\`\`text
False
\`\`\`

The sum is \`0.30000000000000004\`, which is not \`0.3\`. When you must compare calculated floats, test whether the difference between them is very small, instead of testing for equality.

## Predict before you continue

What does each line show?

\`\`\`python
print(10 != 10)
print("apple" < "banana")
print(3 == 3.0)
\`\`\`

The answers are \`False\`, \`True\`, and \`True\`. The last one may surprise you. An integer and a float count as equal when they stand for the same number, even though their types are different.

## Summary

Comparison operators produce Booleans. \`=\` assigns, and \`==\` compares. String comparison is exact and cares about capital letters, so tidy text before comparing. Use \`==\` for values, and keep \`is\` for \`None\`. Do not test calculated floats for exact equality.`,
        },
        {
          type: "exercise",
          title: "Report Comparison Results",
          description: "Produce Boolean answers to several questions about two numbers.",
          instructions: `## The problem

Write a program that reads two whole numbers and reports several comparisons between them.

## Input

Two lines, each holding a whole number. Read them with \`input()\` and no prompt. The first is \`a\`, the second is \`b\`.

## Requirements

Show exactly four lines:

\`\`\`text
Equal: False
A larger: True
B at least A: False
Difference is even: True
\`\`\`

Each line ends with \`True\` or \`False\`. That word must come from a comparison. Do not type it yourself.

## The four questions

1. \`Equal:\` — are the two numbers equal?
2. \`A larger:\` — is \`a\` greater than \`b\`?
3. \`B at least A:\` — is \`b\` greater than or equal to \`a\`?
4. \`Difference is even:\` — is \`a - b\` an even number?

## Example

Given \`10\` and \`4\`, the output is the four lines above.

Given \`5\` and \`5\`, the output is:

\`\`\`text
Equal: True
A larger: False
B at least A: True
Difference is even: True
\`\`\`

## Guidance

For the fourth question, remember that a number is even exactly when dividing it by 2 leaves a remainder of zero. This works for negative differences too.

## Constraints

Do not type \`True\` or \`False\` anywhere in your program. Every Boolean must come from a comparison.`,
          starterCode: `a = int(input())
b = int(input())
`,
          hint: "Each line is an f-string that holds a comparison, for example f\"Equal: {a == b}\". For the last one, test whether (a - b) % 2 == 0.",
          tests: [
            {
              input: "10\n4\n",
              expectedOutput: "Equal: False\nA larger: True\nB at least A: False\nDifference is even: True",
              description: "Two different numbers with an even difference",
            },
            {
              input: "5\n5\n",
              expectedOutput: "Equal: True\nA larger: False\nB at least A: True\nDifference is even: True",
              description: "Equal values, where the at-least comparison must still be true",
            },
            {
              input: "3\n8\n",
              expectedOutput: "Equal: False\nA larger: False\nB at least A: True\nDifference is even: False",
              description: "A smaller first value with an odd difference",
            },
          ],
          solution: `a = int(input())
b = int(input())
print(f"Equal: {a == b}")
print(f"A larger: {a > b}")
print(f"B at least A: {b >= a}")
print(f"Difference is even: {(a - b) % 2 == 0}")
`,
        },
        {
          type: "exercise",
          title: "Compare Text Safely",
          description: "Tidy text from a user before comparing it, and report both results.",
          instructions: `## The problem

Text typed by a person rarely matches exactly. Compare two lines in two ways, the simple way and the careful way, and report the difference.

## Input

Two lines of text. Either line may have spaces around it and any mixture of capital and small letters.

## Requirements

Show exactly three lines:

\`\`\`text
Exact: False
Normalised: True
Same length: False
\`\`\`

Where:

1. \`Exact\` compares the two lines exactly as they arrived.
2. \`Normalised\` compares them after removing spaces from both ends and making both small letters.
3. \`Same length\` compares the lengths of the two lines **as they arrived**, before any tidying.

## Examples

Given \`  Yes  \` and \`yes\`, the output is the three lines above.

Given \`no\` and \`no\`:

\`\`\`text
Exact: True
Normalised: True
Same length: True
\`\`\`

## Guidance

Do the tidying once into two new variables. Do not repeat the chain of methods inside every comparison.

Every Boolean must come from a comparison. Do not type \`True\` or \`False\` anywhere.

## Why this matters

A check that "should work" and does not is very often a comparison of raw input against a clean expected value. Tidying first removes a whole family of bugs.`,
          starterCode: `first = input()
second = input()
`,
          hint: "Build clean_first = first.strip().lower() and clean_second = second.strip().lower(). Then use f-strings that hold first == second, clean_first == clean_second, and len(first) == len(second).",
          tests: [
            {
              input: "  Yes  \nyes\n",
              expectedOutput: "Exact: False\nNormalised: True\nSame length: False",
              description: "Spaces and capital letters defeat an exact comparison but not a tidied one",
            },
            {
              input: "no\nno\n",
              expectedOutput: "Exact: True\nNormalised: True\nSame length: True",
              description: "Identical text matches under both comparisons",
            },
            {
              input: "abc\nxyz\n",
              expectedOutput: "Exact: False\nNormalised: False\nSame length: True",
              description: "Different text of the same length fails both comparisons",
            },
            {
              input: "A\na\n",
              expectedOutput: "Exact: False\nNormalised: True\nSame length: True",
              description: "A capital letter alone is enough to defeat an exact comparison",
            },
          ],
          solution: `first = input()
second = input()

clean_first = first.strip().lower()
clean_second = second.strip().lower()

print(f"Exact: {first == second}")
print(f"Normalised: {clean_first == clean_second}")
print(f"Same length: {len(first) == len(second)}")
`,
        },
      ],
    ),

    lesson(
      "Choosing With if",
      "Running some instructions and skipping others, and the indentation that makes it work.",
      [
        {
          type: "lesson",
          title: "The if Statement",
          description: "Running code only sometimes, code blocks, and why indentation is part of Python.",
          instructions: `## Running code only sometimes

An \`if\` statement runs a block of code only when a condition is \`True\`:

\`\`\`python
temperature = 31

if temperature > 30:
    print("Heat warning")

print("Reading complete")
\`\`\`

\`\`\`text
Heat warning
Reading complete
\`\`\`

Change \`temperature\` to \`18\` and the output becomes only \`Reading complete\`. The indented line was skipped completely.

## The parts

\`if\` starts the statement. Then comes a **condition**: any expression that produces a Boolean, or that Python can read as one. Then a colon, which is required and easy to forget. Then, on the lines below, an indented **block**.

The block is the code that runs when the condition is \`True\`. If the condition is \`False\`, Python skips the whole block and carries on after it.

## Indentation is structure

In many languages, indentation is only a kindness to readers. In Python it is part of the language. Indentation is how you say which lines belong to the \`if\`.

\`\`\`python
score = 20

if score > 50:
    print("inside the block")
    print("also inside the block")
print("outside the block")
\`\`\`

\`\`\`text
outside the block
\`\`\`

The first two prints are indented, so they belong to the \`if\` and are skipped. The third is not indented, so it always runs.

Getting this wrong gives you a program that runs perfectly and does the wrong thing:

\`\`\`python
score = 20

if score > 50:
    print("Pass")
print("Well done")
\`\`\`

\`\`\`text
Well done
\`\`\`

\`Well done\` appears even though the score is 20, because that line was never part of the \`if\`. There is no error message. The only sign of trouble is that you have praised someone who failed.

> **Key idea**
> Indentation decides which lines belong to a block. A wrong indent is not a style problem. It changes what your program does.

Use four spaces for each level, and stay consistent. Mixing tabs and spaces gives confusing errors. This editor puts in spaces when you press Tab.

## Conditions are only expressions

The condition can be any expression that gives a Boolean. It can even be a variable that already holds one:

\`\`\`python
is_open = True

if is_open:
    print("Come in")
\`\`\`

\`\`\`text
Come in
\`\`\`

Note that \`if is_open:\` is better than \`if is_open == True:\`. The comparison adds nothing. \`is_open\` is already a Boolean, and comparing a Boolean with \`True\` gives you the same Boolean back.

## Values that count as true or false

Python accepts values that are not Booleans as conditions, and it reads them as true or false. The rules are worth knowing, because they explain some behaviour that otherwise looks strange.

These count as \`False\`: the number \`0\`, the empty string \`""\`, \`None\`, and empty collections, which you meet in Module 5. Almost everything else counts as \`True\`.

\`\`\`python
name = ""

if name:
    print("Name supplied")
else:
    print("Name is empty")
\`\`\`

\`\`\`text
Name is empty
\`\`\`

This is a genuinely useful way to ask "did I really get something?" But take care. \`if count:\` is \`False\` when \`count\` is \`0\`, and that may not be what you want. When you mean "is this zero", write \`if count == 0:\` and say so plainly.

## One if inside another

An \`if\` can hold another \`if\`, indented one level further:

\`\`\`python
logged_in = True
is_admin = False

if logged_in:
    print("Welcome")
    if is_admin:
        print("Admin tools available")
\`\`\`

\`\`\`text
Welcome
\`\`\`

The inner \`if\` is only reached when the outer condition is true. More than two levels of this quickly becomes hard to follow. A later stage in this module shows how to avoid it.

## Summary

\`if condition:\` with an indented block runs that block only when the condition is true. Indentation marks the block, and it is part of the language. Conditions are ordinary expressions, and values that are not Booleans are read as true or false by fixed rules.`,
        },
        {
          type: "lesson",
          title: "else and elif",
          description: "Choosing between several possibilities, and why the order of a chain matters.",
          instructions: `## Doing something else instead

\`else\` gives a block to run when the condition was false:

\`\`\`python
age = 15

if age >= 18:
    print("Adult ticket")
else:
    print("Concession ticket")
\`\`\`

\`\`\`text
Concession ticket
\`\`\`

Exactly one of the two blocks runs, every time. \`else\` has no condition of its own. It means "in every other case". It must line up with its \`if\`.

## More than two possibilities

\`elif\` is short for "else if". It adds more conditions:

\`\`\`python
score = 74

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(grade)
\`\`\`

\`\`\`text
C
\`\`\`

Python tests the conditions from top to bottom. It runs the block of the **first** one that is true. Everything after that is skipped, even if it would also have been true. A chain runs one block at most.

## The order is part of the logic

That "first one that is true" rule means the order of a chain carries meaning. Turn it round, and the program breaks:

\`\`\`python
score = 95

if score >= 60:
    grade = "D"
elif score >= 70:
    grade = "C"
elif score >= 80:
    grade = "B"
elif score >= 90:
    grade = "A"
else:
    grade = "F"

print(grade)
\`\`\`

\`\`\`text
D
\`\`\`

A score of 95 gets a D. The first condition, \`score >= 60\`, is true for 95, so its block runs and the rest are never looked at. No error appears. The program simply gives a D to everyone who passed.

The general lesson is this. When you write a chain of range tests, put the narrowest test first and the widest test last. Then a special case is never swallowed by a wider case written above it.

> **Key idea**
> An \`if\`/\`elif\`/\`else\` chain runs exactly one block: the first one whose condition is true. Later conditions are never even worked out, so the order is part of the logic, not a matter of taste.

## Separate ifs are not a chain

\`\`\`python
score = 95

if score >= 90:
    print("Excellent")
if score >= 70:
    print("Passed")
\`\`\`

\`\`\`text
Excellent
Passed
\`\`\`

Two separate \`if\` statements are each tested, so both blocks ran. Compare that with the chained version:

\`\`\`python
score = 95

if score >= 90:
    print("Excellent")
elif score >= 70:
    print("Passed")
\`\`\`

\`\`\`text
Excellent
\`\`\`

Only one block ran. Choose on purpose. Use a chain when the cases are alternatives. Use separate \`if\` statements when several separate things may each be true.

## Assign in the branches instead of printing

Notice that the grading example assigned to \`grade\` in each branch and printed once at the end. It did not print inside every branch. That habit pays you back. The value is now ready for anything else the program needs, and there is exactly one place where the shape of the output is decided.

## Predict before you continue

What does this show when \`value\` is \`0\`?

\`\`\`python
value = 0

if value > 0:
    print("positive")
elif value < 0:
    print("negative")
else:
    print("zero")
\`\`\`

It shows \`zero\`. Both conditions are false, so the \`else\` block runs. The three branches together cover every possible number. That is worth checking whenever you write a chain: is there any input for which nothing at all would happen?

## Summary

\`else\` runs when the condition was false. \`elif\` adds more conditions. A chain runs the block of the first true condition and skips the rest, so the order matters. Separate \`if\` statements are each tested, and they can all run.`,
        },
        {
          type: "exercise",
          title: "Classify a Measurement",
          description: "Write an if/elif/else chain that chooses a category and prints it once.",
          instructions: `## The problem

A water-quality sensor reports a pH reading. Put the reading into a category.

## Input

One line holding a number, which may have a decimal part. Read it with \`input()\` and no prompt.

## Categories

- Below \`6.5\`: \`acidic\`
- From \`6.5\` up to \`7.5\`, not including \`7.5\`: \`neutral\`
- From \`7.5\` up to \`9.0\`, not including \`9.0\`: \`alkaline\`
- \`9.0\` and above: \`out of range\`

## Requirements

1. Convert the input to a float.
2. Assign the category to a variable named \`category\` inside the branches.
3. Print exactly one line after the chain, in this form:

\`\`\`text
pH 7.1 is neutral
\`\`\`

The reading is shown with one decimal place.

## Examples

Given \`7.1\`, the output is \`pH 7.1 is neutral\`.

Given \`6.5\`, the output is \`pH 6.5 is neutral\`. The boundary value belongs to the higher category.

Given \`9.0\`, the output is \`pH 9.0 is out of range\`.

## Guidance

Look closely at the boundaries. "Up to but not including" means \`<\`. "And above" means \`>=\`. Order your chain so that a narrower test is never swallowed by a wider one placed above it.

## Constraints

Print exactly once, after the chain. Do not print inside the branches.`,
          starterCode: `reading = float(input())

category = ""
`,
          hint: "Start with the lowest range and work upwards, or start with the highest and work downwards, but keep one direction. Each branch only assigns to category. The single print comes after the chain.",
          tests: [
            {
              input: "7.1\n",
              expectedOutput: "pH 7.1 is neutral",
              description: "A reading inside the neutral range",
            },
            {
              input: "6.5\n",
              expectedOutput: "pH 6.5 is neutral",
              description: "The lower neutral boundary belongs to neutral, not to acidic",
            },
            {
              input: "5.2\n",
              expectedOutput: "pH 5.2 is acidic",
              description: "A clearly acidic reading",
            },
            {
              input: "9.0\n",
              expectedOutput: "pH 9.0 is out of range",
              description: "The upper boundary is reported as out of range",
            },
            {
              input: "8.4\n",
              expectedOutput: "pH 8.4 is alkaline",
              description: "A reading inside the alkaline range",
            },
          ],
          solution: `reading = float(input())

category = ""
if reading < 6.5:
    category = "acidic"
elif reading < 7.5:
    category = "neutral"
elif reading < 9.0:
    category = "alkaline"
else:
    category = "out of range"

print(f"pH {reading:.1f} is {category}")
`,
        },
        {
          type: "exercise",
          title: "Repair a Misordered Chain",
          description: "A grading program runs without error and gives almost everyone the wrong grade.",
          instructions: `## The problem

The program in the editor gives a letter grade for a score. It runs with no error, and it gives the wrong answer for most inputs.

A score of \`95\` should be \`A\`. Run the program and see what it gives.

## The grade boundaries

- \`90\` and above: \`A\`
- \`80\` to \`89\`: \`B\`
- \`70\` to \`79\`: \`C\`
- \`60\` to \`69\`: \`D\`
- Below \`60\`: \`F\`

## Your task

Correct the program so that it gives the right grade for any score.

## Requirements

1. Read one whole number from \`input()\` with no prompt.
2. Show exactly one line, in the form \`Score 95 earns grade A\`.
3. Keep the chain. Do not replace it with something else.

## Guidance

Nothing here is badly formed. The bug is entirely in the *order* of the tests. For a score of 95, work out which condition is tested first and whether it is true. Then decide what order the conditions need to be in for the chain to work.

This fault has no error message and no other sign except a wrong answer, and that is exactly why it is worth practising.`,
          starterCode: `score = int(input())

if score >= 60:
    grade = "D"
elif score >= 70:
    grade = "C"
elif score >= 80:
    grade = "B"
elif score >= 90:
    grade = "A"
else:
    grade = "F"

print(f"Score {score} earns grade {grade}")
`,
          hint: "A chain stops at the first true condition, so the widest test must come last. Turn the order of the four comparisons round, so the hardest one is tested first.",
          tests: [
            {
              input: "95\n",
              expectedOutput: "Score 95 earns grade A",
              description: "A top score gets an A instead of being caught by a lower boundary",
            },
            {
              input: "85\n",
              expectedOutput: "Score 85 earns grade B",
              description: "A score in the B range",
            },
            {
              input: "70\n",
              expectedOutput: "Score 70 earns grade C",
              description: "Exactly on the C boundary",
            },
            {
              input: "42\n",
              expectedOutput: "Score 42 earns grade F",
              description: "A failing score falls through to the else branch",
            },
          ],
          solution: `score = int(input())

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(f"Score {score} earns grade {grade}")
`,
        },
      ],
    ),

    lesson(
      "Combining Conditions",
      "Building bigger tests with and, or, and not, and reading them correctly.",
      [
        {
          type: "lesson",
          title: "and, or, and not",
          description: "The three logical operators, with truth tables built step by step.",
          instructions: `## Questions with several parts

Real conditions often have more than one part. A ticket is cheaper if the visitor is a member *and* the day is a working day. Python gives you three operators for building tests like that.

## and

\`and\` gives \`True\` only when **both** sides are true:

\`\`\`python
print(True and True)
print(True and False)
print(False and True)
print(False and False)
\`\`\`

\`\`\`text
True
False
False
False
\`\`\`

Those four lines are a **truth table**: a complete list of every combination of inputs, with the result for each one. If the term is new to you, that is all it means. A full list like this is possible because there are only two values.

Here it is in use:

\`\`\`python
is_member = True
is_weekday = False

if is_member and is_weekday:
    print("Discount applies")
else:
    print("Full price")
\`\`\`

\`\`\`text
Full price
\`\`\`

## or

\`or\` gives \`True\` when **at least one** side is true:

\`\`\`python
print(True or True)
print(True or False)
print(False or True)
print(False or False)
\`\`\`

\`\`\`text
True
True
True
False
\`\`\`

Look at the first line. In everyday speech, "tea or coffee" usually means one of them but not both. Python's \`or\` is different. It is true when either one is true, and it is also true when both are true.

## not

\`not\` turns a Boolean round. It takes one value, not two:

\`\`\`python
print(not True)
print(not False)
print(not 5 > 3)
\`\`\`

\`\`\`text
False
True
False
\`\`\`

The last line reads as "not (5 > 3)". \`5 > 3\` is true, so turning it round gives false. \`not\` comes after comparison in the order of operations, so the comparison happens first.

Where you can, write a condition in a positive form. \`if not is_invalid:\` makes a reader untangle two negatives. \`if is_valid:\` does not.

## Order among the three

\`not\` comes first, then \`and\`, then \`or\`. So this line:

\`\`\`python
print(True or False and False)
\`\`\`

\`\`\`text
True
\`\`\`

is read as \`True or (False and False)\`, which is \`True or False\`, which is \`True\`. If it had been read from left to right, the answer would have been \`False\`.

As with arithmetic, add brackets whenever they save a reader from remembering the rule:

\`\`\`python
age = 25
has_permit = False
is_staff = True

if (age >= 18 and has_permit) or is_staff:
    print("Entry allowed")
\`\`\`

\`\`\`text
Entry allowed
\`\`\`

## A very common mistake

This line does not do what it looks like:

\`\`\`python
day = "Sunday"
print(day == "Saturday" or "Sunday")
\`\`\`

\`\`\`text
True
\`\`\`

It looks like "is day Saturday or Sunday". It is not. Python reads it as \`(day == "Saturday") or ("Sunday")\`. The first part is false, so the answer is whatever the second part is worth, and a string that is not empty counts as true. So this expression is **always** true, whatever \`day\` holds.

Each side of \`or\` must be a complete comparison:

\`\`\`python
day = "Sunday"
print(day == "Saturday" or day == "Sunday")
\`\`\`

\`\`\`text
True
\`\`\`

Now try it with \`day = "Monday"\`, and the answer becomes \`False\`, as it should be. The next stage shows a neater way to write the same test.

> **Key idea**
> \`or\` joins two Booleans, not a comparison and a bare value. Write the comparison out on both sides, or use a membership test.

## Stopping early

Python stops working out a condition as soon as the answer is certain. If the left side of \`and\` is false, the right side is never worked out, because the answer cannot change. In the same way, if the left side of \`or\` is true, the right side is skipped.

This is sometimes useful for protecting an operation that would fail:

\`\`\`python
text = ""

if len(text) > 0 and text[0] == "a":
    print("starts with a")
else:
    print("no first character to check")
\`\`\`

\`\`\`text
no first character to check
\`\`\`

The first test is false, so the second is never tried. That matters here, because asking for the first character of an empty string would raise an error.

## Summary

\`and\` is true only when both sides are true. \`or\` is true when at least one side is true. \`not\` turns a value round. The order is \`not\`, then \`and\`, then \`or\`. Each side of a logical operator must be a complete condition. Python stops as soon as the answer is settled.`,
        },
        {
          type: "lesson",
          title: "Chained Comparisons and Membership",
          description: "Two pieces of Python writing that make common conditions much clearer.",
          instructions: `## Testing a range

To check that a value lies between two limits, you can join two comparisons:

\`\`\`python
temperature = 22

if temperature >= 18 and temperature <= 25:
    print("Comfortable")
\`\`\`

\`\`\`text
Comfortable
\`\`\`

Python lets you write this the way you would write it in mathematics:

\`\`\`python
temperature = 22

if 18 <= temperature <= 25:
    print("Comfortable")
\`\`\`

\`\`\`text
Comfortable
\`\`\`

This is a **chained comparison**. It means exactly the same as the \`and\` version, and it works out \`temperature\` only once. Read it aloud as "18 is less than or equal to temperature, which is less than or equal to 25".

Chaining works with any comparison operator and with any number of terms. But more than two comparisons in one chain becomes hard to read.

Note that this only works for a true chain. To test that a value is *outside* a range, you still need \`or\`:

\`\`\`python
temperature = 30

if temperature < 18 or temperature > 25:
    print("Outside comfort range")
\`\`\`

\`\`\`text
Outside comfort range
\`\`\`

## Testing membership

To check whether a value is one of several possibilities, a chain of \`or\` grows long, and it invites the mistake from the previous stage:

\`\`\`python
day = "Sunday"

if day == "Saturday" or day == "Sunday":
    print("Weekend")
\`\`\`

The \`in\` operator says this directly:

\`\`\`python
day = "Sunday"

if day in ("Saturday", "Sunday"):
    print("Weekend")
\`\`\`

\`\`\`text
Weekend
\`\`\`

\`in\` gives \`True\` when the value on the left appears in the collection on the right. The group in brackets, with commas between the items, is a **tuple**. You will study tuples properly in Module 5. For now, read it as a fixed list of possibilities.

This grows well. To accept another value, you add one item instead of another comparison, and there is no way to make the "always true" mistake.

\`not in\` is the opposite:

\`\`\`python
command = "delete"

if command not in ("add", "list", "quit"):
    print("Unknown command")
\`\`\`

\`\`\`text
Unknown command
\`\`\`

Note that \`not in\` is one operator, read as one phrase. It is clearer than \`not (command in ...)\`, which means the same thing.

## Membership inside strings

Used with a string, \`in\` tests whether one string appears inside another:

\`\`\`python
address = "user@example.org"

print("@" in address)
print("z" in address)
\`\`\`

\`\`\`text
True
False
\`\`\`

This is a genuinely useful checking tool, and a good example of choosing the simplest thing that works. Looking for an \`@\` is a rough test for an email address. But when a rough test is all a program needs, a rough test is the right answer. Module 11 gives you a far more exact tool for questions like this, and part of learning that tool is learning when you do not need it.

## Putting it together

Here is a worked example that uses everything in this lesson:

\`\`\`python
def describe_booking(age, day, has_pass):
    if has_pass:
        return "Pass holder"
    if day in ("Saturday", "Sunday"):
        return "Weekend rate"
    if 5 <= age <= 15:
        return "Child rate"
    return "Standard rate"


print(describe_booking(10, "Monday", False))
print(describe_booking(30, "Sunday", False))
print(describe_booking(30, "Monday", True))
\`\`\`

\`\`\`text
Child rate
Weekend rate
Pass holder
\`\`\`

Notice the shape. Each condition is checked in order of importance, and each one returns at once. There is no \`else\` anywhere, and nothing is nested. That pattern is the subject of the next lesson.

## Summary

\`a <= b <= c\` chains comparisons and works out \`b\` once. \`in\` tests whether a value is in a collection, or whether a small string is inside a bigger one. \`not in\` is its opposite. Both make bigger conditions shorter, and both remove a common kind of mistake.`,
        },
        {
          type: "exercise",
          title: "Combine Several Conditions",
          description: "Decide who is allowed to borrow, from three separate facts, using logical operators.",
          instructions: `## The problem

A library lets a visitor borrow a reference book only when **all** of these are true:

1. They hold a valid card.
2. They have no unpaid fines.
3. They are either a member of staff, or aged 16 or over.

## Input

Four lines, in this order:

1. \`yes\` or \`no\` — has a valid card
2. \`yes\` or \`no\` — has unpaid fines
3. \`yes\` or \`no\` — is a member of staff
4. A whole number — their age

Read all four with \`input()\` and no prompt.

## Requirements

1. Turn the three yes/no lines into Booleans by comparing each one with \`"yes"\`.
2. Work out one Boolean named \`allowed\` that says whether the rule above is met.
3. Show exactly one line:

\`\`\`text
Borrowing allowed: True
\`\`\`

## Examples

Given \`yes\`, \`no\`, \`no\`, \`17\`, the answer is \`True\`: a valid card, no fines, and old enough.

Given \`yes\`, \`no\`, \`yes\`, \`14\`, the answer is \`True\`: staff do not have to meet the age rule.

Given \`yes\`, \`yes\`, \`yes\`, \`40\`, the answer is \`False\`: unpaid fines stop borrowing in every case.

## Guidance

Look at the shape of the rule. Two requirements must both hold. The third requirement offers two different ways to qualify. Brackets will make that shape visible, and this is exactly the kind of detail where you should not depend on \`and\` coming before \`or\`.

Requirement 2 is written in a negative form: the visitor must have *no* fines. So the Boolean you read from the input must be turned round.

## Constraints

Work out \`allowed\` in a single expression, and do not use \`if\` anywhere.`,
          starterCode: `has_card = input() == "yes"
has_fines = input() == "yes"
is_staff = input() == "yes"
age = int(input())
`,
          hint: "allowed = has_card and not has_fines and (is_staff or age >= 16). The brackets around the or are what make the third requirement an alternative instead of a separate condition.",
          tests: [
            {
              input: "yes\nno\nno\n17\n",
              expectedOutput: "Borrowing allowed: True",
              description: "An adult with a card and no fines qualifies on age",
            },
            {
              input: "yes\nno\nyes\n14\n",
              expectedOutput: "Borrowing allowed: True",
              description: "Staff qualify even when they are below the age limit",
            },
            {
              input: "yes\nyes\nyes\n40\n",
              expectedOutput: "Borrowing allowed: False",
              description: "Unpaid fines stop borrowing even for staff",
            },
            {
              input: "no\nno\nno\n30\n",
              expectedOutput: "Borrowing allowed: False",
              description: "Without a valid card nothing else can help the visitor",
            },
            {
              input: "yes\nno\nno\n15\n",
              expectedOutput: "Borrowing allowed: False",
              description: "One year below the limit, and not staff",
            },
          ],
          solution: `has_card = input() == "yes"
has_fines = input() == "yes"
is_staff = input() == "yes"
age = int(input())

allowed = has_card and not has_fines and (is_staff or age >= 16)
print(f"Borrowing allowed: {allowed}")
`,
        },
        {
          type: "exercise",
          title: "Categorise With Membership Tests",
          description: "Use in and a chained comparison to describe a day.",
          instructions: `## The problem

Given a day name and a temperature, describe the day.

## Input

Two lines:

1. A day name with a capital letter, such as \`Monday\`.
2. A whole number temperature in degrees Celsius.

## Rules, used in this order

1. If the day is \`Saturday\` or \`Sunday\`, the day type is \`weekend\`. Otherwise it is \`weekday\`.
2. If the temperature is from \`18\` to \`25\`, including both, the comfort is \`comfortable\`. Otherwise it is \`uncomfortable\`.

## Requirements

1. Use a membership test with \`in\` for the day, not a chain of \`==\` comparisons.
2. Use a chained comparison for the temperature range, not two comparisons joined with \`and\`.
3. Show exactly one line:

\`\`\`text
Saturday: weekend, 21C, comfortable
\`\`\`

## Examples

Given \`Saturday\` and \`21\`, the output is the line above.

Given \`Tuesday\` and \`30\`, the output is:

\`\`\`text
Tuesday: weekday, 30C, uncomfortable
\`\`\`

Given \`Sunday\` and \`18\`, the output is:

\`\`\`text
Sunday: weekend, 18C, comfortable
\`\`\`

## Constraints

The limits are included: both \`18\` and \`25\` count as comfortable.`,
          starterCode: `day = input()
temperature = int(input())
`,
          hint: "Use day in (\"Saturday\", \"Sunday\") for the first test, and 18 <= temperature <= 25 for the second. Assign each result to a variable with an if/else, then print once.",
          tests: [
            {
              input: "Saturday\n21\n",
              expectedOutput: "Saturday: weekend, 21C, comfortable",
              description: "A weekend day inside the comfortable range",
            },
            {
              input: "Tuesday\n30\n",
              expectedOutput: "Tuesday: weekday, 30C, uncomfortable",
              description: "A working day above the comfortable range",
            },
            {
              input: "Sunday\n18\n",
              expectedOutput: "Sunday: weekend, 18C, comfortable",
              description: "The lower temperature limit counts as comfortable",
            },
            {
              input: "Friday\n25\n",
              expectedOutput: "Friday: weekday, 25C, comfortable",
              description: "The upper temperature limit counts as comfortable",
            },
          ],
          solution: `day = input()
temperature = int(input())

if day in ("Saturday", "Sunday"):
    day_type = "weekend"
else:
    day_type = "weekday"

if 18 <= temperature <= 25:
    comfort = "comfortable"
else:
    comfort = "uncomfortable"

print(f"{day}: {day_type}, {temperature}C, {comfort}")
`,
        },
      ],
    ),

    lesson(
      "Validation and Program Shape",
      "Refusing bad input early, and keeping conditional code flat enough to read.",
      [
        {
          type: "lesson",
          title: "Guard Clauses",
          description: "Dealing with special cases first, so the main logic stays clear.",
          instructions: `## The problem with deep nesting

Here is a function that checks whether an order can be sent out. Written with nested conditions, it looks like this:

\`\`\`python
def dispatch_status(in_stock, address_known, is_paid):
    if in_stock:
        if address_known:
            if is_paid:
                return "Ready to dispatch"
            else:
                return "Awaiting payment"
        else:
            return "No delivery address"
    else:
        return "Out of stock"


print(dispatch_status(True, True, False))
\`\`\`

\`\`\`text
Awaiting payment
\`\`\`

It works, but it is hard to read. The successful path is buried three levels deep, and each \`else\` is far from the \`if\` it belongs to. Adding a fourth condition would push the important line even deeper.

## Turning the structure round

A **guard clause** is a check placed at the top of a function. It deals with a case that fails, and it returns at once:

\`\`\`python
def dispatch_status(in_stock, address_known, is_paid):
    if not in_stock:
        return "Out of stock"
    if not address_known:
        return "No delivery address"
    if not is_paid:
        return "Awaiting payment"
    return "Ready to dispatch"


print(dispatch_status(True, True, False))
\`\`\`

\`\`\`text
Awaiting payment
\`\`\`

The behaviour is exactly the same. The readability is not. Each problem is handled and finished on its own line, and the main result sits at the end, with no indentation, easy to find.

This works because \`return\` ends the call at once. Once a guard has returned, nothing below it can run, so no \`else\` is needed. Adding an \`else\` after an \`if\` that returns adds a level of indentation for nothing.

> **Key idea**
> Deal with the unusual cases first and return. What is left is the ordinary case, written flat.

## Order still matters

Guards are checked from top to bottom, so their order decides which message an input with two problems receives. If an order is both out of stock and unpaid, the version above reports the stock problem, because that guard comes first. That is a decision about priority, and it is worth making on purpose.

## Checking input

Guard clauses are the natural shape for checking input. A program that receives data from a person cannot assume the data is sensible.

\`\`\`python
def check_rating(raw):
    if raw == "":
        return "No rating supplied"
    if not raw.isdigit():
        return "Rating must be a whole number"
    value = int(raw)
    if not 1 <= value <= 5:
        return "Rating must be between 1 and 5"
    return f"Rating accepted: {value}"


print(check_rating(""))
print(check_rating("abc"))
print(check_rating("9"))
print(check_rating("4"))
\`\`\`

\`\`\`text
No rating supplied
Rating must be a whole number
Rating must be between 1 and 5
Rating accepted: 4
\`\`\`

Three things here are worth noticing.

First, the checks run in a necessary order. The change to \`int\` comes only after \`isdigit()\` has shown that it will succeed. If you swapped those two, \`int("abc")\` would raise a \`ValueError\` and stop the program.

Second, \`isdigit()\` is a string method that gives \`True\` when every character is a digit. It gives \`False\` for \`""\`, for \`"4.5"\`, and for \`"-2"\`. So it means "holds digits only", not "is a number".

Third, every refusal explains what was wrong. A message that says only \`Invalid\` gives a person no way to correct the mistake.

## Checking input is not error handling

These two ideas are often mixed up, and the difference is worth drawing now.

**Validation** checks whether data is acceptable *before* you use it, and produces a decision. It is ordinary program logic built from conditions.

**Error handling** deals with something that has already gone wrong. It catches a failure after it happens. That is the subject of Module 7.

Both have their place. Validation is better when you can see the problem coming, because it lets you answer exactly and keeps normal work free of failures. When a program can check first, it should.

## Summary

A guard clause tests for a failing case at the top of a function and returns at once, which keeps the main path flat and clear. An \`else\` after an \`if\` that returns is not needed. Validation checks data before use, and it belongs to ordinary conditional logic.`,
        },
        {
          type: "exercise",
          title: "Validate a Rating",
          description: "Write a function that refuses several kinds of bad input with exact messages.",
          instructions: `## The problem

Write a checking function for a star rating that arrives as text.

## Requirements

Define a function \`check_rating(raw)\` that takes a string and **returns** one of these messages:

1. \`No rating supplied\` — when \`raw\` is empty, or holds only spaces.
2. \`Rating must be a whole number\` — when the text is not made only of digits.
3. \`Rating must be between 1 and 5\` — when it is a whole number outside that range.
4. \`Rating accepted: 4\` — when it is valid, showing the number.

The checks are used in that order. An empty string reports the first message, not the second.

## Then

Read one line with \`input()\` and no prompt, give it to the function, and print the message that comes back.

## Examples

Given \`4\`, the output is \`Rating accepted: 4\`.

Given \`abc\`, the output is \`Rating must be a whole number\`.

Given \`0\`, the output is \`Rating must be between 1 and 5\`.

Given an empty line, the output is \`No rating supplied\`.

## Guidance

Use guard clauses: check, return, move on. You do not need \`else\` anywhere.

Remove the spaces from the input before you test it, so that a line with only spaces counts as empty.

Only convert with \`int()\` after you have shown that the text is all digits. Converting earlier will stop the program on text that is not a number.

## Constraints

The function must return its messages. All printing happens outside it.`,
          starterCode: `def check_rating(raw):
    return ""


line = input()
print(check_rating(line))
`,
          hint: "Put the guards in order: the empty check first, then raw.isdigit(), then the range test after converting with int(). Remember to strip the text before you check whether it is empty.",
          tests: [
            {
              input: "4\n",
              expectedOutput: "Rating accepted: 4",
              description: "A valid rating inside the accepted range",
            },
            {
              input: "abc\n",
              expectedOutput: "Rating must be a whole number",
              description: "Text that is not a number is refused before any conversion is tried",
            },
            {
              input: "0\n",
              expectedOutput: "Rating must be between 1 and 5",
              description: "A whole number below the range",
            },
            {
              input: "9\n",
              expectedOutput: "Rating must be between 1 and 5",
              description: "A whole number above the range",
            },
            {
              input: "\n",
              expectedOutput: "No rating supplied",
              description: "An empty line gives the missing-value message",
            },
            {
              input: "   \n",
              expectedOutput: "No rating supplied",
              description: "Spaces only count as no value, not as text that is not a number",
            },
            {
              input: "1\n",
              expectedOutput: "Rating accepted: 1",
              description: "The lowest value in the valid range is accepted",
            },
          ],
          solution: `def check_rating(raw):
    text = raw.strip()
    if text == "":
        return "No rating supplied"
    if not text.isdigit():
        return "Rating must be a whole number"
    value = int(text)
    if not 1 <= value <= 5:
        return "Rating must be between 1 and 5"
    return f"Rating accepted: {value}"


line = input()
print(check_rating(line))
`,
        },
        {
          type: "exercise",
          title: "Flatten a Nested Decision",
          description: "Rewrite deeply nested conditions as guard clauses without changing what they do.",
          instructions: `## The problem

The function in the editor works correctly. Its problem is that it is hard to read. The ordinary case is buried three levels deep, and each \`else\` sits a long way from the \`if\` it belongs to.

## Your task

Rewrite \`access_message\` using guard clauses, so that:

1. The behaviour is the same for every input.
2. No \`else\` appears anywhere in the function.
3. The success message is the last line of the function, and it is not indented inside any \`if\`.

## The rules, said again

- If the account is not active, return \`Account inactive\`.
- Otherwise, if the password is wrong, return \`Incorrect password\`.
- Otherwise, if the account is locked, return \`Account locked\`.
- Otherwise, return \`Access granted\`.

## Requirements

The program reads three lines and prints the result. That part already works, so leave it alone.

## Why this matters

This is a **refactoring**: changing the shape of code without changing what it does. The test cases are there to prove that the behaviour did not change. Being able to improve code with confidence, because tests show you have not broken it, is one of the most valuable habits in programming. Module 9 is about exactly this.

## Constraints

Do not change the order in which the conditions are checked. An account that is both inactive and locked must still report \`Account inactive\`.`,
          starterCode: `def access_message(is_active, password_ok, is_locked):
    if is_active:
        if password_ok:
            if is_locked:
                return "Account locked"
            else:
                return "Access granted"
        else:
            return "Incorrect password"
    else:
        return "Account inactive"


is_active = input() == "yes"
password_ok = input() == "yes"
is_locked = input() == "yes"
print(access_message(is_active, password_ok, is_locked))
`,
          hint: "Write each failing case as a guard: if not is_active: return \"Account inactive\", and so on. Because return ends the call, nothing below a guard that fired can run, so you need no else.",
          tests: [
            {
              input: "yes\nyes\nno\n",
              expectedOutput: "Access granted",
              description: "The ordinary successful path",
            },
            {
              input: "no\nyes\nno\n",
              expectedOutput: "Account inactive",
              description: "An account that is not active is refused first",
            },
            {
              input: "yes\nno\nno\n",
              expectedOutput: "Incorrect password",
              description: "A wrong password on an active account",
            },
            {
              input: "yes\nyes\nyes\n",
              expectedOutput: "Account locked",
              description: "A locked account with the correct password",
            },
            {
              input: "no\nno\nyes\n",
              expectedOutput: "Account inactive",
              description: "When several problems apply, the first check still wins",
            },
          ],
          solution: `def access_message(is_active, password_ok, is_locked):
    if not is_active:
        return "Account inactive"
    if not password_ok:
        return "Incorrect password"
    if is_locked:
        return "Account locked"
    return "Access granted"


is_active = input() == "yes"
password_ok = input() == "yes"
is_locked = input() == "yes"
print(access_message(is_active, password_ok, is_locked))
`,
        },
      ],
    ),

    lesson(
      "Matching on a Value",
      "A statement made for choosing between many fixed possibilities.",
      [
        {
          type: "lesson",
          title: "The match Statement",
          description: "Comparing one value against several possibilities, and when it is better than an if chain.",
          instructions: `## A chain that tests the same thing again and again

Some \`elif\` chains compare the same value against a series of fixed values:

\`\`\`python
command = "list"

if command == "add":
    print("Adding an entry")
elif command == "list":
    print("Listing entries")
elif command == "remove":
    print("Removing an entry")
else:
    print("Unknown command")
\`\`\`

\`\`\`text
Listing entries
\`\`\`

That works perfectly well. But the variable name is repeated in every branch. If you spell it wrongly in one of those repeats, you create a branch that can never run.

## match

Python offers \`match\` for exactly this shape:

\`\`\`python
command = "list"

match command:
    case "add":
        print("Adding an entry")
    case "list":
        print("Listing entries")
    case "remove":
        print("Removing an entry")
    case _:
        print("Unknown command")
\`\`\`

\`\`\`text
Listing entries
\`\`\`

\`match\` names the value once. Each \`case\` gives one possibility and an indented block. The cases are tried from top to bottom, and only the first matching block runs. That is the same rule as an \`elif\` chain.

\`case _:\` catches everything else. It does the job of \`else\`. The underscore is real Python here, and it means "anything at all". Without it, a value that matches no case simply does nothing, and no error appears.

## Several values in one case

One case can accept alternatives, separated by \`|\`:

\`\`\`python
day = "Sunday"

match day:
    case "Saturday" | "Sunday":
        kind = "weekend"
    case _:
        kind = "weekday"

print(kind)
\`\`\`

\`\`\`text
weekend
\`\`\`

Read \`|\` here as "or". This is often the neatest way to group cases that share one result.

## When to use which

\`match\` fits when you compare **one value** against **several fixed possibilities**. Menu commands, status codes, and day names are typical examples.

An \`if\`/\`elif\` chain fits when the branches test **different things**, or when they use ranges and joined conditions:

\`\`\`python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"

print(grade)
\`\`\`

\`\`\`text
B
\`\`\`

That cannot become a \`match\`, because each branch asks a different question instead of comparing with a fixed value. Choosing the wrong tool gives you code that fights the reader. There is no prize for using the newer feature.

> **Key idea**
> Use \`match\` for one value against many fixed values. Use \`if\`/\`elif\` for ranges, joined conditions, and branches that test different things.

## A note on versions

\`match\` was added in Python 3.10. Code written for older versions uses \`if\`/\`elif\` chains instead. That is one reason you will see far more of those in existing programs. Both are correct. \`match\` is simply newer.

## Summary

\`match\` compares one value against a series of \`case\` patterns and runs the first one that matches. \`case _:\` catches everything else, and \`|\` groups alternatives inside one case. Use it only for equality against fixed values.`,
        },
        {
          type: "exercise",
          title: "Module 3 Checkpoint: Command Dispatcher",
          description: "Put validation, membership, and a match statement together in one small program.",
          instructions: `## The problem

A note-taking tool reads one command and reports what it would do. This checkpoint puts together validation, guard clauses, and \`match\` from across Module 3.

## Input

Two lines:

1. A command word. It may have spaces around it and any mixture of capital and small letters.
2. A whole number: how many notes are stored now.

## Requirements

Define a function \`describe_command(command, count)\` that **returns** a message. Use these rules in order:

1. If the command, after stripping and making it small letters, is empty, return \`No command given\`.
2. If it is not one of \`add\`, \`list\`, \`clear\`, or \`quit\`, return \`Unknown command: X\`, where \`X\` is the cleaned command.
3. Otherwise, return the message for that command:
   - \`add\` returns \`Adding note number 4\`, where the number is one more than \`count\`.
   - \`list\` returns \`Listing 3 notes\`, using \`count\`. When \`count\` is exactly 1, return \`Listing 1 note\` with no \`s\`.
   - \`clear\` returns \`Cleared 3 notes\` normally, but returns \`Nothing to clear\` when \`count\` is 0.
   - \`quit\` returns \`Goodbye\`.

Then read the two input lines, call the function, and print the result.

## Examples

Given \`  ADD  \` and \`3\`, the output is \`Adding note number 4\`.

Given \`list\` and \`1\`, the output is \`Listing 1 note\`.

Given \`clear\` and \`0\`, the output is \`Nothing to clear\`.

Given \`delete\` and \`5\`, the output is \`Unknown command: delete\`.

## Guidance

Clean the command once at the top of the function, and use the cleaned value everywhere after that.

Use a membership test for the "is this a known command" guard, and a \`match\` statement for choosing the message. The singular and plural cases are ordinary \`if\` decisions inside their branches.

## Constraints

The function must return every message. Print exactly once, outside the function.`,
          starterCode: `def describe_command(command, count):
    return ""


command = input()
count = int(input())
print(describe_command(command, count))
`,
          hint: "Start with cleaned = command.strip().lower(). Guard on cleaned == \"\" and on cleaned not in (\"add\", \"list\", \"clear\", \"quit\"). Then match cleaned, and deal with the singular and zero cases using a small if inside those case blocks.",
          tests: [
            {
              input: "  ADD  \n3\n",
              expectedOutput: "Adding note number 4",
              description: "Spaces and capital letters are cleaned away before matching",
            },
            {
              input: "list\n3\n",
              expectedOutput: "Listing 3 notes",
              description: "The plural form is used for a count above one",
            },
            {
              input: "list\n1\n",
              expectedOutput: "Listing 1 note",
              description: "The singular form is used when exactly one note is stored",
            },
            {
              input: "clear\n0\n",
              expectedOutput: "Nothing to clear",
              description: "Clearing with nothing stored gives the special message",
            },
            {
              input: "clear\n7\n",
              expectedOutput: "Cleared 7 notes",
              description: "Clearing with notes stored reports the count",
            },
            {
              input: "quit\n2\n",
              expectedOutput: "Goodbye",
              description: "The quit command takes no notice of the count",
            },
            {
              input: "delete\n5\n",
              expectedOutput: "Unknown command: delete",
              description: "A command that is not known is reported with the cleaned text",
            },
            {
              input: "   \n5\n",
              expectedOutput: "No command given",
              description: "Spaces only are reported as a missing command, not an unknown one",
            },
          ],
          solution: `def describe_command(command, count):
    cleaned = command.strip().lower()

    if cleaned == "":
        return "No command given"
    if cleaned not in ("add", "list", "clear", "quit"):
        return f"Unknown command: {cleaned}"

    match cleaned:
        case "add":
            return f"Adding note number {count + 1}"
        case "list":
            if count == 1:
                return "Listing 1 note"
            return f"Listing {count} notes"
        case "clear":
            if count == 0:
                return "Nothing to clear"
            return f"Cleared {count} notes"
        case _:
            return "Goodbye"


command = input()
count = int(input())
print(describe_command(command, count))
`,
        },
      ],
    ),
  ],
)

export default moduleThree

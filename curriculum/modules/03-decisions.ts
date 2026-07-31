import { module, lesson, type ModuleSource } from "../types.ts"

const moduleThree: ModuleSource = module(
  "Decisions and Boolean Logic",
  "Comparing values, combining conditions, and writing programs that take different paths depending on their data.",
  [
    lesson(
      "Booleans and Comparison",
      "The two-valued type that underlies every decision a program makes.",
      [
        {
          type: "lesson",
          title: "Comparison Produces a Boolean",
          description: "Six operators that ask questions about values, and the type of the answers.",
          instructions: `## Programs that choose

Every program so far has done exactly the same thing on every run. Real programs behave differently depending on their data: a program that checks a password must do one thing when it matches and another when it does not.

Before a program can choose, it needs a way to ask a question and get an answer it can act on. That is what comparison provides.

## The comparison operators

A **comparison operator** compares two values and produces a Boolean — \`True\` or \`False\`:

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

\`>\` is greater than, \`<\` is less than, \`>=\` is greater than or equal to, \`<=\` is less than or equal to, \`==\` tests equality, and \`!=\` tests inequality.

Each of those lines is an expression that produces a value, exactly like \`2 + 3\` produces \`5\`. The value happens to be a Boolean.

## == is not =

This is the mistake nearly every beginner makes at least once.

\`=\` is assignment. It attaches a name to a value and changes the state of your program.

\`==\` is a question. It compares two values and produces \`True\` or \`False\`, changing nothing.

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

Python helps here: writing \`if count = 5:\` is a syntax error rather than a silent bug, because assignment is not allowed where a condition is expected. That is a deliberate design decision, and a kind one.

> **Key idea**
> One equals sign commands: "make this name refer to that value." Two equals signs ask: "are these two values the same?"

## Comparing strings

Comparison works on strings too. Equality is exact, and case matters:

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

The second is \`False\` because of the capital letter; the third because of a trailing space. Both are extremely common causes of a check that "should work" and does not. When comparing text that a person typed, normalise it first:

\`\`\`python
answer = "  Yes  "
print(answer.strip().lower() == "yes")
\`\`\`

\`\`\`text
True
\`\`\`

The relational operators \`<\` and \`>\` also work on strings, comparing them in dictionary-like order based on character codes. Be aware that all uppercase letters come before all lowercase ones, so \`"Z" < "a"\` is \`True\`. That is rarely what a person means by alphabetical order, so lowercase both sides before comparing.

## Comparing different types

\`\`\`python
print(5 == "5")
\`\`\`

\`\`\`text
False
\`\`\`

An integer is never equal to a string, even one containing the same digits. This is the \`"7"\` versus \`7\` distinction again, and it is why a check against input can silently fail:

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

Python has a second, similar-looking operator: \`is\`.

\`==\` asks whether two values are *equal*. \`is\` asks whether two names refer to *the very same object in memory*.

For beginners the practical rule is short: use \`==\` for comparing values, and reserve \`is\` for comparing with \`None\`, as in \`if result is None:\`. Using \`is\` to compare numbers or strings appears to work sometimes and fails unpredictably, because whether two equal values are stored as one object is an implementation detail you should not rely on.

The distinction becomes genuinely important in Module 5, when values that can be modified in place arrive.

## A caution about comparing floats

Because floats cannot represent every decimal exactly, exact equality between computed floats is unreliable:

\`\`\`python
print(0.1 + 0.2 == 0.3)
\`\`\`

\`\`\`text
False
\`\`\`

The sum is \`0.30000000000000004\`, which is not \`0.3\`. When you need to compare computed floats, test whether the difference is small rather than testing for equality.

## Predict before you continue

What does each line display?

\`\`\`python
print(10 != 10)
print("apple" < "banana")
print(3 == 3.0)
\`\`\`

The answers are \`False\`, \`True\`, and \`True\`. The last one may surprise: an integer and a float are considered equal when they represent the same number, even though their types differ.

## Summary

Comparison operators produce Booleans. \`=\` assigns and \`==\` compares. String comparison is exact and case-sensitive, so normalise text before comparing. Use \`==\` for values and reserve \`is\` for \`None\`. Avoid exact equality between computed floats.`,
        },
        {
          type: "exercise",
          title: "Report Comparison Results",
          description: "Produce Boolean answers to several questions about two numbers.",
          instructions: `## The problem

Write a program that reads two whole numbers and reports several comparisons between them.

## Input

Two lines, each a whole number. Read them with \`input()\` and no prompt. The first is \`a\`, the second is \`b\`.

## Requirements

Display exactly four lines:

\`\`\`text
Equal: False
A larger: True
B at least A: False
Difference is even: True
\`\`\`

Each line ends with \`True\` or \`False\`, produced by a comparison rather than typed literally.

## The four questions

1. \`Equal:\` — are the two numbers equal?
2. \`A larger:\` — is \`a\` strictly greater than \`b\`?
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

For the fourth question, recall that a number is even exactly when dividing it by 2 leaves a remainder of zero. Note that this works for negative differences too.

## Constraints

Do not type \`True\` or \`False\` anywhere in your program. Every Boolean must come from a comparison.`,
          starterCode: `a = int(input())
b = int(input())
`,
          hint: "Each line is an f-string containing a comparison, for example f\"Equal: {a == b}\". For the last one, test whether (a - b) % 2 == 0.",
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
          description: "Normalise user-supplied text before comparing it, and report both results.",
          instructions: `## The problem

Text typed by a person rarely matches exactly. Compare two lines both naively and sensibly, and report the difference.

## Input

Two lines of text. Either may have surrounding whitespace and any capitalisation.

## Requirements

Display exactly three lines:

\`\`\`text
Exact: False
Normalised: True
Same length: False
\`\`\`

Where:

1. \`Exact\` compares the two lines exactly as received.
2. \`Normalised\` compares them after stripping whitespace from both ends and lowercasing both.
3. \`Same length\` compares the lengths of the two lines **as received**, before normalising.

## Examples

Given \`  Yes  \` and \`yes\`, the output is the three lines above.

Given \`no\` and \`no\`:

\`\`\`text
Exact: True
Normalised: True
Same length: True
\`\`\`

## Guidance

Do the normalising once into two new variables rather than repeating the method chain in each comparison.

Every Boolean must come from a comparison. Do not type \`True\` or \`False\` anywhere.

## Why this matters

A check that "should work" and does not is very often a case of comparing raw input against a clean expected value. Normalising first removes an entire category of bug.`,
          starterCode: `first = input()
second = input()
`,
          hint: "Build clean_first = first.strip().lower() and clean_second = second.strip().lower(), then use f-strings containing first == second, clean_first == clean_second, and len(first) == len(second).",
          tests: [
            {
              input: "  Yes  \nyes\n",
              expectedOutput: "Exact: False\nNormalised: True\nSame length: False",
              description: "Whitespace and capitalisation defeat an exact comparison but not a normalised one",
            },
            {
              input: "no\nno\n",
              expectedOutput: "Exact: True\nNormalised: True\nSame length: True",
              description: "Identical text matches under both comparisons",
            },
            {
              input: "abc\nxyz\n",
              expectedOutput: "Exact: False\nNormalised: False\nSame length: True",
              description: "Different text of equal length fails both comparisons",
            },
            {
              input: "A\na\n",
              expectedOutput: "Exact: False\nNormalised: True\nSame length: True",
              description: "Case alone is enough to defeat an exact comparison",
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
          description: "Conditional execution, code blocks, and why indentation is structural in Python.",
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

Change \`temperature\` to \`18\` and the output becomes just \`Reading complete\`. The indented line was skipped entirely.

## The parts

\`if\` introduces the statement. Then comes a **condition**: any expression that produces a Boolean, or that Python can interpret as one. Then a colon, which is required and easy to forget. Then, on the following lines, an indented **block**.

The block is the code that runs when the condition is \`True\`. If it is \`False\`, Python skips the entire block and continues after it.

## Indentation is structure

In many languages, indentation is a courtesy to readers. In Python it is part of the language. Indentation is how you say which lines belong to the \`if\`.

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

Getting this wrong produces a program that runs perfectly and does the wrong thing:

\`\`\`python
score = 20

if score > 50:
    print("Pass")
print("Well done")
\`\`\`

\`\`\`text
Well done
\`\`\`

\`Well done\` appears even though the score is 20, because that line was never part of the \`if\`. There is no error message. The only symptom is congratulating someone who failed.

> **Key idea**
> Indentation determines which lines belong to a block. A misplaced indent is not a style problem; it changes what your program does.

Use four spaces per level, and be consistent. Mixing tabs and spaces produces confusing errors; this editor inserts spaces when you press Tab.

## Conditions are just expressions

The condition can be any expression producing a Boolean, including one using a variable that already holds one:

\`\`\`python
is_open = True

if is_open:
    print("Come in")
\`\`\`

\`\`\`text
Come in
\`\`\`

Note that \`if is_open:\` is preferred over \`if is_open == True:\`. The comparison adds nothing: \`is_open\` is already a Boolean, and comparing a Boolean to \`True\` produces the same Boolean.

## Truthiness

Python accepts non-Boolean values as conditions and interprets them. The rules are worth knowing because they explain some otherwise puzzling behaviour.

These are treated as \`False\`: the number \`0\`, the empty string \`""\`, \`None\`, and empty collections (which you meet in Module 5). Almost everything else is treated as \`True\`.

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

This is a genuinely useful idiom for "did I actually get something?". But be careful: \`if count:\` is \`False\` when \`count\` is \`0\`, which may or may not be what you want. When you mean "is this zero", write \`if count == 0:\` and say so plainly.

## Nesting

An \`if\` can contain another \`if\`, indented one level further:

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

The inner \`if\` is only reached when the outer condition is true. Nesting more than two levels deep quickly becomes hard to follow; a later stage in this module shows how to avoid it.

## Summary

\`if condition:\` followed by an indented block runs that block only when the condition is true. Indentation defines the block and is part of the language. Conditions are ordinary expressions, and non-Boolean values are interpreted as true or false by fixed rules.`,
        },
        {
          type: "lesson",
          title: "else and elif",
          description: "Choosing between alternatives, and why the order of a chain matters.",
          instructions: `## Doing something otherwise

\`else\` supplies a block to run when the condition was false:

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

Exactly one of the two blocks runs, always. \`else\` takes no condition of its own — it means "in every other case" — and it must line up with its \`if\`.

## More than two possibilities

\`elif\`, short for "else if", adds further conditions:

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

Python tests the conditions from top to bottom and runs the block belonging to the **first** one that is true. Everything after that is skipped, even if it would also have been true. A chain runs at most one block.

## Order is part of the logic

That "first one that is true" rule means the order of a chain carries meaning. Reverse it and the program breaks:

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

A score of 95 receives a D. The first condition, \`score >= 60\`, is true for 95, so its block runs and the rest are never examined. No error is raised; the program simply grades everyone who passes as a D.

The lesson generalises: when writing a chain of range tests, order them from the most restrictive to the least, so that a more specific case is never swallowed by a broader one written above it.

> **Key idea**
> An \`if\`/\`elif\`/\`else\` chain runs exactly one block: the first whose condition is true. Later conditions are never even evaluated, so ordering is part of the logic, not a matter of taste.

## Separate ifs are not the same as a chain

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

Two independent \`if\` statements are each evaluated, so both blocks ran. Compare with the chained version:

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

Only one block ran. Choose deliberately: use a chain when the cases are alternatives, and separate \`if\` statements when several independent things may each be true.

## Assigning in branches rather than printing

Notice that the grading example assigned to \`grade\` in each branch and printed once at the end, rather than printing inside every branch. That habit pays off: the value is now available for anything else the program needs, and there is exactly one place where the output format is decided.

## Predict before you continue

What does this display when \`value\` is \`0\`?

\`\`\`python
value = 0

if value > 0:
    print("positive")
elif value < 0:
    print("negative")
else:
    print("zero")
\`\`\`

It displays \`zero\`. Both conditions are false, so the \`else\` block runs. The three branches together cover every possible number, which is worth checking whenever you write a chain: is there any input for which nothing would happen?

## Summary

\`else\` runs when the condition was false; \`elif\` adds further conditions. A chain runs the block of the first true condition and skips the rest, so order matters. Independent \`if\` statements are each evaluated and can all run.`,
        },
        {
          type: "exercise",
          title: "Classify a Measurement",
          description: "Write an if/elif/else chain that assigns a category and prints it once.",
          instructions: `## The problem

A water-quality sensor reports a pH reading. Classify it.

## Input

One line containing a number, which may have a decimal part. Read it with \`input()\` and no prompt.

## Categories

- Below \`6.5\`: \`acidic\`
- From \`6.5\` up to but not including \`7.5\`: \`neutral\`
- From \`7.5\` up to but not including \`9.0\`: \`alkaline\`
- \`9.0\` and above: \`out of range\`

## Requirements

1. Convert the input to a float.
2. Assign the category to a variable named \`category\` inside the branches.
3. Print exactly one line after the chain, in this format:

\`\`\`text
pH 7.1 is neutral
\`\`\`

The reading is displayed with one decimal place.

## Examples

Given \`7.1\`, the output is \`pH 7.1 is neutral\`.

Given \`6.5\`, the output is \`pH 6.5 is neutral\` — the boundary belongs to the higher category.

Given \`9.0\`, the output is \`pH 9.0 is out of range\`.

## Guidance

Pay close attention to the boundaries. "Up to but not including" means \`<\`, while "and above" means \`>=\`. Order your chain so a more restrictive test is never swallowed by a broader one placed above it.

## Constraints

Print exactly once, after the chain. Do not print inside the branches.`,
          starterCode: `reading = float(input())

category = ""
`,
          hint: "Start with the lowest range and work upward, or the highest and work downward — but be consistent. Each branch only needs to assign to category; the single print comes afterwards.",
          tests: [
            {
              input: "7.1\n",
              expectedOutput: "pH 7.1 is neutral",
              description: "A reading inside the neutral band",
            },
            {
              input: "6.5\n",
              expectedOutput: "pH 6.5 is neutral",
              description: "The lower neutral boundary belongs to neutral, not acidic",
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
              description: "A reading inside the alkaline band",
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
          description: "A grading program runs without error and assigns the wrong grade to nearly everyone.",
          instructions: `## The problem

The program in the editor assigns a letter grade to a score. It runs with no error and produces the wrong answer for most inputs.

A score of \`95\` should be \`A\`. Run the program and see what it produces.

## The grade boundaries

- \`90\` and above: \`A\`
- \`80\` to \`89\`: \`B\`
- \`70\` to \`79\`: \`C\`
- \`60\` to \`69\`: \`D\`
- Below \`60\`: \`F\`

## Your task

Correct the program so it assigns the right grade for any score.

## Requirements

1. Read one whole number from \`input()\` with no prompt.
2. Output exactly one line, in the form \`Score 95 earns grade A\`.
3. Keep the chain structure — do not replace it with something else.

## Guidance

Nothing here is malformed. The bug is entirely in the *order* of the tests. Work out, for a score of 95, which condition is examined first and whether it is true. Then decide what order the conditions must be in for the chain to work.

This defect has no error message and no visible symptom other than a wrong answer, which is exactly what makes it worth practising.`,
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
          hint: "A chain stops at the first true condition, so the broadest test must come last. Reverse the order of the four comparisons so the most demanding one is tested first.",
          tests: [
            {
              input: "95\n",
              expectedOutput: "Score 95 earns grade A",
              description: "A top score receives an A rather than being caught by a lower boundary",
            },
            {
              input: "85\n",
              expectedOutput: "Score 85 earns grade B",
              description: "A score in the B band",
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
      "Building compound tests with and, or, and not, and reading them correctly.",
      [
        {
          type: "lesson",
          title: "and, or, and not",
          description: "The three logical operators, with truth tables built from scratch.",
          instructions: `## Questions with several parts

Real conditions are often compound: a ticket is discounted if the visitor is a member *and* the day is a weekday. Python provides three operators for building such tests.

## and

\`and\` produces \`True\` only when **both** sides are true:

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

Those four lines are a **truth table**: an exhaustive list of every combination of inputs and the result for each. If you have not met the term before, that is all it is — a complete enumeration, which is possible because there are only two values.

In use:

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

\`or\` produces \`True\` when **at least one** side is true:

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

Note the first line. In everyday speech, "tea or coffee" usually means one or the other but not both. Python's \`or\` is inclusive: it is true when either is true *and* when both are.

## not

\`not\` reverses a Boolean. It takes one operand rather than two:

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

The last line reads as "not (5 > 3)". Since \`5 > 3\` is true, negating gives false. \`not\` has lower precedence than comparison, so the comparison happens first.

Prefer stating a condition positively when you can. \`if not is_invalid:\` forces a reader to unpick a double negative; \`if is_valid:\` does not.

## Precedence among the three

\`not\` binds most tightly, then \`and\`, then \`or\`. So this:

\`\`\`python
print(True or False and False)
\`\`\`

\`\`\`text
True
\`\`\`

is read as \`True or (False and False)\`, which is \`True or False\`, which is \`True\`. Had it been read left to right it would have produced \`False\`.

As with arithmetic, add parentheses whenever they save a reader from recalling the rule:

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

This does not do what it appears to:

\`\`\`python
day = "Sunday"
print(day == "Saturday" or "Sunday")
\`\`\`

\`\`\`text
True
\`\`\`

It looks like "is day Saturday or Sunday". It is not. Python reads it as \`(day == "Saturday") or ("Sunday")\`. The first part is false, so the result is whatever the second part is worth — and a non-empty string counts as true. The expression is therefore **always** true, whatever \`day\` contains.

Each side of \`or\` must be a complete comparison:

\`\`\`python
day = "Sunday"
print(day == "Saturday" or day == "Sunday")
\`\`\`

\`\`\`text
True
\`\`\`

Now try it with \`day = "Monday"\` and the answer becomes \`False\`, as it should. The next stage shows a neater way to write this same test.

> **Key idea**
> \`or\` combines two Booleans, not a comparison and a bare value. Write the comparison out on both sides, or use a membership test.

## Short-circuit evaluation

Python stops evaluating as soon as the answer is settled. If the left side of \`and\` is false, the right side is never evaluated, because the result cannot change. Likewise, if the left side of \`or\` is true, the right side is skipped.

This is occasionally useful for guarding an operation that would fail:

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

Because the first test is false, the second is never attempted — which matters, since asking for the first character of an empty string would raise an error.

## Summary

\`and\` is true only when both sides are; \`or\` is true when at least one is; \`not\` reverses. Precedence runs \`not\`, then \`and\`, then \`or\`. Each side of a logical operator must be a complete condition. Evaluation short-circuits once the answer is determined.`,
        },
        {
          type: "lesson",
          title: "Chained Comparisons and Membership",
          description: "Two pieces of Python syntax that make common conditions much clearer.",
          instructions: `## Testing a range

To check that a value lies between two bounds, you could combine two comparisons:

\`\`\`python
temperature = 22

if temperature >= 18 and temperature <= 25:
    print("Comfortable")
\`\`\`

\`\`\`text
Comfortable
\`\`\`

Python allows this to be written the way it would be written in mathematics:

\`\`\`python
temperature = 22

if 18 <= temperature <= 25:
    print("Comfortable")
\`\`\`

\`\`\`text
Comfortable
\`\`\`

This is a **chained comparison**. It means exactly the same as the \`and\` version, and it evaluates \`temperature\` only once. Read it aloud as "18 is less than or equal to temperature, which is less than or equal to 25".

Chaining works with any of the comparison operators and any number of terms, though more than two comparisons in a chain becomes hard to read.

Note that this only works for genuine chains. To test that a value is outside a range you still need \`or\`:

\`\`\`python
temperature = 30

if temperature < 18 or temperature > 25:
    print("Outside comfort range")
\`\`\`

\`\`\`text
Outside comfort range
\`\`\`

## Testing membership

To check whether a value is one of several possibilities, the \`or\` chain grows tedious and invites the mistake from the previous stage:

\`\`\`python
day = "Sunday"

if day == "Saturday" or day == "Sunday":
    print("Weekend")
\`\`\`

The \`in\` operator expresses this directly:

\`\`\`python
day = "Sunday"

if day in ("Saturday", "Sunday"):
    print("Weekend")
\`\`\`

\`\`\`text
Weekend
\`\`\`

\`in\` produces \`True\` when the value on the left appears in the collection on the right. The parenthesised, comma-separated group is a **tuple**, which you will study properly in Module 5; for now, read it as a fixed list of possibilities.

This scales well. Adding another accepted value means adding one item, not another comparison, and there is no way to make the "always true" mistake.

\`not in\` is the negation:

\`\`\`python
command = "delete"

if command not in ("add", "list", "quit"):
    print("Unknown command")
\`\`\`

\`\`\`text
Unknown command
\`\`\`

Note that \`not in\` is a single operator, read as one phrase. It is clearer than \`not (command in ...)\`, which means the same thing.

## Membership in strings

Applied to a string, \`in\` tests whether one string appears inside another:

\`\`\`python
address = "user@example.org"

print("@" in address)
print("z" in address)
\`\`\`

\`\`\`text
True
False
\`\`\`

This is a genuinely useful validation tool, and a good example of choosing the simplest thing that works. Checking for an \`@\` is a crude test for an email address, but when a crude test is all a program needs, a crude test is the right answer. Module 11 introduces a far more precise tool for questions like this, and part of learning it will be recognising when it is not needed.

## Putting it together

A worked example combining everything in this lesson:

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

Notice the structure: each condition is checked in priority order and returns immediately. There is no \`else\` anywhere, and no nesting. That pattern is the subject of the next lesson.

## Summary

\`a <= b <= c\` chains comparisons and evaluates \`b\` once. \`in\` tests membership in a collection or a substring in a string, and \`not in\` negates it. Both make compound conditions shorter and remove a common class of mistake.`,
        },
        {
          type: "exercise",
          title: "Combine Several Conditions",
          description: "Decide eligibility from three separate facts using logical operators.",
          instructions: `## The problem

A library lets a visitor borrow a reference book only when **all** of the following are true:

1. They hold a valid card.
2. They have no outstanding fines.
3. They are either a member of staff, or aged 16 or over.

## Input

Four lines, in this order:

1. \`yes\` or \`no\` — has a valid card
2. \`yes\` or \`no\` — has outstanding fines
3. \`yes\` or \`no\` — is a member of staff
4. A whole number — their age

Read all four with \`input()\` and no prompt.

## Requirements

1. Convert the three yes/no lines into Booleans by comparing each to \`"yes"\`.
2. Compute a single Boolean named \`allowed\` expressing the rule above.
3. Display exactly one line:

\`\`\`text
Borrowing allowed: True
\`\`\`

## Examples

Given \`yes\`, \`no\`, \`no\`, \`17\` the answer is \`True\`: valid card, no fines, and old enough.

Given \`yes\`, \`no\`, \`yes\`, \`14\` the answer is \`True\`: staff are exempt from the age rule.

Given \`yes\`, \`yes\`, \`yes\`, \`40\` the answer is \`False\`: outstanding fines block borrowing regardless.

## Guidance

Note the shape of the rule: two requirements that must both hold, combined with a third that offers two alternative ways to qualify. Parentheses will make that structure visible, and \`and\` binding more tightly than \`or\` is exactly the kind of detail worth not relying on.

Condition 2 is phrased negatively — the visitor must have *no* fines — so the Boolean you read must be negated.

## Constraints

Compute \`allowed\` in a single expression, and do not use \`if\` anywhere.`,
          starterCode: `has_card = input() == "yes"
has_fines = input() == "yes"
is_staff = input() == "yes"
age = int(input())
`,
          hint: "allowed = has_card and not has_fines and (is_staff or age >= 16). The parentheses around the or are what make the third requirement an alternative rather than a separate condition.",
          tests: [
            {
              input: "yes\nno\nno\n17\n",
              expectedOutput: "Borrowing allowed: True",
              description: "An adult with a card and no fines qualifies on age",
            },
            {
              input: "yes\nno\nyes\n14\n",
              expectedOutput: "Borrowing allowed: True",
              description: "Staff qualify even when below the age threshold",
            },
            {
              input: "yes\nyes\nyes\n40\n",
              expectedOutput: "Borrowing allowed: False",
              description: "Outstanding fines block borrowing even for staff",
            },
            {
              input: "no\nno\nno\n30\n",
              expectedOutput: "Borrowing allowed: False",
              description: "Without a valid card nothing else can qualify the visitor",
            },
            {
              input: "yes\nno\nno\n15\n",
              expectedOutput: "Borrowing allowed: False",
              description: "One year below the threshold and not staff",
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
          description: "Use in and a chained comparison to classify a calendar day.",
          instructions: `## The problem

Given a day name and a temperature, describe the day.

## Input

Two lines:

1. A day name, capitalised, such as \`Monday\`.
2. A whole number temperature in degrees Celsius.

## Rules, applied in this order

1. If the day is \`Saturday\` or \`Sunday\`, the day type is \`weekend\`. Otherwise it is \`weekday\`.
2. If the temperature is from \`18\` to \`25\` inclusive, the comfort is \`comfortable\`. Otherwise it is \`uncomfortable\`.

## Requirements

1. Use a membership test with \`in\` for the day, not a chain of \`==\` comparisons.
2. Use a chained comparison for the temperature range, not two comparisons joined by \`and\`.
3. Display exactly one line:

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

The boundaries are inclusive: both \`18\` and \`25\` count as comfortable.`,
          starterCode: `day = input()
temperature = int(input())
`,
          hint: "Use day in (\"Saturday\", \"Sunday\") for the first test and 18 <= temperature <= 25 for the second. Assign each result to a variable with an if/else, then print once.",
          tests: [
            {
              input: "Saturday\n21\n",
              expectedOutput: "Saturday: weekend, 21C, comfortable",
              description: "A weekend day within the comfortable range",
            },
            {
              input: "Tuesday\n30\n",
              expectedOutput: "Tuesday: weekday, 30C, uncomfortable",
              description: "A weekday above the comfortable range",
            },
            {
              input: "Sunday\n18\n",
              expectedOutput: "Sunday: weekend, 18C, comfortable",
              description: "The lower temperature boundary counts as comfortable",
            },
            {
              input: "Friday\n25\n",
              expectedOutput: "Friday: weekday, 25C, comfortable",
              description: "The upper temperature boundary counts as comfortable",
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
      "Rejecting bad input early, and keeping conditional code flat enough to read.",
      [
        {
          type: "lesson",
          title: "Guard Clauses",
          description: "Handling special cases first so the main logic stays uncluttered.",
          instructions: `## The problem with deep nesting

Here is a function that checks whether an order can be dispatched. Written with nested conditions, it looks like this:

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

It works, but it is hard to read. The successful path is buried three levels deep, and each \`else\` is far from the \`if\` it belongs to. Adding a fourth condition would push the important line deeper still.

## Inverting the structure

A **guard clause** is a check placed at the top of a function that handles a disqualifying case and returns immediately:

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

The behaviour is identical. The readability is not. Each problem case is dealt with and dismissed on its own line, and the main result sits at the end, unindented, easy to find.

This works because \`return\` ends the call immediately. Once a guard has returned, nothing below it can run, so no \`else\` is needed. Adding an \`else\` after a returning \`if\` is redundant and adds a level of indentation for nothing.

> **Key idea**
> Deal with the exceptional cases first and return. What remains is the ordinary case, written flat.

## Order still matters

Guards are checked top to bottom, so their order decides which message a doubly-invalid input receives. If an order is both out of stock and unpaid, the version above reports the stock problem, because that guard comes first. That is a deliberate decision about priority, and worth making consciously.

## Validating input

Guard clauses are the natural shape for validation. A program that receives data from a person cannot assume it is sensible.

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

Three things are worth noting.

First, the checks run in a necessary order. The conversion to \`int\` appears only after \`isdigit()\` has confirmed it will succeed. Reversing those two would let \`int("abc")\` raise a \`ValueError\` and stop the program.

Second, \`isdigit()\` is a string method returning \`True\` when every character is a digit. It reports \`False\` for \`""\`, for \`"4.5"\`, and for \`"-2"\`, so it means "consists only of digits" rather than "is a number".

Third, each rejection explains what was wrong. A message reading only \`Invalid\` gives a person no way to correct their mistake.

## Validation is not error handling

These two are often confused, and the distinction is worth drawing now.

**Validation** checks whether data is acceptable *before* using it, and produces a decision. It is ordinary program logic built from conditions.

**Error handling** deals with something that has already gone wrong, catching a failure after it occurs. That is the subject of Module 7.

Both have their place. Validation is preferable when you can anticipate the problem, because it lets you respond precisely and keeps normal operation free of failures. When a program can check first, it should.

## Summary

A guard clause tests for a disqualifying case at the top of a function and returns at once, keeping the main path flat and unindented. \`else\` after a returning \`if\` is unnecessary. Validation checks data before use and belongs to ordinary conditional logic.`,
        },
        {
          type: "exercise",
          title: "Validate a Rating",
          description: "Write a function that rejects several kinds of bad input with specific messages.",
          instructions: `## The problem

Write a validation function for a star rating supplied as text.

## Requirements

Define a function \`check_rating(raw)\` that takes a string and **returns** one of these messages:

1. \`No rating supplied\` — when \`raw\` is empty, or contains only whitespace.
2. \`Rating must be a whole number\` — when the text is not made up entirely of digits.
3. \`Rating must be between 1 and 5\` — when it is a whole number outside that range.
4. \`Rating accepted: 4\` — when it is valid, showing the number.

The checks are applied in that order: an empty string reports the first message, not the second.

## Then

Read one line with \`input()\` and no prompt, pass it to the function, and print the returned message.

## Examples

Given \`4\`, the output is \`Rating accepted: 4\`.

Given \`abc\`, the output is \`Rating must be a whole number\`.

Given \`0\`, the output is \`Rating must be between 1 and 5\`.

Given an empty line, the output is \`No rating supplied\`.

## Guidance

Use guard clauses: check, return, move on. No \`else\` is needed anywhere.

Strip whitespace from the input before testing it, so a line containing only spaces is treated as empty.

Only convert with \`int()\` once you have established that the text is all digits. Doing it earlier will crash the program on non-numeric input.

## Constraints

The function must return its messages. All printing happens outside it.`,
          starterCode: `def check_rating(raw):
    return ""


line = input()
print(check_rating(line))
`,
          hint: "Order the guards: empty check first, then raw.isdigit(), then the range test after converting with int(). Remember to strip the text before checking whether it is empty.",
          tests: [
            {
              input: "4\n",
              expectedOutput: "Rating accepted: 4",
              description: "A valid rating inside the accepted range",
            },
            {
              input: "abc\n",
              expectedOutput: "Rating must be a whole number",
              description: "Non-numeric text is rejected before any conversion is attempted",
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
              description: "An empty line reports the missing-value message",
            },
            {
              input: "   \n",
              expectedOutput: "No rating supplied",
              description: "Whitespace only is treated as no value rather than as non-numeric text",
            },
            {
              input: "1\n",
              expectedOutput: "Rating accepted: 1",
              description: "The lower boundary of the valid range is accepted",
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
          description: "Rewrite deeply nested conditions as guard clauses without changing behaviour.",
          instructions: `## The problem

The function in the editor works correctly. Its problem is that it is hard to read: the ordinary case is buried three levels deep, and each \`else\` sits a long way from the \`if\` it belongs to.

## Your task

Rewrite \`access_message\` using guard clauses so that:

1. The behaviour is unchanged for every input.
2. No \`else\` appears anywhere in the function.
3. The successful message is the last line of the function, not indented inside any \`if\`.

## The rules, restated

- If the account is not active, return \`Account inactive\`.
- Otherwise, if the password is wrong, return \`Incorrect password\`.
- Otherwise, if the account is locked, return \`Account locked\`.
- Otherwise, return \`Access granted\`.

## Requirements

The program reads three lines and prints the result; that part already works and should be left alone.

## Why this matters

This is a **refactoring**: changing the shape of code without changing what it does. The test cases exist precisely to prove that the behaviour did not change. Being able to improve code with confidence, because tests confirm you have not broken it, is one of the most valuable habits in programming, and Module 9 is devoted to it.

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
          hint: "Write each failing case as a guard: if not is_active: return \"Account inactive\", and so on. Because return ends the call, nothing below a triggered guard runs, so no else is needed.",
          tests: [
            {
              input: "yes\nyes\nno\n",
              expectedOutput: "Access granted",
              description: "The ordinary successful path",
            },
            {
              input: "no\nyes\nno\n",
              expectedOutput: "Account inactive",
              description: "An inactive account is rejected first",
            },
            {
              input: "yes\nno\nno\n",
              expectedOutput: "Incorrect password",
              description: "A wrong password on an active account",
            },
            {
              input: "yes\nyes\nyes\n",
              expectedOutput: "Account locked",
              description: "A locked account with correct credentials",
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
      "A statement designed for choosing between many fixed alternatives.",
      [
        {
          type: "lesson",
          title: "The match Statement",
          description: "Comparing one value against several possibilities, and when it beats an if chain.",
          instructions: `## A chain that tests the same thing repeatedly

Some \`elif\` chains compare the same value against a series of constants:

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

That works perfectly well. But the variable name is repeated in every branch, and a typo in one of those repetitions produces a branch that can never run.

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

\`match\` names the value once. Each \`case\` gives a possibility and an indented block. Cases are tried from top to bottom, and only the first matching block runs — the same rule as an \`elif\` chain.

\`case _:\` is the catch-all, equivalent to \`else\`. The underscore is a genuine piece of syntax here meaning "anything at all". Without it, a value matching no case simply does nothing, with no error.

## Several values in one case

A single case can accept alternatives, separated by \`|\`:

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

Read \`|\` here as "or". This is often the neatest way to group cases that share an outcome.

## When to use which

\`match\` fits when you are comparing **one value** against **several fixed possibilities**. Menu commands, status codes, and day names are typical.

An \`if\`/\`elif\` chain fits when the branches test **different things**, or use ranges and compound conditions:

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

That cannot become a \`match\`, because each branch asks a different question rather than comparing against a constant. Choosing the wrong tool produces code that fights the reader; there is no prize for using the newer feature.

> **Key idea**
> Use \`match\` for one value against many constants. Use \`if\`/\`elif\` for ranges, compound conditions, and branches that test different things.

## A note on availability

\`match\` was added in Python 3.10. Code written for older versions uses \`if\`/\`elif\` chains instead, which is one reason you will meet far more of those in existing programs. Both are correct; \`match\` is simply newer.

## Summary

\`match\` compares one value against a series of \`case\` patterns, running the first that matches. \`case _:\` catches everything else, and \`|\` groups alternatives within a case. Prefer it only for equality against fixed values.`,
        },
        {
          type: "exercise",
          title: "Module 3 Checkpoint: Command Dispatcher",
          description: "Combine validation, membership, and a match statement into one small program.",
          instructions: `## The problem

A note-taking tool reads a single command and reports what it would do. This checkpoint combines validation, guard clauses, and \`match\` from across Module 3.

## Input

Two lines:

1. A command word, which may have surrounding whitespace and any capitalisation.
2. A whole number, the count of notes currently stored.

## Requirements

Define a function \`describe_command(command, count)\` that **returns** a message, applying these rules in order:

1. If the command, once stripped and lowercased, is empty, return \`No command given\`.
2. If it is not one of \`add\`, \`list\`, \`clear\`, or \`quit\`, return \`Unknown command: X\` where \`X\` is the cleaned command.
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

Clean the command once at the top of the function and use the cleaned value everywhere after.

Use a membership test for the "is this a known command" guard, and a \`match\` statement for choosing the message. The singular and plural cases are ordinary \`if\` decisions inside their branches.

## Constraints

The function must return every message. Print exactly once, outside the function.`,
          starterCode: `def describe_command(command, count):
    return ""


command = input()
count = int(input())
print(describe_command(command, count))
`,
          hint: "Start with cleaned = command.strip().lower(). Guard on cleaned == \"\" and on cleaned not in (\"add\", \"list\", \"clear\", \"quit\"). Then match cleaned, handling the singular and zero cases with a small if inside the relevant case blocks.",
          tests: [
            {
              input: "  ADD  \n3\n",
              expectedOutput: "Adding note number 4",
              description: "Whitespace and capitalisation are normalised before matching",
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
              description: "Clearing with nothing stored reports the special message",
            },
            {
              input: "clear\n7\n",
              expectedOutput: "Cleared 7 notes",
              description: "Clearing with notes stored reports the count",
            },
            {
              input: "quit\n2\n",
              expectedOutput: "Goodbye",
              description: "The quit command ignores the count",
            },
            {
              input: "delete\n5\n",
              expectedOutput: "Unknown command: delete",
              description: "An unrecognised command is reported with the cleaned text",
            },
            {
              input: "   \n5\n",
              expectedOutput: "No command given",
              description: "Whitespace only is reported as a missing command, not an unknown one",
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

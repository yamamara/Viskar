import { module, lesson, type ModuleSource } from "../types.ts"

const moduleFour: ModuleSource = module(
  "Repetition and Loops",
  "Making a program repeat work: while loops, for loops, the patterns built from them, and how to trace them when they go wrong.",
  [
    lesson(
      "Repeating With while",
      "The loop that runs as long as a condition holds, and the state that controls it.",
      [
        {
          type: "lesson",
          title: "Why Programs Repeat",
          description: "The limits of writing every step out, and the shape of a loop.",
          instructions: `## Writing it out does not scale

Suppose you want to display the numbers 1 to 5. With what you know so far:

\`\`\`python
print(1)
print(2)
print(3)
print(4)
print(5)
\`\`\`

That works. Now display 1 to 1000. The approach collapses — not because it is difficult, but because it is impossible to maintain. And if the upper limit were supplied when the program ran, you could not write it out at all, because you would not know how many lines to write.

Repetition is what makes programs able to handle amounts of work not known in advance.

## The shape of a loop

A **loop** runs a block of code more than once. Every loop, in any language, has three parts, and being able to name them will save you a great deal of confusion:

1. **Setup.** State that exists before the loop begins.
2. **A condition.** Checked before each repetition to decide whether to continue.
3. **Progress.** Something inside the loop that changes the state, so the condition eventually becomes false.

Leave out the third and the loop never ends.

## The while loop

\`while\` repeats a block for as long as a condition is true:

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count = count + 1
\`\`\`

\`\`\`text
1
2
3
4
5
\`\`\`

The syntax mirrors \`if\`: the keyword, a condition, a colon, and an indented block. The difference is what happens at the end of the block. \`if\` moves on; \`while\` goes back to the condition and checks it again.

## Tracing it

Loops are the first construct where mentally simulating the program becomes essential. Trace this one carefully.

1. \`count\` is set to \`1\`.
2. Condition: is \`1 <= 5\`? Yes. Run the block: display \`1\`, then set \`count\` to \`2\`.
3. Condition: is \`2 <= 5\`? Yes. Display \`2\`, then set \`count\` to \`3\`.
4. Condition: is \`3 <= 5\`? Yes. Display \`3\`, then set \`count\` to \`4\`.
5. Condition: is \`4 <= 5\`? Yes. Display \`4\`, then set \`count\` to \`5\`.
6. Condition: is \`5 <= 5\`? Yes. Display \`5\`, then set \`count\` to \`6\`.
7. Condition: is \`6 <= 5\`? No. The loop ends and the program continues below it.

Two details are worth extracting. The condition is checked *before* each repetition, including the first — so a loop whose condition starts false runs zero times. And after the loop, \`count\` refers to \`6\`, not \`5\`: it must exceed the limit for the loop to stop.

## The loop that never ends

Remove the progress step and the loop runs forever:

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count = count + 1
\`\`\`

If that last line were missing, \`count\` would stay at \`1\`, the condition would stay true, and the program would print \`1\` endlessly. This is an **infinite loop**.

It is the most common loop bug, and it has one cause: the state the condition depends on is never changed in a way that makes the condition false. When you write a \`while\`, form the habit of asking immediately: *what makes this stop?*

> **Key idea**
> Every \`while\` loop needs something inside it that moves the state towards ending the loop. If you cannot point at the line that will eventually make the condition false, the loop is infinite.

In this application, an infinite loop makes the page stop responding until you reload it. Nothing is damaged, but it is worth avoiding.

## Off-by-one errors

Changing \`<=\` to \`<\` changes how many times the loop runs:

\`\`\`python
count = 1

while count < 5:
    print(count)
    count = count + 1
\`\`\`

\`\`\`text
1
2
3
4
\`\`\`

Four lines, not five. Errors of exactly one repetition are so common that they have a name: **off-by-one errors**. They come from confusing "up to" with "up to and including".

The reliable defence is to check the boundaries deliberately. Ask what the first value is, what the last value is, and how many repetitions that gives — then trace the first and last repetitions by hand rather than the middle ones, since the middle is almost never where the mistake is.

## Summary

A loop repeats a block. Every loop needs setup, a condition, and progress towards ending. \`while\` checks its condition before each repetition, so a loop may run zero times. Missing progress gives an infinite loop; confusing \`<\` with \`<=\` gives an off-by-one error.`,
        },
        {
          type: "lesson",
          title: "Counters and Accumulators",
          description: "Two patterns that appear in almost every loop you will ever write.",
          instructions: `## Building a result across repetitions

A loop that only prints is limited. Most useful loops build up a result, and there are two standard ways to do it.

## The counter

A **counter** records how many times something happened. It starts at zero and increases by one when a condition is met:

\`\`\`python
number = 1
even_count = 0

while number <= 10:
    if number % 2 == 0:
        even_count = even_count + 1
    number = number + 1

print(f"Even numbers found: {even_count}")
\`\`\`

\`\`\`text
Even numbers found: 5
\`\`\`

Two variables change here, and they do different jobs. \`number\` drives the loop and always increases. \`even_count\` records a result and increases only sometimes. Confusing the two is a frequent source of bugs, so give them names that make their roles obvious.

## The accumulator

An **accumulator** builds up a total. It also starts at zero, and it adds a value rather than always adding one:

\`\`\`python
number = 1
total = 0

while number <= 5:
    total = total + number
    number = number + 1

print(f"Total: {total}")
\`\`\`

\`\`\`text
Total: 15
\`\`\`

Trace it if the result is not obvious: \`total\` moves through 0, 1, 3, 6, 10, 15 as \`number\` moves through 1 to 5.

## Where to initialise

Both patterns require a value to exist *before* the loop. Putting the initialisation inside the loop resets it every repetition:

\`\`\`python
number = 1

while number <= 5:
    total = 0
    total = total + number
    number = number + 1

print(f"Total: {total}")
\`\`\`

\`\`\`text
Total: 5
\`\`\`

The answer is \`5\`, not \`15\`, because \`total\` was set back to zero at the start of every repetition, so it only ever held the last value. This mistake produces a number that looks almost plausible, which makes it worth recognising on sight.

> **Key idea**
> A variable that must survive across repetitions is initialised **before** the loop. A variable initialised inside the loop starts fresh every time.

## Augmented assignment

Because adding to a variable is so common, Python provides a shorthand:

\`\`\`python
total = 0
total += 5
total += 3
print(total)
\`\`\`

\`\`\`text
8
\`\`\`

\`total += 5\` means exactly \`total = total + 5\`. The same works for \`-=\`, \`*=\`, and \`/=\`. It is shorter and states the intent — modify this variable — more directly. From here on this course uses it.

## Accumulating strings

Accumulators are not limited to numbers. The same pattern builds up text, starting from an empty string:

\`\`\`python
count = 1
bar = ""

while count <= 5:
    bar += "*"
    count += 1

print(bar)
\`\`\`

\`\`\`text
*****
\`\`\`

The starting value is whatever counts as "nothing" for the type being accumulated: \`0\` for numbers, \`""\` for strings.

## Tracking a maximum

A useful variation starts from the first value rather than zero:

\`\`\`python
readings = "4 9 2 7"
parts = readings.split()
index = 0
largest = 0

while index < len(parts):
    value = int(parts[index])
    if value > largest:
        largest = value
    index += 1

print(f"Largest: {largest}")
\`\`\`

\`\`\`text
Largest: 9
\`\`\`

\`split()\` breaks a string into a list of pieces at each space; \`len()\` reports how many. You meet lists properly in Module 5 — for now, note the pattern: keep a "best so far" variable, and replace it whenever something better appears.

Starting \`largest\` at \`0\` works here only because all the readings are positive. With negative values it would report \`0\` as the largest, which is wrong. That is a genuine bug hiding in a common pattern, and Module 5 shows the better approach.

## Summary

A counter starts at zero and increases by one when something is observed; an accumulator starts at an identity value and adds each item. Both must be initialised before the loop. \`+=\` is shorthand for adding to a variable in place.`,
        },
        {
          type: "exercise",
          title: "Count Down and Accumulate",
          description: "Write a while loop with a counter that decreases, and a running total.",
          instructions: `## The problem

Write a program that counts down from a starting number to 1, displaying each value, and then reports the total of all the numbers displayed.

## Input

One line containing a whole number of at least 1. Read it with \`input()\` and no prompt.

## Requirements

1. Display each number from the starting value down to \`1\`, one per line.
2. Keep a running total of the numbers displayed.
3. After the loop, display one final line in the form \`Total: 15\`.

## Example

Given \`5\`, the output is:

\`\`\`text
5
4
3
2
1
Total: 15
\`\`\`

Given \`1\`, the output is:

\`\`\`text
1
Total: 1
\`\`\`

## Guidance

The loop variable decreases this time, so your progress step subtracts. Think carefully about the condition: the loop must still run when the value is exactly 1, and stop before reaching 0.

The accumulator must be initialised before the loop, or it will reset on every repetition.

## Constraints

Use a \`while\` loop. The total must be accumulated inside the loop, not computed with a formula afterwards.`,
          starterCode: `start = int(input())

total = 0
`,
          hint: "Use a variable that begins at start and decreases with current -= 1. The condition current >= 1 keeps the loop running down to and including 1.",
          tests: [
            {
              input: "5\n",
              expectedOutput: "5\n4\n3\n2\n1\nTotal: 15",
              description: "A countdown from five with the correct sum",
            },
            {
              input: "1\n",
              expectedOutput: "1\nTotal: 1",
              description: "The smallest input still produces one line before the total",
            },
            {
              input: "3\n",
              expectedOutput: "3\n2\n1\nTotal: 6",
              description: "A shorter countdown",
            },
          ],
          solution: `start = int(input())

total = 0
current = start
while current >= 1:
    print(current)
    total += current
    current -= 1

print(f"Total: {total}")
`,
        },
        {
          type: "exercise",
          title: "Read Until a Sentinel",
          description: "Use a loop that stops when a particular value arrives rather than after a fixed count.",
          instructions: `## The problem

A **sentinel** is a special value that marks the end of a sequence of data. This is how a program handles input when it does not know in advance how much there will be.

Write a program that reads whole numbers one per line and stops when it reads \`0\`. The \`0\` marks the end and is not itself part of the data.

## Input

A series of lines, each containing a whole number. The final line is always \`0\`.

## Requirements

1. Read numbers until \`0\` arrives.
2. Count how many numbers were read, not counting the \`0\`.
3. Total them.
4. After the loop, display exactly two lines:

\`\`\`text
Count: 3
Total: 27
\`\`\`

## Example

Given the lines \`5\`, \`12\`, \`10\`, \`0\`, the output is the two lines above.

Given only the line \`0\`, the output is:

\`\`\`text
Count: 0
Total: 0
\`\`\`

## Guidance

This is the standard sentinel pattern: read one value before the loop, then loop while it is not the sentinel, doing the work and reading the next value at the end of each repetition.

Getting the order right matters. If you read a value and immediately add it without checking, the sentinel will be included in the total.

## Constraints

Handle the case where the very first line is the sentinel: the loop must then run zero times and report zeroes.`,
          starterCode: `count = 0
total = 0

value = int(input())
`,
          hint: "Read the first value before the loop. Then: while value != 0, add to the total, increase the count, and read the next value as the last statement inside the loop.",
          tests: [
            {
              input: "5\n12\n10\n0\n",
              expectedOutput: "Count: 3\nTotal: 27",
              description: "Three values are counted and totalled, and the sentinel is excluded",
            },
            {
              input: "0\n",
              expectedOutput: "Count: 0\nTotal: 0",
              description: "An immediate sentinel means the loop body never runs",
            },
            {
              input: "7\n0\n",
              expectedOutput: "Count: 1\nTotal: 7",
              description: "A single value before the sentinel",
            },
            {
              input: "-4\n4\n0\n",
              expectedOutput: "Count: 2\nTotal: 0",
              description: "Negative values are handled and only zero ends the loop",
            },
          ],
          solution: `count = 0
total = 0

value = int(input())
while value != 0:
    total += value
    count += 1
    value = int(input())

print(f"Count: {count}")
print(f"Total: {total}")
`,
        },
      ],
    ),

    lesson(
      "Iterating With for",
      "The loop that walks through a sequence, and the range of numbers that drives most of them.",
      [
        {
          type: "lesson",
          title: "The for Loop and range",
          description: "Repeating a known number of times without managing a counter yourself.",
          instructions: `## The bookkeeping problem

A counting \`while\` loop requires three pieces of bookkeeping, all of which can go wrong:

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count += 1
\`\`\`

You must initialise the counter, write the correct comparison, and remember to increase it. Forget the last and the loop never ends; use the wrong comparison and it runs one time too many or too few.

Because this pattern is so common, Python provides a construct that handles all three.

## The for loop

\`\`\`python
for count in range(1, 6):
    print(count)
\`\`\`

\`\`\`text
1
2
3
4
5
\`\`\`

There is no initialisation, no condition, and no increment. \`for\` takes each value from a sequence in turn, assigns it to the variable, and runs the block once per value. When the sequence is exhausted, the loop ends.

A \`for\` loop over a finite sequence cannot loop forever, which eliminates an entire category of bug.

## range

\`range\` produces a sequence of whole numbers. It has three forms.

With one argument, it counts from \`0\` up to but **not including** the argument:

\`\`\`python
for i in range(5):
    print(i)
\`\`\`

\`\`\`text
0
1
2
3
4
\`\`\`

Five values, starting at zero. Starting at zero is a deliberate and pervasive convention in Python; it will make more sense in the next module when indexing arrives.

With two arguments, it counts from the first up to but not including the second:

\`\`\`python
for i in range(2, 6):
    print(i)
\`\`\`

\`\`\`text
2
3
4
5
\`\`\`

With three, the last is the **step**:

\`\`\`python
for i in range(0, 10, 3):
    print(i)
\`\`\`

\`\`\`text
0
3
6
9
\`\`\`

A negative step counts downwards:

\`\`\`python
for i in range(5, 0, -1):
    print(i)
\`\`\`

\`\`\`text
5
4
3
2
1
\`\`\`

## The excluded endpoint

The upper bound is always excluded. This is the single most important thing to remember about \`range\`, and the source of nearly every off-by-one error involving it.

The convention has a practical benefit: \`range(n)\` produces exactly \`n\` values, and \`range(a, b)\` produces exactly \`b - a\` of them. Counts fall out of the arithmetic without adjustment.

To include an endpoint, add one to it. To count 1 through 5, write \`range(1, 6)\`.

> **Key idea**
> \`range(a, b)\` includes \`a\` and excludes \`b\`. If you want the loop to reach a particular last value, the second argument must be one past it.

## The loop variable

The variable named in the \`for\` line is assigned a new value at the start of each repetition. You do not assign it yourself, and assigning to it inside the loop does not affect the sequence:

\`\`\`python
for i in range(3):
    i = 99
    print(i)
\`\`\`

\`\`\`text
99
99
99
\`\`\`

The loop still ran three times, because the sequence decides that, not the variable.

When the value is not used, convention names the variable \`_\`, signalling "I need to repeat, not to count":

\`\`\`python
for _ in range(3):
    print("tick")
\`\`\`

\`\`\`text
tick
tick
tick
\`\`\`

## Accumulating with for

The counter and accumulator patterns work identically:

\`\`\`python
total = 0

for number in range(1, 101):
    total += number

print(total)
\`\`\`

\`\`\`text
5050
\`\`\`

The accumulator is still initialised before the loop. That rule does not change.

## Choosing between for and while

Use \`for\` when you know the values to iterate over: a fixed count, a range, or a collection. That is the majority of loops.

Use \`while\` when repetition depends on a condition whose end is not known in advance: reading until a sentinel, retrying until input is valid, or continuing until a computed value crosses a threshold.

A useful test: if you find yourself writing a \`while\` loop that initialises a counter, compares it, and increments it, you almost certainly wanted a \`for\`.

## Summary

\`for\` takes each value from a sequence and runs its block once per value. \`range\` produces whole numbers, excluding its upper bound, with optional start and step. Prefer \`for\` when the number of repetitions is known and \`while\` when it depends on a condition.`,
        },
        {
          type: "lesson",
          title: "Iterating Over Strings",
          description: "Walking through text one character at a time, and the two ways to do it.",
          instructions: `## A string is a sequence

\`for\` works on any sequence, and a string is a sequence of characters:

\`\`\`python
for character in "code":
    print(character)
\`\`\`

\`\`\`text
c
o
d
e
\`\`\`

The loop variable holds one character per repetition. Note that each character is itself a string, of length one; Python has no separate type for a single character.

## Counting things in text

Combine iteration with a counter and you can answer questions about text:

\`\`\`python
text = "programming"
count = 0

for character in text:
    if character in "aeiou":
        count += 1

print(f"Vowels: {count}")
\`\`\`

\`\`\`text
Vowels: 3
\`\`\`

Notice \`character in "aeiou"\`, a membership test on a string, checking whether the character appears among those five.

## Building a new string

The accumulator pattern applies to text, which lets you transform a string character by character:

\`\`\`python
text = "field notes"
result = ""

for character in text:
    if character == " ":
        result += "-"
    else:
        result += character

print(result)
\`\`\`

\`\`\`text
field-notes
\`\`\`

For this particular job \`text.replace(" ", "-")\` is better: shorter, clearer, and faster. The loop is shown because it generalises — once the rule becomes "replace spaces with hyphens but only outside brackets", no single method will do it and a loop is the answer.

That is a judgement worth developing: reach for the built-in method when one fits, and write the loop when the rule is genuinely yours.

## Iterating versus indexing

There are two ways to walk through a string, and the difference matters.

**Iterating** gives you each item directly:

\`\`\`python
for character in "code":
    print(character)
\`\`\`

**Indexing** gives you each *position*, from which you fetch the item:

\`\`\`python
text = "code"

for position in range(len(text)):
    print(position, text[position])
\`\`\`

\`\`\`text
0 c
1 o
2 d
3 e
\`\`\`

\`text[position]\` retrieves the character at that position. Positions start at \`0\`, so the last valid position is \`len(text) - 1\` — which is exactly why \`range(len(text))\` works: it produces \`0\` up to one less than the length.

Prefer iterating. It is shorter, it cannot go out of bounds, and it says what you mean. Use indexing only when you genuinely need the position, for example to report where something was found.

> **Key idea**
> Iterating over a sequence gives you its items. Indexing gives you positions, which you must then use to look items up. Reach for iteration unless the position itself is part of the answer.

## enumerate

When you need both, Python provides \`enumerate\`, which produces the position and the item together:

\`\`\`python
for position, character in enumerate("code"):
    print(position, character)
\`\`\`

\`\`\`text
0 c
1 o
2 d
3 e
\`\`\`

Two names appear after \`for\` because each item from \`enumerate\` is a pair, and Python unpacks it into the two variables. Unpacking is covered fully in Module 5. For now, treat this as the idiomatic way to get position and value at once.

## A worked example

Reporting where a character first appears:

\`\`\`python
def first_position(text, target):
    for position, character in enumerate(text):
        if character == target:
            return position
    return -1


print(first_position("programming", "g"))
print(first_position("programming", "z"))
\`\`\`

\`\`\`text
3
-1
\`\`\`

The function returns as soon as it finds the target, so it does not examine the rest of the string. Returning \`-1\` to mean "not found" is a common convention, chosen because no valid position is ever negative.

## Summary

\`for\` iterates over a string character by character. Combine it with counters and accumulators to measure and transform text. Iterate for items, index for positions, and use \`enumerate\` when you need both.`,
        },
        {
          type: "exercise",
          title: "Summarise a Line of Text",
          description: "Iterate over a string and report several counts computed in one pass.",
          instructions: `## The problem

Write a program that reads one line of text and reports three counts.

## Input

One line of text, which may contain letters, digits, spaces, and punctuation. Read it with \`input()\` and no prompt.

## Requirements

Count, in a single pass through the text:

1. \`letters\` — characters for which \`isalpha()\` is true.
2. \`digits\` — characters for which \`isdigit()\` is true.
3. \`spaces\` — characters equal to a single space.

Then display exactly three lines:

\`\`\`text
Letters: 12
Digits: 2
Spaces: 2
\`\`\`

## Example

Given \`Field notes 42\`, the output is the three lines above.

Given an empty line, the output is:

\`\`\`text
Letters: 0
Digits: 0
Spaces: 0
\`\`\`

## Guidance

Initialise all three counters before the loop. Iterate over the characters directly rather than over positions — you do not need to know where anything is, only how many there are.

\`isalpha()\` and \`isdigit()\` are string methods, so they are called on the character with a dot: \`character.isalpha()\`.

## Constraints

Use one loop. Do not call \`count()\` or any method that does the counting for you.`,
          starterCode: `text = input()

letters = 0
digits = 0
spaces = 0
`,
          hint: "for character in text: then three separate if statements inside the loop, each increasing its own counter. Print the three lines after the loop finishes.",
          tests: [
            {
              input: "Field notes 42\n",
              expectedOutput: "Letters: 10\nDigits: 2\nSpaces: 2",
              description: "A mixture of letters, digits, and spaces",
            },
            {
              input: "\n",
              expectedOutput: "Letters: 0\nDigits: 0\nSpaces: 0",
              description: "An empty line leaves every counter at zero",
            },
            {
              input: "a1 b2 c3\n",
              expectedOutput: "Letters: 3\nDigits: 3\nSpaces: 2",
              description: "Alternating letters and digits",
            },
            {
              input: "no digits here\n",
              expectedOutput: "Letters: 12\nDigits: 0\nSpaces: 2",
              description: "Text with no digits at all",
            },
          ],
          solution: `text = input()

letters = 0
digits = 0
spaces = 0

for character in text:
    if character.isalpha():
        letters += 1
    if character.isdigit():
        digits += 1
    if character == " ":
        spaces += 1

print(f"Letters: {letters}")
print(f"Digits: {digits}")
print(f"Spaces: {spaces}")
`,
        },
        {
          type: "exercise",
          title: "Build a Multiplication Row",
          description: "Use range with a step and an accumulator to build a formatted line.",
          instructions: `## The problem

Write a program that displays the first several multiples of a number on one line, separated by spaces.

## Input

Two lines:

1. A whole number, the base.
2. A whole number, how many multiples to show.

## Requirements

1. Build a single string containing the multiples of the base, from one times the base up to the requested count, separated by single spaces.
2. There must be no space at the beginning or end of the line.
3. Display exactly one line.

## Examples

Given \`3\` and \`5\`, the output is:

\`\`\`text
3 6 9 12 15
\`\`\`

Given \`7\` and \`1\`, the output is:

\`\`\`text
7
\`\`\`

## Guidance

The awkward part is the separator. Adding \`" "\` after every number leaves a trailing space; adding it before every number leaves a leading one.

One reliable approach: build the string without worrying, then remove the extra space at the end with \`strip()\`. Another: add the separator only when the accumulated string is not empty. Either is acceptable.

Remember that the accumulated string starts empty, before the loop.

## Constraints

Use a \`for\` loop with \`range\`. Do not use \`join\`, which you have not met yet.`,
          starterCode: `base = int(input())
count = int(input())

line = ""
`,
          hint: "Loop with for i in range(1, count + 1) and compute base * i. Accumulate f\"{value} \" each time, then call .strip() on the result before printing.",
          tests: [
            {
              input: "3\n5\n",
              expectedOutput: "3 6 9 12 15",
              description: "Five multiples with single spaces and no trailing space",
            },
            {
              input: "7\n1\n",
              expectedOutput: "7",
              description: "A single multiple has no separator at all",
            },
            {
              input: "10\n3\n",
              expectedOutput: "10 20 30",
              description: "A different base and count",
            },
            {
              input: "-2\n4\n",
              expectedOutput: "-2 -4 -6 -8",
              description: "A negative base still produces correctly separated values",
            },
          ],
          solution: `base = int(input())
count = int(input())

line = ""
for i in range(1, count + 1):
    line += f"{base * i} "

print(line.strip())
`,
        },
      ],
    ),

    lesson(
      "Controlling and Nesting Loops",
      "Leaving a loop early, skipping a repetition, and putting one loop inside another.",
      [
        {
          type: "lesson",
          title: "break and continue",
          description: "Two statements that alter a loop's normal flow, and when each is justified.",
          instructions: `## Stopping early

Sometimes a loop should end before its sequence is exhausted. Searching is the clearest case: once you have found what you are looking for, continuing is wasted work.

\`break\` ends the loop immediately:

\`\`\`python
for number in range(1, 101):
    if number % 17 == 0:
        print(f"First multiple of 17: {number}")
        break
\`\`\`

\`\`\`text
First multiple of 17: 17
\`\`\`

Without \`break\`, the loop would examine all 100 numbers and report six multiples. With it, execution leaves the loop the moment the first is found.

\`break\` affects only the loop containing it. Execution resumes at the first line after that loop.

## Skipping a repetition

\`continue\` abandons the current repetition and moves to the next:

\`\`\`python
for number in range(1, 11):
    if number % 2 == 0:
        continue
    print(number)
\`\`\`

\`\`\`text
1
3
5
7
9
\`\`\`

When the number is even, \`continue\` jumps back to the top and the \`print\` is skipped.

Note that this could equally be written by inverting the condition:

\`\`\`python
for number in range(1, 11):
    if number % 2 != 0:
        print(number)
\`\`\`

Both are correct. \`continue\` earns its place when there are several filtering conditions to apply before the real work, because it lets each be dismissed on its own line — the same reasoning as guard clauses in Module 3:

\`\`\`python
entries = "12,,-3,8,abc,5"

for entry in entries.split(","):
    if entry == "":
        continue
    if not entry.isdigit():
        continue
    value = int(entry)
    if value == 0:
        continue
    print(f"Accepted {value}")
\`\`\`

\`\`\`text
Accepted 12
Accepted 8
Accepted 5
\`\`\`

Each rejection is stated once and dismissed. The alternative — one deeply nested \`if\` containing all the conditions — is harder to read and harder to extend.

## Using them honestly

Both statements make a loop harder to reason about, because the block no longer runs straight through. Use them when they genuinely simplify.

Two habits keep them honest. Put \`break\` where the reason for stopping is obvious from the line above it, and prefer \`continue\` at the very top of a loop body, where it reads as a filter rather than as a jump from the middle of some work.

> **Key idea**
> \`break\` leaves the loop entirely; \`continue\` skips to the next repetition. Both apply only to the innermost loop containing them.

## Searching with a flag

A common task is to search and then report whether anything was found. One approach uses a Boolean:

\`\`\`python
text = "field notes 2024"
found = False

for character in text:
    if character.isdigit():
        found = True
        break

if found:
    print("Contains a digit")
else:
    print("No digits present")
\`\`\`

\`\`\`text
Contains a digit
\`\`\`

The variable \`found\` starts \`False\`, is set \`True\` only if the search succeeds, and is examined after the loop. This flag pattern appears constantly.

When the search lives in a function, returning directly is cleaner and needs no flag at all:

\`\`\`python
def contains_digit(text):
    for character in text:
        if character.isdigit():
            return True
    return False


print(contains_digit("field notes 2024"))
print(contains_digit("field notes"))
\`\`\`

\`\`\`text
True
False
\`\`\`

\`return\` leaves the function entirely, so it ends the loop as a side effect. The final \`return False\` is reached only when the loop completes without finding anything — which is precisely the case where the answer is false.

## Summary

\`break\` ends the innermost loop; \`continue\` moves to its next repetition. Both are best used where they replace nesting with a flat sequence of checks. In a function, returning from inside a loop often removes the need for either.`,
        },
        {
          type: "lesson",
          title: "Nested Loops and Tracing",
          description: "A loop inside a loop, how many times the inner body runs, and how to follow it.",
          instructions: `## Loops within loops

A loop's body may contain another loop. The inner loop runs to completion on every repetition of the outer one:

\`\`\`python
for row in range(1, 4):
    for column in range(1, 3):
        print(f"row {row}, column {column}")
\`\`\`

\`\`\`text
row 1, column 1
row 1, column 2
row 2, column 1
row 2, column 2
row 3, column 1
row 3, column 2
\`\`\`

Six lines: three outer repetitions, each running two inner ones. The total is the product, which is why nested loops become expensive quickly. Two nested loops over a thousand items each perform a million repetitions.

Note which variable changes faster. The inner variable runs through its whole range before the outer one advances at all. That is the single most useful fact for predicting nested-loop output.

## Building rows of text

Nested loops are the natural way to produce two-dimensional output:

\`\`\`python
for row in range(1, 4):
    line = ""
    for column in range(1, 4):
        line += f"{row * column} "
    print(line.strip())
\`\`\`

\`\`\`text
1 2 3
2 4 6
3 6 9
\`\`\`

Look closely at where \`line\` is created and where it is printed. It is initialised inside the outer loop, so each row starts empty. It is printed after the inner loop finishes, so each row is complete before it appears. Moving either statement one level in or out changes the output completely — a good example of indentation carrying meaning.

## Tracing a nested loop

When output surprises you, trace the first few repetitions in full:

\`\`\`python
total = 0

for i in range(1, 4):
    for j in range(1, 3):
        total += i * j

print(total)
\`\`\`

1. \`i\` is 1. Inner loop: \`j\` is 1, add 1, total is 1. \`j\` is 2, add 2, total is 3.
2. \`i\` is 2. Inner loop: \`j\` is 1, add 2, total is 5. \`j\` is 2, add 4, total is 9.
3. \`i\` is 3. Inner loop: \`j\` is 1, add 3, total is 12. \`j\` is 2, add 6, total is 18.

\`\`\`text
18
\`\`\`

Writing out a trace like that feels slow. It is still faster than guessing repeatedly, and it is the only reliable way to understand a loop that is behaving unexpectedly.

## A debugging technique

When a loop misbehaves and you cannot see why, print the state at the top of each repetition:

\`\`\`python
total = 0

for i in range(1, 4):
    print(f"outer i={i} total so far={total}")
    for j in range(1, 3):
        total += i * j

print(total)
\`\`\`

\`\`\`text
outer i=1 total so far=0
outer i=2 total so far=3
outer i=3 total so far=9
18
\`\`\`

That temporary output makes the loop's progress visible. Delete it once the bug is found. This is the simplest debugging tool there is, and experienced programmers use it constantly — Module 7 develops the idea into a systematic method.

## break inside a nested loop

\`break\` leaves only the loop that contains it:

\`\`\`python
for i in range(1, 4):
    for j in range(1, 4):
        if j == 2:
            break
        print(f"{i},{j}")
\`\`\`

\`\`\`text
1,1
2,1
3,1
\`\`\`

The inner loop stops when \`j\` reaches 2, but the outer loop continues, restarting the inner one each time. To leave both, the usual approach is to move the nested loops into a function and \`return\`, which exits everything at once.

> **Key idea**
> The inner loop completes fully on every single repetition of the outer loop. \`break\` and \`continue\` affect only the loop they are directly inside.

## Summary

Nested loops run the inner body once for every combination, so the repetition count multiplies. Where a variable is initialised — inside or outside the inner loop — decides whether it accumulates per row or overall. Trace and print state when the behaviour is unclear.`,
        },
        {
          type: "exercise",
          title: "Find the First Match",
          description: "Search a sequence, stop as soon as you succeed, and handle the not-found case.",
          instructions: `## The problem

Write a function that finds the first whole number in a range that is divisible by a given divisor.

## Requirements

Define a function \`first_divisible(limit, divisor)\` that:

1. Examines the numbers from \`1\` up to and including \`limit\`.
2. **Returns** the first one that divides exactly by \`divisor\`.
3. Returns \`-1\` if no number in that range qualifies.
4. Stops examining numbers as soon as it has an answer.

Then read two lines with \`input()\` and no prompt — the limit, then the divisor — and print exactly one line:

\`\`\`text
First match: 17
\`\`\`

## Examples

Given \`100\` and \`17\`, the output is \`First match: 17\`.

Given \`10\` and \`17\`, the output is \`First match: -1\`, because no number from 1 to 10 is divisible by 17.

Given \`6\` and \`4\`, the output is \`First match: 4\`.

## Guidance

Inside a function you do not need a \`break\` or a flag. Returning from inside the loop ends the function immediately, which ends the loop too.

The \`return -1\` belongs *after* the loop, not inside it. Placed inside, it would run on the very first number that does not match and the search would never continue.

## Constraints

The divisor is always at least 1. The limit is always at least 1.`,
          starterCode: `def first_divisible(limit, divisor):
    return -1


limit = int(input())
divisor = int(input())
print(f"First match: {first_divisible(limit, divisor)}")
`,
          hint: "Loop with for number in range(1, limit + 1). If number % divisor == 0, return number straight away. Put return -1 on the line after the loop, at the function's indentation level.",
          tests: [
            {
              input: "100\n17\n",
              expectedOutput: "First match: 17",
              description: "The first multiple is found well before the limit",
            },
            {
              input: "10\n17\n",
              expectedOutput: "First match: -1",
              description: "No qualifying number in range returns the sentinel",
            },
            {
              input: "6\n4\n",
              expectedOutput: "First match: 4",
              description: "The match is found partway through the range",
            },
            {
              input: "5\n1\n",
              expectedOutput: "First match: 1",
              description: "Every number divides by one, so the first is returned immediately",
            },
            {
              input: "1\n1\n",
              expectedOutput: "First match: 1",
              description: "A range containing a single number that qualifies",
            },
          ],
          solution: `def first_divisible(limit, divisor):
    for number in range(1, limit + 1):
        if number % divisor == 0:
            return number
    return -1


limit = int(input())
divisor = int(input())
print(f"First match: {first_divisible(limit, divisor)}")
`,
        },
        {
          type: "exercise",
          title: "Module 4 Checkpoint: Reading Streak Report",
          description: "Combine a sentinel loop, counters, an accumulator, and a running maximum.",
          instructions: `## The problem

A reading log records how many pages were read each day. This checkpoint combines the loop patterns from the whole module.

## Input

A series of lines, each a whole number of pages. The sequence ends with the line \`-1\`, which is a sentinel and not part of the data. Days with \`0\` pages are real data and must be counted as days.

## Requirements

Read the values and report:

1. \`Days: 5\` — how many days were recorded, excluding the sentinel.
2. \`Pages: 143\` — the total pages across all days.
3. \`Best day: 62\` — the largest single-day figure. If there were no days at all, this is \`0\`.
4. \`Longest streak: 3\` — the length of the longest run of consecutive days with at least one page. A day with \`0\` pages breaks a streak.

Display exactly four lines in that order.

## Example

Given \`10\`, \`0\`, \`31\`, \`62\`, \`40\`, \`-1\`, the output is:

\`\`\`text
Days: 5
Pages: 143
Best day: 62
Longest streak: 3
\`\`\`

The streak of 3 is the final run of 31, 62, and 40.

Given only \`-1\`, the output is:

\`\`\`text
Days: 0
Pages: 0
Best day: 0
Longest streak: 0
\`\`\`

## Guidance

You need two streak variables: the current run length, and the longest seen so far. When a day has pages, extend the current run and check whether it beats the record. When a day has none, reset the current run to zero.

Update the record *inside* the loop, immediately after extending the run. If you only check at the end, a streak that finishes before the last day will be missed.

All the counters and accumulators are initialised before the loop.

## Constraints

Use a sentinel loop. Do not assume how many days there will be.`,
          starterCode: `days = 0
pages = 0
best = 0
current_streak = 0
longest_streak = 0

value = int(input())
`,
          hint: "Inside the loop: count the day, add to pages, update best if value > best. If value > 0 then current_streak += 1 and update longest_streak if it is now larger; otherwise set current_streak back to 0. Read the next value last.",
          tests: [
            {
              input: "10\n0\n31\n62\n40\n-1\n",
              expectedOutput: "Days: 5\nPages: 143\nBest day: 62\nLongest streak: 3",
              description: "A zero day breaks the streak and the later run is the longest",
            },
            {
              input: "-1\n",
              expectedOutput: "Days: 0\nPages: 0\nBest day: 0\nLongest streak: 0",
              description: "No data at all leaves every figure at zero",
            },
            {
              input: "5\n5\n5\n-1\n",
              expectedOutput: "Days: 3\nPages: 15\nBest day: 5\nLongest streak: 3",
              description: "An unbroken streak runs to the end of the data",
            },
            {
              input: "0\n0\n-1\n",
              expectedOutput: "Days: 2\nPages: 0\nBest day: 0\nLongest streak: 0",
              description: "Days with no pages still count as days but never start a streak",
            },
            {
              input: "20\n0\n5\n-1\n",
              expectedOutput: "Days: 3\nPages: 25\nBest day: 20\nLongest streak: 1",
              description: "Two separate one-day streaks leave the record at one",
            },
          ],
          solution: `days = 0
pages = 0
best = 0
current_streak = 0
longest_streak = 0

value = int(input())
while value != -1:
    days += 1
    pages += value
    if value > best:
        best = value
    if value > 0:
        current_streak += 1
        if current_streak > longest_streak:
            longest_streak = current_streak
    else:
        current_streak = 0
    value = int(input())

print(f"Days: {days}")
print(f"Pages: {pages}")
print(f"Best day: {best}")
print(f"Longest streak: {longest_streak}")
`,
        },
      ],
    ),
  ],
)

export default moduleFour

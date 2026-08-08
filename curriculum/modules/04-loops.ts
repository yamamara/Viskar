import { module, lesson, type ModuleSource } from "../types.ts"

const moduleFour: ModuleSource = module(
  "Repetition and Loops",
  "Making a program repeat work: while loops, for loops, the patterns built from them, and how to trace them when they go wrong.",
  [
    lesson(
      "Repeating With while",
      "The loop that runs as long as a condition stays true, and the data that controls it.",
      [
        {
          type: "lesson",
          title: "Why Programs Repeat",
          description: "The limits of writing every step by hand, and the shape of a loop.",
          instructions: `## Writing it out does not work for long

Suppose you want to show the numbers 1 to 5. With what you know so far:

\`\`\`python
print(1)
print(2)
print(3)
print(4)
print(5)
\`\`\`

That works. Now show 1 to 1000. This method breaks down. Not because it is difficult, but because nobody can look after a thousand lines. And if the last number were given to the program while it ran, you could not write it out at all, because you would not know how many lines to write.

Repetition is what lets a program handle an amount of work that is not known in advance.

## The shape of a loop

A **loop** runs a block of code more than once. Every loop, in every language, has three parts. Being able to name them will save you a lot of confusion:

1. **Setup.** Data that exists before the loop begins.
2. **A condition.** Checked before each repeat, to decide whether to go on.
3. **Progress.** Something inside the loop that changes the data, so that the condition finally becomes false.

Leave out the third part and the loop never ends.

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

The form looks like \`if\`: the keyword, a condition, a colon, and an indented block. The difference is what happens at the end of the block. \`if\` moves on. \`while\` goes back to the condition and checks it again.

## Tracing it

A loop is the first thing you will write where running the program in your head really matters. Trace this one carefully.

1. \`count\` is set to \`1\`.
2. Condition: is \`1 <= 5\`? Yes. Run the block: show \`1\`, then set \`count\` to \`2\`.
3. Condition: is \`2 <= 5\`? Yes. Show \`2\`, then set \`count\` to \`3\`.
4. Condition: is \`3 <= 5\`? Yes. Show \`3\`, then set \`count\` to \`4\`.
5. Condition: is \`4 <= 5\`? Yes. Show \`4\`, then set \`count\` to \`5\`.
6. Condition: is \`5 <= 5\`? Yes. Show \`5\`, then set \`count\` to \`6\`.
7. Condition: is \`6 <= 5\`? No. The loop ends, and the program carries on below it.

Two details are worth pulling out. The condition is checked *before* each repeat, including the first one. So a loop whose condition is false at the start runs zero times. And after the loop, \`count\` refers to \`6\`, not \`5\`. It must go past the limit before the loop can stop.

## The loop that never ends

Take away the progress step, and the loop runs forever:

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count = count + 1
\`\`\`

If that last line were missing, \`count\` would stay at \`1\`, the condition would stay true, and the program would print \`1\` for ever. This is an **infinite loop**.

It is the most common loop bug, and it has one cause. The data that the condition depends on is never changed in a way that makes the condition false. When you write a \`while\`, build the habit of asking at once: *what makes this stop?*

> **Key idea**
> Every \`while\` loop needs something inside it that moves the data towards ending the loop. If you cannot point to the line that will finally make the condition false, the loop is infinite.

In this application, an infinite loop makes the page stop answering until you reload it. Nothing is damaged, but it is better avoided.

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

Four lines, not five. Mistakes of exactly one repeat are so common that they have a name: **off-by-one errors**. They come from mixing up "up to" with "up to and including".

The safe defence is to check the boundaries on purpose. Ask what the first value is, what the last value is, and how many repeats that gives. Then trace the first and the last repeat by hand, not the ones in the middle. The middle is almost never where the mistake hides.

## Summary

A loop repeats a block. Every loop needs setup, a condition, and progress towards the end. \`while\` checks its condition before each repeat, so a loop may run zero times. Missing progress gives an infinite loop. Mixing up \`<\` and \`<=\` gives an off-by-one error.`,
        },
        {
          type: "lesson",
          title: "Counters and Accumulators",
          description: "Two patterns that appear in almost every loop you will ever write.",
          instructions: `## Building a result across repeats

A loop that only prints is limited. Most useful loops build up a result, and there are two standard ways to do it.

## The counter

A **counter** records how many times something happened. It starts at zero, and it goes up by one when a condition is met:

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

Two variables change here, and they do different jobs. \`number\` drives the loop and always goes up. \`even_count\` records a result and goes up only sometimes. Mixing up the two is a frequent cause of bugs, so give them names that make their jobs obvious.

## The accumulator

An **accumulator** builds up a total. It also starts at zero, but it adds a value instead of always adding one:

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

Trace it if the answer is not clear. \`total\` moves through 0, 1, 3, 6, 10, 15 as \`number\` moves from 1 to 5.

## Where to set the starting value

Both patterns need a value to exist *before* the loop. If you set the starting value inside the loop, it is reset on every repeat:

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

The answer is \`5\`, not \`15\`, because \`total\` went back to zero at the start of every repeat. So it only ever held the last value. This mistake gives a number that looks almost believable, which is why it is worth learning to spot at once.

> **Key idea**
> A variable that must survive across repeats is given its starting value **before** the loop. A variable set inside the loop starts fresh every time.

## A shorter way to add

Adding to a variable is so common that Python has a short form:

\`\`\`python
total = 0
total += 5
total += 3
print(total)
\`\`\`

\`\`\`text
8
\`\`\`

\`total += 5\` means exactly \`total = total + 5\`. The same works for \`-=\`, \`*=\`, and \`/=\`. It is shorter, and it says what you mean — change this variable — more directly. From here on, this course uses it.

## Building up strings

Accumulators are not only for numbers. The same pattern builds up text, starting from an empty string:

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

The starting value is whatever counts as "nothing" for the type you are building: \`0\` for numbers, \`""\` for strings.

## Keeping track of the largest

A useful change to the pattern starts from the first value instead of zero:

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

\`split()\` breaks a string into a list of pieces at every space. \`len()\` says how many pieces there are. You meet lists properly in Module 5. For now, notice the pattern: keep a "best so far" variable, and replace it whenever something better appears.

Starting \`largest\` at \`0\` works here only because all the readings are positive. With negative values it would report \`0\` as the largest, which is wrong. That is a real bug hiding inside a common pattern, and Module 5 shows the better way.

## Summary

A counter starts at zero and goes up by one when something is seen. An accumulator starts at an empty value and adds each item. Both must be given a starting value before the loop. \`+=\` is the short way to add to a variable in place.`,
        },
        {
          type: "exercise",
          title: "Count Down and Accumulate",
          description: "Write a while loop with a counter that goes down, and a running total.",
          instructions: `## The problem

Write a program that counts down from a starting number to 1, showing each value, and then reports the total of all the numbers it showed.

## Input

One line holding a whole number of at least 1. Read it with \`input()\` and no prompt.

## Requirements

1. Show each number from the starting value down to \`1\`, one per line.
2. Keep a running total of the numbers you showed.
3. After the loop, show one last line in the form \`Total: 15\`.

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

This time the loop variable goes down, so your progress step subtracts. Think carefully about the condition. The loop must still run when the value is exactly 1, and it must stop before it reaches 0.

The accumulator must be given its starting value before the loop, or it will reset on every repeat.

## Constraints

Use a \`while\` loop. The total must be built up inside the loop, not worked out with a formula afterwards.`,
          starterCode: `start = int(input())

total = 0
`,
          hint: "Use a variable that begins at start and goes down with current -= 1. The condition current >= 1 keeps the loop running down to 1 and includes it.",
          tests: [
            {
              input: "5\n",
              expectedOutput: "5\n4\n3\n2\n1\nTotal: 15",
              description: "A countdown from five with the correct total",
            },
            {
              input: "1\n",
              expectedOutput: "1\nTotal: 1",
              description: "The smallest input still gives one line before the total",
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
          description: "Use a loop that stops when a certain value arrives, not after a fixed number of repeats.",
          instructions: `## The problem

A **sentinel** is a special value that marks the end of a set of data. This is how a program handles input when it does not know in advance how much data will come.

Write a program that reads whole numbers, one per line, and stops when it reads \`0\`. The \`0\` marks the end. It is not part of the data.

## Input

A series of lines, each holding a whole number. The last line is always \`0\`.

## Requirements

1. Read numbers until \`0\` arrives.
2. Count how many numbers were read, not counting the \`0\`.
3. Add them up.
4. After the loop, show exactly two lines:

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

This is the standard sentinel pattern. Read one value before the loop. Then loop while that value is not the sentinel, do the work, and read the next value at the end of each repeat.

The order matters. If you read a value and add it at once without checking, the sentinel will end up in the total.

## Constraints

Deal with the case where the very first line is the sentinel. The loop must then run zero times and report zeros.`,
          starterCode: `count = 0
total = 0

value = int(input())
`,
          hint: "Read the first value before the loop. Then: while value != 0, add to the total, add one to the count, and read the next value as the last statement inside the loop.",
          tests: [
            {
              input: "5\n12\n10\n0\n",
              expectedOutput: "Count: 3\nTotal: 27",
              description: "Three values are counted and added, and the sentinel is left out",
            },
            {
              input: "0\n",
              expectedOutput: "Count: 0\nTotal: 0",
              description: "A sentinel on the first line means the loop body never runs",
            },
            {
              input: "7\n0\n",
              expectedOutput: "Count: 1\nTotal: 7",
              description: "A single value before the sentinel",
            },
            {
              input: "-4\n4\n0\n",
              expectedOutput: "Count: 2\nTotal: 0",
              description: "Negative values are handled, and only zero ends the loop",
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
          description: "Repeating a known number of times without looking after a counter yourself.",
          instructions: `## The problem of keeping count

A counting \`while\` loop needs three pieces of housekeeping, and every one of them can go wrong:

\`\`\`python
count = 1

while count <= 5:
    print(count)
    count += 1
\`\`\`

You must give the counter a starting value, write the right comparison, and remember to increase it. Forget the last one and the loop never ends. Use the wrong comparison and it runs one time too many or one time too few.

This pattern is so common that Python gives you a form that handles all three for you.

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

There is no starting value, no condition, and no increase. \`for\` takes each value from a sequence in turn, assigns it to the variable, and runs the block once for each value. When the sequence runs out, the loop ends.

A \`for\` loop over a sequence that ends cannot run for ever. That removes a whole family of bugs.

## range

\`range\` produces a sequence of whole numbers. It has three forms.

With one argument, it counts from \`0\` up to the argument, but it does **not** include it:

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

Five values, starting at zero. Starting at zero is a deliberate habit that runs through the whole of Python. It will make more sense in the next module, when you meet positions inside a list.

With two arguments, it counts from the first up to the second, without including the second:

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

With three arguments, the last one is the **step**:

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

## The end value is left out

The upper limit is always left out. This is the most important thing to remember about \`range\`, and it is the cause of nearly every off-by-one error that involves it.

The habit has a practical benefit. \`range(n)\` gives exactly \`n\` values, and \`range(a, b)\` gives exactly \`b - a\` of them. The count comes straight out of the arithmetic, with nothing to adjust.

To include an end value, add one to it. To count 1 through 5, write \`range(1, 6)\`.

> **Key idea**
> \`range(a, b)\` includes \`a\` and leaves out \`b\`. If you want the loop to reach a particular last value, the second argument must be one past it.

## The loop variable

The variable named on the \`for\` line receives a new value at the start of every repeat. You do not assign it yourself, and assigning to it inside the loop does not change the sequence:

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

When you do not use the value, the usual habit is to name the variable \`_\`. That says "I need to repeat, not to count":

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

The counter and accumulator patterns work in exactly the same way:

\`\`\`python
total = 0

for number in range(1, 101):
    total += number

print(total)
\`\`\`

\`\`\`text
5050
\`\`\`

The accumulator still gets its starting value before the loop. That rule does not change.

## Choosing between for and while

Use \`for\` when you know the values you will go through: a fixed count, a range, or a collection. That covers most loops.

Use \`while\` when the repeating depends on a condition whose end you cannot know in advance: reading until a sentinel, asking again until the input is valid, or continuing until a calculated value passes a limit.

Here is a useful test. If you find yourself writing a \`while\` loop that sets a counter, compares it, and increases it, you almost certainly wanted a \`for\`.

## Summary

\`for\` takes each value from a sequence and runs its block once for each one. \`range\` produces whole numbers, leaves out its upper limit, and can take a start and a step. Prefer \`for\` when the number of repeats is known, and \`while\` when it depends on a condition.`,
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

The loop variable holds one character in each repeat. Note that each character is itself a string of length one. Python has no separate type for a single character.

## Counting things in text

Put iteration together with a counter, and you can answer questions about text:

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

Notice \`character in "aeiou"\`. That is a membership test on a string. It checks whether the character is one of those five.

## Building a new string

The accumulator pattern also works for text, so you can change a string one character at a time:

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

For this particular job, \`text.replace(" ", "-")\` is better. It is shorter, clearer, and faster. The loop is shown because it can grow. Once the rule becomes "replace spaces with hyphens, but only outside brackets", no single method will do it, and a loop is the answer.

That is a judgement worth building. Use a built-in method when one fits the job. Write the loop when the rule is truly your own.

## Iterating and indexing

There are two ways to walk through a string, and the difference matters.

**Iterating** gives you each item directly:

\`\`\`python
for character in "code":
    print(character)
\`\`\`

**Indexing** gives you each *position*, and you use the position to fetch the item:

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

\`text[position]\` fetches the character at that position. Positions start at \`0\`, so the last valid position is \`len(text) - 1\`. That is exactly why \`range(len(text))\` works. It gives \`0\` up to one less than the length.

Prefer iterating. It is shorter, it cannot go past the end, and it says what you mean. Use indexing only when you truly need the position, for example to report where something was found.

> **Key idea**
> Iterating over a sequence gives you its items. Indexing gives you positions, which you must then use to look items up. Choose iteration unless the position itself is part of the answer.

## enumerate

When you need both, Python gives you \`enumerate\`. It produces the position and the item together:

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

Two names appear after \`for\` because each item from \`enumerate\` is a pair, and Python unpacks the pair into the two variables. Unpacking is covered fully in Module 5. For now, treat this as the normal way to get a position and a value at the same time.

## A worked example

Here is a function that reports where a character first appears:

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

The function returns as soon as it finds the target, so it does not look at the rest of the string. Returning \`-1\` to mean "not found" is a common habit, chosen because a real position is never negative.

## Summary

\`for\` goes through a string character by character. Join it with counters and accumulators to measure and change text. Iterate for items, index for positions, and use \`enumerate\` when you need both.`,
        },
        {
          type: "exercise",
          title: "Summarise a Line of Text",
          description: "Go through a string and report several counts worked out in one pass.",
          instructions: `## The problem

Write a program that reads one line of text and reports three counts.

## Input

One line of text. It may hold letters, digits, spaces, and punctuation marks. Read it with \`input()\` and no prompt.

## Requirements

Count these, in a single pass through the text:

1. \`letters\` — characters for which \`isalpha()\` is true.
2. \`digits\` — characters for which \`isdigit()\` is true.
3. \`spaces\` — characters equal to a single space.

Then show exactly three lines:

\`\`\`text
Letters: 10
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

Give all three counters a starting value before the loop. Go through the characters directly instead of going through positions. You do not need to know where anything is, only how many there are.

\`isalpha()\` and \`isdigit()\` are string methods, so you call them on the character with a dot: \`character.isalpha()\`.

## Constraints

Use one loop. Do not call \`count()\` or any other method that does the counting for you.`,
          starterCode: `text = input()

letters = 0
digits = 0
spaces = 0
`,
          hint: "Write for character in text: and then three separate if statements inside the loop, each one increasing its own counter. Print the three lines after the loop ends.",
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
              description: "Letters and digits one after another",
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
          description: "Use range with a step and an accumulator to build one formatted line.",
          instructions: `## The problem

Write a program that shows the first few multiples of a number on one line, with spaces between them.

## Input

Two lines:

1. A whole number, the base.
2. A whole number: how many multiples to show.

## Requirements

1. Build a single string with the multiples of the base, from one times the base up to the number asked for, separated by single spaces.
2. There must be no space at the start or at the end of the line.
3. Show exactly one line.

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

The awkward part is the separator. Adding \`" "\` after every number leaves a space at the end. Adding it before every number leaves a space at the start.

Here is one safe way: build the string without worrying, then remove the extra space at the end with \`strip()\`. Another way: add the separator only when the string you are building is not empty. Either way is accepted.

Remember that the string you build starts empty, before the loop.

## Constraints

Use a \`for\` loop with \`range\`. Do not use \`join\`, which you have not met yet.`,
          starterCode: `base = int(input())
count = int(input())

line = ""
`,
          hint: "Loop with for i in range(1, count + 1) and work out base * i. Add f\"{value} \" each time, then call .strip() on the result before you print it.",
          tests: [
            {
              input: "3\n5\n",
              expectedOutput: "3 6 9 12 15",
              description: "Five multiples with single spaces and no space at the end",
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
              description: "A negative base still gives correctly separated values",
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
      "Leaving a loop early, skipping one repeat, and putting one loop inside another.",
      [
        {
          type: "lesson",
          title: "break and continue",
          description: "Two statements that change the normal flow of a loop, and when each one is fair to use.",
          instructions: `## Stopping early

Sometimes a loop should end before its sequence runs out. Searching is the clearest example. Once you have found what you were looking for, going on is wasted work.

\`break\` ends the loop at once:

\`\`\`python
for number in range(1, 101):
    if number % 17 == 0:
        print(f"First multiple of 17: {number}")
        break
\`\`\`

\`\`\`text
First multiple of 17: 17
\`\`\`

Without \`break\`, the loop would look at all 100 numbers and report six multiples. With it, the program leaves the loop the moment it finds the first one.

\`break\` affects only the loop that holds it. The program carries on at the first line after that loop.

## Skipping one repeat

\`continue\` gives up the current repeat and moves to the next one:

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

When the number is even, \`continue\` jumps back to the top, and the \`print\` is skipped.

Note that you could write the same thing by turning the condition round:

\`\`\`python
for number in range(1, 11):
    if number % 2 != 0:
        print(number)
\`\`\`

Both are correct. \`continue\` earns its place when there are several filters to apply before the real work, because each one can be dealt with on its own line. This is the same idea as the guard clauses in Module 3:

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

Each refusal is stated once and then finished with. The other way — one deeply nested \`if\` holding all the conditions — is harder to read and harder to add to.

## Using them honestly

Both statements make a loop harder to follow, because the block no longer runs straight through. Use them when they truly make things simpler.

Two habits keep them honest. Put \`break\` where the reason for stopping is clear from the line above it. And prefer \`continue\` at the very top of a loop body, where it reads as a filter, not as a jump out of the middle of some work.

> **Key idea**
> \`break\` leaves the loop completely. \`continue\` skips to the next repeat. Both work only on the innermost loop that holds them.

## Searching with a flag

A common job is to search, and then report whether anything was found. One way uses a Boolean:

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

The variable \`found\` starts as \`False\`. It becomes \`True\` only if the search succeeds, and it is checked after the loop. This flag pattern appears all the time.

When the search sits inside a function, returning directly is cleaner and needs no flag at all:

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

\`return\` leaves the whole function, so it ends the loop as well. The last line, \`return False\`, is reached only when the loop finishes without finding anything, and that is exactly the case where the answer is false.

## Summary

\`break\` ends the innermost loop. \`continue\` moves to its next repeat. Both are best used where they replace nesting with a flat list of checks. Inside a function, returning from within a loop often removes the need for either one.`,
        },
        {
          type: "lesson",
          title: "Nested Loops and Tracing",
          description: "A loop inside a loop, how many times the inner body runs, and how to follow it.",
          instructions: `## Loops inside loops

The body of a loop may hold another loop. The inner loop runs all the way through on every repeat of the outer one:

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

Six lines: three outer repeats, and each one runs two inner repeats. The total is the two counts multiplied, and that is why nested loops become expensive so quickly. Two nested loops over a thousand items each would do a million repeats.

Notice which variable changes faster. The inner variable runs through its whole range before the outer one moves at all. That single fact is the most useful thing for predicting the output of nested loops.

## Building rows of text

Nested loops are the natural way to produce output shaped like a table:

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

Look closely at where \`line\` is created and where it is printed. It is set to empty inside the outer loop, so every row starts empty. It is printed after the inner loop finishes, so every row is complete before it appears. Moving either statement one level in or out changes the output completely. This is a good example of indentation carrying meaning.

## Tracing a nested loop

When the output surprises you, trace the first few repeats in full:

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

Writing out a trace like that feels slow. It is still faster than guessing again and again, and it is the only sure way to understand a loop that is behaving strangely.

## A debugging trick

When a loop misbehaves and you cannot see why, print the state at the top of each repeat:

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

That temporary output makes the progress of the loop visible. Delete it once you have found the bug. This is the simplest debugging tool there is, and experienced programmers use it constantly. Module 7 grows the idea into a full method.

## break inside a nested loop

\`break\` leaves only the loop that holds it:

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

The inner loop stops when \`j\` reaches 2, but the outer loop carries on and starts the inner one again each time. To leave both loops, the usual way is to move them into a function and use \`return\`, which leaves everything at once.

> **Key idea**
> The inner loop runs all the way through on every single repeat of the outer loop. \`break\` and \`continue\` affect only the loop they sit directly inside.

## Summary

Nested loops run the inner body once for every combination, so the number of repeats is multiplied. Where a variable is set — inside or outside the inner loop — decides whether it builds up per row or across the whole run. Trace the loop and print the state when the behaviour is not clear.`,
        },
        {
          type: "exercise",
          title: "Find the First Match",
          description: "Search a sequence, stop as soon as you succeed, and deal with the not-found case.",
          instructions: `## The problem

Write a function that finds the first whole number in a range that divides exactly by a given divisor.

## Requirements

Define a function \`first_divisible(limit, divisor)\` that:

1. Looks at the numbers from \`1\` up to \`limit\`, including \`limit\`.
2. **Returns** the first one that divides exactly by \`divisor\`.
3. Returns \`-1\` if no number in that range fits.
4. Stops looking as soon as it has an answer.

Then read two lines with \`input()\` and no prompt — the limit, then the divisor — and print exactly one line:

\`\`\`text
First match: 17
\`\`\`

## Examples

Given \`100\` and \`17\`, the output is \`First match: 17\`.

Given \`10\` and \`17\`, the output is \`First match: -1\`, because no number from 1 to 10 divides by 17.

Given \`6\` and \`4\`, the output is \`First match: 4\`.

## Guidance

Inside a function you do not need a \`break\` or a flag. Returning from inside the loop ends the function at once, and that ends the loop too.

The \`return -1\` belongs *after* the loop, not inside it. If you put it inside, it would run on the very first number that does not match, and the search would never continue.

## Constraints

The divisor is always at least 1. The limit is always at least 1.`,
          starterCode: `def first_divisible(limit, divisor):
    return -1


limit = int(input())
divisor = int(input())
print(f"First match: {first_divisible(limit, divisor)}")
`,
          hint: "Loop with for number in range(1, limit + 1). If number % divisor == 0, return number at once. Put return -1 on the line after the loop, at the indentation level of the function.",
          tests: [
            {
              input: "100\n17\n",
              expectedOutput: "First match: 17",
              description: "The first multiple is found long before the limit",
            },
            {
              input: "10\n17\n",
              expectedOutput: "First match: -1",
              description: "When no number in the range fits, the sentinel is returned",
            },
            {
              input: "6\n4\n",
              expectedOutput: "First match: 4",
              description: "The match is found part of the way through the range",
            },
            {
              input: "5\n1\n",
              expectedOutput: "First match: 1",
              description: "Every number divides by one, so the first one is returned at once",
            },
            {
              input: "1\n1\n",
              expectedOutput: "First match: 1",
              description: "A range with a single number that fits",
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
          description: "Put together a sentinel loop, counters, an accumulator, and a running largest value.",
          instructions: `## The problem

A reading log records how many pages were read each day. This checkpoint puts together the loop patterns from the whole module.

## Input

A series of lines, each holding a whole number of pages. The list ends with the line \`-1\`. That is a sentinel and not part of the data. Days with \`0\` pages are real data, and they must be counted as days.

## Requirements

Read the values and report:

1. \`Days: 5\` — how many days were recorded, not counting the sentinel.
2. \`Pages: 143\` — the total pages across all days.
3. \`Best day: 62\` — the largest single-day number. If there were no days at all, this is \`0\`.
4. \`Longest streak: 3\` — the length of the longest run of days one after another with at least one page. A day with \`0\` pages breaks a streak.

Show exactly four lines, in that order.

## Example

Given \`10\`, \`0\`, \`31\`, \`62\`, \`40\`, \`-1\`, the output is:

\`\`\`text
Days: 5
Pages: 143
Best day: 62
Longest streak: 3
\`\`\`

The streak of 3 is the last run: 31, 62, and 40.

Given only \`-1\`, the output is:

\`\`\`text
Days: 0
Pages: 0
Best day: 0
Longest streak: 0
\`\`\`

## Guidance

You need two streak variables: the length of the current run, and the longest run seen so far. When a day has pages, make the current run longer and check whether it beats the record. When a day has none, set the current run back to zero.

Update the record *inside* the loop, right after you make the run longer. If you only check at the end, you will miss a streak that finished before the last day.

All the counters and accumulators are given their starting values before the loop.

## Constraints

Use a sentinel loop. Do not assume how many days there will be.`,
          starterCode: `days = 0
pages = 0
best = 0
current_streak = 0
longest_streak = 0

value = int(input())
`,
          hint: "Inside the loop: count the day, add to pages, and update best if value > best. If value > 0 then current_streak += 1 and update longest_streak if it is now bigger. Otherwise set current_streak back to 0. Read the next value last of all.",
          tests: [
            {
              input: "10\n0\n31\n62\n40\n-1\n",
              expectedOutput: "Days: 5\nPages: 143\nBest day: 62\nLongest streak: 3",
              description: "A day with no pages breaks the streak, and the later run is the longest",
            },
            {
              input: "-1\n",
              expectedOutput: "Days: 0\nPages: 0\nBest day: 0\nLongest streak: 0",
              description: "No data at all leaves every number at zero",
            },
            {
              input: "5\n5\n5\n-1\n",
              expectedOutput: "Days: 3\nPages: 15\nBest day: 5\nLongest streak: 3",
              description: "An unbroken streak that runs to the end of the data",
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

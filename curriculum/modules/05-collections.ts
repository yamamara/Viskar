import { module, lesson, type ModuleSource } from "../types.ts"

const moduleFive: ModuleSource = module(
  "Collections and Structured Data",
  "Holding many values in one place: lists, tuples, dictionaries, and sets, and choosing the right one for a problem.",
  [
    lesson(
      "Lists",
      "A collection that keeps its order and can be changed, and the positions used to reach inside it.",
      [
        {
          type: "lesson",
          title: "Creating and Indexing Lists",
          description: "Keeping many values under one name, and getting them back by position.",
          instructions: `## The problem with separate variables

Suppose you record five temperature readings:

\`\`\`python
reading_1 = 18
reading_2 = 21
reading_3 = 19
reading_4 = 24
reading_5 = 22
print(reading_3)
\`\`\`

\`\`\`text
19
\`\`\`

This method does not grow. To add them up, you must name all five. And if you do not know in advance how many readings there will be, the method fails completely. You cannot write variable names for values you have not seen yet.

## A list

A **list** holds many values under one name, in order:

\`\`\`python
readings = [18, 21, 19, 24, 22]
print(readings)
print(len(readings))
\`\`\`

\`\`\`text
[18, 21, 19, 24, 22]
5
\`\`\`

Square brackets create a list, and commas separate the items. \`len()\` says how many items there are. It is the same function you used on strings, because both are sequences.

Printing a list shows Python's way of writing it, with the brackets and commas. That is only a way of displaying it, not the list itself. It is written like that so you could type the output back into a program as code.

A list may hold any type, and even a mixture of types. In practice, most lists hold items of one kind:

\`\`\`python
mixed = [1, "two", 3.0, True]
empty = []
print(mixed)
print(len(empty))
\`\`\`

\`\`\`text
[1, 'two', 3.0, True]
0
\`\`\`

## Indexing

An **index** is a position. Square brackets after a list fetch the item at that position:

\`\`\`python
readings = [18, 21, 19, 24, 22]
print(readings[0])
print(readings[2])
\`\`\`

\`\`\`text
18
19
\`\`\`

**Indexing starts at zero.** The first item is at index \`0\`, the second at \`1\`, and so on. This catches every beginner, so it deserves a moment of thought rather than plain memorising.

Here is one way to think about it. An index does not say "which item". It says "how far from the start". The first item is zero steps from the beginning.

One useful result of this: for a list of length \`n\`, the valid indexes run from \`0\` to \`n - 1\`. The last item of a five-item list is at index \`4\`.

> **Key idea**
> An index is a position, not a count. \`readings[2]\` is the *third* item, because it is two steps from the start.

## Index out of range

Asking for a position that does not exist raises an error:

\`\`\`python
readings = [18, 21, 19]
print(readings[2])
\`\`\`

\`\`\`text
19
\`\`\`

Asking for \`readings[3]\` would raise \`IndexError: list index out of range\`. This is a runtime error. The code was well formed, and the failure happened while it was running.

An \`IndexError\` nearly always means an off-by-one mistake. Usually you looped up to \`len(items)\` instead of \`len(items) - 1\`, or you assumed the list held more items than it does.

## Negative indexes

Negative indexes count backwards from the end:

\`\`\`python
readings = [18, 21, 19, 24, 22]
print(readings[-1])
print(readings[-2])
\`\`\`

\`\`\`text
22
19
\`\`\`

\`-1\` is the last item, and \`-2\` is the one before it. There is no \`-0\`, because \`0\` already means the first item.

\`items[-1]\` is the normal way to reach the last item. The other way, \`items[len(items) - 1]\`, is longer and easier to get wrong.

## Changing an item

Unlike strings, lists can be changed in place:

\`\`\`python
readings = [18, 21, 19]
readings[1] = 99
print(readings)
\`\`\`

\`\`\`text
[18, 99, 19]
\`\`\`

This is a real difference in kind. Lists are **mutable**: the value itself can change. Strings are **immutable**: \`text[0] = "X"\` raises an error, and every string method gives back a new string instead.

That difference has effects far beyond the way the code is written, and the last lesson of this module comes back to it.

## Going through a list

\`for\` walks through a list in exactly the same way as it walks through a string:

\`\`\`python
readings = [18, 21, 19]
total = 0

for reading in readings:
    total += reading

print(total)
\`\`\`

\`\`\`text
58
\`\`\`

As with strings, prefer going through the items to going through the positions. Use \`enumerate\` when you need the position as well.

## Summary

A list holds ordered values under one name, and you create it with square brackets. Indexing starts at zero, so valid positions run from \`0\` to \`len(items) - 1\`. Negative indexes count from the end. Lists are mutable, so an item can be replaced in place.`,
        },
        {
          type: "lesson",
          title: "Slicing and Growing Lists",
          description: "Taking a section of a sequence, and the methods that add and remove items.",
          instructions: `## Taking a section

A **slice** takes out part of a sequence. You write a colon between a start position and a stop position:

\`\`\`python
letters = ["a", "b", "c", "d", "e"]
print(letters[1:4])
\`\`\`

\`\`\`text
['b', 'c', 'd']
\`\`\`

The start is included and the stop is left out. This is the same rule as \`range\`, and for the same reason: the number of items is the difference between the two numbers. \`[1:4]\` gives \`4 - 1 = 3\` items.

If you leave out either end, it means "from the beginning" or "to the end":

\`\`\`python
letters = ["a", "b", "c", "d", "e"]
print(letters[:2])
print(letters[3:])
print(letters[:])
\`\`\`

\`\`\`text
['a', 'b']
['d', 'e']
['a', 'b', 'c', 'd', 'e']
\`\`\`

Negative positions work in slices too, and \`[-2:]\` is the normal way to say "the last two items".

## A slice makes a new list

\`\`\`python
original = [1, 2, 3]
section = original[0:2]
section[0] = 99
print(original)
print(section)
\`\`\`

\`\`\`text
[1, 2, 3]
[99, 2]
\`\`\`

Changing the slice left the original alone, because slicing built a new list. This matters, and the last lesson of this module explains exactly when it protects you and when it does not.

## Slicing strings

Slices work on strings too, and they give back new strings:

\`\`\`python
text = "programming"
print(text[0:4])
print(text[-4:])
\`\`\`

\`\`\`text
prog
ming
\`\`\`

## Adding items

\`append\` adds one item to the end:

\`\`\`python
readings = []
readings.append(18)
readings.append(21)
print(readings)
\`\`\`

\`\`\`text
[18, 21]
\`\`\`

This is the standard way to build a list inside a loop. It is the accumulator pattern again, starting from \`[]\` instead of \`0\` or \`""\`:

\`\`\`python
squares = []

for number in range(1, 6):
    squares.append(number * number)

print(squares)
\`\`\`

\`\`\`text
[1, 4, 9, 16, 25]
\`\`\`

\`insert\` puts an item at a given position and moves the rest along:

\`\`\`python
items = ["a", "c"]
items.insert(1, "b")
print(items)
\`\`\`

\`\`\`text
['a', 'b', 'c']
\`\`\`

\`extend\` adds every item from another list. That is different from appending the list itself:

\`\`\`python
first = [1, 2]
first.extend([3, 4])
print(first)

second = [1, 2]
second.append([3, 4])
print(second)
\`\`\`

\`\`\`text
[1, 2, 3, 4]
[1, 2, [3, 4]]
\`\`\`

The second result holds three items, and the last one is itself a list. That is sometimes what you want, but usually it is not.

## These methods return None

This is the most important trap in this stage:

\`\`\`python
readings = [3, 1, 2]
result = readings.append(4)
print(readings)
print(result)
\`\`\`

\`\`\`text
[3, 1, 2, 4]
None
\`\`\`

\`append\` changed the list *in place* and returned \`None\`. So writing \`readings = readings.append(4)\` destroys your list and puts \`None\` in its place.

This is the opposite of the way string methods work, and the difference is worth saying directly. A string method cannot change the string, so it gives back a new one, and you must assign it. A list method usually changes the list, so it gives back nothing, and you must not assign it.

> **Key idea**
> String methods give back a new value: assign the result. List methods that change the list return \`None\`: do not assign the result.

## Removing items

\`\`\`python
items = ["a", "b", "c", "b"]
items.remove("b")
print(items)

last = items.pop()
print(last)
print(items)
\`\`\`

\`\`\`text
['a', 'c', 'b']
'c'
['a', 'b']
\`\`\`

\`remove\` deletes the first item equal to the argument, and raises \`ValueError\` if there is none. \`pop\` removes the last item and *gives it back*, or does the same for the item at a position you name. \`pop\` is the exception to the rule above. It returns something useful exactly because removing the item would otherwise lose the value.

## Membership and counting

\`\`\`python
readings = [18, 21, 19, 21]
print(21 in readings)
print(readings.count(21))
print(readings.index(19))
\`\`\`

\`\`\`text
True
2
2
\`\`\`

\`in\` tests membership. \`count\` says how many times a value appears. \`index\` gives the position of its first appearance. \`index\` raises \`ValueError\` when the value is missing, so check with \`in\` first if it might be.

## Summary

A slice \`[start:stop]\` gives a new sequence, including the start and leaving out the stop. \`append\`, \`insert\`, and \`extend\` add items. \`remove\` and \`pop\` take them away. Methods that change a list in place return \`None\`, so you must not assign their results.`,
        },
        {
          type: "exercise",
          title: "Slice a Sequence",
          description: "Take out particular sections of a list using indexes and slices.",
          instructions: `## The problem

You are given a list of daily step counts. Report several sections of it.

## Input

One line holding whole numbers separated by single spaces. Read it with \`input()\` and no prompt.

The starter code turns the line into a list of integers for you.

## Requirements

Show exactly five lines:

\`\`\`text
First: 4200
Last: 7100
First three: [4200, 5300, 6100]
Last two: [6900, 7100]
Middle: [5300, 6100, 6900]
\`\`\`

Where:

1. \`First:\` is the item at the first position.
2. \`Last:\` is the item at the last position, taken with a negative index.
3. \`First three:\` is a slice of the first three items.
4. \`Last two:\` is a slice of the last two items.
5. \`Middle:\` is a slice with the first and last items removed.

## Example

Given \`4200 5300 6100 6900 7100\`, the output is the five lines above.

## Guidance

For \`Last\`, use \`-1\` instead of working out the length.

For \`Middle\`, a slice that starts at 1 and stops at -1 removes one item from each end, whatever the length is.

Printing a list directly gives Python's way of writing it, with brackets and commas, and that is exactly the form required here.

## Constraints

The input always holds at least five numbers. Use slices, not loops.`,
          starterCode: `steps = [int(part) for part in input().split()]
`,
          hint: "steps[0] and steps[-1] give the two single values. steps[:3], steps[-2:], and steps[1:-1] give the three sections.",
          tests: [
            {
              input: "4200 5300 6100 6900 7100\n",
              expectedOutput:
                "First: 4200\nLast: 7100\nFirst three: [4200, 5300, 6100]\nLast two: [6900, 7100]\nMiddle: [5300, 6100, 6900]",
              description: "Five values cut into the required sections",
            },
            {
              input: "1 2 3 4 5 6 7\n",
              expectedOutput:
                "First: 1\nLast: 7\nFirst three: [1, 2, 3]\nLast two: [6, 7]\nMiddle: [2, 3, 4, 5, 6]",
              description: "A longer list, where the middle slice must fit the length",
            },
          ],
          solution: `steps = [int(part) for part in input().split()]

print(f"First: {steps[0]}")
print(f"Last: {steps[-1]}")
print(f"First three: {steps[:3]}")
print(f"Last two: {steps[-2:]}")
print(f"Middle: {steps[1:-1]}")
`,
        },
        {
          type: "exercise",
          title: "Build a List in a Loop",
          description: "Build up a list with append, then report on what you built.",
          instructions: `## The problem

Read a series of measurements and keep only the ones that reach a limit.

## Input

The first line is a whole number: the limit. Every line after it is a whole number measurement. The data ends with the sentinel \`-1\`.

## Requirements

1. Build a list holding only the measurements that are **greater than or equal to** the limit, in the order they arrived.
2. Show exactly three lines:

\`\`\`text
Kept: [30, 45, 30]
Count: 3
Total: 105
\`\`\`

If nothing was kept, show:

\`\`\`text
Kept: []
Count: 0
Total: 0
\`\`\`

## Example

Given \`25\`, then \`30\`, \`12\`, \`45\`, \`8\`, \`30\`, \`-1\`, the output is the three lines above.

## Guidance

Start with an empty list before the loop, and \`append\` to it when a measurement passes. Remember that \`append\` changes the list and returns \`None\`, so call it on its own line instead of assigning its result.

The count is the length of the list you built. The total can be built up as you go, or worked out afterwards with \`sum()\`, which adds every item of a list.

## Constraints

The sentinel \`-1\` ends the data and is never a measurement itself. The limit is always at least 0.`,
          starterCode: `threshold = int(input())

kept = []

value = int(input())
`,
          hint: "Inside the sentinel loop, use if value >= threshold: kept.append(value). After the loop, len(kept) gives the count and sum(kept) gives the total.",
          tests: [
            {
              input: "25\n30\n12\n45\n8\n30\n-1\n",
              expectedOutput: "Kept: [30, 45, 30]\nCount: 3\nTotal: 105",
              description: "Values at or above the limit are kept in the order they arrived",
            },
            {
              input: "100\n30\n12\n-1\n",
              expectedOutput: "Kept: []\nCount: 0\nTotal: 0",
              description: "A limit that nothing reaches leaves an empty list",
            },
            {
              input: "0\n0\n5\n-1\n",
              expectedOutput: "Kept: [0, 5]\nCount: 2\nTotal: 5",
              description: "A limit of zero keeps a measurement of zero, because the test includes equal values",
            },
            {
              input: "10\n-1\n",
              expectedOutput: "Kept: []\nCount: 0\nTotal: 0",
              description: "A sentinel on the first line means there are no measurements at all",
            },
          ],
          solution: `threshold = int(input())

kept = []

value = int(input())
while value != -1:
    if value >= threshold:
        kept.append(value)
    value = int(input())

print(f"Kept: {kept}")
print(f"Count: {len(kept)}")
print(f"Total: {sum(kept)}")
`,
        },
      ],
    ),

    lesson(
      "Ordering and Summarising Lists",
      "Sorting, summary functions, and working out statistics without losing the original data.",
      [
        {
          type: "lesson",
          title: "Sorting and Aggregating",
          description: "Two ways to sort, and the built-in functions that summarise a collection.",
          instructions: `## Built-in summaries

Python gives you functions that turn a whole collection into one value:

\`\`\`python
readings = [18, 21, 19, 24, 22]
print(sum(readings))
print(min(readings))
print(max(readings))
print(len(readings))
\`\`\`

\`\`\`text
104
18
24
5
\`\`\`

These take the place of the accumulator loops from Module 4. Writing the loop taught you what the function does. Using the function is what you should do now, because it is shorter, faster, and impossible to get slightly wrong.

An average uses two of them together:

\`\`\`python
readings = [18, 21, 19, 24, 22]
mean = sum(readings) / len(readings)
print(f"{mean:.1f}")
\`\`\`

\`\`\`text
20.8
\`\`\`

Watch out for one danger. \`len(readings)\` is zero for an empty list, and dividing by zero raises \`ZeroDivisionError\`. Any function that works out an average must decide what to do when there is no data. Guarding at the top is the usual answer:

\`\`\`python
def mean(values):
    if not values:
        return 0.0
    return sum(values) / len(values)


print(mean([2, 4, 6]))
print(mean([]))
\`\`\`

\`\`\`text
4.0
0.0
\`\`\`

\`if not values:\` uses the truth rules you met earlier: an empty list counts as false. It reads as "if there are no values", which is exactly what you mean.

## Two ways to sort

\`sort()\` is a list method. It puts the list in order **in place**:

\`\`\`python
readings = [18, 21, 19]
readings.sort()
print(readings)
\`\`\`

\`\`\`text
[18, 19, 21]
\`\`\`

\`sorted()\` is a function. It gives back a **new** sorted list and leaves the original alone:

\`\`\`python
readings = [18, 21, 19]
ordered = sorted(readings)
print(readings)
print(ordered)
\`\`\`

\`\`\`text
[18, 21, 19]
[18, 19, 21]
\`\`\`

This is the in-place versus new-value rule again. \`sort()\` changes the list and returns \`None\`. \`sorted()\` changes nothing and returns a list.

That difference causes one very common bug:

\`\`\`python
readings = [18, 21, 19]
readings = readings.sort()
print(readings)
\`\`\`

\`\`\`text
None
\`\`\`

The list is gone. Either call \`readings.sort()\` on its own line, or write \`readings = sorted(readings)\`. Never mix the two.

> **Key idea**
> \`list.sort()\` puts a list in order in place and returns \`None\`. \`sorted(list)\` returns a new list and changes nothing. Assigning the result of \`.sort()\` destroys your data.

Prefer \`sorted()\` when the original order still matters for anything. Order is data, and it is easy to regret throwing it away.

## Reverse order and your own order

Both accept \`reverse=True\` for order from largest to smallest:

\`\`\`python
readings = [18, 21, 19]
print(sorted(readings, reverse=True))
\`\`\`

\`\`\`text
[21, 19, 18]
\`\`\`

\`reverse=True\` is a **keyword argument**: the name says what the value means. Module 6 covers these properly. Notice how much clearer it is than a bare \`True\` would be.

Both also accept \`key\`, which is a function that decides what to sort by:

\`\`\`python
words = ["banana", "fig", "cherry"]
print(sorted(words))
print(sorted(words, key=len))
\`\`\`

\`\`\`text
['banana', 'cherry', 'fig']
['fig', 'banana', 'cherry']
\`\`\`

The first sorts in alphabetical order. The second sorts by length, because \`key=len\` tells \`sorted\` to compare \`len(word)\` instead of the word itself.

Notice that \`len\` is written without brackets. You are passing the function itself, not calling it. \`key=len()\` would try to call \`len\` with no arguments and fail. This difference between a function and a call becomes very important in Module 13.

Sorting text pays attention to capital letters, and all capitals come before all small letters. To sort the way a person expects, use \`key=str.lower\`:

\`\`\`python
names = ["delta", "Alpha", "charlie"]
print(sorted(names))
print(sorted(names, key=str.lower))
\`\`\`

\`\`\`text
['Alpha', 'charlie', 'delta']
['Alpha', 'charlie', 'delta']
\`\`\`

Here the two happen to agree. With \`["delta", "Alpha", "Charlie"]\` they would not, because \`Charlie\` would sort before the neighbours of \`charlie\`.

## Reversing without sorting

\`\`\`python
items = [1, 2, 3]
print(items[::-1])
\`\`\`

\`\`\`text
[3, 2, 1]
\`\`\`

A slice with a step of \`-1\` gives a reversed copy. This is a short and widely used trick, and it works on strings too.

## Summary

\`sum\`, \`min\`, \`max\`, and \`len\` summarise a collection. Guard against an empty collection before you divide. \`list.sort()\` puts a list in order in place and returns \`None\`. \`sorted()\` returns a new list. Both take \`reverse\` and \`key\`.`,
        },
        {
          type: "exercise",
          title: "Summarise a Set of Readings",
          description: "Work out statistics from a list without disturbing its original order.",
          instructions: `## The problem

Given a list of numbers, report several statistics about them.

## Input

One line of whole numbers separated by single spaces.

## Requirements

Show exactly five lines:

\`\`\`text
Original: [22, 18, 25, 18, 30]
Sorted: [18, 18, 22, 25, 30]
Lowest: 18
Highest: 30
Mean: 22.6
\`\`\`

Where:

1. \`Original:\` shows the list in the order it arrived, unchanged.
2. \`Sorted:\` shows the values from smallest to largest.
3. \`Lowest:\` and \`Highest:\` are the smallest and the largest values.
4. \`Mean:\` is the average, shown with **one** decimal place.

## Example

Given \`22 18 25 18 30\`, the output is the five lines above.

## Guidance

The first requirement is the interesting one. If you sort the list in place, the original order is gone, and the first line will be wrong. Use \`sorted()\`, which gives back a new list.

You do not need a loop for any part of this. The built-in summary functions do the work.

## Constraints

The input always holds at least one number, so you do not need to guard against an empty list here.`,
          starterCode: `values = [int(part) for part in input().split()]
`,
          hint: "Use sorted(values) to get a new ordered list without touching values itself. min(), max(), and sum()/len() give the rest. Format the mean with {mean:.1f}.",
          tests: [
            {
              input: "22 18 25 18 30\n",
              expectedOutput:
                "Original: [22, 18, 25, 18, 30]\nSorted: [18, 18, 22, 25, 30]\nLowest: 18\nHighest: 30\nMean: 22.6",
              description: "The statistics are correct and the original order is kept",
            },
            {
              input: "5\n",
              expectedOutput: "Original: [5]\nSorted: [5]\nLowest: 5\nHighest: 5\nMean: 5.0",
              description: "A single value is its own smallest, largest, and average",
            },
            {
              input: "-3 7 -1\n",
              expectedOutput: "Original: [-3, 7, -1]\nSorted: [-3, -1, 7]\nLowest: -3\nHighest: 7\nMean: 1.0",
              description: "Negative values sort and summarise correctly",
            },
          ],
          solution: `values = [int(part) for part in input().split()]

mean = sum(values) / len(values)
print(f"Original: {values}")
print(f"Sorted: {sorted(values)}")
print(f"Lowest: {min(values)}")
print(f"Highest: {max(values)}")
print(f"Mean: {mean:.1f}")
`,
        },
        {
          type: "exercise",
          title: "Repair a Sorting Bug",
          description: "A program loses its data by assigning the result of a method that works in place.",
          instructions: `## The problem

The program in the editor should show a list of names in alphabetical order, taking no notice of capital letters. At the moment it fails with an error.

## Your task

Run it and read the error message. Then fix the program.

## Expected output

\`\`\`text
Sorted: ['Alpha', 'bravo', 'Charlie', 'delta']
Count: 4
\`\`\`

## Requirements

1. The sort must take no notice of capital letters, so \`bravo\` comes after \`Alpha\` and before \`Charlie\`.
2. The output must be exactly the two lines above.

## Guidance

The error message names a type that has no such attribute. Work out which value ended up with that type, and why.

Remember the rule from this lesson. One of Python's two sorting tools puts a list in order and hands back nothing. The other hands back a new list and changes nothing. Assigning the result of the first one destroys the list.

There are two correct repairs. Either call the in-place method on a line of its own, or change to the function that gives back a new list. Both are accepted.

## Why this matters

The sign of trouble here — an error several lines *after* the real mistake — is common. The line that raised the error is where the damage was noticed, not where it was done.`,
          starterCode: `names = ["delta", "Alpha", "Charlie", "bravo"]

names = names.sort(key=str.lower)

print(f"Sorted: {names}")
print(f"Count: {len(names)}")
`,
          hint: "names.sort(...) returns None, so the assignment puts None in place of the list. Either remove the assignment and keep names.sort(key=str.lower) on its own line, or use names = sorted(names, key=str.lower).",
          tests: [
            {
              expectedOutput: "Sorted: ['Alpha', 'bravo', 'Charlie', 'delta']\nCount: 4",
              description: "The names are sorted without regard to capital letters, and the list still exists afterwards",
            },
          ],
          solution: `names = ["delta", "Alpha", "Charlie", "bravo"]

names = sorted(names, key=str.lower)

print(f"Sorted: {names}")
print(f"Count: {len(names)}")
`,
        },
      ],
    ),

    lesson(
      "Tuples and Unpacking",
      "A collection that cannot change, and the way to pull several values out at once.",
      [
        {
          type: "lesson",
          title: "Tuples",
          description: "A sequence that cannot be changed, and why fixing a collection is sometimes exactly right.",
          instructions: `## A collection that cannot change

A **tuple** is an ordered collection, like a list, but it cannot be changed after it is made. Round brackets create one:

\`\`\`python
position = (3, 7)
print(position)
print(position[0])
print(len(position))
\`\`\`

\`\`\`text
(3, 7)
3
2
\`\`\`

Indexing, slicing, \`len\`, \`in\`, and going through the items all work exactly as they do for lists. The difference is that \`position[0] = 9\` raises a \`TypeError\`. There is no \`append\`, no \`remove\`, and no \`sort\`, because all of those would change the tuple.

The brackets can be left out when the meaning is clear. You have already used this without noticing:

\`\`\`python
day = "Sunday"
print(day in ("Saturday", "Sunday"))
\`\`\`

\`\`\`text
True
\`\`\`

A tuple with only one item needs a comma at the end. \`(5,)\` is a tuple, but \`(5)\` is just the number 5 inside brackets. This surprises people now and then, so it is worth knowing.

## Why fix a collection

Being unable to change something sounds like a limit, and it is. The question is what you get in return.

You get a promise. When a value is a tuple, no part of your program can change it. So you can pass it anywhere without wondering whether it will come back different. Bugs where some faraway function quietly changes your data cannot happen.

You also make your meaning clear. A list says "these items may change". A tuple says "this is a fixed group". A map position has exactly two parts, and neither one is optional. A tuple says that. A list would suggest that you might add a third part later.

Here is the practical rule. Use a **list** for a changing number of similar things. Use a **tuple** for a fixed number of related things.

\`\`\`python
readings = [18, 21, 19, 24]
coordinate = (51.5, -0.12)
\`\`\`

The readings could grow. The coordinate could not sensibly gain a third number.

## Unpacking

**Unpacking** assigns the parts of a collection to several names at once:

\`\`\`python
coordinate = (51.5, -0.12)
latitude, longitude = coordinate
print(latitude)
print(longitude)
\`\`\`

\`\`\`text
51.5
-0.12
\`\`\`

The number of names must match the number of items, or Python raises a \`ValueError\`.

This works for lists too, and it is far clearer than using indexes:

\`\`\`python
parts = "2024-07-15".split("-")
year, month, day = parts
print(f"{day}/{month}/{year}")
\`\`\`

\`\`\`text
15/07/2024
\`\`\`

Compare that with \`parts[0]\`, \`parts[1]\`, and \`parts[2]\`. The unpacked version names each piece, so the meaning is written on the page instead of held in the reader's head.

Unpacking also gives a neat way to swap two values:

\`\`\`python
a = 1
b = 2
a, b = b, a
print(a, b)
\`\`\`

\`\`\`text
2 1
\`\`\`

The whole right-hand side is worked out before any assignment happens, so you need no temporary variable.

## Returning several values

The most common use of tuples is returning more than one value from a function:

\`\`\`python
def summarise(values):
    return min(values), max(values), sum(values) / len(values)


lowest, highest, mean = summarise([4, 8, 6])
print(lowest, highest, mean)
\`\`\`

\`\`\`text
4 8 6.0
\`\`\`

The \`return\` builds a tuple from the three expressions, and the calling code unpacks it. It reads as though the function returned three things, which is exactly what was meant.

You have met this already with \`enumerate\`. It produces a position-and-value tuple, and the \`for\` statement unpacks it into two names.

> **Key idea**
> A tuple is a fixed group of related values. Returning one is how a Python function hands back several results at once, and unpacking is how the caller gives them names.

## Summary

A tuple is an ordered collection that cannot be changed, written with round brackets. Use lists for changing collections of similar items, and tuples for fixed groups of related values. Unpacking assigns several names at once, and it is the standard way to receive more than one returned value.`,
        },
        {
          type: "exercise",
          title: "Return Several Values",
          description: "Write a function that returns a tuple, and unpack it where you call it.",
          instructions: `## The problem

Write a function that studies a list of numbers and returns three results at once.

## Requirements

1. Define a function \`analyse(values)\` that **returns a tuple** of three items, in this order:
   - the smallest value
   - the largest value
   - the range, which is the largest minus the smallest
2. If \`values\` is empty, return \`(0, 0, 0)\`.
3. Read one line of whole numbers separated by spaces. The line may be empty.
4. Unpack the returned tuple into three named variables.
5. Show exactly three lines:

\`\`\`text
Lowest: 12
Highest: 44
Range: 32
\`\`\`

## Examples

Given \`30 12 44 19\`, the output is the three lines above.

Given an empty line, the output is:

\`\`\`text
Lowest: 0
Highest: 0
Range: 0
\`\`\`

## Guidance

\`input().split()\` on an empty line gives an empty list, so the guard inside the function really can be reached. Deal with it in a guard clause before you call \`min\` or \`max\`. Both of those raise \`ValueError\` on an empty collection.

Return the three values with commas between them, and Python builds the tuple for you. Where you call the function, write three names with commas between them to unpack it.

## Constraints

Unpack the result into three variables. Do not use an index on the returned tuple.`,
          starterCode: `def analyse(values):
    return (0, 0, 0)


values = [int(part) for part in input().split()]
`,
          hint: "Inside the function, guard with if not values: return (0, 0, 0). Then return min(values), max(values), max(values) - min(values). Where you call it, write lowest, highest, spread = analyse(values).",
          tests: [
            {
              input: "30 12 44 19\n",
              expectedOutput: "Lowest: 12\nHighest: 44\nRange: 32",
              description: "Several values give a correct smallest, largest, and range",
            },
            {
              input: "\n",
              expectedOutput: "Lowest: 0\nHighest: 0\nRange: 0",
              description: "Empty input is handled by the guard instead of raising an error",
            },
            {
              input: "7\n",
              expectedOutput: "Lowest: 7\nHighest: 7\nRange: 0",
              description: "A single value has a range of zero",
            },
            {
              input: "-5 -1\n",
              expectedOutput: "Lowest: -5\nHighest: -1\nRange: 4",
              description: "Negative values give a positive range",
            },
          ],
          solution: `def analyse(values):
    if not values:
        return (0, 0, 0)
    lowest = min(values)
    highest = max(values)
    return lowest, highest, highest - lowest


values = [int(part) for part in input().split()]
lowest, highest, spread = analyse(values)
print(f"Lowest: {lowest}")
print(f"Highest: {highest}")
print(f"Range: {spread}")
`,
        },
        {
          type: "exercise",
          title: "Unpack Structured Text",
          description: "Split a record into named parts and swap two of them.",
          instructions: `## The problem

Read a date and a name from one line, using unpacking instead of indexes.

## Input

One line in the form \`YYYY-MM-DD|Surname,Forename\`.

## Requirements

1. Split the line on \`|\` and unpack it into two names in one statement.
2. Split the date on \`-\` and unpack it into \`year\`, \`month\`, and \`day\` in one statement.
3. Split the name on \`,\` and unpack it into \`surname\` and \`forename\` in one statement.
4. Show exactly two lines:

\`\`\`text
Date: 15/07/2024
Name: Ada Lovelace
\`\`\`

## Example

Given \`2024-07-15|Lovelace,Ada\`, the output is the two lines above.

Given \`1999-01-02|Hopper,Grace\`:

\`\`\`text
Date: 02/01/1999
Name: Grace Hopper
\`\`\`

## Guidance

Unpacking is the whole point of this exercise. Writing \`parts[0]\` and \`parts[1]\` would work, but it would say nothing about what each piece means.

The number of names on the left must match the number of pieces exactly, or Python raises \`ValueError\`.

## Constraints

Use three unpacking assignments. Do not use square brackets to index into any list.`,
          starterCode: `line = input()
`,
          hint: "date_part, name_part = line.split(\"|\"), then year, month, day = date_part.split(\"-\"), and surname, forename = name_part.split(\",\").",
          tests: [
            {
              input: "2024-07-15|Lovelace,Ada\n",
              expectedOutput: "Date: 15/07/2024\nName: Ada Lovelace",
              description: "The parts of the date are reordered and the name parts are swapped",
            },
            {
              input: "1999-01-02|Hopper,Grace\n",
              expectedOutput: "Date: 02/01/1999\nName: Grace Hopper",
              description: "Zeros at the front of the date are kept",
            },
            {
              input: "2000-12-31|Noether,Emmy\n",
              expectedOutput: "Date: 31/12/2000\nName: Emmy Noether",
              description: "A different record unpacks in the same way",
            },
          ],
          solution: `line = input()

date_part, name_part = line.split("|")
year, month, day = date_part.split("-")
surname, forename = name_part.split(",")

print(f"Date: {day}/{month}/{year}")
print(f"Name: {forename} {surname}")
`,
        },
      ],
    ),

    lesson(
      "Dictionaries",
      "Looking values up by a key that means something, instead of by position.",
      [
        {
          type: "lesson",
          title: "Keys and Values",
          description: "A collection you can look into with any label you choose, and the errors that come with it.",
          instructions: `## When position is the wrong handle

Suppose you record how many pages you read for each subject. With two lists side by side:

\`\`\`python
subjects = ["history", "biology", "statistics"]
pages = [40, 25, 60]
print(pages[subjects.index("biology")])
\`\`\`

\`\`\`text
25
\`\`\`

That works, and it is unpleasant. The two lists must stay the same length and in the same order for ever. Nothing makes sure of that, and one small mistake quietly attaches every value to the wrong subject.

The real problem is that position is not a useful handle here. What you want is to look things up *by subject*.

## A dictionary

A **dictionary** stores **key and value pairs**. Curly brackets create one, with a colon between each key and its value:

\`\`\`python
pages = {"history": 40, "biology": 25, "statistics": 60}
print(pages["biology"])
print(len(pages))
\`\`\`

\`\`\`text
25
3
\`\`\`

\`len\` counts the pairs, and each key appears only once.

Square brackets look a value up by its key, in the same way that they look a list item up by its index. The difference is that the key carries meaning. \`pages["biology"]\` says what it fetches. \`pages[1]\` does not.

## Adding and changing

Assigning to a key sets its value. If the key is new, the pair is created:

\`\`\`python
pages = {"history": 40}
pages["biology"] = 25
pages["history"] = 45
print(pages)
\`\`\`

\`\`\`text
{'history': 45, 'biology': 25}
\`\`\`

There is no separate "add" and "change". Both are assignment. A key can appear only once, so assigning to a key that already exists replaces its value.

A dictionary keeps the order in which pairs were added, so items appear in the order they first went in.

## Missing keys

Looking up a key that is not there raises \`KeyError\`:

\`\`\`python
pages = {"history": 40}
print("biology" in pages)
\`\`\`

\`\`\`text
False
\`\`\`

Writing \`pages["biology"]\` there would raise \`KeyError: 'biology'\`. This is the most common dictionary error, and there are two good defences.

Check first with \`in\`, which tests the **keys**:

\`\`\`python
pages = {"history": 40}

if "biology" in pages:
    print(pages["biology"])
else:
    print("No record")
\`\`\`

\`\`\`text
No record
\`\`\`

Or use \`get\`, which returns \`None\` instead of raising an error, and which accepts a value to use instead:

\`\`\`python
pages = {"history": 40}
print(pages.get("biology"))
print(pages.get("biology", 0))
print(pages.get("history", 0))
\`\`\`

\`\`\`text
None
0
40
\`\`\`

\`get\` with a default value is the cleanest way to read something that may not be there, and you will see it constantly in real code.

> **Key idea**
> \`items[key]\` raises \`KeyError\` when the key is missing. \`items.get(key, default)\` gives the default instead. Use the second whenever a missing key is normal rather than a bug.

## What may be a key

Keys must be values that cannot change. In practice that means strings, numbers, or tuples. A list cannot be a key, because it could change, and then the dictionary would no longer be able to find it.

Values have no such rule. They may be anything, including lists and other dictionaries.

Keys are compared exactly, so \`"Biology"\` and \`"biology"\` are two different keys. When keys come from input, tidy them first.

## Removing

\`\`\`python
pages = {"history": 40, "biology": 25}
del pages["history"]
print(pages)

removed = pages.pop("biology")
print(removed)
print(pages)
\`\`\`

\`\`\`text
{'biology': 25}
25
{}
\`\`\`

\`del\` removes a pair. \`pop\` removes it and gives back the value, and it accepts a default so that it does not raise an error when the key is missing.

## Lists and dictionaries side by side

Use a **list** when the items have a natural order and you work with them by position or one after another: a series of readings, a queue of jobs.

Use a **dictionary** when each item has a natural name and you look things up by that name: pages for each subject, price for each product code, count for each word.

If you find yourself searching a list to find the item with a particular name, you almost certainly wanted a dictionary.

## Summary

A dictionary holds key and value pairs, and looks values up by key. Assignment both adds and changes. A missing key raises \`KeyError\`, so use \`in\` or \`get\` with a default. Keys must be values that cannot change, and they are compared exactly.`,
        },
        {
          type: "lesson",
          title: "Iterating Over Dictionaries",
          description: "Walking through keys, values, and pairs, and the counting pattern.",
          instructions: `## Three ways to go through a dictionary

Going through a dictionary directly gives you its **keys**:

\`\`\`python
pages = {"history": 40, "biology": 25}

for subject in pages:
    print(subject)
\`\`\`

\`\`\`text
history
biology
\`\`\`

Since you have the key, you can look the value up. But there is a better way.

\`.values()\` gives the values:

\`\`\`python
pages = {"history": 40, "biology": 25}
print(sum(pages.values()))
\`\`\`

\`\`\`text
65
\`\`\`

\`.items()\` gives both, as one tuple for each pair, which \`for\` unpacks:

\`\`\`python
pages = {"history": 40, "biology": 25}

for subject, count in pages.items():
    print(f"{subject}: {count}")
\`\`\`

\`\`\`text
history: 40
biology: 25
\`\`\`

\`.items()\` is the one to choose whenever you need both, and it is clearer than looking each value up inside the loop.

## Sorting what a dictionary holds

A dictionary keeps the order in which items were added, not sorted order. To show it sorted, sort it when you display it:

\`\`\`python
pages = {"history": 40, "biology": 25, "statistics": 60}

for subject in sorted(pages):
    print(f"{subject}: {pages[subject]}")
\`\`\`

\`\`\`text
biology: 25
history: 40
statistics: 60
\`\`\`

\`sorted(pages)\` sorts the keys. To order by value, sort the pairs and tell \`sorted\` to compare the second part of each pair:

\`\`\`python
pages = {"history": 40, "biology": 25, "statistics": 60}

for subject, count in sorted(pages.items(), key=lambda pair: pair[1], reverse=True):
    print(f"{subject}: {count}")
\`\`\`

\`\`\`text
statistics: 60
history: 40
biology: 25
\`\`\`

\`lambda pair: pair[1]\` is a small function written on the spot. It takes one argument and gives back its second part. Module 13 covers \`lambda\` properly. For now, read it as "sort by the value part of each pair". This exact line is worth remembering, because putting a dictionary in order of value is a very common need.

## Counting

The most useful dictionary pattern counts how often things appear:

\`\`\`python
words = ["red", "blue", "red", "green", "red"]
counts = {}

for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)
\`\`\`

\`\`\`text
{'red': 3, 'blue': 1, 'green': 1}
\`\`\`

The single line inside the loop deserves a careful look, because it does the whole job.

\`counts.get(word, 0)\` reads the current count, or \`0\` if this word has not been seen before. Adding \`1\` gives the new count. The assignment stores it, and it creates the pair the first time.

Without \`get\`, the same job needs a condition:

\`\`\`python
words = ["red", "blue", "red"]
counts = {}

for word in words:
    if word in counts:
        counts[word] = counts[word] + 1
    else:
        counts[word] = 1

print(counts)
\`\`\`

\`\`\`text
{'red': 2, 'blue': 1}
\`\`\`

Both are correct. The \`get\` version is better because it states the rule once, instead of splitting it across two branches.

## Grouping

A related pattern collects items instead of counting them. The value is a list:

\`\`\`python
entries = ["history:40", "biology:25", "history:15"]
grouped = {}

for entry in entries:
    subject, amount = entry.split(":")
    if subject not in grouped:
        grouped[subject] = []
    grouped[subject].append(int(amount))

print(grouped)
\`\`\`

\`\`\`text
{'history': [40, 15], 'biology': [25]}
\`\`\`

The \`if subject not in grouped\` line creates an empty list the first time each subject appears. Without it, \`append\` would raise \`KeyError\`. Note that \`get\` does not help here. It would give back a *new* empty list each time, and adding to a list that nobody kept has no effect at all.

## Summary

Going through a dictionary gives keys. \`.values()\` gives values. \`.items()\` gives pairs to unpack. Sort at the moment you display, and use \`key\` to sort by value. Count with \`counts[key] = counts.get(key, 0) + 1\`, and group by creating an empty list the first time you see a key.`,
        },
        {
          type: "exercise",
          title: "Tally Word Frequencies",
          description: "Count how often words appear with a dictionary, and report the results in a fixed order.",
          instructions: `## The problem

Count how often each word appears in a line of text.

## Input

One line of text holding words separated by spaces. Read it with \`input()\` and no prompt.

## Requirements

1. Take no notice of capital letters, so \`Red\` and \`red\` are the same word.
2. Count how many times each different word appears.
3. Show one line for each different word, in alphabetical order, in this form:

\`\`\`text
blue: 1
green: 1
red: 3
\`\`\`

4. After the counts, show one last line:

\`\`\`text
Distinct words: 3
\`\`\`

## Example

Given \`red blue Red green RED\`, the output is the four lines above.

Given an empty line, the output is only:

\`\`\`text
Distinct words: 0
\`\`\`

## Guidance

Make the whole line small letters before you split it. That deals with the capital-letter rule in one step.

Build the counts with the \`get\` pattern from this lesson. Then go through the sorted keys to show the results.

\`split()\` with no arguments deals sensibly with several spaces in a row, and it gives an empty list for an empty line, so you need no special case.

## Constraints

Sort the output in alphabetical order by word. Do not sort by count.`,
          starterCode: `text = input()

counts = {}
`,
          hint: "words = text.lower().split(), then for word in words: counts[word] = counts.get(word, 0) + 1. Show the results with for word in sorted(counts).",
          tests: [
            {
              input: "red blue Red green RED\n",
              expectedOutput: "blue: 1\ngreen: 1\nred: 3\nDistinct words: 3",
              description: "Words are counted without regard to capital letters and reported in alphabetical order",
            },
            {
              input: "\n",
              expectedOutput: "Distinct words: 0",
              description: "An empty line gives no word lines at all",
            },
            {
              input: "one\n",
              expectedOutput: "one: 1\nDistinct words: 1",
              description: "A single word appears once",
            },
            {
              input: "b a b a b\n",
              expectedOutput: "a: 2\nb: 3\nDistinct words: 2",
              description: "Alphabetical order is used, not the order in which words first appear",
            },
          ],
          solution: `text = input()

counts = {}
for word in text.lower().split():
    counts[word] = counts.get(word, 0) + 1

for word in sorted(counts):
    print(f"{word}: {counts[word]}")

print(f"Distinct words: {len(counts)}")
`,
        },
        {
          type: "exercise",
          title: "Look Up Values Safely",
          description: "Deal with missing keys without raising an error, using get and membership tests.",
          instructions: `## The problem

A price list holds the cost of several items. Given a series of item names that customers ask for, report each price and deal with names that are not in stock.

## Input

The first line holds the price list as \`name=price\` pairs separated by spaces, for example \`bolt=3 washer=1 nut=2\`.

Every line after that holds one item name. The list ends with the sentinel \`done\`.

## Requirements

1. Build a dictionary from the first line, joining each name to its price as an integer.
2. For each name asked for, show one line:
   - \`bolt costs 3\` when the item is in stock.
   - \`spanner is not stocked\` when it is not.
3. After the sentinel, show one last line with the total cost of the items that were in stock:

\`\`\`text
Total: 5
\`\`\`

Requests for items that are not in stock add nothing to the total.

## Example

Given \`bolt=3 washer=1 nut=2\`, then \`bolt\`, \`spanner\`, \`washer\`, \`done\`, the output is:

\`\`\`text
bolt costs 3
spanner is not stocked
washer costs 1
Total: 4
\`\`\`

## Guidance

To build the dictionary, split the first line on spaces, then split each piece on \`=\`. Unpacking makes that easy to read.

For each request, decide whether to use a membership test or \`get\` with a default. Either works. Choose the one that makes your code clearest, because here you must tell "in stock" apart from "not in stock", not simply put a zero in place of a missing price.

## Constraints

The price list line always holds at least one pair. Prices are whole numbers.`,
          starterCode: `prices = {}
for pair in input().split():
    name, value = pair.split("=")
    prices[name] = int(value)

total = 0
request = input()
`,
          hint: "Loop while request != \"done\". Inside, use if request in prices to choose the message, add prices[request] to the total when it is in stock, then read the next request.",
          tests: [
            {
              input: "bolt=3 washer=1 nut=2\nbolt\nspanner\nwasher\ndone\n",
              expectedOutput: "bolt costs 3\nspanner is not stocked\nwasher costs 1\nTotal: 4",
              description: "Items in stock and items not in stock are reported differently, and only the stocked ones are added up",
            },
            {
              input: "bolt=3\ndone\n",
              expectedOutput: "Total: 0",
              description: "No requests at all leaves the total at zero",
            },
            {
              input: "bolt=3\nspanner\nhammer\ndone\n",
              expectedOutput: "spanner is not stocked\nhammer is not stocked\nTotal: 0",
              description: "When every request is missing, the total is still zero and no error is raised",
            },
            {
              input: "a=5 b=10\nb\nb\ndone\n",
              expectedOutput: "b costs 10\nb costs 10\nTotal: 20",
              description: "The same item asked for twice is counted twice",
            },
          ],
          solution: `prices = {}
for pair in input().split():
    name, value = pair.split("=")
    prices[name] = int(value)

total = 0
request = input()
while request != "done":
    if request in prices:
        print(f"{request} costs {prices[request]}")
        total += prices[request]
    else:
        print(f"{request} is not stocked")
    request = input()

print(f"Total: {total}")
`,
        },
      ],
    ),

    lesson(
      "Sets, Nesting, and Copying",
      "Uniqueness, collections inside collections, and the sharing trap that catches everyone once.",
      [
        {
          type: "lesson",
          title: "Sets and Choosing a Collection",
          description: "A collection with no repeats and no order, and a guide to picking between the four.",
          instructions: `## Uniqueness as a data structure

A **set** holds unique items, with no order. Curly brackets create one, or \`set()\` turns another collection into one:

\`\`\`python
tags = {"python", "notes", "python"}
print(tags)
print(len(tags))
\`\`\`

\`\`\`text
{'python', 'notes'}
2
\`\`\`

The repeat disappeared. A set cannot hold the same item twice, and adding something that is already there does nothing.

Note that \`{}\` creates an empty *dictionary*, not an empty set. For an empty set you must write \`set()\`.

## Removing repeats

The most common use is removing repeats:

\`\`\`python
readings = [3, 1, 3, 2, 1]
unique = set(readings)
print(sorted(unique))
print(len(unique))
\`\`\`

\`\`\`text
[1, 2, 3]
3
\`\`\`

Sets have no order, so printing one directly gives no promised arrangement. Whenever the order of the output matters, turn it into a sorted list first. In exercises this is a real correctness problem: an unsorted set can print differently on different runs.

## Fast membership tests

Testing membership in a set is far faster than in a list, because a set does not have to look through its items one by one.

\`\`\`python
allowed = {"add", "list", "quit"}
print("list" in allowed)
print("delete" in allowed)
\`\`\`

\`\`\`text
True
False
\`\`\`

For a few items this makes no real difference. For thousands it makes an enormous one. When you build a collection only to test membership against it, make it a set.

## Set operations

Sets support the operations of set theory in mathematics:

\`\`\`python
monday = {"ana", "raj", "kim"}
tuesday = {"raj", "kim", "sam"}

print(sorted(monday & tuesday))
print(sorted(monday | tuesday))
print(sorted(monday - tuesday))
\`\`\`

\`\`\`text
['kim', 'raj']
['ana', 'kim', 'raj', 'sam']
['ana']
\`\`\`

\`&\` gives the items in both. \`|\` gives the items in either. \`-\` gives the items in the first but not in the second. Answering "who came on both days" with these is far clearer than writing a nested loop.

## Adding and removing

\`\`\`python
tags = set()
tags.add("python")
tags.add("python")
tags.discard("missing")
print(tags)
\`\`\`

\`\`\`text
{'python'}
\`\`\`

\`add\` puts an item in. \`discard\` removes it and says nothing if the item is not there. \`remove\` also removes it, but raises \`KeyError\` when it is not there.

## Choosing between the four

You now have four collections. Here is a short guide.

**List** — an ordered sequence of similar things that can change, where position matters or where repeats mean something. Readings over time, a queue of jobs, the lines of a file.

**Tuple** — a fixed group of related values that should not change. A map position, a colour, several values returned from a function.

**Dictionary** — values looked up by a key that means something. Counts for each word, price for each product, settings by name.

**Set** — membership and uniqueness, where order and repeats do not matter. Tags seen, identifiers already handled, allowed commands.

Two questions usually settle the choice. *Do I look things up by a name?* If yes, use a dictionary. *Do I care about order or repeats?* If no, use a set.

> **Key idea**
> Choosing the right collection removes work. Searching a list for an item with a certain name, or writing loops to remove repeats, are both signs that a dictionary or a set was the right choice.

## Summary

A set holds unique items with no order, and \`set()\` creates an empty one. Sets remove repeats, test membership quickly, and support the operations for items in both, in either, and in only one. Sort before you display, because sets have no order.`,
        },
        {
          type: "lesson",
          title: "Nested Collections",
          description: "Collections inside collections, and how to reach into them.",
          instructions: `## Structure inside structure

The items of a collection may themselves be collections. This is how a program holds anything with more than one level.

A list of lists suits rows of data well:

\`\`\`python
grid = [[1, 2, 3], [4, 5, 6]]
print(grid[0])
print(grid[0][2])
print(len(grid))
\`\`\`

\`\`\`text
[1, 2, 3]
3
2
\`\`\`

Read \`grid[0][2]\` from left to right. Take item \`0\` of \`grid\`, which gives the list \`[1, 2, 3]\`. Then take item \`2\` of that, which gives \`3\`. Each pair of brackets steps one level deeper.

\`len(grid)\` is \`2\` because \`grid\` holds two items. The fact that each item is a list of three is one level further down.

## Going through a nested list

\`\`\`python
grid = [[1, 2, 3], [4, 5, 6]]

for row in grid:
    total = sum(row)
    print(f"{row} sums to {total}")
\`\`\`

\`\`\`text
[1, 2, 3] sums to 6
[4, 5, 6] sums to 15
\`\`\`

The outer loop variable holds a whole row. To reach the single items, put a second loop inside:

\`\`\`python
grid = [[1, 2], [3, 4]]
total = 0

for row in grid:
    for value in row:
        total += value

print(total)
\`\`\`

\`\`\`text
10
\`\`\`

## Dictionaries holding lists

Here is a very common shape. Each key points to a list of related items.

\`\`\`python
sessions = {
    "history": [40, 15],
    "biology": [25],
}

for subject, pages in sessions.items():
    print(f"{subject}: {len(pages)} sessions, {sum(pages)} pages")
\`\`\`

\`\`\`text
history: 2 sessions, 40 pages
biology: 1 sessions, 25 pages
\`\`\`

Notice that the output says "1 sessions", which is wrong English. Getting singular and plural forms right is a small but real problem. It is the kind of detail that separates a program that works from a program that is finished.

## Lists of dictionaries

The other common shape is a list of records. Each record is a dictionary with the same keys:

\`\`\`python
books = [
    {"title": "Tidal Systems", "pages": 320, "finished": True},
    {"title": "Coastal Birds", "pages": 180, "finished": False},
]

for book in books:
    status = "finished" if book["finished"] else "in progress"
    print(f"{book['title']} ({book['pages']} pages) - {status}")
\`\`\`

\`\`\`text
Tidal Systems (320 pages) - finished
Coastal Birds (180 pages) - in progress
\`\`\`

Two details are worth pulling out.

\`"finished" if book["finished"] else "in progress"\` is a **conditional expression**. It gives one of two values, depending on a condition. It is an \`if\`/\`else\` that produces a value instead of choosing between blocks. Use it only for short choices like this one. Anything longer belongs in a proper \`if\` statement.

Inside the f-string, \`book['title']\` uses single quotes, because the f-string itself is inside double quotes. The rule about not reusing the outer quote mark applies here as it does everywhere.

This "list of dictionaries" shape is exactly what you get when you read a CSV file or a JSON document, and both of those arrive in Module 10.

## Building nested structures

\`\`\`python
records = [
    ("history", 40),
    ("biology", 25),
    ("history", 15),
]

grouped = {}
for subject, pages in records:
    if subject not in grouped:
        grouped[subject] = []
    grouped[subject].append(pages)

for subject in sorted(grouped):
    print(f"{subject}: {grouped[subject]}")
\`\`\`

\`\`\`text
biology: [25]
history: [40, 15]
\`\`\`

This is the grouping pattern from the previous lesson, and now the tuple unpacking happens on the \`for\` line itself. Reading each record straight into two named variables is far clearer than using indexes.

## Summary

Collections may hold collections. Each pair of square brackets steps one level down. Dictionaries holding lists, and lists holding dictionaries, are the two shapes you will meet most often, and both come straight from real data formats.`,
        },
        {
          type: "lesson",
          title: "Aliasing and Copying",
          description: "Why two names can point at one list, and the bug that follows.",
          instructions: `## The same list under two names

Remember from Module 2 that assignment attaches a name to a value. With numbers and strings this caused no trouble, because those values cannot change.

Lists can change, and that makes assignment behave in a way that surprises everyone once:

\`\`\`python
original = [1, 2, 3]
second = original
second.append(4)
print(original)
print(second)
\`\`\`

\`\`\`text
[1, 2, 3, 4]
[1, 2, 3, 4]
\`\`\`

Adding to \`second\` changed \`original\`. There is only one list here. \`second = original\` did not make a copy. It attached a second name to the same list. Both names point at one object, so a change made through either name can be seen through both.

This is called **aliasing**. It is not a fault. It is what lets you pass a large list to a function without copying it. But it causes real bugs when you wanted a copy.

## Why numbers behaved differently

In Module 2:

\`\`\`python
a = 10
b = a
a = 99
print(b)
\`\`\`

\`\`\`text
10
\`\`\`

That looks like the opposite behaviour, so it is worth being exact about why it is not.

\`a = 99\` *rebinds*: it points the name \`a\` at a different value and leaves \`b\` pointing at the old one. \`second.append(4)\` *mutates*: it changes the object itself, and both names still point at that object.

So the difference is not between numbers and lists. It is between rebinding a name and mutating an object. Numbers simply cannot be mutated, so the question never comes up for them.

> **Key idea**
> Assignment never copies. \`b = a\` gives one object two names. Rebinding one name does not touch the other. Mutating the shared object can be seen through both.

## Spotting aliasing

\`is\` tells you whether two names point at the same object:

\`\`\`python
first = [1, 2]
second = first
third = [1, 2]

print(first is second)
print(first is third)
print(first == third)
\`\`\`

\`\`\`text
True
False
True
\`\`\`

\`first\` and \`third\` are equal, because they hold the same contents. They are not identical, because they are two separate lists. This is the equality-versus-identity difference promised in Module 3, and lists are where it finally matters.

## Making a copy

There are three ways, and they are equivalent for a flat list:

\`\`\`python
original = [1, 2, 3]

copy_one = original.copy()
copy_two = original[:]
copy_three = list(original)

copy_one.append(4)
print(original)
print(copy_one)
\`\`\`

\`\`\`text
[1, 2, 3]
[1, 2, 3, 4]
\`\`\`

\`.copy()\` says what you mean most plainly. The slice \`[:]\` is a common trick that you will see often, because a slice always builds a new list.

Dictionaries and sets also have \`.copy()\`.

## A copy goes only one level deep

\`\`\`python
grid = [[1, 2], [3, 4]]
shallow = grid.copy()
shallow[0].append(99)
print(grid)
\`\`\`

\`\`\`text
[[1, 2, 99], [3, 4]]
\`\`\`

The copy is a new outer list, but its items are the *same inner lists*. Changing an inner list can still be seen through both names. This is called a **shallow copy**.

For nested structures, Python's \`copy\` module gives you \`deepcopy\`, which copies every level:

\`\`\`python
import copy

grid = [[1, 2], [3, 4]]
deep = copy.deepcopy(grid)
deep[0].append(99)
print(grid)
print(deep)
\`\`\`

\`\`\`text
[[1, 2], [3, 4]]
[[1, 2, 99], [3, 4]]
\`\`\`

Use \`deepcopy\` only when you need it. It is slower, and most of the time a shallow copy is enough.

## Functions and arguments that can change

The same rule applies to arguments. A function receives the object itself, not a copy:

\`\`\`python
def add_entry(items):
    items.append("new")


records = ["first"]
add_entry(records)
print(records)
\`\`\`

\`\`\`text
['first', 'new']
\`\`\`

The function changed the caller's list. Sometimes that is exactly what you want. When it is not, it is a nasty bug, because the caller sees no sign that its data has been changed.

The safer habit, and the one this course recommends, is for a function to return a new value instead of changing its argument:

\`\`\`python
def with_entry(items, entry):
    result = items.copy()
    result.append(entry)
    return result


records = ["first"]
updated = with_entry(records, "new")
print(records)
print(updated)
\`\`\`

\`\`\`text
['first']
['first', 'new']
\`\`\`

This is the pure-function idea from Module 2, now applied to collections. When a function does change its arguments, say so clearly in its name and in its documentation.

## Summary

Assignment never copies. It creates another name for the same object. Mutating a shared list can be seen through every name for it. Use \`.copy()\`, a full slice, or \`list()\` for a shallow copy, and \`copy.deepcopy\` for nested structures. Prefer functions that return new collections over functions that change their arguments.`,
        },
        {
          type: "exercise",
          title: "Deduplicate Without Losing Order",
          description: "Use a set for membership while you build an ordered list of first appearances.",
          instructions: `## The problem

Remove repeats from a sequence while keeping the order in which items first appeared.

Turning the data into a set removes repeats, but it throws away the order. Sorting afterwards gives alphabetical order, which is not the same as the order of arrival. The answer needs both structures.

## Input

One line of words separated by spaces.

## Requirements

1. Build a list holding each different word **once**, in the order in which it first appeared.
2. Use a set to keep track of which words you have seen.
3. Show exactly three lines:

\`\`\`text
Unique: ['red', 'blue', 'green']
Count: 3
Duplicates removed: 2
\`\`\`

\`Duplicates removed\` is the number of words in the input minus the number of different words.

## Example

Given \`red blue red green blue\`, the output is the three lines above.

Given an empty line:

\`\`\`text
Unique: []
Count: 0
Duplicates removed: 0
\`\`\`

## Guidance

Keep two structures as you loop: a list you append to, and a set you add to. For each word, check whether it is already in the set. If it is not, append it to the list and add it to the set.

Testing membership against the set instead of the list is the point of this exercise. It is also what you would do in real work, because set membership does not get slower as the collection grows.

## Constraints

Do not sort the output. The order must be the order of first appearance.`,
          starterCode: `words = input().split()

seen = set()
unique = []
`,
          hint: "for word in words: if word not in seen: unique.append(word) and seen.add(word). The number of repeats is len(words) - len(unique).",
          tests: [
            {
              input: "red blue red green blue\n",
              expectedOutput: "Unique: ['red', 'blue', 'green']\nCount: 3\nDuplicates removed: 2",
              description: "The order of first appearance is kept, instead of alphabetical order",
            },
            {
              input: "\n",
              expectedOutput: "Unique: []\nCount: 0\nDuplicates removed: 0",
              description: "Empty input gives empty results with no error",
            },
            {
              input: "one two three\n",
              expectedOutput: "Unique: ['one', 'two', 'three']\nCount: 3\nDuplicates removed: 0",
              description: "Input with no repeats comes back unchanged",
            },
            {
              input: "z z z z\n",
              expectedOutput: "Unique: ['z']\nCount: 1\nDuplicates removed: 3",
              description: "One word repeated many times becomes a single entry",
            },
          ],
          solution: `words = input().split()

seen = set()
unique = []
for word in words:
    if word not in seen:
        unique.append(word)
        seen.add(word)

print(f"Unique: {unique}")
print(f"Count: {len(unique)}")
print(f"Duplicates removed: {len(words) - len(unique)}")
`,
        },
        {
          type: "exercise",
          title: "Module 5 Checkpoint: Expense Tracker",
          description: "Put dictionaries, lists, grouping, and sorting together in a small reporting program.",
          instructions: `## The problem

A household expense tracker records spending by category. This checkpoint brings together the collections from the whole module.

## Input

A series of lines. Each line is one expense, in the form \`category:amount\`, where the amount is a whole number of rupees. The list ends with the line \`end\`.

## Requirements

Build a report showing, for each category:

- the total spent
- the number of entries
- the largest single entry

Show one line for each category, sorted by **total spent, highest first**. When two categories have the same total, put those two in alphabetical order by name.

Each line has this form:

\`\`\`text
food: total 45, entries 3, largest 20
\`\`\`

After the category lines, show one last line:

\`\`\`text
Overall total: 72
\`\`\`

## Example

Given \`food:20\`, \`travel:27\`, \`food:15\`, \`food:10\`, \`end\`, the output is:

\`\`\`text
food: total 45, entries 3, largest 20
travel: total 27, entries 1, largest 27
Overall total: 72
\`\`\`

## Special case

Given only \`end\`, the output is:

\`\`\`text
Overall total: 0
\`\`\`

with no category lines at all.

## Guidance

Group the amounts into a dictionary that joins each category to a list of its amounts. Once you have that, \`sum\`, \`len\`, and \`max\` give all three numbers for each category without any more loops.

For the order, build a list of the categories and sort it with a \`key\` that gives back a tuple: the negative total first, then the name. Sorting by a negative number is a neat way to get the highest first, while the alphabetical tie-break still runs from A to Z.

## Constraints

Amounts are always whole numbers of at least 0. Category names hold no spaces and no colons.`,
          starterCode: `grouped = {}

line = input()
`,
          hint: "Split each line on \":\" and unpack it into a category and an amount. Group with if category not in grouped: grouped[category] = [] and then append. Sort with sorted(grouped, key=lambda name: (-sum(grouped[name]), name)).",
          tests: [
            {
              input: "food:20\ntravel:27\nfood:15\nfood:10\nend\n",
              expectedOutput:
                "food: total 45, entries 3, largest 20\ntravel: total 27, entries 1, largest 27\nOverall total: 72",
              description: "Categories are grouped and ordered by total spending, highest first",
            },
            {
              input: "end\n",
              expectedOutput: "Overall total: 0",
              description: "No entries gives only the overall line",
            },
            {
              input: "b:10\na:10\nend\n",
              expectedOutput: "a: total 10, entries 1, largest 10\nb: total 10, entries 1, largest 10\nOverall total: 20",
              description: "Equal totals are separated by putting the names in alphabetical order",
            },
            {
              input: "rent:800\nend\n",
              expectedOutput: "rent: total 800, entries 1, largest 800\nOverall total: 800",
              description: "A single category reports its own figures",
            },
            {
              input: "a:0\na:0\nend\n",
              expectedOutput: "a: total 0, entries 2, largest 0\nOverall total: 0",
              description: "Amounts of zero still count as entries",
            },
          ],
          solution: `grouped = {}

line = input()
while line != "end":
    category, amount = line.split(":")
    if category not in grouped:
        grouped[category] = []
    grouped[category].append(int(amount))
    line = input()

ordered = sorted(grouped, key=lambda name: (-sum(grouped[name]), name))
overall = 0
for category in ordered:
    amounts = grouped[category]
    overall += sum(amounts)
    print(f"{category}: total {sum(amounts)}, entries {len(amounts)}, largest {max(amounts)}")

print(f"Overall total: {overall}")
`,
        },
      ],
    ),
  ],
)

export default moduleFive

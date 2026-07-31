import { module, lesson, type ModuleSource } from "../types.ts"

const moduleFive: ModuleSource = module(
  "Collections and Structured Data",
  "Holding many values in one place: lists, tuples, dictionaries, and sets, and choosing the right one for a problem.",
  [
    lesson(
      "Lists",
      "An ordered, changeable collection, and the positions used to reach into it.",
      [
        {
          type: "lesson",
          title: "Creating and Indexing Lists",
          description: "Storing many values under one name, and retrieving them by position.",
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

This does not scale. Totalling them means naming all five. Handling a number of readings not known in advance is impossible, because you cannot write variable names for values you have not seen.

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

Square brackets create a list; commas separate the items. \`len()\` reports how many there are — the same function you used on strings, because both are sequences.

Printing a list shows Python's representation of it, brackets and commas included. That is a display convention, not the list itself; it exists so that what you see could be typed back in as code.

A list may hold any type, including a mixture, though in practice most lists hold items of one kind:

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

An **index** is a position. Square brackets after a list retrieve the item at that position:

\`\`\`python
readings = [18, 21, 19, 24, 22]
print(readings[0])
print(readings[2])
\`\`\`

\`\`\`text
18
19
\`\`\`

**Indexing starts at zero.** The first item is at index \`0\`, the second at \`1\`, and so on. This trips up every beginner, and it is worth a moment's thought rather than mere memorisation.

One helpful reading: an index is not "which item" but "how far from the start". The first item is zero steps from the beginning.

A practical consequence: for a list of length \`n\`, the valid indexes are \`0\` to \`n - 1\`. The last item of a five-item list is at index \`4\`.

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

Asking for \`readings[3]\` would raise \`IndexError: list index out of range\`. This is a runtime error: the code was well-formed, and the failure happened while running.

An \`IndexError\` nearly always means an off-by-one mistake, usually looping to \`len(items)\` instead of \`len(items) - 1\`, or assuming a list has more items than it does.

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

\`-1\` is the last item, \`-2\` the second to last. There is no \`-0\`, since \`0\` already means the first item.

\`items[-1]\` is the idiomatic way to reach the last item. The alternative, \`items[len(items) - 1]\`, is longer and easier to get wrong.

## Changing an item

Unlike strings, lists can be modified in place:

\`\`\`python
readings = [18, 21, 19]
readings[1] = 99
print(readings)
\`\`\`

\`\`\`text
[18, 99, 19]
\`\`\`

This is a genuine difference of kind. Lists are **mutable**: the value itself can change. Strings are **immutable**: \`text[0] = "X"\` raises an error, and every string method returns a new string instead.

That distinction has consequences that go well beyond syntax, and the last lesson of this module returns to it.

## Iterating over a list

\`for\` walks a list exactly as it walks a string:

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

As with strings, prefer iterating over the items to iterating over positions. Use \`enumerate\` when you need the position as well.

## Summary

A list holds ordered values under one name, created with square brackets. Indexing starts at zero, so valid positions run from \`0\` to \`len(items) - 1\`; negative indexes count from the end. Lists are mutable, so an item can be replaced in place.`,
        },
        {
          type: "lesson",
          title: "Slicing and Growing Lists",
          description: "Taking a section of a sequence, and the methods that add and remove items.",
          instructions: `## Taking a section

A **slice** extracts part of a sequence. The syntax uses a colon between a start and a stop position:

\`\`\`python
letters = ["a", "b", "c", "d", "e"]
print(letters[1:4])
\`\`\`

\`\`\`text
['b', 'c', 'd']
\`\`\`

The start is included and the stop is excluded — the same convention as \`range\`, and for the same reason: the number of items is the difference between the two numbers. \`[1:4]\` gives \`4 - 1 = 3\` items.

Omitting either end means "from the beginning" or "to the end":

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

Negative positions work in slices too, and \`[-2:]\` is the idiomatic "last two items".

## A slice produces a new list

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

Modifying the slice left the original untouched, because slicing built a new list. This matters, and the last lesson of this module explains exactly when it does and does not protect you.

## Slicing strings

Slices work on strings too, producing new strings:

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

This is the standard way to build a list inside a loop — the accumulator pattern again, starting from \`[]\` rather than \`0\` or \`""\`:

\`\`\`python
squares = []

for number in range(1, 6):
    squares.append(number * number)

print(squares)
\`\`\`

\`\`\`text
[1, 4, 9, 16, 25]
\`\`\`

\`insert\` places an item at a given position, shifting the rest along:

\`\`\`python
items = ["a", "c"]
items.insert(1, "b")
print(items)
\`\`\`

\`\`\`text
['a', 'b', 'c']
\`\`\`

\`extend\` adds every item from another list, which is different from appending the list itself:

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

The second result contains three items, the last of which is itself a list. That is occasionally what you want and usually not.

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

\`append\` modified the list *in place* and returned \`None\`. Writing \`readings = readings.append(4)\` therefore destroys your list, replacing it with \`None\`.

This is the opposite of how string methods work, and the contrast is worth stating directly. A string method cannot modify the string, so it returns a new one and you must assign it. A list method usually modifies the list, so it returns nothing and you must not assign it.

> **Key idea**
> String methods return a new value: assign the result. List methods that modify the list return \`None\`: do not assign the result.

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

\`remove\` deletes the first item equal to the argument, and raises \`ValueError\` if none matches. \`pop\` removes and *returns* the last item, or the item at a given index. \`pop\` is the exception to the rule above: it returns something useful precisely because removal would otherwise lose the value.

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

\`in\` tests membership, \`count\` reports how many times a value occurs, and \`index\` reports the position of its first occurrence. \`index\` raises \`ValueError\` when the value is absent, so check with \`in\` first if it might be.

## Summary

A slice \`[start:stop]\` produces a new sequence, including the start and excluding the stop. \`append\`, \`insert\`, and \`extend\` add items; \`remove\` and \`pop\` take them away. Methods that modify a list in place return \`None\`, so their results must not be assigned back.`,
        },
        {
          type: "exercise",
          title: "Slice a Sequence",
          description: "Extract specific sections of a list using indexes and slices.",
          instructions: `## The problem

Given a list of daily step counts, report several sections of it.

## Input

One line containing whole numbers separated by single spaces. Read it with \`input()\` and no prompt.

The starter code converts the line into a list of integers for you.

## Requirements

Display exactly five lines:

\`\`\`text
First: 4200
Last: 7100
First three: [4200, 5300, 6100]
Last two: [6900, 7100]
Middle: [5300, 6100, 6900]
\`\`\`

Where:

1. \`First:\` is the item at the first position.
2. \`Last:\` is the item at the final position, obtained with a negative index.
3. \`First three:\` is a slice of the first three items.
4. \`Last two:\` is a slice of the final two items.
5. \`Middle:\` is a slice with the first and last items removed.

## Example

Given \`4200 5300 6100 6900 7100\`, the output is the five lines above.

## Guidance

For \`Last\`, use \`-1\` rather than computing the length.

For \`Middle\`, a slice starting at 1 and stopping at -1 removes one item from each end, whatever the length.

Printing a list directly gives Python's representation, with brackets and commas, which is exactly the required format.

## Constraints

The input always contains at least five numbers. Use slices rather than loops.`,
          starterCode: `steps = [int(part) for part in input().split()]
`,
          hint: "steps[0] and steps[-1] give the two single values. steps[:3], steps[-2:], and steps[1:-1] give the three sections.",
          tests: [
            {
              input: "4200 5300 6100 6900 7100\n",
              expectedOutput:
                "First: 4200\nLast: 7100\nFirst three: [4200, 5300, 6100]\nLast two: [6900, 7100]\nMiddle: [5300, 6100, 6900]",
              description: "Five values sliced into the required sections",
            },
            {
              input: "1 2 3 4 5 6 7\n",
              expectedOutput:
                "First: 1\nLast: 7\nFirst three: [1, 2, 3]\nLast two: [6, 7]\nMiddle: [2, 3, 4, 5, 6]",
              description: "A longer list, where the middle slice must adapt to the length",
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
          description: "Accumulate into a list with append, then report on what you built.",
          instructions: `## The problem

Read a series of measurements and keep only the ones that pass a threshold.

## Input

The first line is a whole number, the threshold. Every line after it is a whole number measurement, ending with the sentinel \`-1\`.

## Requirements

1. Build a list containing only the measurements that are **greater than or equal to** the threshold, in the order they arrived.
2. Display exactly three lines:

\`\`\`text
Kept: [30, 45, 30]
Count: 3
Total: 105
\`\`\`

If nothing was kept, display:

\`\`\`text
Kept: []
Count: 0
Total: 0
\`\`\`

## Example

Given \`25\`, then \`30\`, \`12\`, \`45\`, \`8\`, \`30\`, \`-1\`, the output is the three lines above.

## Guidance

Start with an empty list before the loop and \`append\` to it when a measurement qualifies. Remember that \`append\` modifies the list and returns \`None\`, so call it as a statement rather than assigning its result.

The count is the length of the list you built. The total can be accumulated as you go, or computed afterwards with \`sum()\`, which adds every item of a list.

## Constraints

The sentinel \`-1\` ends the data and is never itself a measurement. The threshold is always at least 0.`,
          starterCode: `threshold = int(input())

kept = []

value = int(input())
`,
          hint: "Inside the sentinel loop, use if value >= threshold: kept.append(value). After the loop, len(kept) gives the count and sum(kept) gives the total.",
          tests: [
            {
              input: "25\n30\n12\n45\n8\n30\n-1\n",
              expectedOutput: "Kept: [30, 45, 30]\nCount: 3\nTotal: 105",
              description: "Values at or above the threshold are kept in arrival order",
            },
            {
              input: "100\n30\n12\n-1\n",
              expectedOutput: "Kept: []\nCount: 0\nTotal: 0",
              description: "A threshold nothing reaches leaves an empty list",
            },
            {
              input: "0\n0\n5\n-1\n",
              expectedOutput: "Kept: [0, 5]\nCount: 2\nTotal: 5",
              description: "A zero threshold keeps a zero measurement, since the test is inclusive",
            },
            {
              input: "10\n-1\n",
              expectedOutput: "Kept: []\nCount: 0\nTotal: 0",
              description: "An immediate sentinel means no measurements at all",
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
      "Sorting, aggregate functions, and computing statistics without losing the original data.",
      [
        {
          type: "lesson",
          title: "Sorting and Aggregating",
          description: "Two ways to sort, and the built-in functions that summarise a collection.",
          instructions: `## Built-in summaries

Python provides functions that reduce a whole collection to one value:

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

These replace the accumulator loops of Module 4. Writing the loop taught you what the function does; using the function is what you should now do, because it is shorter, faster, and impossible to get subtly wrong.

An average combines two of them:

\`\`\`python
readings = [18, 21, 19, 24, 22]
mean = sum(readings) / len(readings)
print(f"{mean:.1f}")
\`\`\`

\`\`\`text
20.8
\`\`\`

Note the hazard: \`len(readings)\` is zero for an empty list, and dividing by zero raises \`ZeroDivisionError\`. Any function computing an average must decide what to do with no data. Guarding early is the usual answer:

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

\`if not values:\` uses truthiness: an empty list is treated as false. It reads as "if there are no values", which is exactly the intent.

## Two ways to sort

\`sort()\` is a list method that rearranges the list **in place**:

\`\`\`python
readings = [18, 21, 19]
readings.sort()
print(readings)
\`\`\`

\`\`\`text
[18, 19, 21]
\`\`\`

\`sorted()\` is a function that returns a **new** sorted list, leaving the original alone:

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

The distinction is the in-place versus new-value rule again. \`sort()\` modifies and returns \`None\`; \`sorted()\` modifies nothing and returns a list.

This causes a specific, very common bug:

\`\`\`python
readings = [18, 21, 19]
readings = readings.sort()
print(readings)
\`\`\`

\`\`\`text
None
\`\`\`

The list is gone. Either call \`readings.sort()\` on its own line, or write \`readings = sorted(readings)\`. Never combine the two.

> **Key idea**
> \`list.sort()\` rearranges in place and returns \`None\`. \`sorted(list)\` returns a new list and changes nothing. Assigning the result of \`.sort()\` destroys your data.

Prefer \`sorted()\` when the original order matters for anything else. Order is data, and discarding it is easy to regret.

## Reverse and custom order

Both accept \`reverse=True\` for descending order:

\`\`\`python
readings = [18, 21, 19]
print(sorted(readings, reverse=True))
\`\`\`

\`\`\`text
[21, 19, 18]
\`\`\`

\`reverse=True\` is a **keyword argument**: the name states what the value means. Module 6 covers these properly. Note how much clearer it is than a bare \`True\` would be.

Both also accept \`key\`, a function deciding what to sort by:

\`\`\`python
words = ["banana", "fig", "cherry"]
print(sorted(words))
print(sorted(words, key=len))
\`\`\`

\`\`\`text
['banana', 'cherry', 'fig']
['fig', 'banana', 'cherry']
\`\`\`

The first sorts alphabetically. The second sorts by length, because \`key=len\` tells \`sorted\` to compare \`len(word)\` rather than the word.

Note that \`len\` is written without parentheses. You are passing the function itself, not calling it. \`key=len()\` would attempt to call \`len\` with no arguments and fail. This distinction between a function and a call becomes central in Module 13.

Sorting text is case-sensitive by default, with all capitals before all lowercase. To sort the way a person expects, use \`key=str.lower\`:

\`\`\`python
names = ["delta", "Alpha", "charlie"]
print(sorted(names))
print(sorted(names, key=str.lower))
\`\`\`

\`\`\`text
['Alpha', 'charlie', 'delta']
['Alpha', 'charlie', 'delta']
\`\`\`

Here both happen to agree; with \`["delta", "Alpha", "Charlie"]\` they would not, because \`Charlie\` would sort before \`charlie\`'s neighbours.

## Reversing without sorting

\`\`\`python
items = [1, 2, 3]
print(items[::-1])
\`\`\`

\`\`\`text
[3, 2, 1]
\`\`\`

A slice with a step of \`-1\` produces a reversed copy. This is a compact and widely used idiom, and it works on strings too.

## Summary

\`sum\`, \`min\`, \`max\`, and \`len\` summarise a collection; guard against empty collections before dividing. \`list.sort()\` reorders in place and returns \`None\`; \`sorted()\` returns a new list. Both take \`reverse\` and \`key\`.`,
        },
        {
          type: "exercise",
          title: "Summarise a Set of Readings",
          description: "Compute statistics from a list without disturbing its original order.",
          instructions: `## The problem

Given a list of numbers, report several statistics about them.

## Input

One line of whole numbers separated by single spaces.

## Requirements

Display exactly five lines:

\`\`\`text
Original: [22, 18, 25, 18, 30]
Sorted: [18, 18, 22, 25, 30]
Lowest: 18
Highest: 30
Mean: 22.6
\`\`\`

Where:

1. \`Original:\` shows the list in the order it arrived, unchanged.
2. \`Sorted:\` shows the values in ascending order.
3. \`Lowest:\` and \`Highest:\` are the smallest and largest values.
4. \`Mean:\` is the average, displayed with **one** decimal place.

## Example

Given \`22 18 25 18 30\`, the output is the five lines above.

## Guidance

The first requirement is the interesting one. If you sort the list in place, the original order is gone and the first line will be wrong. Use \`sorted()\`, which returns a new list.

You do not need loops for any part of this. The built-in summary functions do the work.

## Constraints

The input always contains at least one number, so you need not guard against an empty list here.`,
          starterCode: `values = [int(part) for part in input().split()]
`,
          hint: "Use sorted(values) to get a new ordered list without touching values itself. min(), max(), and sum()/len() give the rest. Format the mean with {mean:.1f}.",
          tests: [
            {
              input: "22 18 25 18 30\n",
              expectedOutput:
                "Original: [22, 18, 25, 18, 30]\nSorted: [18, 18, 22, 25, 30]\nLowest: 18\nHighest: 30\nMean: 22.6",
              description: "Statistics are correct and the original order is preserved",
            },
            {
              input: "5\n",
              expectedOutput: "Original: [5]\nSorted: [5]\nLowest: 5\nHighest: 5\nMean: 5.0",
              description: "A single value is its own minimum, maximum, and mean",
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
          description: "A program loses its data by assigning the result of an in-place method.",
          instructions: `## The problem

The program in the editor should display a list of names in alphabetical order, ignoring case. It currently fails with an error.

## Your task

Run it and read the error message. Then fix the program.

## Expected output

\`\`\`text
Sorted: ['Alpha', 'bravo', 'Charlie', 'delta']
Count: 4
\`\`\`

## Requirements

1. The sort must ignore case, so \`bravo\` comes after \`Alpha\` and before \`Charlie\`.
2. The output must be exactly the two lines above.

## Guidance

The error message names a type that has no such attribute. Work out which value ended up with that type, and why.

Recall the rule from this lesson: one of Python's two sorting tools rearranges a list and hands back nothing, while the other hands back a new list and changes nothing. Assigning the result of the first destroys the list.

There are two correct fixes. Either call the in-place method as a statement of its own, or switch to the function that returns a new list. Both are acceptable.

## Why this matters

The symptom here — an error several lines *after* the real mistake — is common. The line that raised the error is where the damage was noticed, not where it was done.`,
          starterCode: `names = ["delta", "Alpha", "Charlie", "bravo"]

names = names.sort(key=str.lower)

print(f"Sorted: {names}")
print(f"Count: {len(names)}")
`,
          hint: "names.sort(...) returns None, so the assignment replaces the list with None. Either drop the assignment and keep names.sort(key=str.lower) on its own line, or use names = sorted(names, key=str.lower).",
          tests: [
            {
              expectedOutput: "Sorted: ['Alpha', 'bravo', 'Charlie', 'delta']\nCount: 4",
              description: "The names are sorted case-insensitively and the list still exists afterwards",
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
      "A fixed collection, and the syntax for pulling several values out at once.",
      [
        {
          type: "lesson",
          title: "Tuples",
          description: "An immutable sequence, and why fixing a collection is sometimes exactly right.",
          instructions: `## A collection that cannot change

A **tuple** is an ordered collection, like a list, that cannot be modified after it is created. Round brackets create one:

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

Indexing, slicing, \`len\`, \`in\`, and iteration all work exactly as they do for lists. The difference is that \`position[0] = 9\` raises a \`TypeError\`. There are no \`append\`, \`remove\`, or \`sort\` methods, because all of those would modify.

The brackets are optional when the meaning is unambiguous, and you have already used this without noticing:

\`\`\`python
day = "Sunday"
print(day in ("Saturday", "Sunday"))
\`\`\`

\`\`\`text
True
\`\`\`

A tuple with a single item needs a trailing comma — \`(5,)\` is a tuple, while \`(5)\` is just the number 5 in brackets. This is an occasional source of confusion and worth knowing about.

## Why fix a collection

Immutability sounds like a restriction, and it is; the question is what you gain.

You gain a guarantee. When a value is a tuple, no part of your program can change it, so you can pass it anywhere without wondering whether it came back altered. Bugs where a distant function quietly modifies your data cannot happen.

You also gain clarity of intent. A list says "these items may change". A tuple says "this is a fixed group". A geographic coordinate has exactly two parts and neither is optional; a tuple states that, while a list would imply you might append a third.

The practical guideline: use a **list** for a varying number of similar things, and a **tuple** for a fixed number of related things.

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

This works for lists too, and it is far clearer than indexing:

\`\`\`python
parts = "2024-07-15".split("-")
year, month, day = parts
print(f"{day}/{month}/{year}")
\`\`\`

\`\`\`text
15/07/2024
\`\`\`

Compare that with \`parts[0]\`, \`parts[1]\`, and \`parts[2]\`. The unpacked version names each piece, so the meaning is on the page rather than in the reader's head.

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

The right-hand side is evaluated completely before any assignment happens, so no temporary variable is needed.

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

The \`return\` builds a tuple from the three expressions, and the call site unpacks it. This reads as though the function returned three things, which is exactly the intent.

You met this already with \`enumerate\`, which produces a position-and-value tuple that the \`for\` statement unpacks into two names.

> **Key idea**
> A tuple is a fixed group of related values. Returning one is how a Python function hands back several results at once, and unpacking is how the caller names them.

## Summary

A tuple is an immutable ordered collection, written with round brackets. Use lists for varying collections of similar items and tuples for fixed groups of related values. Unpacking assigns several names at once and is the standard way to receive multiple return values.`,
        },
        {
          type: "exercise",
          title: "Return Several Values",
          description: "Write a function returning a tuple, and unpack it at the call site.",
          instructions: `## The problem

Write a function that analyses a list of numbers and returns three results at once.

## Requirements

1. Define a function \`analyse(values)\` that **returns a tuple** of three items, in this order:
   - the smallest value
   - the largest value
   - the range, meaning largest minus smallest
2. If \`values\` is empty, return \`(0, 0, 0)\`.
3. Read one line of whole numbers separated by spaces. The line may be empty.
4. Unpack the returned tuple into three named variables.
5. Display exactly three lines:

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

\`input().split()\` on an empty line produces an empty list, so the guard inside the function is genuinely reachable. Handle it with a guard clause before calling \`min\` or \`max\`, both of which raise \`ValueError\` on an empty collection.

Return the three values separated by commas; Python builds the tuple for you. At the call site, write three names separated by commas to unpack it.

## Constraints

Unpack the result into three variables. Do not index into the returned tuple.`,
          starterCode: `def analyse(values):
    return (0, 0, 0)


values = [int(part) for part in input().split()]
`,
          hint: "Inside the function, guard with if not values: return (0, 0, 0), then return min(values), max(values), max(values) - min(values). At the call site write lowest, highest, spread = analyse(values).",
          tests: [
            {
              input: "30 12 44 19\n",
              expectedOutput: "Lowest: 12\nHighest: 44\nRange: 32",
              description: "Several values give a correct minimum, maximum, and range",
            },
            {
              input: "\n",
              expectedOutput: "Lowest: 0\nHighest: 0\nRange: 0",
              description: "An empty input is handled by the guard rather than raising an error",
            },
            {
              input: "7\n",
              expectedOutput: "Lowest: 7\nHighest: 7\nRange: 0",
              description: "A single value has a range of zero",
            },
            {
              input: "-5 -1\n",
              expectedOutput: "Lowest: -5\nHighest: -1\nRange: 4",
              description: "Negative values produce a positive range",
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

Parse a date and a name from one line, using unpacking rather than indexing.

## Input

One line in the form \`YYYY-MM-DD|Surname,Forename\`.

## Requirements

1. Split the line on \`|\` and unpack into two names in one statement.
2. Split the date on \`-\` and unpack into \`year\`, \`month\`, and \`day\` in one statement.
3. Split the name on \`,\` and unpack into \`surname\` and \`forename\` in one statement.
4. Display exactly two lines:

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

Unpacking is the point of this exercise. Writing \`parts[0]\` and \`parts[1]\` would work and would say nothing about what each piece means.

The number of names on the left must match the number of pieces exactly, or Python raises \`ValueError\`.

## Constraints

Use three unpacking assignments. Do not index into any list with square brackets.`,
          starterCode: `line = input()
`,
          hint: "date_part, name_part = line.split(\"|\") then year, month, day = date_part.split(\"-\") and surname, forename = name_part.split(\",\").",
          tests: [
            {
              input: "2024-07-15|Lovelace,Ada\n",
              expectedOutput: "Date: 15/07/2024\nName: Ada Lovelace",
              description: "The date is reordered and the name parts are swapped",
            },
            {
              input: "1999-01-02|Hopper,Grace\n",
              expectedOutput: "Date: 02/01/1999\nName: Grace Hopper",
              description: "Leading zeros in the date are preserved",
            },
            {
              input: "2000-12-31|Noether,Emmy\n",
              expectedOutput: "Date: 31/12/2000\nName: Emmy Noether",
              description: "A different record unpacks the same way",
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
      "Looking values up by a meaningful key rather than by position.",
      [
        {
          type: "lesson",
          title: "Keys and Values",
          description: "A collection indexed by anything you choose, and the errors that come with it.",
          instructions: `## When position is the wrong handle

Suppose you record how many pages were read for each subject. With two parallel lists:

\`\`\`python
subjects = ["history", "biology", "statistics"]
pages = [40, 25, 60]
print(pages[subjects.index("biology")])
\`\`\`

\`\`\`text
25
\`\`\`

That works and is unpleasant. The two lists must stay the same length and in the same order forever; nothing enforces that, and a single mistake silently misattributes every value.

The problem is that position is not a meaningful handle here. What you want is to look things up *by subject*.

## A dictionary

A **dictionary** stores **key–value pairs**. Curly brackets create one, with a colon between each key and its value:

\`\`\`python
pages = {"history": 40, "biology": 25, "statistics": 60}
print(pages["biology"])
print(len(pages))
\`\`\`

\`\`\`text
25
5
\`\`\`

Wait — \`len(pages)\` reports \`3\`, not \`5\`. Let us be precise:

\`\`\`python
pages = {"history": 40, "biology": 25, "statistics": 60}
print(len(pages))
\`\`\`

\`\`\`text
3
\`\`\`

\`len\` counts the pairs. Each key appears once.

Square brackets look a value up by key, exactly as they look a list item up by index. The difference is that the key carries meaning: \`pages["biology"]\` says what it retrieves, while \`pages[1]\` does not.

## Adding and changing

Assigning to a key sets its value, creating the pair if the key is new:

\`\`\`python
pages = {"history": 40}
pages["biology"] = 25
pages["history"] = 45
print(pages)
\`\`\`

\`\`\`text
{'history': 45, 'biology': 25}
\`\`\`

There is no separate "add" and "update"; both are assignment. A key can appear only once, so assigning to an existing key replaces its value.

Dictionaries preserve insertion order, so items appear in the order they were first added.

## Missing keys

Looking up a key that is not present raises \`KeyError\`:

\`\`\`python
pages = {"history": 40}
print("biology" in pages)
\`\`\`

\`\`\`text
False
\`\`\`

Writing \`pages["biology"]\` there would raise \`KeyError: 'biology'\`. This is the most common dictionary error, and there are two good defences.

Check first with \`in\`, which tests **keys**:

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

Or use \`get\`, which returns \`None\` instead of raising, and accepts a fallback:

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

\`get\` with a default is the cleanest way to read a value that may be absent, and it appears constantly in real code.

> **Key idea**
> \`items[key]\` raises \`KeyError\` when the key is missing. \`items.get(key, default)\` returns the default instead. Use the second whenever absence is a normal possibility rather than a bug.

## What may be a key

Keys must be immutable, which in practice means strings, numbers, or tuples. A list cannot be a key, because it could change and the dictionary would no longer be able to find it.

Values have no such restriction: they may be anything, including lists and other dictionaries.

Keys are compared exactly, so \`"Biology"\` and \`"biology"\` are different keys. When keys come from input, normalise them first.

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

\`del\` removes a pair. \`pop\` removes it and returns the value, and accepts a default so it does not raise when the key is absent.

## Lists versus dictionaries

Use a **list** when items are naturally ordered and you work with them by position or in sequence: a series of readings, a queue of tasks.

Use a **dictionary** when each item has a natural identifier and you look things up by it: pages per subject, price per product code, count per word.

If you find yourself searching a list to find the item with a particular name, you almost certainly wanted a dictionary.

## Summary

A dictionary holds key–value pairs and looks values up by key. Assignment both adds and updates. Missing keys raise \`KeyError\`; use \`in\` or \`get\` with a default. Keys must be immutable and are compared exactly.`,
        },
        {
          type: "lesson",
          title: "Iterating Over Dictionaries",
          description: "Walking through keys, values, and pairs, and the tallying pattern.",
          instructions: `## Three ways to iterate

Iterating a dictionary directly gives its **keys**:

\`\`\`python
pages = {"history": 40, "biology": 25}

for subject in pages:
    print(subject)
\`\`\`

\`\`\`text
history
biology
\`\`\`

Since you have the key, you can look the value up — but there is a better way.

\`.values()\` gives the values:

\`\`\`python
pages = {"history": 40, "biology": 25}
print(sum(pages.values()))
\`\`\`

\`\`\`text
65
\`\`\`

\`.items()\` gives both, as a tuple per pair, which \`for\` unpacks:

\`\`\`python
pages = {"history": 40, "biology": 25}

for subject, count in pages.items():
    print(f"{subject}: {count}")
\`\`\`

\`\`\`text
history: 40
biology: 25
\`\`\`

\`.items()\` is the one to reach for whenever you need both, and it is clearer than looking each value up inside the loop.

## Sorting a dictionary's contents

Dictionaries keep insertion order, not sorted order. To present them sorted, sort when you display:

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

\`sorted(pages)\` sorts the keys. To order by value, sort the pairs and tell \`sorted\` to compare the second element of each:

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

\`lambda pair: pair[1]\` is a small function written inline, taking one argument and returning its second element. Module 13 covers \`lambda\` properly. For now, read it as "sort by the value part of each pair" — this exact line is worth remembering, because ranking a dictionary by value is a very common need.

## Tallying

The most useful dictionary pattern counts occurrences:

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

The single line inside the loop deserves unpacking, because it does the whole job.

\`counts.get(word, 0)\` reads the current count, or \`0\` if this word has not been seen. Adding \`1\` gives the new count. Assigning stores it, creating the pair on first sight.

Without \`get\`, the same thing needs a conditional:

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

Both are correct. The \`get\` version is preferred because it states the rule once rather than splitting it across two branches.

## Grouping

A related pattern collects items rather than counting them, using a list as the value:

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

The \`if subject not in grouped\` line creates an empty list the first time each subject appears. Without it, \`append\` would raise \`KeyError\`. Note that \`get\` does not help here: it would return a *new* empty list each time, and appending to a list nobody kept has no effect.

## Summary

Iterating a dictionary gives keys; \`.values()\` gives values; \`.items()\` gives pairs to unpack. Sort at the point of display, using \`key\` to sort by value. Tally with \`counts[key] = counts.get(key, 0) + 1\`, and group by creating an empty list on first sight of a key.`,
        },
        {
          type: "exercise",
          title: "Tally Word Frequencies",
          description: "Count occurrences with a dictionary and report the results in a defined order.",
          instructions: `## The problem

Count how often each word appears in a line of text.

## Input

One line of text containing words separated by spaces. Read it with \`input()\` and no prompt.

## Requirements

1. Treat words case-insensitively, so \`Red\` and \`red\` are the same word.
2. Count how many times each distinct word appears.
3. Display one line per distinct word, sorted alphabetically, in this format:

\`\`\`text
blue: 1
green: 1
red: 3
\`\`\`

4. After the counts, display one final line:

\`\`\`text
Distinct words: 3
\`\`\`

## Example

Given \`red blue Red green RED\`, the output is the four lines above.

Given an empty line, the output is just:

\`\`\`text
Distinct words: 0
\`\`\`

## Guidance

Lowercase the whole line before splitting, which handles the case rule in one step.

Build the tally with the \`get\` pattern from this lesson. Then iterate over the sorted keys to display the results.

\`split()\` with no arguments handles runs of spaces sensibly and produces an empty list for an empty line, so no special case is needed.

## Constraints

Sort the output alphabetically by word. Do not sort by count.`,
          starterCode: `text = input()

counts = {}
`,
          hint: "words = text.lower().split(), then for word in words: counts[word] = counts.get(word, 0) + 1. Display with for word in sorted(counts).",
          tests: [
            {
              input: "red blue Red green RED\n",
              expectedOutput: "blue: 1\ngreen: 1\nred: 3\nDistinct words: 3",
              description: "Words are counted case-insensitively and reported alphabetically",
            },
            {
              input: "\n",
              expectedOutput: "Distinct words: 0",
              description: "An empty line produces no word lines at all",
            },
            {
              input: "one\n",
              expectedOutput: "one: 1\nDistinct words: 1",
              description: "A single word appears once",
            },
            {
              input: "b a b a b\n",
              expectedOutput: "a: 2\nb: 3\nDistinct words: 2",
              description: "Alphabetical ordering is used rather than order of first appearance",
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
          description: "Handle missing keys without raising, using get and membership tests.",
          instructions: `## The problem

A price list holds the cost of several items. Given a series of requested item names, report each price, handling names that are not stocked.

## Input

The first line contains the price list as \`name=price\` pairs separated by spaces, for example \`bolt=3 washer=1 nut=2\`.

Every line after that is a single item name, ending with the sentinel \`done\`.

## Requirements

1. Build a dictionary from the first line, mapping each name to its price as an integer.
2. For each requested name, display one line:
   - \`bolt costs 3\` when the item is stocked.
   - \`spanner is not stocked\` when it is not.
3. After the sentinel, display one final line with the total cost of the stocked requests:

\`\`\`text
Total: 5
\`\`\`

Requests for items that are not stocked contribute nothing to the total.

## Example

Given \`bolt=3 washer=1 nut=2\`, then \`bolt\`, \`spanner\`, \`washer\`, \`done\`, the output is:

\`\`\`text
bolt costs 3
spanner is not stocked
washer costs 1
Total: 4
\`\`\`

## Guidance

To build the dictionary, split the first line on spaces, then split each piece on \`=\`. Unpacking makes that readable.

For each request, decide whether to use a membership test or \`get\` with a default. Either works; choose the one that makes your code clearest, since you need to distinguish "stocked" from "not stocked" rather than merely substituting a zero.

## Constraints

The price list line always contains at least one pair. Prices are whole numbers.`,
          starterCode: `prices = {}
for pair in input().split():
    name, value = pair.split("=")
    prices[name] = int(value)

total = 0
request = input()
`,
          hint: "Loop while request != \"done\". Inside, use if request in prices to choose the message, add prices[request] to the total when stocked, then read the next request.",
          tests: [
            {
              input: "bolt=3 washer=1 nut=2\nbolt\nspanner\nwasher\ndone\n",
              expectedOutput: "bolt costs 3\nspanner is not stocked\nwasher costs 1\nTotal: 4",
              description: "Stocked and unstocked requests are reported differently and only stocked ones are totalled",
            },
            {
              input: "bolt=3\ndone\n",
              expectedOutput: "Total: 0",
              description: "No requests at all leaves the total at zero",
            },
            {
              input: "bolt=3\nspanner\nhammer\ndone\n",
              expectedOutput: "spanner is not stocked\nhammer is not stocked\nTotal: 0",
              description: "Every request missing still produces a zero total rather than an error",
            },
            {
              input: "a=5 b=10\nb\nb\ndone\n",
              expectedOutput: "b costs 10\nb costs 10\nTotal: 20",
              description: "The same item requested twice is counted twice",
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
      "Uniqueness, collections inside collections, and the aliasing trap that catches everyone once.",
      [
        {
          type: "lesson",
          title: "Sets and Choosing a Collection",
          description: "A collection with no duplicates and no order, and a guide to picking between the four.",
          instructions: `## Uniqueness as a data structure

A **set** holds unique items, unordered. Curly brackets create one, or \`set()\` converts another collection:

\`\`\`python
tags = {"python", "notes", "python"}
print(tags)
print(len(tags))
\`\`\`

\`\`\`text
{'python', 'notes'}
2
\`\`\`

The duplicate vanished. A set cannot contain the same item twice, and adding something already present has no effect.

Note that \`{}\` creates an empty *dictionary*, not an empty set. For an empty set you must write \`set()\`.

## Removing duplicates

The most common use is deduplication:

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

Sets have no order, so printing one directly gives no guaranteed arrangement. Whenever the output order matters, convert to a sorted list first. This is a genuine correctness issue in exercises: an unsorted set can print differently on different runs.

## Fast membership

Testing membership in a set is dramatically faster than in a list, because a set does not have to look through its items one by one.

\`\`\`python
allowed = {"add", "list", "quit"}
print("list" in allowed)
print("delete" in allowed)
\`\`\`

\`\`\`text
True
False
\`\`\`

For a handful of items this makes no practical difference. For thousands it makes an enormous one. When you build a collection purely to test membership against, make it a set.

## Set operations

Sets support the operations of mathematical set theory:

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

\`&\` gives items in both, \`|\` gives items in either, and \`-\` gives items in the first but not the second. Answering "who attended both days" with these is far clearer than writing a nested loop.

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

\`add\` inserts, \`discard\` removes without complaining if the item is absent, and \`remove\` removes but raises \`KeyError\` when it is not there.

## Choosing between the four

You now have four collections. A short guide:

**List** — an ordered, changeable sequence of similar things, where position matters or duplicates are meaningful. Readings over time, a queue of tasks, lines of a file.

**Tuple** — a fixed group of related values that should not change. A coordinate, a colour, several values returned from a function.

**Dictionary** — values looked up by a meaningful key. Counts per word, price per product, settings by name.

**Set** — membership and uniqueness, where order and duplicates are irrelevant. Tags seen, identifiers already processed, allowed commands.

Two questions usually settle it. *Do I look things up by a name?* If yes, dictionary. *Do I care about order or duplicates?* If no, set.

> **Key idea**
> Choosing the right collection removes work. Searching a list for a named item, or writing loops to remove duplicates, are both signs that a dictionary or a set was the right choice.

## Summary

A set holds unique, unordered items; \`set()\` creates an empty one. Sets deduplicate, test membership quickly, and support intersection, union, and difference. Sort before displaying, since sets have no order.`,
        },
        {
          type: "lesson",
          title: "Nested Collections",
          description: "Collections inside collections, and how to reach into them.",
          instructions: `## Structure within structure

A collection's items may themselves be collections. This is how programs represent anything with more than one level.

A list of lists is a natural fit for rows of data:

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

Read \`grid[0][2]\` left to right: take item \`0\` of \`grid\`, giving the list \`[1, 2, 3]\`, then take item \`2\` of that, giving \`3\`. Each pair of brackets steps one level deeper.

\`len(grid)\` is \`2\` because \`grid\` has two items. The fact that each is a three-item list is one level down.

## Iterating a nested list

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

The outer loop variable holds an entire row. To reach individual items, nest a second loop:

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

A very common shape: each key maps to a list of related items.

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

Notice that the output says "1 sessions", which is wrong English. Producing correct singular and plural forms is a small, real problem, and the kind of detail that separates a program that works from one that is finished.

## Lists of dictionaries

The other common shape is a list of records, each a dictionary with the same keys:

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

Two details are worth extracting.

\`"finished" if book["finished"] else "in progress"\` is a **conditional expression**: it produces one of two values depending on a condition. It is an \`if\`/\`else\` that yields a value rather than choosing between blocks. Use it only for short choices like this one; anything longer belongs in a proper \`if\` statement.

Inside the f-string, \`book['title']\` uses single quotes because the f-string is delimited by double quotes. The rule about not reusing the delimiter applies here as everywhere.

This "list of dictionaries" shape is exactly what you get from reading a CSV file or a JSON document, both of which arrive in Module 10.

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

This is the grouping pattern from the previous lesson, now with the tuple unpacking done in the \`for\` line itself. Reading each record straight into two named variables is far clearer than indexing.

## Summary

Collections may contain collections. Each pair of square brackets steps one level down. Dictionaries holding lists and lists holding dictionaries are the two shapes you will meet most, and both come directly from real data formats.`,
        },
        {
          type: "lesson",
          title: "Aliasing and Copying",
          description: "Why two names can refer to one list, and the bug that follows.",
          instructions: `## The same list under two names

Recall from Module 2 that assignment attaches a name to a value. With numbers and strings this caused no trouble, because those values cannot change.

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

Appending to \`second\` changed \`original\`. There is only one list. \`second = original\` did not make a copy; it attached a second name to the same list. Both names refer to one object, so a change through either is visible through both.

This is called **aliasing**. It is not a flaw; it is what makes it possible to pass a large list to a function without copying it. But it produces genuine bugs when a copy was intended.

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

That looks like the opposite behaviour, and it is worth being precise about why it is not.

\`a = 99\` is *rebinding*: it points the name \`a\` at a different value, leaving \`b\` pointing at the old one. \`second.append(4)\` is *mutation*: it changes the object itself, which both names still refer to.

The difference is not between numbers and lists. It is between rebinding a name and mutating an object. Numbers simply cannot be mutated, so the question never arises for them.

> **Key idea**
> Assignment never copies. \`b = a\` gives one object two names. Rebinding one name does not affect the other; mutating the shared object is visible through both.

## Detecting aliasing

\`is\` answers whether two names refer to the same object:

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

\`first\` and \`third\` are equal — same contents — but not identical, because they are two separate lists. This is the equality-versus-identity distinction promised in Module 3, and lists are where it finally matters.

## Making a copy

Three ways, all equivalent for a flat list:

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

\`.copy()\` states the intent most plainly. The slice \`[:]\` is a common idiom you will see often, since a slice always builds a new list.

Dictionaries and sets also have \`.copy()\`.

## Copies are one level deep

\`\`\`python
grid = [[1, 2], [3, 4]]
shallow = grid.copy()
shallow[0].append(99)
print(grid)
\`\`\`

\`\`\`text
[[1, 2, 99], [3, 4]]
\`\`\`

The copy is a new outer list, but its items are the *same inner lists*. Modifying an inner list is still visible through both. This is a **shallow copy**.

For nested structures, Python's \`copy\` module provides \`deepcopy\`, which copies every level:

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

Reach for \`deepcopy\` only when you need it; it is slower, and most of the time a shallow copy is enough.

## Functions and mutable arguments

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

The function changed the caller's list. Sometimes that is exactly what you want; when it is not, it is a nasty bug, because the caller sees no sign that its data was altered.

The safer habit, and the one this course recommends, is for a function to return a new value rather than modify its argument:

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

This is the pure-function idea from Module 2, applied to collections. When a function modifies its arguments, say so clearly in its name and documentation.

## Summary

Assignment never copies; it creates another name for the same object. Mutating a shared list is visible through every name for it. Use \`.copy()\`, a full slice, or \`list()\` for a shallow copy, and \`copy.deepcopy\` for nested structures. Prefer functions that return new collections over ones that modify their arguments.`,
        },
        {
          type: "exercise",
          title: "Deduplicate Without Losing Order",
          description: "Use a set for membership while building an ordered list of first appearances.",
          instructions: `## The problem

Remove duplicates from a sequence while keeping the order in which items first appeared.

Converting to a set removes duplicates but discards order. Sorting afterwards gives alphabetical order, which is not the same as arrival order. The solution needs both structures.

## Input

One line of words separated by spaces.

## Requirements

1. Build a list containing each distinct word **once**, in the order of its first appearance.
2. Use a set to track which words have been seen.
3. Display exactly three lines:

\`\`\`text
Unique: ['red', 'blue', 'green']
Count: 3
Duplicates removed: 2
\`\`\`

\`Duplicates removed\` is the number of words in the input minus the number of distinct words.

## Example

Given \`red blue red green blue\`, the output is the three lines above.

Given an empty line:

\`\`\`text
Unique: []
Count: 0
Duplicates removed: 0
\`\`\`

## Guidance

Keep two structures as you loop: a list you append to, and a set you add to. For each word, check whether it is already in the set; if not, append it to the list and add it to the set.

Testing membership against the set rather than the list is the point of the exercise. It is also what you would do for real, because set membership does not slow down as the collection grows.

## Constraints

Do not sort the output. The order must be order of first appearance.`,
          starterCode: `words = input().split()

seen = set()
unique = []
`,
          hint: "for word in words: if word not in seen: unique.append(word) and seen.add(word). The duplicate count is len(words) - len(unique).",
          tests: [
            {
              input: "red blue red green blue\n",
              expectedOutput: "Unique: ['red', 'blue', 'green']\nCount: 3\nDuplicates removed: 2",
              description: "First-appearance order is preserved rather than alphabetical order",
            },
            {
              input: "\n",
              expectedOutput: "Unique: []\nCount: 0\nDuplicates removed: 0",
              description: "An empty input produces empty results without error",
            },
            {
              input: "one two three\n",
              expectedOutput: "Unique: ['one', 'two', 'three']\nCount: 3\nDuplicates removed: 0",
              description: "Input with no duplicates is returned unchanged",
            },
            {
              input: "z z z z\n",
              expectedOutput: "Unique: ['z']\nCount: 1\nDuplicates removed: 3",
              description: "A single repeated word collapses to one entry",
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
          description: "Combine dictionaries, lists, grouping, and sorting into a small reporting program.",
          instructions: `## The problem

A household expense tracker records spending by category. This checkpoint brings together the collections from the whole module.

## Input

A series of lines, each an expense in the form \`category:amount\`, where the amount is a whole number of pounds. The sequence ends with the line \`end\`.

## Requirements

Build a report showing, for each category:

- the total spent
- the number of entries
- the largest single entry

Display one line per category, sorted by **total spent, highest first**. Where two categories have the same total, sort those alphabetically by name.

Each line has this format:

\`\`\`text
food: total 45, entries 3, largest 20
\`\`\`

After the category lines, display one final line:

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

## Edge case

Given only \`end\`, the output is:

\`\`\`text
Overall total: 0
\`\`\`

with no category lines at all.

## Guidance

Group the amounts into a dictionary mapping each category to a list of its amounts. Once you have that, \`sum\`, \`len\`, and \`max\` give all three figures per category without further loops.

For the ordering, build a list of the categories and sort it with a \`key\` that returns a tuple: the negative total first, then the name. Sorting by a negative number is a neat way to get descending order while keeping the alphabetical tie-break ascending.

## Constraints

Amounts are always whole numbers of at least 0. Category names contain no spaces or colons.`,
          starterCode: `grouped = {}

line = input()
`,
          hint: "Split each line on \":\" and unpack into category and amount. Group with if category not in grouped: grouped[category] = [] then append. Sort with sorted(grouped, key=lambda name: (-sum(grouped[name]), name)).",
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
              description: "No entries produces only the overall line",
            },
            {
              input: "b:10\na:10\nend\n",
              expectedOutput: "a: total 10, entries 1, largest 10\nb: total 10, entries 1, largest 10\nOverall total: 20",
              description: "Equal totals are broken alphabetically by category name",
            },
            {
              input: "rent:800\nend\n",
              expectedOutput: "rent: total 800, entries 1, largest 800\nOverall total: 800",
              description: "A single category reports its own figures",
            },
            {
              input: "a:0\na:0\nend\n",
              expectedOutput: "a: total 0, entries 2, largest 0\nOverall total: 0",
              description: "Zero amounts still count as entries",
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

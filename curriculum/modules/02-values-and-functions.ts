import { module, lesson, type ModuleSource } from "../types.ts"

const moduleTwo: ModuleSource = module(
  "Values, Variables, Input, and Functions",
  "Storing and naming data, doing arithmetic, formatting text, reading input, and writing your own reusable operations.",
  [
    lesson(
      "Values and Variables",
      "The kinds of data Python works with, and how to give a value a name you can reuse.",
      [
        {
          type: "lesson",
          title: "Values, Expressions, and Types",
          description: "The four kinds of data you will use constantly, and how Python classifies them.",
          instructions: `## Data has kinds

So far every piece of data you have written has been text. Python works with several kinds of data, and it treats them differently. Knowing which kind you are holding explains most of the surprises beginners meet.

A **value** is a single piece of data: the text \`hello\`, the number \`7\`, the number \`2.5\`. Every value has a **type**, which is Python's classification of what kind of thing it is.

Four types matter immediately.

An **integer** is a whole number, positive, negative, or zero: \`7\`, \`-3\`, \`0\`. Python calls this type \`int\`.

A **float** is a number with a fractional part: \`2.5\`, \`-0.75\`, \`3.0\`. Python calls this \`float\`. Note that \`3.0\` is a float even though its value is a whole number — the decimal point is what makes it one.

A **string** is text, written between quotation marks: \`"hello"\`, \`"7"\`. Python calls this \`str\`.

A **Boolean** is one of exactly two values, \`True\` or \`False\`, written with a capital letter and no quotation marks. Python calls this \`bool\`. Booleans become central in the next module.

## Asking Python what type something is

The \`type()\` function reports the type of a value:

\`\`\`python
print(type(7))
print(type(2.5))
print(type("hello"))
print(type(True))
\`\`\`

which produces:

\`\`\`text
<class 'int'>
<class 'float'>
<class 'str'>
<class 'bool'>
\`\`\`

The word \`class\` in that output is Python's general term for a type. You will meet classes properly much later; for now, read \`<class 'int'>\` simply as "this is an integer".

## The most important distinction in this stage

Look carefully at these two values:

\`\`\`python
print(type(7))
print(type("7"))
\`\`\`

\`\`\`text
<class 'int'>
<class 'str'>
\`\`\`

\`7\` is a number. \`"7"\` is a *string that happens to contain a digit character*. They display identically when printed, which is exactly why this confusion is so common, but Python treats them as different kinds of thing entirely.

You can do arithmetic with the first. You cannot do arithmetic with the second — or rather, you can, but it means something else:

\`\`\`python
print(7 + 7)
print("7" + "7")
\`\`\`

\`\`\`text
14
77
\`\`\`

Adding two integers computes a sum. Adding two strings joins them end to end, which is called **concatenation**. The \`+\` symbol means different things depending on the types on either side of it.

> **Key idea**
> A string containing digits is not a number. \`"7"\` and \`7\` look the same when printed and behave completely differently. When arithmetic gives you a surprising result, check your types first.

## Expressions

An **expression** is any piece of code that produces a value. \`7\` is an expression. So is \`7 + 7\`, and so is \`"7" + "7"\`.

Python **evaluates** an expression, meaning it works out the single value the expression produces. Evaluation happens before anything else uses the result:

\`\`\`python
print(3 + 4)
\`\`\`

Python first evaluates \`3 + 4\` to get \`7\`, then passes that single value to \`print\`. What appears is \`7\`, never \`3 + 4\`. The expression is replaced by its result.

This is worth stating explicitly because it is the mechanism behind nearly everything that follows: wherever Python expects a value, you may write any expression that produces one.

## Predict before you continue

What are the two types here, and what does each line display?

\`\`\`python
print(type(3.0))
print(2 + 3 * 4)
\`\`\`

The first line displays \`<class 'float'>\`, because the decimal point makes it a float even though the value is a whole number. The second displays \`14\`, not \`20\`, because multiplication is carried out before addition. Precedence has its own stage shortly.

## Summary

Values have types: \`int\`, \`float\`, \`str\`, and \`bool\` to begin with. \`type()\` reports the type. A string of digits is not a number. An expression is code that produces a value, and Python evaluates it down to that single value before anything else uses it.`,
        },
        {
          type: "lesson",
          title: "Variables and Assignment",
          description: "Giving a value a name, and what actually happens when you reassign it.",
          instructions: `## The problem with anonymous values

Consider a program that computes a total and uses it three times. Without names, you would have to write the whole calculation out three times, and change it in three places when it changes. That is tedious and error-prone.

A **variable** is a name that refers to a value. You create one with an **assignment statement**:

\`\`\`python
item_count = 12
print(item_count)
\`\`\`

\`\`\`text
12
\`\`\`

The name is on the left, the \`=\` sign is in the middle, and an expression is on the right. Python evaluates the expression on the right, then makes the name on the left refer to the resulting value.

## The equals sign does not mean equality

This is the single most important correction to make about assignment. In mathematics, \`x = 5\` states a fact: x and 5 are the same. In Python, \`x = 5\` issues a command: *make the name x refer to the value 5*.

The difference becomes obvious with a line that is nonsense in mathematics but ordinary in Python:

\`\`\`python
count = 3
count = count + 1
print(count)
\`\`\`

\`\`\`text
4
\`\`\`

Read the second line as a sequence of two steps, right side first:

1. Evaluate \`count + 1\`. At this moment \`count\` refers to \`3\`, so the expression produces \`4\`.
2. Make the name \`count\` refer to \`4\`.

The old value is simply no longer referred to by that name. Nothing was "solved"; something was done.

> **Key idea**
> \`=\` is an instruction, not a statement of fact. It means "evaluate the right-hand side, then attach the left-hand name to the result." The test for equality is a different operator, \`==\`, which you meet in the next module.

## A name is not a value

Keep these separate in your mind. \`item_count\` is a name. \`12\` is a value. The name refers to the value; it is not the value itself.

Two names can refer to the same value at once:

\`\`\`python
original = 10
copy = original
original = 99
print(original)
print(copy)
\`\`\`

\`\`\`text
99
10
\`\`\`

Trace it carefully. Line 2 makes \`copy\` refer to whatever \`original\` referred to at that moment, which was \`10\`. Line 3 then points \`original\` at a new value. That does not disturb \`copy\`, which still refers to \`10\`.

Beginners often expect \`copy\` to change too, imagining that \`copy = original\` created a permanent link between the names. It did not. It copied a reference, once, at the moment the line ran. This will matter a great deal when you reach lists in Module 5.

## Using a name before it exists

A name only exists after an assignment has run. Using it earlier is an error:

\`\`\`python
total = 5
print(total)
\`\`\`

works, but reversing those two lines does not. Python reports a \`NameError\`, which means "you used a name I have never been told about". This is a *runtime* error: the arrangement of the code was legal, so the program started, and it failed only when it reached the offending line.

A \`NameError\` usually means one of three things: you misspelled the name, you used it before assigning it, or you assigned it inside something that never ran.

## Choosing names

Python requires that a name start with a letter or underscore and contain only letters, digits, and underscores. It cannot contain spaces or hyphens.

Convention, which Python does not enforce but every Python programmer follows, is to use lowercase words separated by underscores: \`item_count\`, \`total_price\`, \`user_name\`. This style is called snake case.

Beyond the rules, choose names that say what the value means. \`x\` tells a reader nothing. \`n\` is marginally better. \`unread_messages\` explains itself and never needs a comment. Good naming is not decoration; it is the cheapest way to make a program understandable, and it repays the effort every time you come back to the code.

## Summary

A variable is a name referring to a value, created by assignment. The right-hand side is evaluated first, then the name is attached to the result. \`=\` performs an action rather than asserting a fact. Names are not values, and assigning one name from another copies a reference once rather than linking them.`,
        },
        {
          type: "exercise",
          title: "Store, Reassign, and Display",
          description: "Use variables to hold values, then update one and observe the effect.",
          instructions: `## The problem

Write a program that tracks a count of open tasks.

## Requirements

1. Create a variable named \`open_tasks\` referring to the integer \`5\`.
2. Display it on its own line.
3. Increase \`open_tasks\` by \`3\`, using the existing value rather than typing \`8\`.
4. Display it again on its own line.
5. Create a second variable named \`label\` referring to the string \`Tasks remaining\`.
6. Display \`label\` and \`open_tasks\` with a single \`print\` call that receives them as two arguments.

## Expected output

\`\`\`text
5
8
Tasks remaining 8
\`\`\`

## Guidance

Step 3 is the important one. Writing \`open_tasks = 8\` would produce the right output for the wrong reason. Write an expression that reads the current value and adds to it, so that the program would still be correct if the starting value changed.

## Constraints

Do not type the literal \`8\` anywhere in your program.`,
          starterCode: `open_tasks = 5
`,
          hint: "To increase a variable by 3, put the variable itself on the right-hand side: open_tasks = open_tasks + 3. Python evaluates the right side first, using the current value.",
          tests: [
            {
              expectedOutput: "5\n8\nTasks remaining 8",
              description: "The count is displayed before and after the increase, then labelled",
            },
          ],
          solution: `open_tasks = 5
print(open_tasks)
open_tasks = open_tasks + 3
print(open_tasks)
label = "Tasks remaining"
print(label, open_tasks)
`,
        },
        {
          type: "exercise",
          title: "Trace an Assignment Sequence",
          description: "Predict the result of a sequence of assignments, then make the program prove you right.",
          instructions: `## The problem

Read this sequence carefully before writing anything:

\`\`\`python
a = 2
b = a
a = a + 10
b = b + 1
\`\`\`

Work out on paper what \`a\` and \`b\` refer to at the end. Remember that \`b = a\` copies a reference once; it does not link the two names.

## Your task

Write a program that performs exactly those four assignments and then displays the results in this format:

\`\`\`text
a is 12
b is 3
\`\`\`

## Requirements

1. Perform the four assignments shown above, in that order.
2. Display two lines, each produced by a \`print\` call receiving two arguments: a string label and the variable.
3. The labels are \`a is\` and \`b is\`.

## Constraints

Do not shortcut the reasoning by assigning the final values directly. The four assignments must appear in your program in the order given.`,
          starterCode: `a = 2
b = a
`,
          hint: "After b = a, the name b refers to 2. Changing a afterwards has no effect on b, so b starts from 2 when you add 1 to it.",
          tests: [
            {
              expectedOutput: "a is 12\nb is 3",
              description: "Both final values are correct, showing that reassigning a did not change b",
            },
          ],
          solution: `a = 2
b = a
a = a + 10
b = b + 1
print("a is", a)
print("b is", b)
`,
        },
      ],
    ),

    lesson(
      "Arithmetic and Precedence",
      "Python's numeric operators, the order they are applied in, and the two kinds of division.",
      [
        {
          type: "lesson",
          title: "Arithmetic Operators",
          description: "The seven operators you need, including the two that surprise people.",
          instructions: `## The operators

Python's arithmetic operators are mostly what you would expect:

\`\`\`python
print(7 + 2)
print(7 - 2)
print(7 * 2)
print(7 / 2)
\`\`\`

\`\`\`text
9
5
14
3.5
\`\`\`

Addition, subtraction, and multiplication behave as in ordinary arithmetic. Division deserves a closer look.

## Division always produces a float

Notice that \`7 / 2\` produced \`3.5\`, not \`3\`. More surprisingly:

\`\`\`python
print(6 / 2)
print(type(6 / 2))
\`\`\`

\`\`\`text
3.0
<class 'float'>
\`\`\`

Even when the division comes out exactly, \`/\` produces a float. This is deliberate: the type of the result depends only on the operator, not on the particular values, which makes programs predictable.

## Floor division and remainder

Two further operators handle whole-number division.

\`//\` is **floor division**. It divides and then discards anything after the decimal point, rounding down:

\`\`\`python
print(7 // 2)
print(20 // 6)
\`\`\`

\`\`\`text
3
3
\`\`\`

\`%\` is the **modulo** operator, sometimes called remainder. It gives what is left over after floor division:

\`\`\`python
print(7 % 2)
print(20 % 6)
\`\`\`

\`\`\`text
1
2
\`\`\`

These two are more useful than they first appear. Together they answer "how many whole groups, and how many left over?" — a question that comes up constantly. If you have 100 items and boxes that hold 12, then \`100 // 12\` is the number of full boxes and \`100 % 12\` is the number of items left over.

\`%\` also gives you a clean test for divisibility: a number is even exactly when \`number % 2\` is \`0\`. You will use that repeatedly from the next module onwards.

## Exponentiation

\`**\` raises to a power:

\`\`\`python
print(2 ** 10)
print(9 ** 0.5)
\`\`\`

\`\`\`text
1024
3.0
\`\`\`

Raising to the power \`0.5\` is a square root, which is occasionally handy before you meet the \`math\` module.

## Mixing integers and floats

If either operand is a float, the result is a float:

\`\`\`python
print(3 + 0.5)
print(4 * 2.0)
\`\`\`

\`\`\`text
3.5
8.0
\`\`\`

This is why a total that should read \`8\` sometimes reads \`8.0\`. Nothing is wrong; one of the inputs was a float, so the result is too.

## A caution about floats

Floats are stored in a way that cannot represent every decimal fraction exactly, in much the same way that decimal notation cannot write one third exactly. This occasionally shows:

\`\`\`python
print(0.1 + 0.2)
\`\`\`

\`\`\`text
0.30000000000000004
\`\`\`

This is not a bug in Python; it is a consequence of how fractions are stored in binary, and every mainstream language behaves the same way. For now, simply know it happens. The practical lesson is to avoid comparing two floats for exact equality, a point that returns in Module 3.

## Predict before you continue

What does each line display?

\`\`\`python
print(9 // 4)
print(9 % 4)
print(9 / 4)
\`\`\`

The answers are \`2\`, \`1\`, and \`2.25\`. Floor division gives whole groups, modulo gives the remainder, and true division gives the exact quotient as a float.

## Summary

\`+\`, \`-\`, \`*\` behave conventionally. \`/\` always produces a float. \`//\` divides and rounds down; \`%\` gives the remainder. \`**\` raises to a power. Mixing an int with a float produces a float.`,
        },
        {
          type: "lesson",
          title: "Precedence and Parentheses",
          description: "The order Python applies operators in, and how to override it.",
          instructions: `## Why order matters

Consider this expression:

\`\`\`python
print(2 + 3 * 4)
\`\`\`

There are two plausible readings. Add first, giving \`5 * 4\`, which is \`20\`. Or multiply first, giving \`2 + 12\`, which is \`14\`.

Python produces \`14\`. It follows fixed rules about which operator is applied first, called **precedence**. Python does not guess and does not consider what you probably meant; the rules are the same every time.

## The order

From highest precedence to lowest, for the operators you know:

1. Parentheses \`()\`
2. Exponentiation \`**\`
3. Multiplication \`*\`, division \`/\`, floor division \`//\`, modulo \`%\`
4. Addition \`+\`, subtraction \`-\`

Operators at the same level are applied left to right, with one exception: \`**\` is applied right to left, so \`2 ** 3 ** 2\` is \`2 ** 9\`, not \`8 ** 2\`. That exception rarely matters in practice; the rest of the table matters constantly.

\`\`\`python
print(10 - 2 - 3)
print(20 / 5 * 2)
\`\`\`

\`\`\`text
5
8.0
\`\`\`

Both are evaluated left to right. \`10 - 2\` is \`8\`, then \`8 - 3\` is \`5\`. Similarly \`20 / 5\` is \`4.0\`, then \`4.0 * 2\` is \`8.0\`.

## Parentheses override everything

Parentheses group part of an expression so it is evaluated first:

\`\`\`python
print(2 + 3 * 4)
print((2 + 3) * 4)
\`\`\`

\`\`\`text
14
20
\`\`\`

This is the same tool you already use for function calls, doing a different job. Context tells Python which meaning applies: parentheses after a function name call the function, parentheses around an expression group it.

## Use parentheses for readers, not just for Python

A common piece of advice is to add parentheses only where they change the result. A better rule is to add them wherever they save a reader from having to recall the precedence table.

Compare:

\`\`\`python
base = 100
rate = 0.2
years = 3
total = base + base * rate * years
print(total)
\`\`\`

with:

\`\`\`python
base = 100
rate = 0.2
years = 3
total = base + (base * rate * years)
print(total)
\`\`\`

Both display \`160.0\`. The second version costs nothing and removes any doubt about intent. When a reader has to pause and remember a rule, the code is doing less work than it could.

## A worked trace

Take this expression and evaluate it the way Python does:

\`\`\`python
print(4 + 6 // 2 * 3 - 1)
\`\`\`

1. \`//\` and \`*\` share the highest precedence present, so they go left to right. \`6 // 2\` is \`3\`. The expression is now \`4 + 3 * 3 - 1\`.
2. \`3 * 3\` is \`9\`. The expression is now \`4 + 9 - 1\`.
3. \`+\` and \`-\` share precedence, left to right. \`4 + 9\` is \`13\`, then \`13 - 1\` is \`12\`.

The output is \`12\`.

Notice that the answer depends entirely on doing steps in the right order. This is precisely the kind of place where a wrong assumption produces a program that runs perfectly and reports the wrong number, with no error message to warn you.

## Predict before you continue

What does this display?

\`\`\`python
print((8 + 4) / 3)
\`\`\`

The parentheses force the addition first, giving \`12\`, then division gives \`4.0\`. Note the float: \`/\` always produces one.

## Summary

Precedence decides which operator is applied first: parentheses, then \`**\`, then \`* / // %\`, then \`+ -\`, with same-level operators applied left to right. Parentheses override the order and are worth adding whenever they make intent clearer.`,
        },
        {
          type: "exercise",
          title: "Whole Boxes and Leftovers",
          description: "Use floor division and modulo to split a quantity into full containers and a remainder.",
          instructions: `## The problem

A dispatch team packs items into boxes. Every box holds exactly 12 items. Given a number of items, they need to know how many boxes will be completely full and how many items will be left over.

## Requirements

1. Create a variable \`items\` referring to the integer \`100\`.
2. Create a variable \`per_box\` referring to the integer \`12\`.
3. Compute the number of completely full boxes into a variable \`full_boxes\`.
4. Compute the number of leftover items into a variable \`leftover\`.
5. Display exactly two lines in this format:

\`\`\`text
Full boxes: 8
Leftover items: 4
\`\`\`

## Guidance

Two operators from this lesson answer the two questions directly. One discards the fractional part of a division; the other reports what division leaves behind.

Use \`items\` and \`per_box\` in your calculations rather than typing \`100\` and \`12\` again. A program written that way still works when the numbers change, which is the entire point of using variables.

## Constraints

Do not type the numbers \`8\` or \`4\` anywhere. Both must be computed.`,
          starterCode: `items = 100
per_box = 12
`,
          hint: "items // per_box discards the fraction, giving whole boxes. items % per_box gives what is left over. Use print with two arguments, or build the string yourself.",
          tests: [
            {
              expectedOutput: "Full boxes: 8\nLeftover items: 4",
              description: "Both the number of full boxes and the remainder are computed correctly",
            },
          ],
          solution: `items = 100
per_box = 12
full_boxes = items // per_box
leftover = items % per_box
print("Full boxes:", full_boxes)
print("Leftover items:", leftover)
`,
        },
        {
          type: "exercise",
          title: "Fix a Precedence Bug",
          description: "A running program computes the wrong average because of a missing pair of parentheses.",
          instructions: `## The problem

The program in the editor is meant to compute the average of three test scores and display it. It runs without any error, and it is wrong.

The three scores are 70, 80, and 90. Their average is 80.0. The program currently reports something else.

## Your task

Find the reason and fix it. Change as little as possible.

## Expected output

\`\`\`text
Average: 80.0
\`\`\`

## Guidance

Run the program first and look at the number it produces. Then evaluate the expression by hand, applying the precedence rules in order. The gap between what you intended and what the rules actually require is the bug.

This is a good example of a whole category of defect: nothing is malformed, nothing raises an error, and the only symptom is a wrong number. The only defence is checking the result against a value you worked out independently.

## Requirements

1. The output must be exactly \`Average: 80.0\`.
2. Keep the three score variables and compute the average from them.`,
          starterCode: `first = 70
second = 80
third = 90

average = first + second + third / 3
print("Average:", average)
`,
          hint: "Division binds more tightly than addition, so only `third` is being divided by 3. Group the whole sum in parentheses before dividing.",
          tests: [
            {
              expectedOutput: "Average: 80.0",
              description: "The average is computed over all three scores, not just the last one",
            },
          ],
          solution: `first = 70
second = 80
third = 90

average = (first + second + third) / 3
print("Average:", average)
`,
        },
      ],
    ),

    lesson(
      "Working with Strings",
      "Operations on text, and a readable way to build strings out of values.",
      [
        {
          type: "lesson",
          title: "String Operations and Methods",
          description: "Joining, repeating, measuring, and transforming text.",
          instructions: `## Joining and repeating

Two arithmetic operators have meanings for strings.

\`+\` joins two strings end to end:

\`\`\`python
first = "field"
second = "notes"
print(first + second)
print(first + " " + second)
\`\`\`

\`\`\`text
fieldnotes
field notes
\`\`\`

Note that \`+\` adds nothing of its own. If you want a space between the words, you must supply it. This is different from \`print\` with several arguments, which inserts a space for you — a common source of confusion, so it is worth keeping the two mechanisms distinct.

\`*\` repeats a string a whole number of times:

\`\`\`python
print("-" * 20)
\`\`\`

\`\`\`text
--------------------
\`\`\`

That idiom is genuinely useful for drawing separator lines in output.

## Adding a string to a number fails

\`\`\`python
count = 3
print("You have " + str(count) + " messages")
\`\`\`

\`\`\`text
You have 3 messages
\`\`\`

The \`str()\` there is doing necessary work. Without it, \`"You have " + 3\` raises a \`TypeError\`, because Python will not guess whether you meant to do arithmetic or to join text. Converting explicitly says which one you meant. The next stage shows a cleaner way to write the same thing.

## Length

\`len()\` reports how many characters a string contains:

\`\`\`python
print(len("field"))
print(len(""))
\`\`\`

\`\`\`text
5
0
\`\`\`

Spaces and punctuation are characters and are counted.

## Methods

A **method** is a function that belongs to a particular value and is called with a dot:

\`\`\`python
name = "ada lovelace"
print(name.upper())
print(name.title())
\`\`\`

\`\`\`text
ADA LOVELACE
Ada Lovelace
\`\`\`

Read \`name.upper()\` as "ask the string that \`name\` refers to for its uppercase version". The dot means "belonging to". The parentheses are still there because this is still a function call.

Methods worth knowing now:

\`\`\`python
text = "  Field Notes  "
print(text.strip())
print(text.strip().lower())
print("a,b,c".replace(",", " | "))
print("field notes".startswith("field"))
\`\`\`

\`\`\`text
Field Notes
field notes
a | b | c
True
\`\`\`

\`strip()\` removes whitespace from both ends, which is essential when handling text that people typed. \`lower()\` and \`upper()\` change case. \`replace()\` substitutes one piece of text for another. \`startswith()\` reports whether the string begins with something, and produces a Boolean.

## Methods do not change the original

This is the point most often missed:

\`\`\`python
name = "ada"
name.upper()
print(name)
\`\`\`

\`\`\`text
ada
\`\`\`

Nothing changed. \`upper()\` did not modify \`name\`; it produced a *new* string and, because nothing was done with that new string, it was discarded.

To keep the result, assign it:

\`\`\`python
name = "ada"
name = name.upper()
print(name)
\`\`\`

\`\`\`text
ADA
\`\`\`

Strings in Python are **immutable**, meaning a string value can never be altered once it exists. Every string method returns a new string and leaves the original untouched.

> **Key idea**
> A string method returns a new string; it does not modify the one you called it on. If you do not assign the result, the result is thrown away.

## Chaining

Because each method returns a string, you can call another method on the result:

\`\`\`python
raw = "   Ada Lovelace   "
print(raw.strip().lower().replace(" ", "_"))
\`\`\`

\`\`\`text
ada_lovelace
\`\`\`

Read it left to right: strip the spaces, lowercase the result, then replace spaces in that result. Chains longer than three or four calls become hard to read; at that point, use intermediate variables with meaningful names instead.

## Summary

\`+\` joins strings and adds no separator; \`*\` repeats. \`len()\` counts characters. Methods are functions called with a dot on a value. String methods always return a new string and never modify the original, so their results must be assigned to be kept.`,
        },
        {
          type: "lesson",
          title: "F-Strings",
          description: "Building strings that contain values, without concatenation and conversion.",
          instructions: `## The problem with concatenation

Suppose you want to display a line like \`Ada has 3 unread messages\`, where the name and the number come from variables. With concatenation:

\`\`\`python
name = "Ada"
unread = 3
print(name + " has " + str(unread) + " unread messages")
\`\`\`

\`\`\`text
Ada has 3 unread messages
\`\`\`

It works, but look at the cost. Four \`+\` operators, a conversion, and spaces that must be placed carefully inside the quotation marks. The shape of the final sentence is hard to see through the machinery.

## The f-string

An **f-string** is a string with an \`f\` before the opening quotation mark. Inside it, anything in curly braces is evaluated and its value inserted:

\`\`\`python
name = "Ada"
unread = 3
print(f"{name} has {unread} unread messages")
\`\`\`

\`\`\`text
Ada has 3 unread messages
\`\`\`

The sentence is now readable as a sentence. The variable names appear where their values will appear. No conversion is needed: values of any type are converted to their display form automatically.

Forgetting the \`f\` is a common slip, and it fails quietly:

\`\`\`python
name = "Ada"
print("{name} is here")
\`\`\`

\`\`\`text
{name} is here
\`\`\`

Without the \`f\`, the braces have no special meaning and are simply characters. If your output contains literal braces and variable names, check for a missing \`f\`.

## Any expression, not just a name

The braces may contain any expression:

\`\`\`python
price = 4
quantity = 3
print(f"Total: {price * quantity}")
print(f"Name: {'ada lovelace'.title()}")
\`\`\`

\`\`\`text
Total: 12
Name: Ada Lovelace
\`\`\`

Note the inner quotation marks in the second line: single quotes inside a double-quoted f-string. The same rule as always applies — the inner quotes must differ from the outer ones.

Keep the expressions short. An f-string is for presenting a value, not for doing the work. If the expression inside the braces is long enough to need thought, compute it into a well-named variable on the previous line and put the name in the braces.

## Controlling how numbers appear

A colon inside the braces introduces a format specification. The one worth learning now controls decimal places:

\`\`\`python
average = 80.66666666666667
print(f"Average: {average:.2f}")
print(f"Average: {average:.0f}")
\`\`\`

\`\`\`text
Average: 80.67
Average: 81
\`\`\`

\`.2f\` means "as a decimal number with two digits after the point". It rounds for display. This is exactly the tool for reporting a float that would otherwise print seventeen digits.

Note carefully that this changes only the *display*. The value that \`average\` refers to is unchanged:

\`\`\`python
average = 80.66666666666667
print(f"{average:.2f}")
print(average)
\`\`\`

\`\`\`text
80.67
80.66666666666667
\`\`\`

That distinction — between a value and its printed representation — first came up with strings and newlines in Module 1. It recurs constantly, and it explains a whole class of confusion about "why is my number wrong when I print it a different way".

> **Key idea**
> Formatting changes how a value is displayed, not what the value is. \`f"{x:.2f}"\` produces a rounded *string*; \`x\` itself is untouched.

## Alignment

Two more specifications are useful for producing tidy columns of output:

\`\`\`python
print(f"{'Item':<10}{'Qty':>5}")
print(f"{'Bolts':<10}{12:>5}")
print(f"{'Washers':<10}{7:>5}")
\`\`\`

\`\`\`text
Item        Qty
Bolts        12
Washers       7
\`\`\`

\`<10\` means "left-aligned in a field ten characters wide", and \`>5\` means "right-aligned in a field five wide". Right-aligning numbers lines up their digits, which makes a column far easier to read.

## Summary

An f-string is prefixed with \`f\`, and expressions inside curly braces are evaluated and inserted. It replaces concatenation and explicit conversion. \`:.2f\` sets decimal places for display only; \`<\` and \`>\` with a width control alignment.`,
        },
        {
          type: "exercise",
          title: "Format a Record Line",
          description: "Use an f-string to build a single line from several values, with a rounded number.",
          instructions: `## The problem

A study log records a subject, the number of sessions completed, and the total hours spent. You need to produce one summary line.

## Requirements

1. Use these three variables exactly as given in the starter code.
2. Compute the mean hours per session into a variable named \`per_session\`.
3. Display exactly one line, built with a single f-string, in this format:

\`\`\`text
Statistics: 7 sessions, 11.5 hours, 1.64 hours each
\`\`\`

## Details

- \`Statistics\` is the value of \`subject\`.
- \`7\` is the value of \`sessions\`.
- \`11.5\` is the value of \`hours\`.
- \`1.64\` is \`per_session\` rounded to **two** decimal places for display. The exact value is 1.642857..., so do not round it yourself; use a format specification.

## Guidance

Compute \`per_session\` on its own line rather than inside the braces. The f-string should present values, not calculate them.

## Constraints

Use exactly one \`print\` call with one f-string. Do not use \`+\` to join strings, and do not use \`str()\`.`,
          starterCode: `subject = "Statistics"
sessions = 7
hours = 11.5
`,
          hint: "Divide hours by sessions to get per_session. Inside the f-string, write {per_session:.2f} to show two decimal places without changing the stored value.",
          tests: [
            {
              expectedOutput: "Statistics: 7 sessions, 11.5 hours, 1.64 hours each",
              description: "The line is assembled correctly with the mean rounded to two decimal places",
            },
          ],
          solution: `subject = "Statistics"
sessions = 7
hours = 11.5
per_session = hours / sessions
print(f"{subject}: {sessions} sessions, {hours} hours, {per_session:.2f} hours each")
`,
        },
        {
          type: "exercise",
          title: "Clean Up Untidy Text",
          description: "Apply string methods to normalise text that a person typed carelessly.",
          instructions: `## The problem

Text entered by people is rarely tidy. It has stray spaces, inconsistent capitalisation, and separators that do not match what you need.

## Requirements

Starting from the variable \`raw\` in the editor, produce a variable \`clean\` in which:

1. Whitespace at the beginning and end has been removed.
2. All letters are lowercase.
3. Every space between words has been replaced with a single hyphen.

Then display two lines:

\`\`\`text
Before: '   Weekly Field Report   '
After: 'weekly-field-report'
\`\`\`

## Details

The quotation marks in the output are literal single-quote characters, printed so the whitespace in the original is visible. Note that \`Before:\` shows the original value of \`raw\`, unchanged — proving that the original string was never modified.

## Guidance

Do the operations in the order listed. Stripping *before* replacing matters: if you replace spaces first, the leading and trailing spaces become hyphens and the result is wrong.

Remember that each method returns a new string, so you must either chain the calls or assign each intermediate result.

## Constraints

Use one \`print\` per line, and build the output with f-strings.`,
          starterCode: `raw = "   Weekly Field Report   "
`,
          hint: "Chain the calls in order: raw.strip().lower().replace(\" \", \"-\"). To show a single quote inside an f-string delimited by double quotes, just type it as an ordinary character.",
          tests: [
            {
              expectedOutput: "Before: '   Weekly Field Report   '\nAfter: 'weekly-field-report'",
              description: "The cleaned value is correct and the original string is left unchanged",
            },
          ],
          solution: `raw = "   Weekly Field Report   "
clean = raw.strip().lower().replace(" ", "-")
print(f"Before: '{raw}'")
print(f"After: '{clean}'")
`,
        },
      ],
    ),

    lesson(
      "Input and Conversion",
      "Reading what a person types, and turning text into the type you need.",
      [
        {
          type: "lesson",
          title: "Reading Input",
          description: "How a program pauses to receive text, and what it always receives.",
          instructions: `## Programs that receive information

Every program so far has produced the same output every time it ran. That is a serious limitation: useful programs respond to information supplied when they run.

The \`input()\` function reads one line of text:

\`\`\`python
name = input()
print(f"Hello, {name}")
\`\`\`

When this runs, the program pauses at \`input()\` and waits. Once a line is supplied, \`input()\` produces that line as a value, which is then assigned to \`name\`.

## input() always produces a string

This is the single most important fact about \`input()\`, and it causes more early confusion than anything else in this module.

Whatever is typed, \`input()\` produces a **string**. Always. Even when what was typed looks like a number:

\`\`\`python
age = input()
print(type(age))
\`\`\`

If \`36\` is supplied, the output is:

\`\`\`text
<class 'str'>
\`\`\`

Not \`int\`. The value is the two-character string \`"36"\`.

This connects directly to the distinction drawn earlier: \`"7"\` is not \`7\`. Arithmetic on input without converting it first produces results that are wrong in a specific, recognisable way:

\`\`\`python
first = "5"
second = "3"
print(first + second)
\`\`\`

\`\`\`text
53
\`\`\`

Two strings were joined, not added. If a program that adds user-supplied numbers produces a long number that looks like the inputs stuck together, this is always the reason.

> **Key idea**
> \`input()\` produces a string every time. If you need a number, you must convert it explicitly.

## Prompts

\`input()\` accepts an optional argument, displayed before the program waits:

\`\`\`python
name = input("What is your name? ")
print(f"Hello, {name}")
\`\`\`

The prompt appears in the output, exactly as if it had been printed. That is worth knowing, because it affects exercises: since a prompt becomes part of the program's output, and this course grades output exactly, **the graded exercises in this course use \`input()\` with no prompt**. The exercise instructions always tell you what will be supplied and in what order.

When you write programs outside this course, prompts are good practice — a program that pauses silently gives a person no idea what it wants.

## Reading several values

Each \`input()\` call reads one line. To read three values, call it three times:

\`\`\`python
first = input()
second = input()
third = input()
print(f"{first} then {second} then {third}")
\`\`\`

The calls read lines in order. The first \`input()\` gets the first line, and so on. Getting the order wrong is a common bug and produces sensible-looking output with the values in the wrong places.

## Summary

\`input()\` reads one line and always produces a string, regardless of what it looks like. An optional argument is displayed as a prompt and becomes part of the output. Each call consumes one line, in order.`,
        },
        {
          type: "lesson",
          title: "Converting Between Types",
          description: "Turning strings into numbers and back, and what happens when conversion fails.",
          instructions: `## The conversion functions

Three functions convert between the types you know:

\`int()\` produces an integer. \`float()\` produces a float. \`str()\` produces a string.

\`\`\`python
print(int("42") + 1)
print(float("2.5") + 1)
print(str(42) + "!")
\`\`\`

\`\`\`text
43
3.5
42!
\`\`\`

Each produces a new value. Like string methods, they do not modify anything; the result must be used or assigned.

## The standard pattern for numeric input

\`\`\`python
raw = input()
count = int(raw)
print(count * 2)
\`\`\`

Given \`21\`, this displays \`42\`. Compare with what happens without the conversion: \`"21" * 2\` is \`"2121"\`, because multiplying a string repeats it.

The two steps are often combined:

\`\`\`python
count = int(input())
print(count * 2)
\`\`\`

Read that from the inside out. \`input()\` runs first and produces a string; \`int()\` receives that string and produces an integer; the integer is assigned to \`count\`. Nesting calls like this is idiomatic and worth getting comfortable with, though writing the two steps separately is equally correct and easier to debug.

## Conversions that fail

\`int()\` requires a string that is a whole number and nothing else:

\`\`\`python
print(int("42"))
print(int(" 42 "))
\`\`\`

\`\`\`text
42
42
\`\`\`

Surrounding whitespace is tolerated. But \`int("four")\`, \`int("4.5")\`, and \`int("")\` all raise a \`ValueError\`, which means "the type is right but the content is not usable".

A \`ValueError\` here is a *runtime* error. The program starts, runs normally, and stops at the moment the conversion fails. Everything printed before that point has already appeared.

Note the second case particularly: \`int("4.5")\` fails. \`int()\` will not silently discard a fractional part from a string. If you might receive a decimal, convert with \`float()\` first.

## Converting a float to an int truncates

Converting a *float value* to an integer does discard the fractional part, and it does so by rounding towards zero:

\`\`\`python
print(int(4.9))
print(int(-4.9))
\`\`\`

\`\`\`text
4
-4
\`\`\`

That is truncation, not rounding to nearest. If you want to round to the nearest whole number, use \`round()\`:

\`\`\`python
print(round(4.9))
print(round(4.4))
print(round(2.567, 2))
\`\`\`

\`\`\`text
5
4
2.57
\`\`\`

\`round()\` with a second argument rounds to that many decimal places, and unlike an f-string's \`.2f\`, it produces an actual rounded *number* rather than a formatted string. Use \`round()\` when the value itself should change, and \`:.2f\` when only the display should.

## A worked example

A program that reads two numbers and reports their sum and mean:

\`\`\`python
first = int(input())
second = int(input())
total = first + second
mean = total / 2
print(f"Total: {total}")
print(f"Mean: {mean:.1f}")
\`\`\`

Given \`7\` and \`8\`, this displays:

\`\`\`text
Total: 15
Mean: 7.5
\`\`\`

Trace the types. Both inputs arrive as strings and are converted to integers. \`total\` is an integer. \`mean\` is a float, because \`/\` always produces one. The f-string displays it with one decimal place.

## Predict before you continue

If the line \`10\` is supplied, what does this display?

\`\`\`python
value = input()
print(value + value)
\`\`\`

It displays \`1010\`, not \`20\`. No conversion was performed, so \`+\` joined two strings.

## Summary

\`int()\`, \`float()\`, and \`str()\` convert between types and return new values. \`int()\` on a non-numeric or decimal string raises \`ValueError\`. \`int()\` on a float truncates towards zero; \`round()\` rounds to nearest and can take a number of decimal places.`,
        },
        {
          type: "exercise",
          title: "Convert Input and Compute",
          description: "Read two numbers from input, convert them, and report a total and a mean.",
          instructions: `## The problem

Write a program that reads two whole numbers and reports their total and their mean.

## Input

The program receives exactly two lines, each containing a whole number. Read them with \`input()\` and no prompt.

## Requirements

1. Read the first number, then the second, in that order.
2. Convert both to integers.
3. Display exactly two lines:

\`\`\`text
Total: 22
Mean: 11.0
\`\`\`

## Example

Given the input lines \`14\` and \`8\`, the output is:

\`\`\`text
Total: 22
Mean: 11.0
\`\`\`

Given the input lines \`3\` and \`4\`, the output is:

\`\`\`text
Total: 7
Mean: 3.5
\`\`\`

## Details

The mean is displayed exactly as \`/\` produces it, with no rounding and no format specification. Because \`/\` always produces a float, a whole-number mean appears as \`11.0\` rather than \`11\`.

## Constraints

Your program must work for any two whole numbers, not just the examples. It is tested with several different pairs.`,
          starterCode: `first = input()
`,
          hint: "input() gives you strings. Wrap each one in int() before doing arithmetic, or your total will be the two digits stuck together.",
          tests: [
            {
              input: "14\n8\n",
              expectedOutput: "Total: 22\nMean: 11.0",
              description: "Two positive numbers with a whole-number mean",
            },
            {
              input: "3\n4\n",
              expectedOutput: "Total: 7\nMean: 3.5",
              description: "Two numbers whose mean has a fractional part",
            },
            {
              input: "-5\n5\n",
              expectedOutput: "Total: 0\nMean: 0.0",
              description: "Negative and positive values that cancel out",
            },
          ],
          solution: `first = int(input())
second = int(input())
total = first + second
mean = total / 2
print(f"Total: {total}")
print(f"Mean: {mean}")
`,
        },
        {
          type: "exercise",
          title: "Build a Receipt Line",
          description: "Read a mixture of text and numeric input and format a currency total.",
          instructions: `## The problem

A stall keeper wants one printed line per sale.

## Input

Three lines, in this order:

1. The item name, as text.
2. The quantity, a whole number.
3. The unit price in pounds, which may have a decimal part.

## Requirements

1. Read the three lines with \`input()\` and no prompt.
2. Convert the quantity to an integer and the price to a float.
3. Compute the total cost.
4. Display exactly one line in this format:

\`\`\`text
4 x Notebook @ 2.50 = 10.00
\`\`\`

## Details

Both the unit price and the total are shown with exactly **two** decimal places, regardless of what was supplied. A price supplied as \`2.5\` must appear as \`2.50\`.

## Example

Given \`Notebook\`, \`4\`, \`2.5\`, the output is:

\`\`\`text
4 x Notebook @ 2.50 = 10.00
\`\`\`

Given \`Pen\`, \`3\`, \`1.2\`, the output is:

\`\`\`text
3 x Pen @ 1.20 = 3.60
\`\`\`

## Constraints

Use a single f-string. Do not round the values yourself with \`round()\`; use a format specification so the stored values stay exact.`,
          starterCode: `item = input()
`,
          hint: "Read all three lines first, then convert. Inside the f-string use {price:.2f} and {total:.2f} to force two decimal places.",
          tests: [
            {
              input: "Notebook\n4\n2.5\n",
              expectedOutput: "4 x Notebook @ 2.50 = 10.00",
              description: "A price given with one decimal place is displayed with two",
            },
            {
              input: "Pen\n3\n1.2\n",
              expectedOutput: "3 x Pen @ 1.20 = 3.60",
              description: "A different item, quantity, and price",
            },
            {
              input: "Ruler\n1\n0.99\n",
              expectedOutput: "1 x Ruler @ 0.99 = 0.99",
              description: "A quantity of one with a price already at two decimal places",
            },
          ],
          solution: `item = input()
quantity = int(input())
price = float(input())
total = quantity * price
print(f"{quantity} x {item} @ {price:.2f} = {total:.2f}")
`,
        },
      ],
    ),

    lesson(
      "Writing Your Own Functions",
      "Packaging an operation under a name so it can be used repeatedly and reasoned about separately.",
      [
        {
          type: "lesson",
          title: "Defining and Calling a Function",
          description: "The def statement, parameters, arguments, and return values.",
          instructions: `## Why define your own

You have called functions written by others: \`print\`, \`len\`, \`int\`. Defining your own lets you name an operation once and use it everywhere, which removes repetition and gives the operation a name a reader can understand.

## The def statement

\`\`\`python
def greet(name):
    return f"Hello, {name}"

print(greet("Ada"))
print(greet("Grace"))
\`\`\`

\`\`\`text
Hello, Ada
Hello, Grace
\`\`\`

Take the definition apart.

\`def\` announces a definition. \`greet\` is the name. \`(name)\` lists the **parameters**: names the function will use for the values it is given. The colon ends the header line.

The indented lines beneath are the **body**: the instructions that run when the function is called. Indentation is how Python marks which lines belong to the function — it is structural, not cosmetic. Four spaces is the universal convention.

\`return\` sends a value back to whoever called the function, and ends the call immediately.

## Definition is not execution

\`\`\`python
def greet(name):
    return f"Hello, {name}"

print("This runs first")
print(greet("Ada"))
\`\`\`

\`\`\`text
This runs first
Hello, Ada
\`\`\`

Running the \`def\` statement does not run the body. It creates the function and attaches it to the name \`greet\`, and then moves on. The body runs only when the function is **called**, which means writing its name followed by parentheses.

> **Key idea**
> A definition creates a function; a call runs it. \`greet\` refers to the function itself. \`greet("Ada")\` runs it and produces a value.

## Parameters and arguments

These two words are often used loosely, and the distinction is genuinely useful.

A **parameter** is the name in the definition. In \`def greet(name):\`, the parameter is \`name\`.

An **argument** is the value supplied at the call. In \`greet("Ada")\`, the argument is \`"Ada"\`.

When the call happens, each argument is assigned to the corresponding parameter, and the body runs with those assignments in place. The parameter is an ordinary variable that exists only while the function runs.

A function may take several parameters, matched by position:

\`\`\`python
def describe(item, quantity):
    return f"{quantity} x {item}"

print(describe("Bolt", 12))
\`\`\`

\`\`\`text
12 x Bolt
\`\`\`

The first argument goes to the first parameter. Swapping them at the call site produces \`Bolt x 12\` — perfectly valid code producing nonsense, with no error to warn you.

A function may also take none:

\`\`\`python
def divider():
    return "-" * 20

print(divider())
\`\`\`

The empty parentheses are still required in both the definition and the call.

## What a call produces

A function call is an expression: it produces a value, and may be used anywhere a value is expected.

\`\`\`python
def double(number):
    return number * 2

result = double(21)
print(result)
print(double(5) + double(10))
\`\`\`

\`\`\`text
42
30
\`\`\`

In the last line, both calls are evaluated first, producing \`10\` and \`20\`, and those values are then added.

## Summary

\`def\` defines a function with a name, parameters, and an indented body. Parameters are names in the definition; arguments are values at the call. Defining does not run the body; calling does. \`return\` produces the call's value and ends the call.`,
        },
        {
          type: "lesson",
          title: "Printing Versus Returning",
          description: "The most consequential distinction in this module, and how to tell which one you need.",
          instructions: `## Two functions that look alike

\`\`\`python
def show_double(number):
    print(number * 2)

def get_double(number):
    return number * 2

show_double(21)
print(get_double(21))
\`\`\`

\`\`\`text
42
42
\`\`\`

The output is identical, so it is tempting to conclude the functions are equivalent. They are not, and the difference matters enormously.

## The difference

\`print()\` displays text for a person to read. It sends characters to the console and produces no usable value.

\`return\` hands a value back to the calling code, which can then store it, combine it, or pass it somewhere else.

The distinction becomes visible the moment you try to use the result:

\`\`\`python
def show_double(number):
    print(number * 2)

def get_double(number):
    return number * 2

a = get_double(10)
b = show_double(10)
print(f"a is {a}")
print(f"b is {b}")
\`\`\`

\`\`\`text
20
a is 20
b is None
\`\`\`

Follow the output carefully. \`20\` appears first, printed by \`show_double\` when it was called. Then \`a is 20\`, because \`get_double\` returned a value that was stored.

Then \`b is None\`. \`show_double\` displayed something but returned nothing, and a function that returns nothing produces the special value \`None\`.

## None

\`None\` is Python's value meaning "no value at all". It is not zero, not an empty string, and not \`False\`; it is its own thing, of type \`NoneType\`.

Every function returns something. A function with no \`return\` statement returns \`None\` when it reaches the end of its body.

Seeing \`None\` in your output is almost always a symptom of the same mistake: printing the result of a function that printed rather than returned.

\`\`\`python
def add(a, b):
    print(a + b)

print(add(2, 3))
\`\`\`

\`\`\`text
5
None
\`\`\`

The \`5\` came from inside \`add\`. The \`None\` came from printing what \`add\` handed back, which was nothing. The fix is to \`return a + b\` instead.

> **Key idea**
> If you see \`None\` where you expected a value, you almost certainly wrote \`print\` inside a function where you meant \`return\`.

## Which should you write?

The rule that serves best, and which the rest of this course follows:

**Functions that compute should return. Only the outermost part of a program should print.**

The reason is reusability. A function that returns can be used in any context: its value can be stored, formatted differently, compared, or fed to another function. A function that prints can only ever do one thing — put those exact characters on the console, in that exact form.

\`\`\`python
def area(width, height):
    return width * height

small = area(2, 3)
large = area(10, 4)
print(f"Small: {small}")
print(f"Large: {large}")
print(f"Combined: {small + large}")
\`\`\`

\`\`\`text
Small: 6
Large: 40
Combined: 46
\`\`\`

Had \`area\` printed instead of returned, that last line would have been impossible without rewriting the function.

## return ends the call immediately

\`\`\`python
def first_word(text):
    return text.split()[0]
    print("this line never runs")

print(first_word("hello there"))
\`\`\`

\`\`\`text
hello
\`\`\`

Anything after a \`return\` that has executed is unreachable. This becomes useful in the next module, where returning early is a clean way to handle special cases.

## Summary

\`print\` displays; \`return\` produces a value for the caller. A function without \`return\` produces \`None\`. Compute with returns and print at the edges of your program, so that the computing parts stay reusable.`,
        },
        {
          type: "lesson",
          title: "Scope and Side Effects",
          description: "Where a function's names live, and what it means for a function to affect the outside world.",
          instructions: `## Names inside a function are private

A name created inside a function exists only while that function runs, and only inside it:

\`\`\`python
def compute():
    working_total = 99
    return working_total

print(compute())
\`\`\`

\`\`\`text
99
\`\`\`

Adding \`print(working_total)\` after the call raises a \`NameError\`. The name existed during the call and was discarded when the call finished.

The region of a program where a name is usable is called its **scope**. Names created inside a function have **local** scope. Names created at the top level of your program have **global** scope.

This is a feature, not an inconvenience. It means you can write a function without checking whether its variable names collide with names elsewhere:

\`\`\`python
def first_step():
    result = 10
    return result

def second_step():
    result = 20
    return result

print(first_step())
print(second_step())
\`\`\`

\`\`\`text
10
20
\`\`\`

Both functions use \`result\` and neither disturbs the other, because each \`result\` lives only in its own call.

## Reading a global name

A function can read a name from the enclosing program:

\`\`\`python
tax_rate = 0.2

def with_tax(amount):
    return amount * (1 + tax_rate)

print(with_tax(100))
\`\`\`

\`\`\`text
120.0
\`\`\`

This works, and for genuine constants it is reasonable. But it creates a hidden dependency: reading the definition of \`with_tax\` alone does not tell you everything it needs. Passing the value in as a parameter makes the dependency visible:

\`\`\`python
def with_tax(amount, rate):
    return amount * (1 + rate)

print(with_tax(100, 0.2))
\`\`\`

\`\`\`text
120.0
\`\`\`

The second version can be understood entirely from its own definition, and can be reused with a different rate.

## Assignment inside a function creates a local name

\`\`\`python
counter = 0

def attempt_increase():
    counter = 5
    return counter

print(attempt_increase())
print(counter)
\`\`\`

\`\`\`text
5
0
\`\`\`

The function did not change the global \`counter\`. Assigning to a name inside a function creates a *new local name*, which shadows the global one for the duration of the call. The global is untouched.

Python does provide a \`global\` keyword to override this, and you should almost never use it. A function that reaches out and modifies global state is hard to reason about, because its effect is invisible at the call site. Return a value and let the caller decide what to do with it.

## Pure functions and side effects

A function is **pure** when it does two things and nothing else: it computes a result from its arguments, and it returns it. Given the same arguments, it always produces the same result, and it leaves everything outside itself untouched.

\`\`\`python
def total_with_tax(amount, rate):
    return amount * (1 + rate)
\`\`\`

That function is pure. Call it a thousand times; nothing accumulates, nothing changes, and the answer for a given pair of arguments never varies.

A **side effect** is anything a function does beyond returning a value: printing, modifying a global, writing a file, reading input. Side effects are not bad — a program with no side effects at all could not communicate. But they should be deliberate and concentrated.

Pure functions are dramatically easier to test, because testing one requires nothing more than calling it and checking the answer. That property becomes concrete in Module 9, when you start writing tests. It is worth building the habit now.

> **Key idea**
> Prefer functions that take everything they need as parameters and hand back a result. Keep printing and other side effects in a thin outer layer that coordinates the pure parts.

## Summary

Names created inside a function are local and vanish when the call ends. Assigning to a name inside a function creates a local name rather than changing a global one. A pure function computes from its arguments and returns a result without disturbing anything else; prefer these, and concentrate side effects at the edges.`,
        },
        {
          type: "exercise",
          title: "Write a Function That Returns",
          description: "Define a function that computes a value, and call it several times.",
          instructions: `## The problem

Define a function that converts a duration in minutes into a readable string.

## Requirements

1. Define a function named \`format_duration\` taking one parameter, \`minutes\`, a whole number.
2. It must **return** a string of the form \`2h 15m\`, where the first number is whole hours and the second is the remaining minutes.
3. It must not print anything.
4. After the definition, display the results of three calls, one per line, with the arguments \`135\`, \`45\`, and \`120\`.

## Expected output

\`\`\`text
2h 15m
0h 45m
2h 0m
\`\`\`

## Details

Note the third case: exactly two hours produces \`2h 0m\`, not \`2h\`. Always include both parts.

The second case produces \`0h 45m\`. Do not omit a zero hour count.

## Guidance

Two operators from earlier in this module split a total into whole units and a remainder. You met them when packing items into boxes; the problem here has the same shape.

## Constraints

The function must return its result. If you print inside the function and then print the call, your output will contain \`None\` and the tests will fail.`,
          starterCode: `def format_duration(minutes):
    return ""


print(format_duration(135))
`,
          hint: "minutes // 60 gives whole hours and minutes % 60 gives the remainder. Build the result with an f-string and return it rather than printing it.",
          tests: [
            {
              expectedOutput: "2h 15m\n0h 45m\n2h 0m",
              description: "All three durations are formatted correctly, including the zero-hour and zero-minute cases",
            },
          ],
          solution: `def format_duration(minutes):
    hours = minutes // 60
    remaining = minutes % 60
    return f"{hours}h {remaining}m"


print(format_duration(135))
print(format_duration(45))
print(format_duration(120))
`,
        },
        {
          type: "exercise",
          title: "Repair a Function That Prints",
          description: "Diagnose a program that displays None, and correct the underlying mistake.",
          instructions: `## The problem

The program in the editor should display:

\`\`\`text
Subtotal: 30
Subtotal: 12
Combined: 42
\`\`\`

It currently displays something different, including the word \`None\` twice, and the final line fails.

## Your task

Run it and read the output carefully before changing anything. Then correct the program so it produces the required output.

## Requirements

1. \`line_total\` must **return** the total rather than printing it.
2. The three output lines must be produced by the calling code, not from inside the function.
3. The combined figure must be computed from the two returned values.

## Guidance

The symptom — \`None\` appearing where a number was expected — has one common cause, described in this lesson. Fixing it requires changing one word inside the function and then adjusting the calls to display what they receive.

## Why this matters

A function that prints can only ever put those exact characters on screen. A function that returns can be used to compute a third value, which is precisely what the last line of the required output needs.`,
          starterCode: `def line_total(quantity, price):
    print(quantity * price)


first = line_total(6, 5)
second = line_total(4, 3)
print(f"Combined: {first + second}")
`,
          hint: "Change print inside the function to return. Then wrap each call in a print with a Subtotal: label, and keep the returned values in variables so the last line can add them.",
          tests: [
            {
              expectedOutput: "Subtotal: 30\nSubtotal: 12\nCombined: 42",
              description: "Both subtotals and the combined figure are correct, with no None in the output",
            },
          ],
          solution: `def line_total(quantity, price):
    return quantity * price


first = line_total(6, 5)
second = line_total(4, 3)
print(f"Subtotal: {first}")
print(f"Subtotal: {second}")
print(f"Combined: {first + second}")
`,
        },
        {
          type: "exercise",
          title: "Module 2 Checkpoint: Session Summary",
          description: "Combine input, conversion, functions, and formatting into one small program.",
          instructions: `## The problem

This checkpoint uses everything from Module 2: reading input, converting types, defining functions that return, and formatting with f-strings.

A study tracker records one practice session and reports on it.

## Input

Three lines, in this order:

1. The subject name, as text.
2. The number of minutes spent, a whole number.
3. The number of exercises completed, a whole number.

## Requirements

1. Define a function \`format_duration(minutes)\` that returns a string like \`1h 50m\`, exactly as in the earlier exercise.
2. Define a function \`minutes_each(minutes, exercises)\` that returns the mean number of minutes per exercise, as a float. You may assume \`exercises\` is at least 1.
3. Read the three input lines with \`input()\` and no prompt, converting the two numbers.
4. Display exactly three lines:

\`\`\`text
Subject: Statistics
Time: 1h 50m
Pace: 11.00 minutes per exercise
\`\`\`

## Details

The pace is displayed with exactly **two** decimal places. Use a format specification rather than \`round()\`.

## Example

Given \`Statistics\`, \`110\`, \`10\`, the output is the three lines above.

Given \`Chemistry\`, \`45\`, \`7\`, the output is:

\`\`\`text
Subject: Chemistry
Time: 0h 45m
Pace: 6.43 minutes per exercise
\`\`\`

## Constraints

Both functions must return their results. All printing happens outside the functions.`,
          starterCode: `def format_duration(minutes):
    return ""


def minutes_each(minutes, exercises):
    return 0.0


subject = input()
`,
          hint: "Reuse the // and % approach for format_duration. minutes_each is a single division. Read all three inputs before printing, and use {pace:.2f} for the two decimal places.",
          tests: [
            {
              input: "Statistics\n110\n10\n",
              expectedOutput: "Subject: Statistics\nTime: 1h 50m\nPace: 11.00 minutes per exercise",
              description: "A session with a whole-number pace still shows two decimal places",
            },
            {
              input: "Chemistry\n45\n7\n",
              expectedOutput: "Subject: Chemistry\nTime: 0h 45m\nPace: 6.43 minutes per exercise",
              description: "Under an hour, with a pace that must be rounded for display",
            },
            {
              input: "History\n180\n1\n",
              expectedOutput: "Subject: History\nTime: 3h 0m\nPace: 180.00 minutes per exercise",
              description: "An exact number of hours and a single exercise",
            },
          ],
          solution: `def format_duration(minutes):
    hours = minutes // 60
    remaining = minutes % 60
    return f"{hours}h {remaining}m"


def minutes_each(minutes, exercises):
    return minutes / exercises


subject = input()
minutes = int(input())
exercises = int(input())

pace = minutes_each(minutes, exercises)
print(f"Subject: {subject}")
print(f"Time: {format_duration(minutes)}")
print(f"Pace: {pace:.2f} minutes per exercise")
`,
        },
      ],
    ),
  ],
)

export default moduleTwo

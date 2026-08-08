import { module, lesson, type ModuleSource } from "../types.ts"

const moduleTwo: ModuleSource = module(
  "Values, Variables, Input, and Functions",
  "Keeping and naming data, doing arithmetic, shaping text, reading input, and writing your own reusable jobs.",
  [
    lesson(
      "Values and Variables",
      "The kinds of data Python works with, and how to give a value a name you can use again.",
      [
        {
          type: "lesson",
          title: "Values, Expressions, and Types",
          description: "The four kinds of data you will use all the time, and how Python sorts them.",
          instructions: `## Data comes in kinds

So far every piece of data you have written has been text. Python works with several kinds of data, and it treats each kind differently. Knowing which kind you are holding explains most of the surprises that beginners meet.

A **value** is a single piece of data: the text \`hello\`, the number \`7\`, the number \`2.5\`. Every value has a **type**. The type is Python's answer to the question "what kind of thing is this?"

Four types matter right now.

An **integer** is a whole number. It can be positive, negative, or zero: \`7\`, \`-3\`, \`0\`. Python calls this type \`int\`.

A **float** is a number with a decimal part: \`2.5\`, \`-0.75\`, \`3.0\`. Python calls this \`float\`. Note that \`3.0\` is a float even though its value is a whole number. The decimal point is what makes it a float.

A **string** is text, written between quotation marks: \`"hello"\`, \`"7"\`. Python calls this \`str\`.

A **Boolean** is one of exactly two values, \`True\` or \`False\`. They are written with a capital letter and no quotation marks. Python calls this \`bool\`. Booleans become very important in the next module.

## Asking Python what type something is

The \`type()\` function tells you the type of a value:

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

The word \`class\` in that output is Python's general word for a type. You will study classes properly much later. For now, read \`<class 'int'>\` simply as "this is an integer".

## The most important difference in this stage

Look carefully at these two values:

\`\`\`python
print(type(7))
print(type("7"))
\`\`\`

\`\`\`text
<class 'int'>
<class 'str'>
\`\`\`

\`7\` is a number. \`"7"\` is a *string that holds a digit character*. On the screen they look the same when printed. That is exactly why this mistake is so common. But Python treats them as two completely different kinds of thing.

You can do arithmetic with the first. You cannot do arithmetic with the second. Or rather, you can, but it means something else:

\`\`\`python
print(7 + 7)
print("7" + "7")
\`\`\`

\`\`\`text
14
77
\`\`\`

Adding two integers gives a sum. Adding two strings joins them end to end. Joining strings is called **concatenation**. So the \`+\` symbol means different things, and the types on each side decide which meaning is used.

> **Key idea**
> A string of digits is not a number. \`"7"\` and \`7\` look the same when printed, and they behave in completely different ways. When arithmetic gives you a strange result, check your types first.

## Expressions

An **expression** is any piece of code that produces a value. \`7\` is an expression. So is \`7 + 7\`, and so is \`"7" + "7"\`.

Python **evaluates** an expression. That means it works out the single value the expression produces. This happens before anything else uses the result:

\`\`\`python
print(3 + 4)
\`\`\`

Python first evaluates \`3 + 4\` and gets \`7\`. Then it gives that single value to \`print\`. What appears is \`7\`, never \`3 + 4\`. The expression is replaced by its result.

This is worth saying clearly, because it is the machinery behind almost everything that follows. Wherever Python expects a value, you may write any expression that produces one.

## Predict before you continue

What are the two types here, and what does each line show?

\`\`\`python
print(type(3.0))
print(2 + 3 * 4)
\`\`\`

The first line shows \`<class 'float'>\`, because the decimal point makes it a float even though the value is a whole number. The second shows \`14\`, not \`20\`, because multiplication is done before addition. This ordering rule has its own stage very soon.

## Summary

Values have types: \`int\`, \`float\`, \`str\`, and \`bool\` to start with. \`type()\` tells you the type. A string of digits is not a number. An expression is code that produces a value, and Python works it out down to that single value before anything else uses it.`,
        },
        {
          type: "lesson",
          title: "Variables and Assignment",
          description: "Giving a value a name, and what really happens when you give the name a new value.",
          instructions: `## The problem with values that have no name

Think about a program that works out a total and then uses it three times. Without a name for the total, you would have to write the whole calculation three times. When the calculation changes, you would have to change it in three places. That is slow work and it is easy to get wrong.

A **variable** is a name that refers to a value. You create one with an **assignment statement**:

\`\`\`python
item_count = 12
print(item_count)
\`\`\`

\`\`\`text
12
\`\`\`

The name is on the left. The \`=\` sign is in the middle. An expression is on the right. Python works out the expression on the right, and then makes the name on the left refer to the result.

## The equals sign does not mean "is equal to"

This is the most important correction to make about assignment. In mathematics, \`x = 5\` states a fact: x and 5 are the same. In Python, \`x = 5\` gives an order: *make the name x refer to the value 5*.

The difference becomes clear with a line that is nonsense in mathematics but normal in Python:

\`\`\`python
count = 3
count = count + 1
print(count)
\`\`\`

\`\`\`text
4
\`\`\`

Read the second line as two steps, right side first:

1. Work out \`count + 1\`. At this moment \`count\` refers to \`3\`, so the expression gives \`4\`.
2. Make the name \`count\` refer to \`4\`.

The old value simply has no name pointing at it any more. Nothing was "solved". Something was done.

> **Key idea**
> \`=\` is an order, not a statement of fact. It means "work out the right-hand side, then attach the left-hand name to the result." The test for equality is a different operator, \`==\`, which you meet in the next module.

## A name is not a value

Keep these two things apart in your mind. \`item_count\` is a name. \`12\` is a value. The name refers to the value. The name is not the value itself.

Two names can refer to the same value at the same time:

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

Trace it carefully. Line 2 makes \`copy\` refer to whatever \`original\` referred to at that moment, which was \`10\`. Line 3 then points \`original\` at a new value. That does not touch \`copy\`, which still refers to \`10\`.

Beginners often expect \`copy\` to change as well. They imagine that \`copy = original\` created a permanent link between the two names. It did not. It copied a reference, one time, at the moment the line ran. This will matter a great deal when you reach lists in Module 5.

## Using a name before it exists

A name only exists after an assignment has run. Using it earlier is an error:

\`\`\`python
total = 5
print(total)
\`\`\`

This works. Swapping those two lines does not. Python reports a \`NameError\`, which means "you used a name I have never been told about". This is a *runtime* error. The arrangement of the code was legal, so the program started, and it failed only when it reached the bad line.

A \`NameError\` usually means one of three things. You spelled the name wrongly. You used it before you assigned it. Or you assigned it inside a part of the program that never ran.

## Choosing names

Python has some rules. A name must start with a letter or an underscore. It can hold only letters, digits, and underscores. It cannot hold spaces or hyphens.

There is also a habit that Python does not force, but every Python programmer follows. Use small letters with underscores between words: \`item_count\`, \`total_price\`, \`user_name\`. This style is called snake case.

Beyond the rules, choose names that say what the value means. \`x\` tells a reader nothing. \`n\` is a little better. \`unread_messages\` explains itself, and it never needs a comment. Good naming is not decoration. It is the cheapest way to make a program clear, and it saves you time every time you come back to the code.

## Summary

A variable is a name that refers to a value, and you create it with assignment. The right-hand side is worked out first, then the name is attached to the result. \`=\` does an action. It does not state a fact. Names are not values, and giving one name the value of another copies a reference once instead of linking them.`,
        },
        {
          type: "exercise",
          title: "Store, Reassign, and Display",
          description: "Use variables to hold values, then update one and watch the effect.",
          instructions: `## The problem

Write a program that keeps a count of open tasks.

## Requirements

1. Create a variable named \`open_tasks\` that refers to the integer \`5\`.
2. Show it on its own line.
3. Increase \`open_tasks\` by \`3\`, using the value it already has instead of typing \`8\`.
4. Show it again on its own line.
5. Create a second variable named \`label\` that refers to the string \`Tasks remaining\`.
6. Show \`label\` and \`open_tasks\` with a single \`print\` call that receives them as two arguments.

## Expected output

\`\`\`text
5
8
Tasks remaining 8
\`\`\`

## Guidance

Step 3 is the important one. Writing \`open_tasks = 8\` would give the right output for the wrong reason. Write an expression that reads the current value and adds to it. Then the program would still be correct if the starting value changed.

## Constraints

Do not type the number \`8\` anywhere in your program.`,
          starterCode: `open_tasks = 5
`,
          hint: "To increase a variable by 3, put the variable itself on the right-hand side: open_tasks = open_tasks + 3. Python works out the right side first, using the current value.",
          tests: [
            {
              expectedOutput: "5\n8\nTasks remaining 8",
              description: "The count is shown before and after the increase, then shown with its label",
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
          description: "Predict the result of a series of assignments, then let the program prove you right.",
          instructions: `## The problem

Read this series of lines carefully before you write anything:

\`\`\`python
a = 2
b = a
a = a + 10
b = b + 1
\`\`\`

Work out on paper what \`a\` and \`b\` refer to at the end. Remember that \`b = a\` copies a reference once. It does not link the two names.

## Your task

Write a program that does exactly those four assignments, and then shows the results in this form:

\`\`\`text
a is 12
b is 3
\`\`\`

## Requirements

1. Do the four assignments shown above, in that order.
2. Show two lines. Each line comes from a \`print\` call with two arguments: a string label and the variable.
3. The labels are \`a is\` and \`b is\`.

## Constraints

Do not skip the thinking by assigning the final values directly. The four assignments must appear in your program in the order given.`,
          starterCode: `a = 2
b = a
`,
          hint: "After b = a, the name b refers to 2. Changing a after that has no effect on b, so b starts from 2 when you add 1 to it.",
          tests: [
            {
              expectedOutput: "a is 12\nb is 3",
              description: "Both final values are correct, which shows that giving a a new value did not change b",
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
      "Arithmetic and Order of Operations",
      "Python's number operators, the order they are used in, and the two kinds of division.",
      [
        {
          type: "lesson",
          title: "Arithmetic Operators",
          description: "The seven operators you need, including the two that surprise people.",
          instructions: `## The operators

Most of Python's arithmetic operators are the ones you already know:

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

Addition, subtraction, and multiplication work as they do in ordinary arithmetic. Division needs a closer look.

## Division always gives a float

Notice that \`7 / 2\` gave \`3.5\`, not \`3\`. Here is the more surprising part:

\`\`\`python
print(6 / 2)
print(type(6 / 2))
\`\`\`

\`\`\`text
3.0
<class 'float'>
\`\`\`

Even when the division has no remainder, \`/\` gives a float. Python does this on purpose. The type of the result depends only on the operator, not on the particular numbers, and that makes programs easier to predict.

## Floor division and remainder

Two more operators work with whole numbers.

\`//\` is **floor division**. It divides and then throws away everything after the decimal point, so it rounds down:

\`\`\`python
print(7 // 2)
print(20 // 6)
\`\`\`

\`\`\`text
3
3
\`\`\`

\`%\` is the **modulo** operator. Many people call it the remainder operator. It gives what is left after floor division:

\`\`\`python
print(7 % 2)
print(20 % 6)
\`\`\`

\`\`\`text
1
2
\`\`\`

These two are more useful than they look at first. Together they answer the question "how many full groups, and how many left over?" That question comes up all the time. If you have 100 items and each box holds 12, then \`100 // 12\` is the number of full boxes and \`100 % 12\` is the number of items left over.

\`%\` also gives you a simple test for exact division. A number is even exactly when \`number % 2\` is \`0\`. You will use that many times from the next module onwards.

## Powers

\`**\` raises a number to a power:

\`\`\`python
print(2 ** 10)
print(9 ** 0.5)
\`\`\`

\`\`\`text
1024
3.0
\`\`\`

Raising to the power \`0.5\` gives a square root. That is useful now and then, before you meet the \`math\` module.

## Mixing integers and floats

If either side is a float, the result is a float:

\`\`\`python
print(3 + 0.5)
print(4 * 2.0)
\`\`\`

\`\`\`text
3.5
8.0
\`\`\`

This is why a total that should read \`8\` sometimes reads \`8.0\`. Nothing is broken. One of the inputs was a float, so the result is a float too.

## A warning about floats

A float is stored in a way that cannot hold every decimal fraction exactly. It is a little like writing one third in decimal: you never finish. Sometimes this shows:

\`\`\`python
print(0.1 + 0.2)
\`\`\`

\`\`\`text
0.30000000000000004
\`\`\`

This is not a fault in Python. It comes from the way fractions are stored in binary, and every popular language behaves in the same way. For now, just know that it happens. The practical lesson is this: do not test two floats for exact equality. That point returns in Module 3.

## Predict before you continue

What does each line show?

\`\`\`python
print(9 // 4)
print(9 % 4)
print(9 / 4)
\`\`\`

The answers are \`2\`, \`1\`, and \`2.25\`. Floor division gives whole groups. Modulo gives the remainder. Normal division gives the exact answer as a float.

## Summary

\`+\`, \`-\`, and \`*\` work as usual. \`/\` always gives a float. \`//\` divides and rounds down. \`%\` gives the remainder. \`**\` raises to a power. Mixing an int with a float gives a float.`,
        },
        {
          type: "lesson",
          title: "Order of Operations and Brackets",
          description: "The order Python uses for operators, and how to change it.",
          instructions: `## Why order matters

Look at this expression:

\`\`\`python
print(2 + 3 * 4)
\`\`\`

There are two possible readings. Add first, which gives \`5 * 4\`, so \`20\`. Or multiply first, which gives \`2 + 12\`, so \`14\`.

Python gives \`14\`. It follows fixed rules about which operator is used first. These rules are called **precedence**, which simply means "the order of operations". Python never guesses, and it never thinks about what you probably meant. The rules are the same every time.

## The order

Here is the order for the operators you know, from first to last:

1. Brackets \`()\`
2. Powers \`**\`
3. Multiplication \`*\`, division \`/\`, floor division \`//\`, modulo \`%\`
4. Addition \`+\`, subtraction \`-\`

Operators on the same level are used from left to right. There is one exception. \`**\` works from right to left, so \`2 ** 3 ** 2\` means \`2 ** 9\`, not \`8 ** 2\`. That exception is rare in real code. The rest of the list matters every day.

\`\`\`python
print(10 - 2 - 3)
print(20 / 5 * 2)
\`\`\`

\`\`\`text
5
8.0
\`\`\`

Both go left to right. \`10 - 2\` is \`8\`, then \`8 - 3\` is \`5\`. In the same way \`20 / 5\` is \`4.0\`, then \`4.0 * 2\` is \`8.0\`.

## Brackets beat everything

Brackets group a part of an expression so that Python works it out first:

\`\`\`python
print(2 + 3 * 4)
print((2 + 3) * 4)
\`\`\`

\`\`\`text
14
20
\`\`\`

These are the same brackets you already use for function calls, doing a different job. The position tells Python which job is meant. Brackets after a function name call the function. Brackets around an expression group it.

## Use brackets for readers, not only for Python

Some people say you should add brackets only where they change the answer. A better rule is to add them wherever they save the reader from remembering the order of operations.

Compare this:

\`\`\`python
base = 100
rate = 0.2
years = 3
total = base + base * rate * years
print(total)
\`\`\`

with this:

\`\`\`python
base = 100
rate = 0.2
years = 3
total = base + (base * rate * years)
print(total)
\`\`\`

Both show \`160.0\`. The second version costs nothing, and it removes all doubt about what you meant. If a reader has to stop and remember a rule, your code is doing less work for them than it could.

## A worked trace

Take this expression and work it out the way Python does:

\`\`\`python
print(4 + 6 // 2 * 3 - 1)
\`\`\`

1. \`//\` and \`*\` are the highest level present, so they go left to right. \`6 // 2\` is \`3\`. The expression is now \`4 + 3 * 3 - 1\`.
2. \`3 * 3\` is \`9\`. The expression is now \`4 + 9 - 1\`.
3. \`+\` and \`-\` are on the same level, so they go left to right. \`4 + 9\` is \`13\`, then \`13 - 1\` is \`12\`.

The output is \`12\`.

Notice that the answer depends completely on doing the steps in the right order. This is exactly the kind of place where a wrong guess gives you a program that runs perfectly and reports the wrong number, with no error message to warn you.

## Predict before you continue

What does this show?

\`\`\`python
print((8 + 4) / 3)
\`\`\`

The brackets force the addition first, which gives \`12\`. Then the division gives \`4.0\`. Note the float: \`/\` always gives one.

## Summary

Precedence decides which operator is used first: brackets, then \`**\`, then \`* / // %\`, then \`+ -\`. Operators on the same level go left to right. Brackets change the order, and they are worth adding whenever they make your meaning clearer.`,
        },
        {
          type: "exercise",
          title: "Whole Boxes and Leftovers",
          description: "Use floor division and modulo to split a number of items into full boxes and a remainder.",
          instructions: `## The problem

A shop packs items into boxes. Every box holds exactly 12 items. For a given number of items, the shop needs to know how many boxes will be completely full, and how many items will be left over.

## Requirements

1. Create a variable \`items\` that refers to the integer \`100\`.
2. Create a variable \`per_box\` that refers to the integer \`12\`.
3. Work out the number of completely full boxes into a variable \`full_boxes\`.
4. Work out the number of leftover items into a variable \`leftover\`.
5. Show exactly two lines, in this form:

\`\`\`text
Full boxes: 8
Leftover items: 4
\`\`\`

## Guidance

Two operators from this lesson answer the two questions directly. One throws away the decimal part of a division. The other reports what the division leaves behind.

Use \`items\` and \`per_box\` in your calculations instead of typing \`100\` and \`12\` again. A program written that way still works when the numbers change, and that is the whole point of using variables.

## Constraints

Do not type the numbers \`8\` or \`4\` anywhere. The program must work both of them out.`,
          starterCode: `items = 100
per_box = 12
`,
          hint: "items // per_box throws away the fraction, so it gives whole boxes. items % per_box gives what is left over. Use print with two arguments, or build the string yourself.",
          tests: [
            {
              expectedOutput: "Full boxes: 8\nLeftover items: 4",
              description: "Both the number of full boxes and the remainder are worked out correctly",
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
          title: "Fix an Order of Operations Bug",
          description: "A running program works out the wrong average because one pair of brackets is missing.",
          instructions: `## The problem

The program in the editor should work out the average of three test scores and show it. It runs without any error, and it is wrong.

The three scores are 70, 80, and 90. Their average is 80.0. At the moment the program reports a different number.

## Your task

Find the reason and fix it. Change as little as you can.

## Expected output

\`\`\`text
Average: 80.0
\`\`\`

## Guidance

Run the program first and look at the number it gives. Then work out the expression by hand, using the order of operations step by step. The gap between what you meant and what the rules really do is the bug.

This is a good example of a whole family of faults. Nothing is badly formed, nothing raises an error, and the only sign of trouble is a wrong number. Your only defence is to check the result against a value you worked out yourself.

## Requirements

1. The output must be exactly \`Average: 80.0\`.
2. Keep the three score variables and work out the average from them.`,
          starterCode: `first = 70
second = 80
third = 90

average = first + second + third / 3
print("Average:", average)
`,
          hint: "Division comes before addition, so only `third` is being divided by 3. Put the whole sum inside brackets before you divide.",
          tests: [
            {
              expectedOutput: "Average: 80.0",
              description: "The average uses all three scores, not only the last one",
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
      "Operations on text, and a clear way to build strings out of values.",
      [
        {
          type: "lesson",
          title: "String Operations and Methods",
          description: "Joining, repeating, measuring, and changing text.",
          instructions: `## Joining and repeating

Two arithmetic operators also have a meaning for strings.

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

Notice that \`+\` adds nothing of its own. If you want a space between the words, you must put it there yourself. This is different from \`print\` with several arguments, which adds a space for you. The two are easy to mix up, so keep them clearly apart in your mind.

\`*\` repeats a string a whole number of times:

\`\`\`python
print("-" * 20)
\`\`\`

\`\`\`text
--------------------
\`\`\`

That trick is genuinely useful for drawing lines between sections of output.

## Adding a string to a number fails

\`\`\`python
count = 3
print("You have " + str(count) + " messages")
\`\`\`

\`\`\`text
You have 3 messages
\`\`\`

The \`str()\` here is doing necessary work. Without it, \`"You have " + 3\` raises a \`TypeError\`, because Python will not guess whether you wanted arithmetic or joined text. Converting the number yourself says which one you meant. The next stage shows a cleaner way to write the same line.

## Length

\`len()\` tells you how many characters a string holds:

\`\`\`python
print(len("field"))
print(len(""))
\`\`\`

\`\`\`text
5
0
\`\`\`

Spaces and punctuation marks are characters too, so they are counted.

## Methods

A **method** is a function that belongs to one particular value. You call it with a dot:

\`\`\`python
name = "ada lovelace"
print(name.upper())
print(name.title())
\`\`\`

\`\`\`text
ADA LOVELACE
Ada Lovelace
\`\`\`

Read \`name.upper()\` as "ask the string that \`name\` refers to for its capital-letter version". The dot means "belonging to". The brackets are still there, because this is still a function call.

Here are the methods worth knowing now:

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

\`strip()\` removes spaces from both ends. This is very important when you handle text that people have typed. \`lower()\` and \`upper()\` change the case of the letters. \`replace()\` puts one piece of text in place of another. \`startswith()\` tells you whether the string begins with something, and gives a Boolean.

## A method does not change the original

This is the point that learners miss most often:

\`\`\`python
name = "ada"
name.upper()
print(name)
\`\`\`

\`\`\`text
ada
\`\`\`

Nothing changed. \`upper()\` did not change \`name\`. It produced a *new* string. Nothing was done with that new string, so it was thrown away.

To keep the result, assign it:

\`\`\`python
name = "ada"
name = name.upper()
print(name)
\`\`\`

\`\`\`text
ADA
\`\`\`

Strings in Python are **immutable**. That means a string value can never be changed once it exists. Every string method gives back a new string and leaves the old one alone.

> **Key idea**
> A string method gives you a new string. It does not change the string you called it on. If you do not assign the result, the result is lost.

## Chaining

Every method gives back a string, so you can call another method on that result:

\`\`\`python
raw = "   Ada Lovelace   "
print(raw.strip().lower().replace(" ", "_"))
\`\`\`

\`\`\`text
ada_lovelace
\`\`\`

Read it from left to right. Remove the spaces at the ends, make the result small letters, then replace the spaces inside that result. Chains of more than three or four calls become hard to read. At that point, use extra variables with clear names instead.

## Summary

\`+\` joins strings and adds no separator. \`*\` repeats a string. \`len()\` counts characters. Methods are functions called on a value with a dot. String methods always give back a new string and never change the original, so you must assign the result to keep it.`,
        },
        {
          type: "lesson",
          title: "F-Strings",
          description: "Building strings that hold values, without joining and converting by hand.",
          instructions: `## The problem with joining

Suppose you want to show a line like \`Ada has 3 unread messages\`, where the name and the number come from variables. Joining strings gives this:

\`\`\`python
name = "Ada"
unread = 3
print(name + " has " + str(unread) + " unread messages")
\`\`\`

\`\`\`text
Ada has 3 unread messages
\`\`\`

It works, but look at the cost. Four \`+\` operators, one conversion, and spaces that must be placed carefully inside the quotation marks. The shape of the final sentence is hard to see behind all that machinery.

## The f-string

An **f-string** is a string with an \`f\` in front of the opening quotation mark. Inside it, anything between curly braces is worked out, and its value is put into the text:

\`\`\`python
name = "Ada"
unread = 3
print(f"{name} has {unread} unread messages")
\`\`\`

\`\`\`text
Ada has 3 unread messages
\`\`\`

Now the sentence reads like a sentence. The variable names sit where their values will sit. No conversion is needed. Values of any type are turned into text for you.

Forgetting the \`f\` is a common slip, and it fails quietly:

\`\`\`python
name = "Ada"
print("{name} is here")
\`\`\`

\`\`\`text
{name} is here
\`\`\`

Without the \`f\`, the braces mean nothing special and are printed as ordinary characters. If your output shows braces and variable names, look for a missing \`f\`.

## Any expression, not only a name

The braces may hold any expression:

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

Look at the quotation marks in the second line. There are single quotes inside a double-quoted f-string. The usual rule still holds: the inner quotes must be a different kind from the outer ones.

Keep the expressions short. An f-string is for showing a value, not for doing the work. If the expression inside the braces is long enough to need thought, work it out into a well-named variable on the line before, and put that name in the braces.

## Controlling how numbers appear

A colon inside the braces starts a format instruction. The one worth learning now controls decimal places:

\`\`\`python
average = 80.66666666666667
print(f"Average: {average:.2f}")
print(f"Average: {average:.0f}")
\`\`\`

\`\`\`text
Average: 80.67
Average: 81
\`\`\`

\`.2f\` means "show this as a decimal number with two digits after the point". It rounds the number for display. This is exactly the tool you need when a float would otherwise print seventeen digits.

Note carefully that this changes only the *display*. The value that \`average\` refers to does not change:

\`\`\`python
average = 80.66666666666667
print(f"{average:.2f}")
print(average)
\`\`\`

\`\`\`text
80.67
80.66666666666667
\`\`\`

That difference — between a value and the way it is printed — first appeared with strings and newlines in Module 1. It comes back again and again. It explains a whole family of questions that begin "why is my number wrong when I print it another way?"

> **Key idea**
> Formatting changes how a value is shown, not what the value is. \`f"{x:.2f}"\` produces a rounded *string*. \`x\` itself does not change.

## Lining up columns

Two more instructions help you print tidy columns:

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

\`<10\` means "put this on the left of a space ten characters wide". \`>5\` means "put this on the right of a space five characters wide". Placing numbers on the right lines up their digits, and that makes a column much easier to read.

## Summary

An f-string has an \`f\` in front of it, and expressions inside curly braces are worked out and inserted. It replaces joining and hand conversion. \`:.2f\` sets decimal places for display only. \`<\` and \`>\` with a width control the alignment.`,
        },
        {
          type: "exercise",
          title: "Format a Record Line",
          description: "Use an f-string to build one line from several values, with a rounded number.",
          instructions: `## The problem

A study log records a subject, the number of study sessions finished, and the total hours spent. You must produce one summary line.

## Requirements

1. Use the three variables exactly as they are given in the starter code.
2. Work out the average hours per session into a variable named \`per_session\`.
3. Show exactly one line, built with a single f-string, in this form:

\`\`\`text
Statistics: 7 sessions, 11.5 hours, 1.64 hours each
\`\`\`

## Details

- \`Statistics\` is the value of \`subject\`.
- \`7\` is the value of \`sessions\`.
- \`11.5\` is the value of \`hours\`.
- \`1.64\` is \`per_session\` shown with **two** decimal places. The exact value is 1.642857..., so do not round it yourself. Use a format instruction.

## Guidance

Work out \`per_session\` on its own line, not inside the braces. The f-string should show values, not calculate them.

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
              description: "The line is built correctly, with the average shown to two decimal places",
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
          description: "Use string methods to tidy text that a person typed carelessly.",
          instructions: `## The problem

Text typed by people is rarely tidy. It has extra spaces, capital letters in different places, and separators that are not the ones you need.

## Requirements

Start from the variable \`raw\` in the editor and produce a variable \`clean\` in which:

1. The spaces at the beginning and the end have been removed.
2. All letters are small letters.
3. Every space between words has become a single hyphen.

Then show two lines:

\`\`\`text
Before: '   Weekly Field Report   '
After: 'weekly-field-report'
\`\`\`

## Details

The quotation marks in the output are real single-quote characters. They are printed so that you can see the spaces in the original text. Note that \`Before:\` shows the original value of \`raw\`, unchanged. That proves the original string was never modified.

## Guidance

Do the operations in the order listed above. Stripping *before* replacing matters. If you replace the spaces first, the spaces at the ends become hyphens, and the result is wrong.

Remember that each method gives back a new string. So you must either chain the calls or assign each step to a variable.

## Constraints

Use one \`print\` for each line, and build the output with f-strings.`,
          starterCode: `raw = "   Weekly Field Report   "
`,
          hint: "Chain the calls in order: raw.strip().lower().replace(\" \", \"-\"). To show a single quote inside an f-string that uses double quotes, just type it as an ordinary character.",
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
          description: "How a program waits for text, and what it always gets back.",
          instructions: `## Programs that receive information

Every program so far has produced the same output every time it ran. That is a serious limit. A useful program answers information that is given to it while it runs.

The \`input()\` function reads one line of text:

\`\`\`python
name = input()
print(f"Hello, {name}")
\`\`\`

When this runs, the program stops at \`input()\` and waits. Once a line is given, \`input()\` produces that line as a value, and that value is assigned to \`name\`.

## input() always gives you a string

This is the most important fact about \`input()\`. It causes more early confusion than anything else in this module.

Whatever is typed, \`input()\` gives you a **string**. Always. Even when what was typed looks like a number:

\`\`\`python
age = input()
print(type(age))
\`\`\`

If \`36\` is given, the output is:

\`\`\`text
<class 'str'>
\`\`\`

Not \`int\`. The value is the two-character string \`"36"\`.

This connects straight to the difference you saw earlier: \`"7"\` is not \`7\`. Doing arithmetic on input without converting it first gives you wrong answers, and the mistake has a clear signature:

\`\`\`python
first = "5"
second = "3"
print(first + second)
\`\`\`

\`\`\`text
53
\`\`\`

Two strings were joined, not added. If a program that adds numbers from a user shows a long number that looks like the inputs stuck together, this is always the reason.

> **Key idea**
> \`input()\` gives you a string every time. If you need a number, you must convert it yourself.

## Prompts

\`input()\` accepts one optional argument. It is shown before the program waits:

\`\`\`python
name = input("What is your name? ")
print(f"Hello, {name}")
\`\`\`

The prompt appears in the output, exactly as if you had printed it. That fact matters here. A prompt becomes part of the program's output, and this course compares output exactly. So **the graded exercises in this course use \`input()\` with no prompt**. The instructions of each exercise always tell you what will be given and in what order.

When you write programs outside this course, use prompts. A program that waits in silence gives a person no idea what it wants.

## Reading several values

Each \`input()\` call reads one line. To read three values, call it three times:

\`\`\`python
first = input()
second = input()
third = input()
print(f"{first} then {second} then {third}")
\`\`\`

The calls read the lines in order. The first \`input()\` gets the first line, and so on. Getting the order wrong is a common bug. The output then looks sensible, but the values sit in the wrong places.

## Summary

\`input()\` reads one line and always gives you a string, whatever the line looks like. An optional argument is shown as a prompt and becomes part of the output. Each call uses up one line, in order.`,
        },
        {
          type: "lesson",
          title: "Converting Between Types",
          description: "Turning strings into numbers and back, and what happens when a conversion fails.",
          instructions: `## The conversion functions

Three functions convert between the types you know.

\`int()\` gives an integer. \`float()\` gives a float. \`str()\` gives a string.

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

Each one produces a new value. Like string methods, they change nothing. You must use the result or assign it.

## The normal pattern for number input

\`\`\`python
raw = input()
count = int(raw)
print(count * 2)
\`\`\`

Given \`21\`, this shows \`42\`. Compare that with what happens without the conversion. \`"21" * 2\` is \`"2121"\`, because multiplying a string repeats it.

The two steps are often written as one:

\`\`\`python
count = int(input())
print(count * 2)
\`\`\`

Read that from the inside out. \`input()\` runs first and gives a string. \`int()\` receives that string and gives an integer. The integer is assigned to \`count\`. Putting one call inside another like this is normal Python, and it is worth getting used to. Writing the two steps separately is just as correct, and it is easier to debug.

## Conversions that fail

\`int()\` needs a string that holds a whole number and nothing else:

\`\`\`python
print(int("42"))
print(int(" 42 "))
\`\`\`

\`\`\`text
42
42
\`\`\`

Spaces around the number are allowed. But \`int("four")\`, \`int("4.5")\`, and \`int("")\` all raise a \`ValueError\`. That error means "the type is right, but the content cannot be used".

A \`ValueError\` here is a *runtime* error. The program starts, runs normally, and stops at the moment the conversion fails. Everything printed before that point has already appeared.

Look at the second case carefully: \`int("4.5")\` fails. \`int()\` will not quietly throw away a decimal part from a string. If the text may hold a decimal, convert with \`float()\` first.

## Converting a float to an int cuts off the decimal part

Converting a *float value* to an integer does throw away the decimal part. It always moves towards zero:

\`\`\`python
print(int(4.9))
print(int(-4.9))
\`\`\`

\`\`\`text
4
-4
\`\`\`

That is cutting off, not rounding to the nearest whole number. To round to the nearest whole number, use \`round()\`:

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

\`round()\` with a second argument rounds to that many decimal places. Unlike \`.2f\` in an f-string, it gives you a real rounded *number*, not a piece of text. Use \`round()\` when the value itself should change. Use \`:.2f\` when only the display should change.

## A worked example

Here is a program that reads two numbers and reports their total and their average:

\`\`\`python
first = int(input())
second = int(input())
total = first + second
mean = total / 2
print(f"Total: {total}")
print(f"Mean: {mean:.1f}")
\`\`\`

Given \`7\` and \`8\`, this shows:

\`\`\`text
Total: 15
Mean: 7.5
\`\`\`

Trace the types. Both inputs arrive as strings and become integers. \`total\` is an integer. \`mean\` is a float, because \`/\` always gives one. The f-string shows it with one decimal place.

## Predict before you continue

If the line \`10\` is given, what does this show?

\`\`\`python
value = input()
print(value + value)
\`\`\`

It shows \`1010\`, not \`20\`. Nothing was converted, so \`+\` joined two strings.

## Summary

\`int()\`, \`float()\`, and \`str()\` convert between types and give back new values. \`int()\` raises \`ValueError\` on a string that is not a whole number. \`int()\` on a float cuts towards zero. \`round()\` rounds to the nearest value and can take a number of decimal places.`,
        },
        {
          type: "exercise",
          title: "Convert Input and Compute",
          description: "Read two numbers from input, convert them, and report a total and an average.",
          instructions: `## The problem

Write a program that reads two whole numbers and reports their total and their average.

## Input

The program receives exactly two lines. Each line holds one whole number. Read them with \`input()\` and no prompt.

## Requirements

1. Read the first number, then the second, in that order.
2. Convert both to integers.
3. Show exactly two lines:

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

The average is shown exactly as \`/\` produces it. Do not round it, and do not use a format instruction. Because \`/\` always gives a float, a whole-number average appears as \`11.0\` and not as \`11\`.

## Constraints

Your program must work for any two whole numbers, not only the examples. It is tested with several different pairs.`,
          starterCode: `first = input()
`,
          hint: "input() gives you strings. Put each one inside int() before you do arithmetic, or your total will be the two numbers stuck together.",
          tests: [
            {
              input: "14\n8\n",
              expectedOutput: "Total: 22\nMean: 11.0",
              description: "Two positive numbers with a whole-number average",
            },
            {
              input: "3\n4\n",
              expectedOutput: "Total: 7\nMean: 3.5",
              description: "Two numbers whose average has a decimal part",
            },
            {
              input: "-5\n5\n",
              expectedOutput: "Total: 0\nMean: 0.0",
              description: "A negative and a positive value that cancel each other",
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
          description: "Read a mixture of text and number input, and format a money total.",
          instructions: `## The problem

A shopkeeper wants one printed line for every sale.

## Input

Three lines, in this order:

1. The item name, as text.
2. The quantity, a whole number.
3. The price of one item in rupees, which may have a decimal part.

## Requirements

1. Read the three lines with \`input()\` and no prompt.
2. Convert the quantity to an integer and the price to a float.
3. Work out the total cost.
4. Show exactly one line, in this form:

\`\`\`text
4 x Notebook @ 2.50 = 10.00
\`\`\`

## Details

Both the price of one item and the total are shown with exactly **two** decimal places, whatever was given. A price given as \`2.5\` must appear as \`2.50\`.

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

Use a single f-string. Do not round the values yourself with \`round()\`. Use a format instruction, so that the stored values stay exact.`,
          starterCode: `item = input()
`,
          hint: "Read all three lines first, then convert them. Inside the f-string use {price:.2f} and {total:.2f} to force two decimal places.",
          tests: [
            {
              input: "Notebook\n4\n2.5\n",
              expectedOutput: "4 x Notebook @ 2.50 = 10.00",
              description: "A price given with one decimal place is shown with two",
            },
            {
              input: "Pen\n3\n1.2\n",
              expectedOutput: "3 x Pen @ 1.20 = 3.60",
              description: "A different item, quantity, and price",
            },
            {
              input: "Ruler\n1\n0.99\n",
              expectedOutput: "1 x Ruler @ 0.99 = 0.99",
              description: "A quantity of one, with a price that already has two decimal places",
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
      "Putting a job under a name, so that you can use it again and think about it on its own.",
      [
        {
          type: "lesson",
          title: "Defining and Calling a Function",
          description: "The def statement, parameters, arguments, and returned values.",
          instructions: `## Why write your own

You have called functions that other people wrote: \`print\`, \`len\`, \`int\`. When you define your own, you name a job once and use it everywhere. That removes repeated code, and it gives the job a name that a reader can understand.

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

\`def\` says that a definition is coming. \`greet\` is the name. \`(name)\` lists the **parameters**: the names the function will use for the values it is given. The colon ends the first line.

The indented lines below are the **body**. These are the instructions that run when the function is called. Indentation is how Python marks which lines belong to the function. It is part of the structure, not decoration. Four spaces is the habit that everyone follows.

\`return\` sends a value back to whoever called the function, and it ends the call at once.

## Defining is not running

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

Running the \`def\` statement does not run the body. It creates the function, attaches it to the name \`greet\`, and moves on. The body runs only when the function is **called**, which means writing its name followed by brackets.

> **Key idea**
> A definition creates a function. A call runs it. \`greet\` refers to the function itself. \`greet("Ada")\` runs it and produces a value.

## Parameters and arguments

People often use these two words loosely, but the difference is genuinely useful.

A **parameter** is a name in the definition. In \`def greet(name):\`, the parameter is \`name\`.

An **argument** is a value given at the call. In \`greet("Ada")\`, the argument is \`"Ada"\`.

When the call happens, each argument is assigned to its parameter, and then the body runs. A parameter is an ordinary variable that exists only while the function runs.

A function may take several parameters. They are matched by position:

\`\`\`python
def describe(item, quantity):
    return f"{quantity} x {item}"

print(describe("Bolt", 12))
\`\`\`

\`\`\`text
12 x Bolt
\`\`\`

The first argument goes to the first parameter. If you swap them in the call, you get \`Bolt x 12\`. That is legal code producing nonsense, and no error warns you.

A function may also take no parameters at all:

\`\`\`python
def divider():
    return "-" * 20

print(divider())
\`\`\`

The empty brackets are still needed, both in the definition and in the call.

## What a call produces

A function call is an expression. It produces a value, and you may use it anywhere a value is expected.

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

In the last line, both calls run first and produce \`10\` and \`20\`. Then those two values are added.

## Summary

\`def\` defines a function with a name, parameters, and an indented body. Parameters are names in the definition. Arguments are values at the call. Defining does not run the body. Calling does. \`return\` gives the call its value and ends the call.`,
        },
        {
          type: "lesson",
          title: "Printing Versus Returning",
          description: "The most important difference in this module, and how to know which one you need.",
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

The output is the same, so it is easy to think the two functions are the same. They are not, and the difference matters a great deal.

## The difference

\`print()\` shows text for a person to read. It sends characters to the console, and it produces no value you can use.

\`return\` hands a value back to the code that called the function. That code can then store it, join it with something else, or pass it somewhere.

The difference becomes visible the moment you try to use the result:

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

Follow the output carefully. \`20\` appears first. \`show_double\` printed it when it was called. Then \`a is 20\`, because \`get_double\` returned a value and that value was stored.

Then \`b is None\`. \`show_double\` showed something but returned nothing, and a function that returns nothing gives you the special value \`None\`.

## None

\`None\` is Python's value for "no value at all". It is not zero. It is not an empty string. It is not \`False\`. It is its own thing, of type \`NoneType\`.

Every function returns something. A function with no \`return\` statement returns \`None\` when it reaches the end of its body.

Seeing \`None\` in your output is nearly always a sign of the same mistake. You printed the result of a function that printed instead of returning.

\`\`\`python
def add(a, b):
    print(a + b)

print(add(2, 3))
\`\`\`

\`\`\`text
5
None
\`\`\`

The \`5\` came from inside \`add\`. The \`None\` came from printing what \`add\` handed back, which was nothing. The repair is to write \`return a + b\` instead.

> **Key idea**
> If you see \`None\` where you expected a value, you almost certainly wrote \`print\` inside a function where you meant \`return\`.

## Which one should you write?

Here is the rule that works best, and the rest of this course follows it:

**Functions that calculate should return. Only the outer part of a program should print.**

The reason is reuse. A function that returns can be used anywhere. Its value can be stored, shown in another form, compared, or given to another function. A function that prints can do only one thing: put those exact characters on the console, in that exact form.

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

If \`area\` printed instead of returning, that last line would be impossible without rewriting the function.

## return ends the call at once

\`\`\`python
def first_word(text):
    return text.split()[0]
    print("this line never runs")

print(first_word("hello there"))
\`\`\`

\`\`\`text
hello
\`\`\`

Anything after a \`return\` that has run can never be reached. This becomes useful in the next module, where returning early is a clean way to deal with special cases.

## Summary

\`print\` shows text. \`return\` produces a value for the caller. A function without \`return\` gives \`None\`. Calculate with returns, and print at the edges of your program, so that the calculating parts stay reusable.`,
        },
        {
          type: "lesson",
          title: "Scope and Side Effects",
          description: "Where the names inside a function live, and what it means for a function to change the world outside it.",
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

If you add \`print(working_total)\` after the call, Python raises a \`NameError\`. The name existed during the call, and it was thrown away when the call finished.

The part of a program where a name can be used is called its **scope**. Names created inside a function have **local** scope. Names created at the top level of your program have **global** scope.

This is a useful feature, not a problem. It means you can write a function without checking whether its variable names clash with names somewhere else:

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

Both functions use \`result\`, and neither one disturbs the other, because each \`result\` lives only inside its own call.

## Reading a global name

A function can read a name from the program around it:

\`\`\`python
tax_rate = 0.2

def with_tax(amount):
    return amount * (1 + tax_rate)

print(with_tax(100))
\`\`\`

\`\`\`text
120.0
\`\`\`

This works, and for a true constant it is reasonable. But it creates a hidden need. Reading the definition of \`with_tax\` on its own does not tell you everything the function uses. Passing the value in as a parameter makes that need visible:

\`\`\`python
def with_tax(amount, rate):
    return amount * (1 + rate)

print(with_tax(100, 0.2))
\`\`\`

\`\`\`text
120.0
\`\`\`

You can understand the second version from its own definition alone, and you can use it again with a different rate.

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

The function did not change the global \`counter\`. Assigning to a name inside a function creates a *new local name*. That local name hides the global one while the call runs. The global one is untouched.

Python does have a \`global\` keyword that changes this, and you should almost never use it. A function that reaches out and changes global data is hard to think about, because you cannot see its effect at the place where it is called. Return a value, and let the caller decide what to do with it.

## Pure functions and side effects

A function is **pure** when it does two things and nothing else. It works out a result from its arguments, and it returns that result. For the same arguments it always gives the same answer, and it leaves everything outside itself alone.

\`\`\`python
def total_with_tax(amount, rate):
    return amount * (1 + rate)
\`\`\`

That function is pure. Call it a thousand times. Nothing builds up, nothing changes, and the answer for a given pair of arguments is always the same.

A **side effect** is anything a function does besides returning a value: printing, changing a global, writing a file, reading input. Side effects are not bad. A program with no side effects at all could not talk to anyone. But they should be chosen on purpose and kept in a few places.

Pure functions are much easier to test. To test one, you only call it and check the answer. That becomes very real in Module 9, when you start writing tests. It is worth building the habit now.

> **Key idea**
> Prefer functions that take everything they need as parameters and hand back a result. Keep printing and other side effects in a thin outer layer that joins the pure parts together.

## Summary

Names created inside a function are local, and they disappear when the call ends. Assigning to a name inside a function creates a local name instead of changing a global one. A pure function works out a result from its arguments and returns it without disturbing anything else. Prefer these, and keep side effects at the edges.`,
        },
        {
          type: "exercise",
          title: "Write a Function That Returns",
          description: "Define a function that works out a value, and call it several times.",
          instructions: `## The problem

Define a function that turns a length of time in minutes into a readable string.

## Requirements

1. Define a function named \`format_duration\` with one parameter, \`minutes\`, a whole number.
2. It must **return** a string of the form \`2h 15m\`. The first number is whole hours, and the second is the minutes left over.
3. It must not print anything.
4. After the definition, show the results of three calls, one per line, with the arguments \`135\`, \`45\`, and \`120\`.

## Expected output

\`\`\`text
2h 15m
0h 45m
2h 0m
\`\`\`

## Details

Look at the third case. Exactly two hours gives \`2h 0m\`, not \`2h\`. Always show both parts.

The second case gives \`0h 45m\`. Do not leave out a count of zero hours.

## Guidance

Two operators from earlier in this module split a total into whole units and a remainder. You met them when packing items into boxes. This problem has the same shape.

## Constraints

The function must return its result. If you print inside the function and then print the call, your output will hold \`None\` and the tests will fail.`,
          starterCode: `def format_duration(minutes):
    return ""


print(format_duration(135))
`,
          hint: "minutes // 60 gives whole hours, and minutes % 60 gives the remainder. Build the result with an f-string and return it instead of printing it.",
          tests: [
            {
              expectedOutput: "2h 15m\n0h 45m\n2h 0m",
              description: "All three times are formatted correctly, including the zero-hour and zero-minute cases",
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
          description: "Work out why a program shows None, and correct the real mistake.",
          instructions: `## The problem

The program in the editor should show:

\`\`\`text
Subtotal: 30
Subtotal: 12
Combined: 42
\`\`\`

At the moment it shows something else. The word \`None\` appears twice, and the last line fails.

## Your task

Run it and read the output carefully before you change anything. Then correct the program so that it produces the required output.

## Requirements

1. \`line_total\` must **return** the total instead of printing it.
2. The three output lines must come from the calling code, not from inside the function.
3. The combined number must be worked out from the two returned values.

## Guidance

The sign of trouble — \`None\` where a number should be — has one common cause, and this lesson describes it. To fix it, change one word inside the function, then change the calls so that they show what they receive.

## Why this matters

A function that prints can only ever put those exact characters on the screen. A function that returns can help work out a third value, and that is exactly what the last line of the required output needs.`,
          starterCode: `def line_total(quantity, price):
    print(quantity * price)


first = line_total(6, 5)
second = line_total(4, 3)
print(f"Combined: {first + second}")
`,
          hint: "Change print inside the function to return. Then put each call inside a print with a Subtotal: label, and keep the returned values in variables so the last line can add them.",
          tests: [
            {
              expectedOutput: "Subtotal: 30\nSubtotal: 12\nCombined: 42",
              description: "Both subtotals and the combined number are correct, with no None in the output",
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
          description: "Put input, conversion, functions, and formatting together in one small program.",
          instructions: `## The problem

This checkpoint uses everything from Module 2: reading input, converting types, writing functions that return, and formatting with f-strings.

A study tracker records one practice session and reports on it.

## Input

Three lines, in this order:

1. The subject name, as text.
2. The number of minutes spent, a whole number.
3. The number of exercises finished, a whole number.

## Requirements

1. Define a function \`format_duration(minutes)\` that returns a string like \`1h 50m\`, exactly as in the earlier exercise.
2. Define a function \`minutes_each(minutes, exercises)\` that returns the average number of minutes for each exercise, as a float. You may assume \`exercises\` is at least 1.
3. Read the three input lines with \`input()\` and no prompt, and convert the two numbers.
4. Show exactly three lines:

\`\`\`text
Subject: Statistics
Time: 1h 50m
Pace: 11.00 minutes per exercise
\`\`\`

## Details

The pace is shown with exactly **two** decimal places. Use a format instruction, not \`round()\`.

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
          hint: "Use the // and % method again for format_duration. minutes_each is a single division. Read all three inputs before you print anything, and use {pace:.2f} for the two decimal places.",
          tests: [
            {
              input: "Statistics\n110\n10\n",
              expectedOutput: "Subject: Statistics\nTime: 1h 50m\nPace: 11.00 minutes per exercise",
              description: "A session whose pace is a whole number still shows two decimal places",
            },
            {
              input: "Chemistry\n45\n7\n",
              expectedOutput: "Subject: Chemistry\nTime: 0h 45m\nPace: 6.43 minutes per exercise",
              description: "Less than an hour, with a pace that must be rounded for display",
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

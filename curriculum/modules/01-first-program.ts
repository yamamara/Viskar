import { module, lesson, type ModuleSource } from "../types.ts"

const moduleOne: ModuleSource = module(
  "Computers, Code, and Your First Program",
  "What a program actually is, how Python reads one, and how to write, run, and repair your first working code.",
  [
    lesson(
      "What a Program Is",
      "Instructions, precision, and the machinery that turns text you type into behaviour you can observe.",
      [
        {
          type: "lesson",
          title: "Instructions Without Ambiguity",
          description: "Why computers require a kind of precision that ordinary language never demands.",
          instructions: `## Starting from an ordinary request

Imagine leaving a note for someone who is house-sitting for you:

> **A note in ordinary language**
> Water the plants and take the bins out on Tuesday.

Any adult can act on that note. But look at how much it leaves unsaid. Which plants? How much water? Are the bins taken out on Tuesday, or is only the second task on Tuesday? A person resolves these gaps without noticing, using memory, context, and judgement.

A computer has none of that. It does not resolve gaps. It does not infer what you meant. This is the first idea in the course, and nearly everything else depends on it.

## What a program is

A **program** is a sequence of instructions written precisely enough that a machine can carry them out without making any decisions of its own.

That definition contains two claims worth separating.

The first is *sequence*. Instructions happen in an order, and the order matters. Putting your socks on after your shoes is a different outcome from putting them on before, even though the same two actions appear in both lists.

The second is *precision*. Every instruction must have exactly one meaning. Where ordinary language is comfortable being approximate, a program cannot be. If an instruction could be read two ways, the machine does not pick the sensible one. It follows the rule it was built to follow, which may not be the one you had in mind.

## Precision is not intelligence

It is tempting to describe a computer as "smart" because it does complicated things quickly. A more useful description is that a computer is **fast and literal**. It performs simple operations at enormous speed, and it performs exactly the operations it was given.

This is why beginners are so often surprised by their own programs. The program did not misunderstand. It did precisely what the text said, and the text said something slightly different from what the author intended. Learning to program is, to a large degree, learning to notice that gap.

> **Key idea**
> When a program behaves unexpectedly, the useful question is never "why did the computer do that to me?" It is "what did I actually write?"

## A worked comparison

Suppose you want a machine to greet someone. In ordinary language you might say:

> Say hello to the user.

To turn that into instructions, every vague word has to be settled. What are the exact characters of the greeting? Where does the greeting appear — on a screen, on paper, in a file? Does anything happen before or after it?

Once those questions are answered, the instruction becomes something a machine can carry out. In Python, one answer looks like this:

\`\`\`python
print("Hello, world!")
\`\`\`

You are not expected to understand every part of that line yet. Notice only what has changed between the English sentence and the Python line. The text to display is now written out exactly, character for character, including the comma and the exclamation mark. The action to perform has a specific name, \`print\`. There is nothing left for anyone to interpret.

## Predict before you continue

Here are two lines of Python. They use the same instruction twice.

\`\`\`python
print("first")
print("second")
\`\`\`

Before reading on, decide what you expect to appear when this runs, and in what order.

When this program runs, it produces:

\`\`\`text
first
second
\`\`\`

The order of the output matches the order of the instructions, because the machine works through the list from top to bottom. That will remain true for every program you write in this course, with one important refinement you will meet later when programs learn to make decisions and repeat themselves.

## The habit to build

For the rest of this course, treat every unexpected result as information rather than as failure. A program that does the wrong thing is telling you something true about what you wrote. That is far more useful than a program that happens to work for reasons you do not understand.

The next stage looks at what actually happens to your text between the moment you type it and the moment something appears on screen.`,
        },
        {
          type: "lesson",
          title: "Source Code and the Interpreter",
          description: "What happens between the text you type and the behaviour you observe.",
          instructions: `## The text you write has a name

The text of a program is called **source code**, or just *code*. It is ordinary text. There is nothing magical in the characters themselves; a Python program stored on a disk is as plain as a shopping list.

What makes it a program is that another piece of software is prepared to read it and act on it. For Python, that software is called the **Python interpreter**.

## What the interpreter does

The interpreter reads your source code and carries out the instructions it finds. It does this in a specific order, and it is worth being precise about the steps, because the difference between them explains the errors you will meet in a few stages' time.

1. The interpreter reads your text and checks that it is *arranged* in a way Python allows. This is a question of grammar, not meaning.
2. If the arrangement is not allowed, the interpreter stops immediately and reports the problem. Nothing runs at all.
3. If the arrangement is allowed, the interpreter carries out the instructions one at a time, from top to bottom.
4. While carrying out an instruction, it may discover a problem that could not be seen from the arrangement alone. It then stops at that point, having already done everything before it.

Steps 2 and 4 describe two different kinds of failure, and telling them apart is a genuine skill. You will meet both shortly.

## Where your code runs in this course

Ordinarily, a Python programmer saves source code in a file whose name ends in \`.py\`, then asks the interpreter to run that file. That workflow involves a terminal, a file system, and a text editor, none of which you need on your first day.

In this course, the interpreter runs inside your web browser. Each example on a lesson page has a **Run** button, and each exercise gives you an editor with a **Run** button and a **Check** button. Nothing is installed, and nothing you write can damage anything.

That convenience does not change any of the ideas. The Python you write here is the same Python you would write in a file. When you later move to a machine of your own, the language will be identical; only the surroundings will differ.

## The console

When a program produces text for a person to read, that text appears in an area called the **console**. In this application, the console sits directly beneath the code.

The console shows *output*: what the program produced. It does not show the program itself. Keeping those two things separate in your mind is important enough to state plainly.

> **Key idea**
> Code is the instructions you wrote. Output is what happened when they ran. They are different things, they live in different places on screen, and they usually do not look alike.

A beginner reading \`print("Hello, world!")\` sometimes expects the output to include the word \`print\`, the parentheses, or the quotation marks. It does not:

\`\`\`python
print("Hello, world!")
\`\`\`

produces exactly:

\`\`\`text
Hello, world!
\`\`\`

The \`print\` names the action. The parentheses mark where the action's details begin and end. The quotation marks show Python where the text starts and stops. None of those are part of the message, so none of them appear in the output.

## Trying it

Run the example above using the Run button on the code block. Then change the text inside the quotation marks — perhaps to your own name — and run it again. Watch the console change while the structure of the line stays the same.

That loop, in which you make a small change and immediately observe its effect, is the core working habit of programming. It has a name, and the last lesson of this module examines it deliberately.

## What to take away

Source code is plain text. The interpreter reads it, checks its arrangement, then carries out its instructions in order. Output appears in the console and contains only what the program produced, not the code that produced it.

In the next stage you write and run a program of your own.`,
        },
        {
          type: "exercise",
          title: "Your First Program",
          description: "Write a single instruction that displays one exact line of text.",
          instructions: `## The problem

Write a program that displays exactly one line of text:

\`\`\`text
Ready to begin.
\`\`\`

## Requirements

1. Use the \`print\` function.
2. The output must be exactly \`Ready to begin.\` — same capital \`R\`, same spelling, same full stop.
3. The program should display nothing else.

## Guidance

The general shape of the instruction is:

\`\`\`python
print("some text goes here")
\`\`\`

Replace the text between the quotation marks. Keep the quotation marks, the parentheses, and the word \`print\` exactly as they are.

## Constraints

The comparison is exact. \`ready to begin.\` and \`Ready to begin\` are both wrong: the first has a lowercase \`r\`, the second is missing the full stop. Copy the target text character for character.

## Checking your work

Press **Run** to see your output, then **Check** to grade it.`,
          starterCode: `print("")
`,
          hint: "The text you want displayed goes between the quotation marks. Everything outside the quotation marks — print, the parentheses, the quote characters themselves — is structure, and none of it appears in the output.",
          tests: [
            {
              expectedOutput: "Ready to begin.",
              description: "The program displays the required line exactly, including capitalisation and the full stop",
            },
          ],
          solution: `print("Ready to begin.")
`,
        },
        {
          type: "exercise",
          title: "Two Statements, In Order",
          description: "Show that a program runs its instructions from top to bottom.",
          instructions: `## The problem

A program is a *sequence*. This exercise makes that visible.

Write a program that displays these three lines, in this order:

\`\`\`text
Loading the data.
Checking the data.
Done.
\`\`\`

## Requirements

1. Use three separate \`print\` instructions, one per line of output.
2. The lines must appear in the order shown.
3. Each line of output must match the target exactly.

## Why this matters

Each \`print\` produces its own line, and the interpreter carries out the instructions from top to bottom. So the order of your three instructions determines the order of the three output lines. If you write them in the wrong order, the program is still perfectly valid Python — it simply does the wrong thing. That distinction between *invalid* and *wrong* will come up repeatedly.

## Predict first

Before you write anything, answer this for yourself: if you swapped the first and second instructions, would the program fail, or would it succeed while producing the wrong output? Decide, then try it and confirm.`,
          starterCode: `print("Loading the data.")
`,
          hint: "You need three lines of code, each one a complete print instruction. Write them in the same order you want the output to appear.",
          tests: [
            {
              expectedOutput: "Loading the data.\nChecking the data.\nDone.",
              description: "All three lines appear, in the required order",
            },
          ],
          solution: `print("Loading the data.")
print("Checking the data.")
print("Done.")
`,
        },
      ],
    ),

    lesson(
      "Displaying Text",
      "The print function in detail, and the rules that govern text in Python.",
      [
        {
          type: "lesson",
          title: "Inside the print Function",
          description: "Calling a function, passing it arguments, and controlling the line breaks it produces.",
          instructions: `## A name for what you have been doing

You have written \`print("Ready to begin.")\` and watched text appear. It is time to name the parts, because those names are used constantly from here on.

\`print\` is a **function**: a named operation that Python already knows how to perform. Writing the name followed by parentheses is called **calling** the function. The parentheses are not decoration; they are what turns a name into an instruction to *do the thing now*.

The values you place inside the parentheses are called **arguments**. They are the details the function needs in order to do its job. In \`print("Ready to begin.")\` there is one argument, the text \`Ready to begin.\`.

> **Key idea**
> A function call has three parts: the name of the function, a pair of parentheses, and zero or more arguments inside them. \`print\` names the operation, \`()\` performs it, and the arguments supply the details.

## Calling print with nothing

A function call can have no arguments at all. \`print()\` is legal, and it produces an empty line:

\`\`\`python
print("Top")
print()
print("Bottom")
\`\`\`

The output is:

\`\`\`text
Top

Bottom
\`\`\`

This is a small but genuinely useful tool: it is how you put visual space in your output.

## Calling print with several arguments

You can pass more than one argument by separating them with commas. Python displays them all on one line, with a single space between each:

\`\`\`python
print("Total", 42, "items")
\`\`\`

produces:

\`\`\`text
Total 42 items
\`\`\`

Notice three things. The arguments appeared in the order given. Python inserted a space between them that you did not type. And \`42\` was written without quotation marks, yet still appeared — the reason for that difference is the subject of the next stage.

A common early mistake is to add your own spaces as well:

\`\`\`python
print("Total ", 42, " items")
\`\`\`

which produces:

\`\`\`text
Total  42  items
\`\`\`

There are now two spaces on each side of the number: the one you typed inside the quotation marks, and the one Python adds between arguments. If your output has mysterious extra spaces, this is usually why.

## Each print starts a new line

By default, every \`print\` call ends by moving to a new line. That is why three \`print\` calls produced three lines in the previous exercise.

You can change this using \`end\`, which specifies what to put at the end instead of a line break:

\`\`\`python
print("Loading", end="")
print("...")
\`\`\`

produces a single line:

\`\`\`text
Loading...
\`\`\`

The first call ended with nothing at all, so the second call's output continued on the same line. You will not need \`end\` often, but knowing it exists explains why output sometimes runs together unexpectedly.

## Predict before you continue

What does this program display, and on how many lines?

\`\`\`python
print("a", "b")
print("c")
print()
print("d", "e", "f")
\`\`\`

Work it out before running it. The answer is four lines: \`a b\`, then \`c\`, then an empty line, then \`d e f\`. The first and last lines each contain several arguments joined by single spaces; the empty \`print()\` contributes a line with nothing on it.

## Summary

Calling a function means writing its name followed by parentheses. Arguments go inside the parentheses, separated by commas. \`print\` displays its arguments on one line, separated by single spaces, and then moves to a new line unless told otherwise.`,
        },
        {
          type: "lesson",
          title: "Strings and Quotation Marks",
          description: "How Python tells text apart from everything else, and what to do when your text contains a quotation mark.",
          instructions: `## Why the quotation marks are there

In \`print("Ready to begin.")\`, the quotation marks are doing real work. They mark where a piece of text begins and ends.

A piece of text in Python is called a **string**. The name is old and simply means a string of characters, one after another. The quotation marks are not part of the string; they are the boundary markers that tell the interpreter "the string starts here" and "the string stops here".

This matters because a program contains two very different kinds of word. Some words are instructions to Python, like \`print\`. Others are data for the program to work with, like \`Ready to begin.\`. Quotation marks are how you keep them apart.

Consider what happens without them:

\`\`\`python
print("hello")
\`\`\`

Python displays the five characters \`hello\`. But if you wrote \`print(hello)\`, Python would not display anything. It would look for something *named* \`hello\`, fail to find it, and stop with an error. The quotation marks change the meaning entirely: with them, \`hello\` is data; without them, it is a name.

> **Key idea**
> Quotation marks turn characters into data. Without them, Python reads the same characters as a name and goes looking for something with that name.

## Single or double quotes

Python accepts both \`'\` and \`"\` as string boundaries. These two lines do exactly the same thing:

\`\`\`python
print("Consistent")
print('Consistent')
\`\`\`

The only rule is that a string must end with the same kind of quotation mark it started with. \`"mismatched'\` is not a valid string.

Having two choices is not redundancy; it solves a real problem.

## When the text itself contains a quote

Suppose you want to display:

\`\`\`text
It's ready.
\`\`\`

If you try to build that string with single quotes, the apostrophe ends the string early and the rest of the line becomes nonsense to Python. The fix is to use the other kind of quotation mark as the boundary:

\`\`\`python
print("It's ready.")
\`\`\`

The apostrophe is now just an ordinary character inside a double-quoted string, so it has no special meaning.

The same trick works the other way around. To display a sentence containing double quotes, wrap it in single quotes:

\`\`\`python
print('She said "later" and left.')
\`\`\`

which produces:

\`\`\`text
She said "later" and left.
\`\`\`

## When you need both

Occasionally a string contains both kinds of quotation mark. Then you need a **backslash**, written \`\\\`, which tells Python that the very next character is ordinary data rather than a boundary:

\`\`\`python
print("It's labelled \\"fragile\\" on the box.")
\`\`\`

which produces:

\`\`\`text
It's labelled "fragile" on the box.
\`\`\`

The backslashes are instructions to the interpreter about how to read the source code. They are not part of the string, so they do not appear in the output. This is called **escaping** a character.

One escape is worth memorising now: \`\\n\` means "start a new line here". It lets a single string span several output lines:

\`\`\`python
print("First line\\nSecond line")
\`\`\`

produces:

\`\`\`text
First line
Second line
\`\`\`

## A distinction to hold on to

There is a difference between a string and the way it is displayed. The string in the last example contains a newline character. When printed, that character becomes an actual line break on screen. You cannot see the character itself; you see its effect.

That gap between a value and its printed appearance will return in several later modules, and it is a frequent source of confusion. Keep it in mind: what a value *is* and how it *looks when displayed* are related but separate questions.

## Predict before you continue

What does this display?

\`\`\`python
print('The sign said "closed".')
\`\`\`

The output is \`The sign said "closed".\` — the double quotes appear because the string's boundaries are single quotes, so the double quotes inside are ordinary characters.

## Summary

A string is a sequence of characters marked off by matching quotation marks. Use whichever quote character is not inside your text. When both appear, escape with a backslash. \`\\n\` inserts a line break.`,
        },
        {
          type: "exercise",
          title: "Predict Then Reproduce",
          description: "Work out what a short program displays, then write one that matches it.",
          instructions: `## The problem

Read this program carefully. Do not run it yet.

\`\`\`text
print("A", "B")
print()
print("C")
\`\`\`

Decide, before doing anything else, how many lines it displays and exactly what is on each.

## Your task

Write a program that produces that same output, plus one extra line at the end reading \`Done\`.

## Expected output

\`\`\`text
A B

C
Done
\`\`\`

## Requirements

1. Four lines in total, one of them empty.
2. The first line must be produced by a single \`print\` receiving **two** arguments.
3. The last line is \`Done\`.

## Guidance

The first line is \`A B\` with exactly one space, supplied by \`print\` rather than typed inside the strings.

The second line is empty because \`print()\` with no arguments still ends its line.

If your prediction disagreed with the output, work out precisely which of those two facts you had wrong. That is worth more than getting it right first time.`,
          starterCode: `print("A", "B")
`,
          hint: "Four print calls. The first takes two arguments and lets Python insert the space; the second takes none; the third and fourth take one each.",
          tests: [
            {
              expectedOutput: "A B\n\nC\nDone",
              description: "All four lines appear, with a single space in the first and an empty second line",
            },
          ],
          solution: `print("A", "B")
print()
print("C")
print("Done")
`,
        },
        {
          type: "exercise",
          title: "Text Containing Quotation Marks",
          description: "Choose quotation marks that let a sentence contain an apostrophe and a quoted phrase.",
          instructions: `## The problem

Write a program that displays these two lines exactly:

\`\`\`text
It's a quiet morning.
The label read "handle with care".
\`\`\`

## Requirements

1. Use two \`print\` instructions.
2. The first line contains an apostrophe in \`It's\`.
3. The second line contains double quotation marks around \`handle with care\`.
4. Both lines must match exactly, including the full stops.

## Guidance

Each line contains one kind of quotation mark, so neither line needs a backslash. For each one, choose the *other* kind of quotation mark as the string's boundary.

Note where the full stop sits on the second line: outside the closing double quote, immediately before the end of the sentence.

## Constraints

Do not use \`\\n\` to produce both lines from a single \`print\`. This exercise is about choosing quotation marks, so use one \`print\` per line.`,
          starterCode: `print("")
print("")
`,
          hint: "A string boundary must be a quote character that does not appear inside the text. For a line containing an apostrophe, use double quotes as the boundary; for a line containing double quotes, use single quotes.",
          tests: [
            {
              expectedOutput: "It's a quiet morning.\nThe label read \"handle with care\".",
              description: "Both lines appear exactly, with the apostrophe and the double-quoted phrase intact",
            },
          ],
          solution: `print("It's a quiet morning.")
print('The label read "handle with care".')
`,
        },
        {
          type: "exercise",
          title: "Spacing and Blank Lines",
          description: "Control exactly where spaces and empty lines appear in your output.",
          instructions: `## The problem

Produce this output exactly:

\`\`\`text
Report

Items 7 counted

End of report
\`\`\`

Read the target carefully. There are five lines in total: three lines with text and two empty lines, one after \`Report\` and one after \`Items 7 counted\`.

## Requirements

1. The middle line must be produced by a single \`print\` call that receives **three arguments**: the string \`Items\`, the number \`7\` written without quotation marks, and the string \`counted\`.
2. The empty lines must be produced by calling \`print()\` with no arguments.
3. There must be exactly one space between \`Items\` and \`7\`, and exactly one between \`7\` and \`counted\`.

## Guidance

Remember that Python already inserts one space between arguments. If you also type spaces inside your strings, you will end up with two, and the check will fail.

## Constraints

Do not build the middle line by typing \`"Items 7 counted"\` as a single string. The point of the exercise is to pass three separate arguments and let \`print\` join them.`,
          starterCode: `print("Report")
`,
          hint: "Five print calls in total. Two of them are print() with nothing inside. For the middle line, write print(\"Items\", 7, \"counted\") and let Python supply the spaces.",
          tests: [
            {
              expectedOutput: "Report\n\nItems 7 counted\n\nEnd of report",
              description: "All five lines appear, with single spaces in the middle line and blank lines in the right places",
            },
          ],
          solution: `print("Report")
print()
print("Items", 7, "counted")
print()
print("End of report")
`,
        },
      ],
    ),

    lesson(
      "Comments and Errors",
      "Writing notes for human readers, and learning to read Python's error messages without alarm.",
      [
        {
          type: "lesson",
          title: "Comments: Notes for People",
          description: "Text the interpreter deliberately ignores, and what it is genuinely for.",
          instructions: `## Text that does not run

Sometimes you want to write something in your source code that is meant for a person rather than for the interpreter. Python provides the \`#\` character for this. Everything from a \`#\` to the end of that line is a **comment**, and the interpreter skips it entirely.

\`\`\`python
# This line is ignored completely.
print("This line runs.")
\`\`\`

The output is only:

\`\`\`text
This line runs.
\`\`\`

A comment can also follow code on the same line:

\`\`\`python
print("Totals")  # a heading for the section below
\`\`\`

The \`print\` still runs; the note after \`#\` is ignored.

## What comments are for

Beginners are often told to comment their code, and then write comments like this:

\`\`\`python
# print the total
print(total_cost)
\`\`\`

That comment adds nothing. It restates in English exactly what the code already says in Python, and now there are two things to keep in step instead of one. When the code changes and the comment does not, the comment becomes a lie.

Useful comments explain what the code cannot say for itself:

- **Why** a decision was made, when the reason is not obvious from the code.
- Where a value came from, if it looks arbitrary.
- A warning about something surprising.

\`\`\`python
# Prices are held in whole pence to avoid rounding drift on repeated addition.
price_in_pence = 1299
print(price_in_pence)
\`\`\`

That comment tells a future reader something the code genuinely does not.

> **Key idea**
> A comment should explain what the code cannot. If a comment merely translates the line beneath it into English, delete it and spend the effort on a clearer name instead.

## Commenting out code

Comments have a second, very practical use. While hunting a problem, you can temporarily disable a line by putting \`#\` in front of it:

\`\`\`python
print("step one")
# print("step two")
print("step three")
\`\`\`

The middle line is now inert, and the output is \`step one\` then \`step three\`. This is a quick way to test whether a particular line is responsible for some behaviour. It is a tool you will reach for constantly once your programs are more than a few lines long.

## A note on style

Write comments as complete sentences with ordinary capitalisation. Leave a space after the \`#\`. These are conventions rather than rules — Python will accept \`#no space\` — but consistent code is easier to read, and you will be reading your own code far more often than you expect.

## Summary

\`#\` marks the rest of a line as a comment, which the interpreter ignores. Use comments to record reasons and warnings, not to restate the code. Commenting out a line is a fast way to test what it contributes.`,
        },
        {
          type: "lesson",
          title: "When Python Refuses to Run",
          description: "Syntax errors, what the message is telling you, and how to read it calmly.",
          instructions: `## Two ways a program can fail

Recall the interpreter's steps: first it checks that your code is *arranged* legally, and only then does it start carrying out instructions. This gives two distinct failure points, and they feel very different when you meet them.

A **syntax error** means the arrangement itself is not legal Python. The interpreter could not even begin. Nothing runs at all — not even the lines above the mistake.

A **runtime error** means the arrangement was fine, so the program started, but something went wrong while an instruction was being carried out. Everything before that point has already happened.

This module concentrates on the first kind. Runtime errors get a full treatment later, once your programs do enough for them to occur.

## What a syntax error looks like

Here is a program with a missing closing parenthesis:

\`\`\`text
print("Hello"
\`\`\`

Python reports something close to:

\`\`\`text
Line 1: SyntaxError: '(' was never closed
\`\`\`

Three pieces of information are being offered, and each is useful:

1. **Where.** A line number. This is where Python *noticed* the problem, which is not always where you *made* it — more on that below.
2. **What kind.** \`SyntaxError\` tells you the arrangement was wrong, so no part of the program ran.
3. **The detail.** \`'(' was never closed\` is a specific, actionable description.

## Reading the message rather than fearing it

Error messages look intimidating mostly because they are unfamiliar. They are, in fact, the most helpful output your program can give you: a free diagnosis, produced instantly, that tells you where to look.

The productive habit is mechanical:

1. Read the last line first. It names the kind of error and describes it.
2. Look at the reported line number in your code.
3. If that line looks fine, check the line *above* it.

Step 3 is not superstition. Some mistakes are only detectable once Python has read further. A missing closing parenthesis on line 4 might only be reported at line 5, because Python kept reading, hoping the parenthesis was still coming.

\`\`\`python
print("first")
print("second")
\`\`\`

That program is fine. Now imagine deleting the final \`)\` from line 2. Python reaches the end of the file still waiting for it, and reports the problem at the end rather than at line 2.

## Three syntax errors you will meet this week

**A missing closing quotation mark.** The string never ends:

\`\`\`text
print("unterminated)
\`\`\`

Python reports an unterminated string literal. The clue is that the closing parenthesis has been swallowed into the string.

**Mismatched quotation marks.** A string that opens with one kind and closes with the other:

\`\`\`text
print('mismatched")
\`\`\`

Python is still waiting for a closing \`'\`.

**A missing parenthesis.** As shown above; \`'(' was never closed\`.

Each of these has the same underlying cause: something that must come in pairs was not paired. When you see a \`SyntaxError\`, count your pairs first — quotes, then parentheses.

> **Key idea**
> A \`SyntaxError\` means nothing ran. If you see one, do not look for a problem in your logic. Look for a character that is missing, extra, or mismatched.

## Errors are not a verdict

Every working programmer produces syntax errors daily. They are not a sign of inability; they are a sign of typing. The difference between a beginner and an experienced programmer is not that one makes errors and the other does not. It is that one reads the message and fixes it in fifteen seconds, while the other feels a jolt of alarm and starts changing things at random.

Aim for the first. Read the message. Count the pairs. Fix the character.

## Predict before you continue

Which of these two programs produces a syntax error, and what does the other one do?

\`\`\`python
print("a")
print("b")
\`\`\`

\`\`\`text
print("a"
print("b")
\`\`\`

The first is fine and prints two lines. The second has an unclosed parenthesis on its first line, so **nothing** runs — not even \`a\`. That last point is the one worth remembering.

## Summary

A syntax error means the code's arrangement is illegal and no part of it ran. The message gives you a line number, a category, and a description. Read the last line, check the reported line, then the line above it, and count your pairs.`,
        },
        {
          type: "exercise",
          title: "Repair a Broken Program",
          description: "Find and fix the syntax errors preventing a short program from running at all.",
          instructions: `## The problem

The program in the editor is supposed to display these three lines:

\`\`\`text
System check
All modules present
Ready
\`\`\`

It does not run at all. It contains **two** syntax errors.

## Your task

Repair the program so that it runs and produces exactly the output above. Do not rewrite it from scratch; find the specific characters that are wrong and correct them.

## Guidance

Press **Run** first and read the error message. Fix the problem it reports, then run it again — the second error will only be reported once the first is gone. This is normal: Python stops at the first arrangement problem it finds, so errors often surface one at a time.

Recall the checklist for a \`SyntaxError\`: count the pairs. Every opening quotation mark needs a matching closing one of the same kind, and every opening parenthesis needs a closing one.

## Requirements

1. The output must be exactly the three lines shown.
2. Keep the three \`print\` calls and their order.`,
          starterCode: `print("System check")
print("All modules present)
print("Ready"
`,
          starterIsBroken: true,
          hint: "Line 2 opens a string that is never closed, which swallows the rest of that line. Line 3 opens a parenthesis that is never closed. Fix one, run again, then fix the other.",
          tests: [
            {
              expectedOutput: "System check\nAll modules present\nReady",
              description: "The repaired program runs and prints all three lines",
            },
          ],
          solution: `print("System check")
print("All modules present")
print("Ready")
`,
        },
        {
          type: "exercise",
          title: "A Program That Runs but Is Wrong",
          description: "Distinguish code that Python rejects from code Python accepts but that does the wrong thing.",
          instructions: `## The problem

The program in the editor runs perfectly well. Python reports no errors at all. It nevertheless produces the wrong output.

It currently displays:

\`\`\`text
Second
First
\`\`\`

It should display:

\`\`\`text
First
Second
Third
\`\`\`

## Your task

Correct the program so it produces the required output.

## Requirements

1. Three lines of output, in the order \`First\`, \`Second\`, \`Third\`.
2. Use one \`print\` call per line.

## Why this exercise exists

There is an important difference between a program Python *refuses to run* and a program Python *runs happily while doing the wrong thing*. The first announces itself with an error message. The second is silent, and the only way to catch it is to compare what the program produced against what you intended.

Notice also that one line of the starter code is commented out. A commented line is invisible to the interpreter; it contributes nothing to the output. That is a third possibility to keep in mind when a line seems to have no effect: perhaps it is not running at all.

> **Key idea**
> A program with no error message is not necessarily a correct program. "It ran" and "it is right" are separate claims, and only the second one matters.`,
          starterCode: `print("Second")
print("First")
# print("Third")
`,
          hint: "Two problems: the first two lines are in the wrong order, and the third line is commented out, so it never runs. Reorder the first two and remove the # from the third.",
          tests: [
            {
              expectedOutput: "First\nSecond\nThird",
              description: "All three lines print in the correct order, with the commented line restored",
            },
          ],
          solution: `print("First")
print("Second")
print("Third")
`,
        },
      ],
    ),

    lesson(
      "Working Like a Programmer",
      "Reading code before running it, and the small disciplined loop that underlies all programming.",
      [
        {
          type: "lesson",
          title: "Predicting Output",
          description: "Why forming an expectation before running code is the fastest way to learn.",
          instructions: `## A habit worth forming immediately

When you meet an unfamiliar piece of code, there are two things you can do. You can run it and see. Or you can decide what you expect first, then run it and compare.

The second takes about ten extra seconds and is worth far more than the first, for a reason that is easy to miss: running code tells you what it does, but *predicting* code tells you whether your model of the language is correct.

If your prediction matches, you have confirmed your understanding. If it does not, you have found a specific gap in your knowledge at the exact moment you are best placed to close it. Without a prediction, a surprising result simply washes over you and nothing is learned.

## Tracing a program by hand

**Tracing** means walking through a program one instruction at a time, writing down what happens at each step, as though you were the interpreter.

Take this program:

\`\`\`python
print("Start")
print()
print("Middle", "of", "the", "run")
print("End")
\`\`\`

Trace it:

1. Line 1 displays \`Start\` and moves to a new line.
2. Line 2 has no arguments, so it displays nothing and moves to a new line. The result is an empty line.
3. Line 3 has four arguments. They are displayed in order, separated by single spaces, giving \`Middle of the run\`.
4. Line 4 displays \`End\`.

The complete output:

\`\`\`text
Start

Middle of the run
End
\`\`\`

That level of care seems excessive for a four-line program. It is. The point is to build the habit while the programs are small enough that tracing is easy, so that the habit is available when the programs are large enough that tracing is the only thing that works.

## Predicting output that involves a trick

Try this one. Decide what it displays before reading on.

\`\`\`python
print("Line one")
# print("Line two")
print("Line", "three")
\`\`\`

The answer is two lines: \`Line one\` and \`Line three\`. The middle instruction is a comment, so it never runs. The final instruction has two arguments, which \`print\` joins with a single space.

If you predicted three lines, you have just learned something specific about comments that a passive read-through would not have taught you.

## Counting characters matters

One more, and this one is about precision:

\`\`\`python
print("a", "b")
print("a" , "b")
\`\`\`

Both lines produce \`a b\`. The extra space before the comma on the second line is in the *source code*, not in a string, and Python ignores whitespace between the parts of an instruction. Only the spaces *inside* quotation marks are data.

That distinction — between whitespace that is part of your data and whitespace that is merely part of how you laid out your code — is worth being clear about now, because it removes a whole category of confusion later.

## Summary

Predict, then run, then compare. When the prediction is wrong, find out precisely why before moving on. Trace small programs line by line while tracing is still easy.`,
        },
        {
          type: "lesson",
          title: "The Edit-Run-Observe Cycle",
          description: "The small, fast loop that experienced programmers run hundreds of times a day.",
          instructions: `## How programs actually get written

Beginners often imagine that a competent programmer thinks carefully, types a finished program, and runs it once successfully. This is not what happens. What happens is a tight loop:

1. **Edit.** Make one small change.
2. **Run.** Execute the program immediately.
3. **Observe.** Compare what happened against what you expected.

Then repeat. An experienced programmer goes round this loop constantly, often every few seconds, and the changes are much smaller than a beginner expects.

## Why small steps win

The reason is entirely practical. If you write twenty lines and then run them for the first time, and the output is wrong, the mistake could be in any of the twenty. If you write one line, run it, and the output is wrong, the mistake is in that line.

The cost of finding a mistake grows much faster than the amount of code you wrote before looking for it. Working in small steps keeps that cost near zero.

> **Key idea**
> Run your program more often than feels necessary. The purpose is not to check that it works; it is to keep the amount of unverified code small enough that any problem has an obvious cause.

## What "observe" really means

The third step is the one most often skipped. Running the program and glancing at the output is not observing. Observing means comparing the actual output against a specific expectation, character by character where it matters.

Consider a program that should print \`Total: 42\` and instead prints \`Total:  42\`. A glance says "yes, that looks right". A comparison catches the doubled space. Later in this course, automated tests will do this comparison for you, exactly and without fatigue — but the habit of caring about the difference has to be yours.

## Working this way in the exercises

Every exercise in this course gives you two buttons.

**Run** executes your program and shows its output. Use it constantly. It is free, it is fast, and there is no penalty for pressing it.

**Check** runs your program against the exercise's tests and reports which passed. When a test fails, you are shown the input used, the output that was expected, and the output your program actually produced. Read all three. The difference between the last two is the whole diagnosis.

You may press either button as many times as you like. Nothing is graded on the number of attempts; the exercise is complete when every test passes.

## When you are stuck

A short, ordered checklist, worth returning to for the rest of the course:

1. Read the error message, if there is one. Its last line names the problem.
2. If there is no error, compare the actual output against the expected output character by character.
3. Reduce the program. Comment out lines until it is as small as possible while still showing the problem.
4. Add a \`print\` to display something you are unsure about.
5. Re-read the requirements. A surprising share of "broken" programs are correct programs solving a slightly different problem.

Notice that "start again from scratch" and "change things until it works" are not on the list. Both feel productive and neither is.

## Summary

Edit a little, run immediately, and compare the result against a specific expectation. Keep the unverified portion of your program small. When stuck, work through the checklist rather than making random changes.`,
        },
        {
          type: "exercise",
          title: "Produce an Exact Layout",
          description: "Reproduce a precise multi-line layout, spaces and blank lines included.",
          instructions: `## The problem

Write a program that produces exactly this output:

\`\`\`text
=== Field Notes ===

Site: North Ridge
Visits: 3

Notes recorded.
\`\`\`

## Requirements

1. Six lines in total: four with text and two empty.
2. The first line is \`=== Field Notes ===\` — three equals signs, a space, the words, a space, three equals signs.
3. \`Site: North Ridge\` and \`Visits: 3\` each have exactly one space after the colon.
4. The empty lines appear where shown: after the heading, and after \`Visits: 3\`.

## Guidance

Work one line at a time, running after each addition rather than writing all six and hoping. That is the edit-run-observe cycle applied to a problem small enough to see it working.

There is more than one correct way to produce \`Visits: 3\`. You could write it as a single string, or pass two arguments and let \`print\` insert the space. Either is acceptable here — but if you choose two arguments, remember not to also type a space inside the string.

## Constraints

Trailing spaces at the end of a line are ignored by the checker, but everything else is compared exactly.`,
          starterCode: `print("=== Field Notes ===")
`,
          hint: "Six print calls: four with text, two with nothing inside the parentheses. Build them one at a time and press Run after each one.",
          tests: [
            {
              expectedOutput: "=== Field Notes ===\n\nSite: North Ridge\nVisits: 3\n\nNotes recorded.",
              description: "The full six-line layout matches, including both blank lines",
            },
          ],
          solution: `print("=== Field Notes ===")
print()
print("Site: North Ridge")
print("Visits: 3")
print()
print("Notes recorded.")
`,
        },
        {
          type: "exercise",
          title: "Module 1 Checkpoint: A Program Summary Card",
          description: "Combine printing, quotation marks, escapes, and comments into one small program.",
          instructions: `## The problem

This checkpoint draws on everything in Module 1: calling \`print\`, choosing quotation marks, escaping a character, producing blank lines, and writing a comment.

Write a program that produces exactly this output:

\`\`\`text
Program: Field Logger
Author: "unattributed"
Status: it's running

Lines of output: 5
\`\`\`

## Requirements

1. Five lines of output in total: four with text, and one empty line before the last line.
2. Line 2 displays \`Author: "unattributed"\` with visible double quotation marks around the word.
3. Line 3 displays \`Status: it's running\` with a visible apostrophe.
4. The final line is produced by a single \`print\` call receiving **two arguments**: the string \`Lines of output:\` and the number \`5\` written without quotation marks.
5. The program must include at least one comment line beginning with \`#\`.

## Guidance

Lines 2 and 3 each contain one kind of quotation mark, so each can be written by choosing the other kind as the boundary — no backslash is required, though using one is not wrong.

The comment has no effect on the output. It is there because part of writing a program is leaving a note for whoever reads it next, including yourself.

## Constraints

The output is compared exactly. Check the colons, the spaces after them, and the position of the blank line before submitting.`,
          starterCode: `# Summary card for the Field Logger program
print("Program: Field Logger")
`,
          hint: "Line 2 contains double quotes, so wrap that string in single quotes. Line 3 contains an apostrophe, so wrap that string in double quotes. The last line is print(\"Lines of output:\", 5) with no space typed before the closing quote.",
          tests: [
            {
              expectedOutput:
                "Program: Field Logger\nAuthor: \"unattributed\"\nStatus: it's running\n\nLines of output: 5",
              description: "All five lines match exactly, including the quoted author, the apostrophe, and the blank line",
            },
          ],
          solution: `# Summary card for the Field Logger program
print("Program: Field Logger")
print('Author: "unattributed"')
print("Status: it's running")
print()
print("Lines of output:", 5)
`,
        },
      ],
    ),
  ],
)

export default moduleOne

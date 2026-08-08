import { module, lesson, type ModuleSource } from "../types.ts"

const moduleOne: ModuleSource = module(
  "Computers, Code, and Your First Program",
  "What a program really is, how Python reads one, and how to write, run, and repair your first working code.",
  [
    lesson(
      "What a Program Is",
      "Instructions, exactness, and the machine that turns the text you type into behaviour you can see.",
      [
        {
          type: "lesson",
          title: "Instructions With Only One Meaning",
          description: "Why a computer needs a kind of exactness that ordinary language never needs.",
          instructions: `## Humans and computers think very differently

Imagine you are going away for two days. You leave a note for your cousin, who will look after your house:

> **Note for my cousin**
> "Water the plants and take the rubbish out on Tuesday."

Any adult can follow this note, but look at how much the note does not say. Which plants? How much water? Is the rubbish taken out on Tuesday, or are both jobs done on Tuesday?

A person fills these gaps without even noticing. They use memory, habit, and common sense.

A computer has none of that. It does not fill gaps. It does not guess what you meant. This is the first idea of programming you need to understand, you need to give your computer exact instructions as if it was 4 year old kid.

## What exactly is a program?

A **program** is a list of instructions. The instructions are written so exactly that a machine can follow them without making any choice of its own.

There are two main ideas that allow programmers to achieve this.

The first is *order*. Instructions happen one after another, and the order matters. Putting on your socks after your shoes gives a different result than putting on your socks first. It is still the same two actions, only the order is different.

The second idea is *exactness*. Every instruction must have one meaning only. Ordinary language is fine to be a little loose, but a program cannot be. If an instruction can be read in two ways, the machine does not pick the sensible one. It follows the rule it was built to follow, and that rule may not be the one you had in mind.

## Being exact is not the same as being clever

People often call a computer "clever" because it does difficult work quickly. A more useful description is that a computer is **fast and literal**. Literal means it does exactly what the words say, and nothing more.

This is why new programmers are so often surprised by their own programs. The program did not misunderstand you. It did exactly what your text said. Your text said something slightly different from what you wanted. Learning to program means learning to see that small difference.

> **Key idea**
> When a program does something strange, the useful question is not "why did the computer do this to me?" The useful question is "what did I actually write?"

## One example, step by step

Suppose you want a machine to greet a person. In ordinary language you might say:

> Say hello to the user.

To turn that into an instruction, every unclear word must be settled. What are the exact letters of the greeting? Where does the greeting appear: on a screen, on paper, in a file? Does anything happen before it or after it?

Once those questions are answered, a machine can follow the instruction. In Python, one answer looks like this:

\`\`\`python
print("Hello, world!")
\`\`\`

You are not expected to understand every part of that line yet. Notice only what has changed between the English sentence and the Python line. The text to show is now written out exactly, letter by letter, including the comma and the exclamation mark. The action has an exact name, \`print\`. Nothing is left for anyone to guess.

## Predict before you continue

Here are two lines of Python. They use the same instruction twice.

\`\`\`python
print("first")
print("second")
\`\`\`

Before you read on, decide what you expect to see when this runs, and in what order.

When this program runs, it shows:

\`\`\`text
first
second
\`\`\`

The order of the output matches the order of the instructions, because the machine works through the list from top to bottom. This stays true for every program you write in this course. Later, when programs learn to make choices and to repeat work, you will meet one important addition to this rule.

## The habit to build

For the rest of this course, treat every surprise as information, not as failure. A program that does the wrong thing is telling you something true about what you wrote. That is far more useful than a program that works for reasons you do not understand.

The next stage looks at what happens to your text between the moment you type it and the moment something appears on the screen.`,
        },
        {
          type: "lesson",
          title: "Source Code and the Interpreter",
          description: "What happens between the text you type and the behaviour you see.",
          instructions: `## The text you write has a name

The text of a program is called **source code**, or just *code*. It is ordinary text. There is nothing magic in the letters themselves. A Python program saved on a disk is as plain as a shopping list.

What makes it a program is that another piece of software is ready to read it and act on it. For Python, that software is called the **Python interpreter**.

## What the interpreter does

The interpreter reads your source code and carries out the instructions it finds. It works in a fixed order. It is worth learning these steps carefully, because the difference between them explains the errors you will meet in a few stages' time.

1. The interpreter reads your text and checks that it is *arranged* in a way Python allows. This is a question of grammar, not of meaning.
2. If the arrangement is not allowed, the interpreter stops at once and reports the problem. Nothing runs at all.
3. If the arrangement is allowed, the interpreter carries out the instructions one at a time, from top to bottom.
4. While carrying out an instruction, it may find a problem that the arrangement alone could not show. It then stops at that point. Everything before that point has already happened.

Steps 2 and 4 describe two different kinds of failure. Telling them apart is a real skill. You will meet both of them soon.

## Where your code runs in this course

Normally a Python programmer saves source code in a file whose name ends in \`.py\`. Then the programmer asks the interpreter to run that file. That way of working needs a terminal, a file system, and a text editor. You need none of them on your first day.

In this course, the interpreter runs inside your web browser. Every example on a lesson page has a **Run** button. Every exercise gives you an editor with a **Run** button and a **Check** button. Nothing is installed, and nothing you write can damage anything.

This convenience does not change any of the ideas. The Python you write here is the same Python you would write in a file. When you later move to your own machine, the language will be the same. Only the surroundings will be different.

## The console

When a program produces text for a person to read, that text appears in an area called the **console**. In this application, the console sits directly below the code.

The console shows *output*: what the program produced. It does not show the program itself. Keeping these two things separate in your mind is important enough to say plainly.

> **Key idea**
> Code is the instructions you wrote. Output is what happened when they ran. They are different things, they sit in different places on the screen, and they usually do not look alike.

A beginner who reads \`print("Hello, world!")\` sometimes expects the word \`print\`, the brackets, or the quotation marks to appear in the output. They do not:

\`\`\`python
print("Hello, world!")
\`\`\`

produces exactly:

\`\`\`text
Hello, world!
\`\`\`

The word \`print\` names the action. The brackets show where the details of the action begin and end. The quotation marks show Python where the text starts and stops. None of them are part of the message, so none of them appear in the output.

## Try it

Run the example above with the Run button on the code block. Then change the text inside the quotation marks — perhaps to your own name — and run it again. Watch the console change while the shape of the line stays the same.

That loop, where you make a small change and see its effect at once, is the main working habit in programming. It has a name, and the last lesson of this module studies it carefully.

## What to take away

Source code is plain text. The interpreter reads it, checks its arrangement, then carries out its instructions in order. Output appears in the console, and it holds only what the program produced, not the code that produced it.

In the next stage you write and run a program of your own.`,
        },
        {
          type: "exercise",
          title: "Your First Program",
          description: "Write one instruction that shows one exact line of text.",
          instructions: `## The problem

Write a program that shows exactly one line of text:

\`\`\`text
Ready to begin.
\`\`\`

## Requirements

1. Use the \`print\` function.
2. The output must be exactly \`Ready to begin.\` — the same capital \`R\`, the same spelling, the same full stop.
3. The program must show nothing else.

## Guidance

The general shape of the instruction is:

\`\`\`python
print("some text goes here")
\`\`\`

Change the text between the quotation marks. Keep the quotation marks, the brackets, and the word \`print\` exactly as they are.

## Constraints

The check is exact. Both \`ready to begin.\` and \`Ready to begin\` are wrong. The first has a small \`r\`. The second has no full stop. Copy the target text letter by letter.

## Checking your work

Press **Run** to see your output. Then press **Check** to grade it.`,
          starterCode: `print("")
`,
          hint: "The text you want to show goes between the quotation marks. Everything outside the quotation marks — print, the brackets, the quote marks themselves — is structure, and none of it appears in the output.",
          tests: [
            {
              expectedOutput: "Ready to begin.",
              description: "The program shows the required line exactly, with the same capital letter and full stop",
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

A program is a *list in order*. This exercise makes that easy to see.

Write a program that shows these three lines, in this order:

\`\`\`text
Loading the data.
Checking the data.
Done.
\`\`\`

## Requirements

1. Use three separate \`print\` instructions, one for each line of output.
2. The lines must appear in the order shown.
3. Each line of output must match the target exactly.

## Why this matters

Each \`print\` produces its own line, and the interpreter carries out the instructions from top to bottom. So the order of your three instructions decides the order of the three output lines. If you write them in the wrong order, the program is still perfectly legal Python. It simply does the wrong thing. That difference between *illegal* and *wrong* will come back many times.

## Predict first

Before you write anything, answer this for yourself. If you swapped the first and second instructions, would the program fail? Or would it run happily and produce the wrong output? Decide first, then try it and check.`,
          starterCode: `print("Loading the data.")
`,
          hint: "You need three lines of code. Each one is a complete print instruction. Write them in the same order you want the output to appear.",
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
      "Showing Text on the Screen",
      "The print function in detail, and the rules Python uses for text.",
      [
        {
          type: "lesson",
          title: "Inside the print Function",
          description: "Calling a function, giving it arguments, and controlling the line breaks it makes.",
          instructions: `## A name for what you have been doing

You have written \`print("Ready to begin.")\` and watched text appear. Now it is time to name the parts, because these names are used all the time from here on.

\`print\` is a **function**: a named job that Python already knows how to do. Writing the name and then a pair of brackets is called **calling** the function. The round brackets \`( )\` are also called parentheses. They are not decoration. They turn a name into an order to *do the job now*.

The values you put inside the brackets are called **arguments**. They are the details the function needs to do its job. In \`print("Ready to begin.")\` there is one argument: the text \`Ready to begin.\`.

> **Key idea**
> A function call has three parts: the name of the function, a pair of brackets, and zero or more arguments inside them. \`print\` names the job, \`()\` does it, and the arguments give the details.

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

This is a small but genuinely useful tool. It is how you put empty space in your output.

## Calling print with several arguments

You can give more than one argument. Separate them with commas. Python shows them all on one line, with a single space between each one:

\`\`\`python
print("Total", 42, "items")
\`\`\`

produces:

\`\`\`text
Total 42 items
\`\`\`

Notice three things. The arguments appeared in the order you gave them. Python added a space between them that you did not type. And \`42\` was written without quotation marks, but it still appeared. The reason for that difference is the subject of the next stage.

A common early mistake is to add your own spaces as well:

\`\`\`python
print("Total ", 42, " items")
\`\`\`

which produces:

\`\`\`text
Total  42  items
\`\`\`

Now there are two spaces on each side of the number: the one you typed inside the quotation marks, and the one Python adds between arguments. If your output has extra spaces you cannot explain, this is usually the reason.

## Each print starts a new line

Normally every \`print\` call ends by moving to a new line. That is why three \`print\` calls produced three lines in the last exercise.

You can change this with \`end\`. It says what to put at the end instead of a line break:

\`\`\`python
print("Loading", end="")
print("...")
\`\`\`

produces a single line:

\`\`\`text
Loading...
\`\`\`

The first call ended with nothing at all, so the output of the second call continued on the same line. You will not need \`end\` often. Knowing it exists explains why output sometimes joins together when you did not expect it.

## Predict before you continue

What does this program show, and on how many lines?

\`\`\`python
print("a", "b")
print("c")
print()
print("d", "e", "f")
\`\`\`

Work it out before you run it. The answer is four lines: \`a b\`, then \`c\`, then an empty line, then \`d e f\`. The first and last lines each hold several arguments joined by single spaces. The empty \`print()\` gives a line with nothing on it.

## Summary

Calling a function means writing its name and then a pair of brackets. Arguments go inside the brackets, separated by commas. \`print\` shows its arguments on one line, separated by single spaces, and then moves to a new line unless you tell it otherwise.`,
        },
        {
          type: "lesson",
          title: "Strings and Quotation Marks",
          description: "How Python tells text apart from everything else, and what to do when your text holds a quotation mark.",
          instructions: `## Why the quotation marks are there

In \`print("Ready to begin.")\`, the quotation marks are doing real work. They mark where a piece of text begins and where it ends.

A piece of text in Python is called a **string**. The name is old. It simply means a line of characters, one after another. The quotation marks are not part of the string. They are the boundary marks that tell the interpreter "the string starts here" and "the string stops here".

This matters because a program holds two very different kinds of word. Some words are orders to Python, like \`print\`. Others are data for the program to work with, like \`Ready to begin.\`. Quotation marks are how you keep them apart.

See what happens without them:

\`\`\`python
print("hello")
\`\`\`

Python shows the five characters \`hello\`. But if you wrote \`print(hello)\`, Python would show nothing. It would look for something *named* \`hello\`, fail to find it, and stop with an error. The quotation marks change the meaning completely. With them, \`hello\` is data. Without them, it is a name.

> **Key idea**
> Quotation marks turn characters into data. Without them, Python reads the same characters as a name and goes looking for something with that name.

## Single or double quotes

Python accepts both \`'\` and \`"\` as string boundaries. These two lines do exactly the same thing:

\`\`\`python
print("Consistent")
print('Consistent')
\`\`\`

The only rule is that a string must end with the same kind of quotation mark it started with. \`"mismatched'\` is not a valid string.

Having two choices is not a waste. It solves a real problem.

## When the text itself holds a quote

Suppose you want to show this line:

\`\`\`text
It's ready.
\`\`\`

If you try to build that string with single quotes, the apostrophe ends the string too early. The rest of the line then makes no sense to Python. The answer is to use the other kind of quotation mark as the boundary:

\`\`\`python
print("It's ready.")
\`\`\`

The apostrophe is now just an ordinary character inside a double-quoted string, so it has no special meaning.

The same trick works the other way round. To show a sentence that holds double quotes, wrap it in single quotes:

\`\`\`python
print('She said "later" and left.')
\`\`\`

which produces:

\`\`\`text
She said "later" and left.
\`\`\`

## When you need both

Sometimes a string holds both kinds of quotation mark. Then you need a **backslash**, written \`\\\`. It tells Python that the very next character is ordinary data, not a boundary:

\`\`\`python
print("It's labelled \\"fragile\\" on the box.")
\`\`\`

which produces:

\`\`\`text
It's labelled "fragile" on the box.
\`\`\`

The backslashes are notes to the interpreter about how to read your source code. They are not part of the string, so they do not appear in the output. This is called **escaping** a character.

One escape is worth learning by heart now. \`\\n\` means "start a new line here". It lets a single string cover several output lines:

\`\`\`python
print("First line\\nSecond line")
\`\`\`

produces:

\`\`\`text
First line
Second line
\`\`\`

## A difference to remember

There is a difference between a string and the way it looks on the screen. The string in the last example holds a newline character. When it is printed, that character becomes a real line break. You cannot see the character itself. You see what it does.

That gap between a value and its printed appearance comes back in several later modules, and it confuses many learners. Keep it in mind. What a value *is* and how it *looks when shown* are two separate questions.

## Predict before you continue

What does this show?

\`\`\`python
print('The sign said "closed".')
\`\`\`

The output is \`The sign said "closed".\` The double quotes appear because the boundaries of the string are single quotes. So the double quotes inside are ordinary characters.

## Summary

A string is a line of characters marked off by matching quotation marks. Use whichever quote character is not inside your text. When both appear inside, escape with a backslash. \`\\n\` puts in a line break.`,
        },
        {
          type: "exercise",
          title: "Predict Then Reproduce",
          description: "Work out what a short program shows, then write one that matches it.",
          instructions: `## The problem

Read this program carefully. Do not run it yet.

\`\`\`text
print("A", "B")
print()
print("C")
\`\`\`

Before you do anything else, decide how many lines it shows and exactly what is on each line.

## Your task

Write a program that produces that same output, and one extra line at the end that reads \`Done\`.

## Expected output

\`\`\`text
A B

C
Done
\`\`\`

## Requirements

1. Four lines in total, and one of them is empty.
2. The first line must come from a single \`print\` that receives **two** arguments.
3. The last line is \`Done\`.

## Guidance

The first line is \`A B\` with exactly one space. That space comes from \`print\`, not from anything you type inside the strings.

The second line is empty because \`print()\` with no arguments still ends its line.

If your prediction did not match the output, find out exactly which of those two facts you had wrong. That is worth more than getting it right the first time.`,
          starterCode: `print("A", "B")
`,
          hint: "Four print calls. The first takes two arguments and lets Python add the space. The second takes none. The third and fourth take one each.",
          tests: [
            {
              expectedOutput: "A B\n\nC\nDone",
              description: "All four lines appear, with a single space in the first line and an empty second line",
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
          description: "Choose quotation marks that let a sentence hold an apostrophe and a quoted phrase.",
          instructions: `## The problem

Write a program that shows these two lines exactly:

\`\`\`text
It's a quiet morning.
The label read "handle with care".
\`\`\`

## Requirements

1. Use two \`print\` instructions.
2. The first line holds an apostrophe in \`It's\`.
3. The second line holds double quotation marks around \`handle with care\`.
4. Both lines must match exactly, including the full stops.

## Guidance

Each line holds one kind of quotation mark, so neither line needs a backslash. For each line, choose the *other* kind of quotation mark as the boundary of the string.

Look carefully at where the full stop sits on the second line. It is outside the closing double quote, right at the end of the sentence.

## Constraints

Do not use \`\\n\` to make both lines from a single \`print\`. This exercise is about choosing quotation marks, so use one \`print\` for each line.`,
          starterCode: `print("")
print("")
`,
          hint: "The boundary of a string must be a quote character that does not appear inside the text. For a line with an apostrophe, use double quotes as the boundary. For a line with double quotes, use single quotes.",
          tests: [
            {
              expectedOutput: "It's a quiet morning.\nThe label read \"handle with care\".",
              description: "Both lines appear exactly, with the apostrophe and the double-quoted phrase kept",
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

Read the target carefully. There are five lines in total: three lines with text and two empty lines. One empty line comes after \`Report\`, and one comes after \`Items 7 counted\`.

## Requirements

1. The middle line must come from a single \`print\` call with **three arguments**: the string \`Items\`, the number \`7\` written without quotation marks, and the string \`counted\`.
2. The empty lines must come from calling \`print()\` with no arguments.
3. There must be exactly one space between \`Items\` and \`7\`, and exactly one between \`7\` and \`counted\`.

## Guidance

Remember that Python already puts one space between arguments. If you type spaces inside your strings as well, you will get two spaces, and the check will fail.

## Constraints

Do not build the middle line by typing \`"Items 7 counted"\` as one string. The point of the exercise is to pass three separate arguments and let \`print\` join them.`,
          starterCode: `print("Report")
`,
          hint: "Five print calls in total. Two of them are print() with nothing inside. For the middle line, write print(\"Items\", 7, \"counted\") and let Python add the spaces.",
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
      "Writing notes for human readers, and learning to read Python's error messages without fear.",
      [
        {
          type: "lesson",
          title: "Comments: Notes for People",
          description: "Text that the interpreter ignores on purpose, and what it is really for.",
          instructions: `## Text that does not run

Sometimes you want to write something in your source code for a person, not for the interpreter. Python gives you the \`#\` character for this. Everything from a \`#\` to the end of that line is a **comment**, and the interpreter skips it completely.

\`\`\`python
# This line is ignored completely.
print("This line runs.")
\`\`\`

The output is only:

\`\`\`text
This line runs.
\`\`\`

A comment can also come after code on the same line:

\`\`\`python
print("Totals")  # a heading for the section below
\`\`\`

The \`print\` still runs. The note after \`#\` is ignored.

## What comments are for

Beginners are often told to comment their code. Then they write comments like this:

\`\`\`python
# print the total
print(total_cost)
\`\`\`

That comment adds nothing. It says in English exactly what the code already says in Python. Now there are two things to keep correct instead of one. When the code changes and the comment does not, the comment becomes a lie.

Useful comments explain what the code cannot say for itself:

- **Why** a choice was made, when the reason is not clear from the code.
- Where a value came from, if the value looks strange.
- A warning about something surprising.

\`\`\`python
# Prices are stored in paisa, as whole numbers, so that adding many
# prices does not create small rounding mistakes.
price_in_paisa = 1299
print(price_in_paisa)
\`\`\`

That comment tells a future reader something the code truly does not say.

> **Key idea**
> A comment should explain what the code cannot. If a comment only repeats the line below it in English, delete it and use that effort to choose a clearer name instead.

## Turning code off with a comment

Comments have a second, very practical use. While you are hunting for a problem, you can switch a line off by putting \`#\` in front of it:

\`\`\`python
print("step one")
# print("step two")
print("step three")
\`\`\`

The middle line is now dead, and the output is \`step one\` then \`step three\`. This is a quick way to test whether one line is causing some behaviour. You will use this tool often once your programs are longer than a few lines.

## A note on style

Write comments as full sentences, with normal capital letters. Leave a space after the \`#\`. These are habits rather than rules — Python accepts \`#no space\` — but code that looks the same everywhere is easier to read. You will read your own code far more often than you expect.

## Summary

\`#\` marks the rest of a line as a comment, and the interpreter ignores it. Use comments to record reasons and warnings, not to repeat the code. Switching a line off with \`#\` is a fast way to test what that line does.`,
        },
        {
          type: "lesson",
          title: "When Python Refuses to Run",
          description: "Syntax errors, what the message is telling you, and how to read it calmly.",
          instructions: `## Two ways a program can fail

Remember the steps of the interpreter. First it checks that your code is *arranged* legally. Only then does it start carrying out instructions. This gives two different points of failure, and they feel very different when you meet them.

A **syntax error** means the arrangement itself is not legal Python. The interpreter could not even start. Nothing runs at all, not even the lines above the mistake.

A **runtime error** means the arrangement was fine, so the program started, but something went wrong while an instruction was being carried out. Everything before that point has already happened.

This module looks at the first kind. Runtime errors get a full treatment later, once your programs do enough for them to happen.

## What a syntax error looks like

Here is a program with a missing closing bracket:

\`\`\`text
print("Hello"
\`\`\`

Python reports something close to this:

\`\`\`text
Line 1: SyntaxError: '(' was never closed
\`\`\`

The message gives you three pieces of information, and each one is useful:

1. **Where.** A line number. This is where Python *noticed* the problem. It is not always where you *made* it. There is more on this below.
2. **What kind.** \`SyntaxError\` tells you the arrangement was wrong, so no part of the program ran.
3. **The detail.** \`'(' was never closed\` is an exact description you can act on.

## Read the message instead of fearing it

Error messages look frightening mostly because they are new to you. In fact they are the most helpful output your program can give you. They are a free report, produced at once, that tells you where to look.

The useful habit is a simple routine:

1. Read the last line first. It names the kind of error and describes it.
2. Look at the line number it reports.
3. If that line looks fine, check the line *above* it.

Step 3 is not a superstition. Some mistakes can only be seen once Python has read further. A missing closing bracket on line 4 may only be reported at line 5, because Python kept reading and hoped the bracket was still coming.

\`\`\`python
print("first")
print("second")
\`\`\`

That program is fine. Now imagine you delete the last \`)\` from line 2. Python reaches the end of the file still waiting for it, and reports the problem at the end instead of at line 2.

## Three syntax errors you will meet this week

**A missing closing quotation mark.** The string never ends:

\`\`\`text
print("unterminated)
\`\`\`

Python reports an unterminated string. The clue is that the closing bracket has been swallowed into the string.

**Quotation marks that do not match.** A string opens with one kind and closes with the other:

\`\`\`text
print('mismatched")
\`\`\`

Python is still waiting for a closing \`'\`.

**A missing bracket.** As shown above: \`'(' was never closed\`.

All three have the same cause. Something that must come in pairs was not paired. When you see a \`SyntaxError\`, count your pairs first: quotes, then brackets.

> **Key idea**
> A \`SyntaxError\` means nothing ran. When you see one, do not look for a problem in your thinking. Look for a character that is missing, extra, or of the wrong kind.

## Errors are not a judgement on you

Every working programmer makes syntax errors every day. They are not a sign that you cannot do this. They are a sign that you are typing. The difference between a beginner and an experienced programmer is not that one makes errors and the other does not. It is that one reads the message and fixes it in fifteen seconds, while the other feels afraid and starts changing things without a plan.

Aim to be the first kind. Read the message. Count the pairs. Fix the character.

## Predict before you continue

Which of these two programs gives a syntax error, and what does the other one do?

\`\`\`python
print("a")
print("b")
\`\`\`

\`\`\`text
print("a"
print("b")
\`\`\`

The first is fine and prints two lines. The second has a bracket on its first line that is never closed, so **nothing** runs, not even \`a\`. That last point is the one to remember.

## Summary

A syntax error means the arrangement of the code is illegal and no part of it ran. The message gives you a line number, a kind, and a description. Read the last line, check the reported line, then the line above it, and count your pairs.`,
        },
        {
          type: "exercise",
          title: "Repair a Broken Program",
          description: "Find and fix the syntax errors that stop a short program from running at all.",
          instructions: `## The problem

The program in the editor should show these three lines:

\`\`\`text
System check
All modules present
Ready
\`\`\`

It does not run at all. It holds **two** syntax errors.

## Your task

Repair the program so that it runs and produces exactly the output above. Do not rewrite it from the beginning. Find the exact characters that are wrong and correct them.

## Guidance

Press **Run** first and read the error message. Fix the problem it reports, then run again. The second error will only be reported once the first one is gone. This is normal. Python stops at the first arrangement problem it finds, so errors often appear one at a time.

Remember the checklist for a \`SyntaxError\`: count the pairs. Every opening quotation mark needs a matching closing one of the same kind, and every opening bracket needs a closing one.

## Requirements

1. The output must be exactly the three lines shown.
2. Keep the three \`print\` calls and their order.`,
          starterCode: `print("System check")
print("All modules present)
print("Ready"
`,
          starterIsBroken: true,
          hint: "Line 2 opens a string that is never closed, and that swallows the rest of the line. Line 3 opens a bracket that is never closed. Fix one, run again, then fix the other.",
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
          description: "Tell the difference between code Python rejects and code Python accepts that does the wrong thing.",
          instructions: `## The problem

The program in the editor runs without any trouble. Python reports no errors at all. Even so, it produces the wrong output.

At the moment it shows:

\`\`\`text
Second
First
\`\`\`

It should show:

\`\`\`text
First
Second
Third
\`\`\`

## Your task

Correct the program so that it produces the required output.

## Requirements

1. Three lines of output, in the order \`First\`, \`Second\`, \`Third\`.
2. Use one \`print\` call for each line.

## Why this exercise exists

There is an important difference between a program Python *refuses to run* and a program Python *runs happily while doing the wrong thing*. The first tells you about itself with an error message. The second says nothing. The only way to catch it is to compare what the program produced with what you wanted.

Notice also that one line of the starter code has a \`#\` in front of it. A line with \`#\` in front is invisible to the interpreter, so it adds nothing to the output. That is a third thing to check when a line seems to do nothing: perhaps it is not running at all.

> **Key idea**
> A program with no error message is not always a correct program. "It ran" and "it is right" are two separate claims, and only the second one matters.`,
          starterCode: `print("Second")
print("First")
# print("Third")
`,
          hint: "Two problems: the first two lines are in the wrong order, and the third line is switched off by a #, so it never runs. Swap the first two lines and remove the # from the third.",
          tests: [
            {
              expectedOutput: "First\nSecond\nThird",
              description: "All three lines print in the correct order, with the commented line switched back on",
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
      "Reading code before you run it, and the small careful loop that all programming rests on.",
      [
        {
          type: "lesson",
          title: "Predicting Output",
          description: "Why deciding what you expect before you run code is the fastest way to learn.",
          instructions: `## A habit to build straight away

When you meet a piece of code you do not know, you can do one of two things. You can run it and see. Or you can decide what you expect first, then run it and compare.

The second way takes about ten extra seconds, and it is worth far more. The reason is easy to miss. Running code tells you what the code does. *Predicting* code tells you whether your idea of the language is correct.

If your prediction matches, you have proved your understanding. If it does not match, you have found an exact gap in your knowledge at the best possible moment to close it. Without a prediction, a surprising result just passes by, and you learn nothing.

## Tracing a program by hand

**Tracing** means walking through a program one instruction at a time and writing down what happens at each step, as if you were the interpreter.

Take this program:

\`\`\`python
print("Start")
print()
print("Middle", "of", "the", "run")
print("End")
\`\`\`

Trace it:

1. Line 1 shows \`Start\` and moves to a new line.
2. Line 2 has no arguments, so it shows nothing and moves to a new line. The result is an empty line.
3. Line 3 has four arguments. They are shown in order, separated by single spaces, so the line reads \`Middle of the run\`.
4. Line 4 shows \`End\`.

The complete output:

\`\`\`text
Start

Middle of the run
End
\`\`\`

That amount of care looks like too much for a four-line program. It is. The point is to build the habit while the programs are small and tracing is easy. Then the habit is ready when the programs are large and tracing is the only thing that works.

## Predicting output with a trap in it

Try this one. Decide what it shows before you read on.

\`\`\`python
print("Line one")
# print("Line two")
print("Line", "three")
\`\`\`

The answer is two lines: \`Line one\` and \`Line three\`. The middle instruction is a comment, so it never runs. The last instruction has two arguments, and \`print\` joins them with a single space.

If you predicted three lines, you have just learned something exact about comments. A quiet read-through would not have taught you that.

## Every character counts

One more example, and this one is about being exact:

\`\`\`python
print("a", "b")
print("a" , "b")
\`\`\`

Both lines produce \`a b\`. The extra space before the comma on the second line is in the *source code*, not inside a string, and Python ignores spaces between the parts of an instruction. Only the spaces *inside* quotation marks are data.

That difference — between spaces that are part of your data and spaces that are only part of how you laid out your code — is worth being clear about now. It removes a whole group of problems later.

## Summary

Predict, then run, then compare. When the prediction is wrong, find the exact reason before you move on. Trace small programs line by line while tracing is still easy.`,
        },
        {
          type: "lesson",
          title: "The Edit-Run-Observe Cycle",
          description: "The small, fast loop that experienced programmers repeat hundreds of times a day.",
          instructions: `## How programs are really written

Beginners often imagine that a good programmer thinks carefully, types a finished program, and runs it once with success. That is not what happens. What happens is a tight loop:

1. **Edit.** Make one small change.
2. **Run.** Run the program at once.
3. **Observe.** Compare what happened with what you expected.

Then repeat. An experienced programmer goes round this loop all the time, often every few seconds. The changes are much smaller than a beginner expects.

## Why small steps win

The reason is practical. Suppose you write twenty lines and then run them for the first time, and the output is wrong. The mistake could be in any of the twenty lines. Now suppose you write one line, run it, and the output is wrong. The mistake is in that one line.

The cost of finding a mistake grows much faster than the amount of code you wrote before you looked. Working in small steps keeps that cost near zero.

> **Key idea**
> Run your program more often than feels necessary. The purpose is not to prove that it works. The purpose is to keep the amount of unchecked code small, so that any problem has an obvious cause.

## What "observe" really means

The third step is the one people skip. Running the program and glancing at the output is not observing. Observing means comparing the real output with an exact expectation, character by character where that matters.

Think of a program that should print \`Total: 42\` but prints \`Total:  42\` instead. A quick glance says "yes, that looks right". A careful comparison catches the double space. Later in this course, automatic tests will do this comparison for you, exactly and without getting tired. But the habit of caring about the difference must be yours.

## Working this way in the exercises

Every exercise in this course gives you two buttons.

**Run** runs your program and shows its output. Use it constantly. It is free, it is fast, and there is no penalty for pressing it.

**Check** runs your program against the tests of the exercise and reports which tests passed. When a test fails, you are shown the input that was used, the output that was expected, and the output your program really produced. Read all three. The difference between the last two is the whole diagnosis.

You may press either button as many times as you like. Nothing is graded on the number of tries. The exercise is finished when every test passes.

## When you are stuck

Here is a short list, in order. It is worth coming back to for the rest of the course.

1. Read the error message, if there is one. Its last line names the problem.
2. If there is no error, compare the real output with the expected output character by character.
3. Make the program smaller. Switch lines off with \`#\` until the program is as small as it can be while still showing the problem.
4. Add a \`print\` to show a value you are not sure about.
5. Read the requirements again. A surprising number of "broken" programs are correct programs that solve a slightly different problem.

Notice that "start again from the beginning" and "change things until it works" are not on the list. Both feel useful. Neither is.

## Summary

Edit a little, run at once, and compare the result with an exact expectation. Keep the unchecked part of your program small. When you are stuck, work through the checklist instead of making random changes.`,
        },
        {
          type: "exercise",
          title: "Produce an Exact Layout",
          description: "Copy an exact layout of several lines, with the spaces and blank lines in the right places.",
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
4. The empty lines appear where they are shown: after the heading, and after \`Visits: 3\`.

## Guidance

Work on one line at a time, and run after each new line instead of writing all six and hoping. That is the edit-run-observe cycle used on a problem small enough to watch it working.

There is more than one correct way to produce \`Visits: 3\`. You could write it as one string, or pass two arguments and let \`print\` add the space. Either way is accepted here. But if you choose two arguments, remember not to type a space inside the string as well.

## Constraints

Spaces at the very end of a line are ignored by the checker. Everything else is compared exactly.`,
          starterCode: `print("=== Field Notes ===")
`,
          hint: "Six print calls: four with text, two with nothing inside the brackets. Build them one at a time and press Run after each one.",
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
          description: "Put printing, quotation marks, escapes, and comments together in one small program.",
          instructions: `## The problem

This checkpoint uses everything in Module 1: calling \`print\`, choosing quotation marks, escaping a character, making blank lines, and writing a comment.

Write a program that produces exactly this output:

\`\`\`text
Program: Field Logger
Author: "unattributed"
Status: it's running

Lines of output: 5
\`\`\`

## Requirements

1. Five lines of output in total: four with text, and one empty line before the last line.
2. Line 2 shows \`Author: "unattributed"\` with visible double quotation marks around the word.
3. Line 3 shows \`Status: it's running\` with a visible apostrophe.
4. The last line comes from a single \`print\` call with **two arguments**: the string \`Lines of output:\` and the number \`5\` written without quotation marks.
5. The program must hold at least one comment line that starts with \`#\`.

## Guidance

Lines 2 and 3 each hold one kind of quotation mark. So each one can be written by choosing the other kind as the boundary. No backslash is needed, although using one is not wrong.

The comment has no effect on the output. It is there because part of writing a program is leaving a note for the next reader, and that reader is often you.

## Constraints

The output is compared exactly. Check the colons, the spaces after them, and the position of the blank line before you submit.`,
          starterCode: `# Summary card for the Field Logger program
print("Program: Field Logger")
`,
          hint: "Line 2 holds double quotes, so wrap that string in single quotes. Line 3 holds an apostrophe, so wrap that string in double quotes. The last line is print(\"Lines of output:\", 5) with no space typed before the closing quote.",
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

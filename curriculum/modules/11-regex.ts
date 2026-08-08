import { module, lesson, type ModuleSource } from "../types.ts"

const moduleEleven: ModuleSource = module(
  "Regular Expressions and Text Processing",
  "Describing patterns in text: matching, checking, taking out, and replacing, and knowing when an ordinary string method is the better answer.",
  [
    lesson(
      "Why Regular Expressions Exist",
      "The kind of question string methods cannot answer, and the notation that can.",
      [
        {
          type: "lesson",
          title: "The Problem Patterns Solve",
          description: "A real task that string methods handle badly.",
          instructions: `## A task that grows out of hand

Suppose you must find every reference code in a piece of text. A code is three capital letters, a hyphen, and four digits: \`ABC-1234\`.

With the tools you have, you would split the text into words. Then, for each word, you would check that it is eight characters long, that the first three are capital letters, that the fourth is a hyphen, and that the last four are digits:

\`\`\`python
def looks_like_code(word):
    if len(word) != 8:
        return False
    if not word[:3].isalpha() or not word[:3].isupper():
        return False
    if word[3] != "-":
        return False
    return word[4:].isdigit()


text = "Refs ABC-1234 and XY-99 and QRS-0001 here"
found = [word for word in text.split() if looks_like_code(word)]
print(found)
\`\`\`

\`\`\`text
['ABC-1234', 'QRS-0001']
\`\`\`

It works. But it is twelve lines to describe one simple shape, and it is fragile. It fails for a code followed by a full stop, because splitting on spaces leaves the punctuation attached to the word.

Now imagine the rule changes to "three or four letters" and "two to six digits". Every check has to be rewritten.

## A notation for shapes of text

A **regular expression**, usually shortened to *regex*, is a small language for describing patterns in text. The same rule above is written like this:

\`\`\`python
import re

text = "Refs ABC-1234 and XY-99 and QRS-0001 here"
print(re.findall(r"[A-Z]{3}-[0-9]{4}", text))
\`\`\`

\`\`\`text
['ABC-1234', 'QRS-0001']
\`\`\`

One line. Read it piece by piece. \`[A-Z]\` means one capital letter. \`{3}\` means exactly three of them. \`-\` is a real hyphen. \`[0-9]\` is one digit. \`{4}\` means exactly four.

It is also sturdier. It finds codes anywhere in the text, whatever punctuation sits around them, because it never split on spaces in the first place.

## The trade

Regex is dense. \`[A-Z]{3}-[0-9]{4}\` cannot be read at all until you know the notation, and complicated patterns are genuinely hard to read even then.

What you gain is that a pattern which would take dozens of lines of conditions becomes one expression, and that expression can be changed in seconds when the rule changes.

The judgement to build is *when* to use it. Regex is right for questions about the shape of text. It is wrong for questions that an ordinary string method already answers, and the last lesson of this module looks at that border.

> **Key idea**
> A regular expression describes the *shape* of a piece of text. Use one when the shape is the question, and a string method when it is not.

## Raw strings

Regex patterns are written as **raw strings**, marked with an \`r\` before the quotation mark:

\`\`\`python
print("a\\tb")
print(r"a\\tb")
\`\`\`

\`\`\`text
a	b
a\\tb
\`\`\`

In an ordinary string, a backslash starts an escape: \`\\t\` becomes a tab and \`\\n\` becomes a newline. In a raw string, a backslash is only a backslash.

This matters because regex uses backslashes heavily for its own purposes. Without a raw string, \`"\\d"\` would first be read by Python and only then by the regex engine. That leads to confusing failures and, sometimes, to patterns that quietly mean something else.

The rule is simple: **always write regex patterns as raw strings.** There is no case where it does harm.

## The re module

Pattern matching lives in the \`re\` module:

\`\`\`python
import re

text = "Order ABC-1234 shipped"
match = re.search(r"[A-Z]{3}-[0-9]{4}", text)

if match:
    print(f"Found: {match.group()}")
else:
    print("No code found")
\`\`\`

\`\`\`text
Found: ABC-1234
\`\`\`

\`re.search\` looks for the pattern anywhere in the text. It gives back a **match object** if it finds one, and \`None\` if it does not.

That \`None\` is why the \`if\` is needed. Calling \`.group()\` on \`None\` raises \`AttributeError: 'NoneType' object has no attribute 'group'\`. It is one of the most common regex mistakes, and from Module 7 you will recognise it as "something gave me nothing".

\`match.group()\` gives back the text that matched.

## Summary

A regular expression describes the shape of text in a short notation, and it replaces long chains of conditions. Patterns are written as raw strings, so that backslashes reach the regex engine untouched. \`re.search\` finds a pattern anywhere and gives \`None\` when there is no match, so you must check before using the result.`,
        },
        {
          type: "lesson",
          title: "Character Classes and Quantifiers",
          description: "Describing which characters are allowed, and how many of them.",
          instructions: `## Plain characters

The simplest pattern is plain text, which matches exactly itself:

\`\`\`python
import re

print(bool(re.search(r"cat", "the cat sat")))
print(bool(re.search(r"cat", "the dog sat")))
print(bool(re.search(r"cat", "concatenate")))
\`\`\`

\`\`\`text
True
False
True
\`\`\`

The third one is worth noticing. \`cat\` appears inside \`concatenate\`, and \`search\` finds patterns anywhere. Anchors, later in this lesson, control that.

## Character classes

Square brackets mean "any one character from this set":

\`\`\`python
import re

print(re.findall(r"[aeiou]", "programming"))
print(re.findall(r"[0-9]", "a1b22c"))
\`\`\`

\`\`\`text
['o', 'a', 'i']
['1', '2', '2']
\`\`\`

A hyphen inside the brackets means a range. \`[a-z]\` is any small letter, \`[A-Z]\` any capital letter, \`[0-9]\` any digit. Ranges can be combined: \`[a-zA-Z0-9]\` is any letter or digit.

A \`^\` at the start turns the set round:

\`\`\`python
import re

print(re.findall(r"[^0-9]", "a1b2"))
\`\`\`

\`\`\`text
['a', 'b']
\`\`\`

\`[^0-9]\` means "any character that is not a digit".

## Short forms

Common sets have short forms:

\`\`\`python
import re

text = "Code A7 costs 30"
print(re.findall(r"\\d", text))
print(re.findall(r"\\w+", text))
print(re.findall(r"\\s", text))
\`\`\`

\`\`\`text
['7', '3', '0']
['Code', 'A7', 'costs', '30']
[' ', ' ', ' ']
\`\`\`

\`\\d\` is a digit, the same as \`[0-9]\`. \`\\w\` is a "word character": a letter, a digit, or an underscore. \`\\s\` is whitespace: a space, a tab, or a newline.

Their capital versions mean the opposite. \`\\D\` is any non-digit, \`\\W\` any non-word character, \`\\S\` anything that is not whitespace.

A dot matches **any character except a newline**:

\`\`\`python
import re

print(re.findall(r"c.t", "cat cot c t cut"))
\`\`\`

\`\`\`text
['cat', 'cot', 'c t', 'cut']
\`\`\`

The dot is the most over-used piece of regex notation. It matches far more than people expect, including punctuation and digits. Prefer an exact class when you know what you want.

To match a real dot, escape it. \`\\.\` means a full stop, not "any character".

## Quantifiers

A quantifier says how many times the thing before it may repeat:

\`\`\`python
import re

print(re.findall(r"\\d+", "a1 bb22 c333"))
print(re.findall(r"\\d*", "ab"))
print(re.findall(r"colou?r", "color colour"))
\`\`\`

\`\`\`text
['1', '22', '333']
['', '', '']
['color', 'colour']
\`\`\`

\`+\` means one or more. \`*\` means zero or more. \`?\` means zero or one, which makes the thing before it optional.

Look at the second result. \`\\d*\` matches an empty string, so it "finds" a match at every position. A pattern that can match nothing is usually a mistake. \`+\` is almost always what you meant.

Braces give exact counts:

\`\`\`python
import re

print(re.findall(r"\\d{4}", "1234 56 78901"))
print(re.findall(r"\\d{2,3}", "1 22 333 4444"))
\`\`\`

\`\`\`text
['1234', '7890']
['22', '333', '444']
\`\`\`

\`{4}\` is exactly four. \`{2,3}\` is two to three. \`{2,}\` is two or more.

Look closely at both results. \`78901\` gave \`7890\`: four digits were taken and the fifth was left. And \`4444\` gave \`444\`, taking three and leaving one. A quantifier takes what it can, and it does not require the text around it to end. Anchors fix that.

## Greedy matching

Quantifiers are **greedy**. They match as much as they can.

\`\`\`python
import re

text = "[first] and [second]"
print(re.findall(r"\\[.+\\]", text))
print(re.findall(r"\\[.+?\\]", text))
\`\`\`

\`\`\`text
['[first] and [second]']
['[first]', '[second]']
\`\`\`

The first pattern matched from the opening bracket all the way to the *last* closing bracket, swallowing the middle. Adding \`?\` after the quantifier makes it **lazy**, so it matches as little as it can.

This is one of the most common regex surprises. When a pattern matches far more than you wanted, greediness is usually the reason.

Note \`\\[\` and \`\\]\` as well. Square brackets are regex syntax, so matching real ones needs an escape.

> **Key idea**
> Quantifiers are greedy by default and take as much as they can. Add \`?\` after one to make it lazy. A pattern that matches more than you expected is usually a greediness problem.

## Characters that need escaping

These characters have a special meaning, so they must be escaped with a backslash to match themselves:

\`\`\`text
. ^ $ * + ? { } [ ] \\ | ( )
\`\`\`

\`\`\`python
import re

print(re.findall(r"\\d+\\.\\d+", "version 3.11 and 4"))
\`\`\`

\`\`\`text
['3.11']
\`\`\`

Writing \`\\d+.\\d+\` without escaping the dot would also match \`3x11\`, because an unescaped dot matches any character. That kind of mistake gives you a pattern that works on your examples and fails on real data.

## Summary

Character classes say which characters are allowed: \`[a-z]\`, \`[^0-9]\`, and the short forms \`\\d\`, \`\\w\`, \`\\s\`. Quantifiers say how many: \`+\`, \`*\`, \`?\`, and \`{n,m}\`. Quantifiers are greedy unless a \`?\` follows them. Escape the special characters when you mean them literally.`,
        },
        {
          type: "exercise",
          title: "Find Patterns in Text",
          description: "Use character classes and quantifiers to take three kinds of token out of a line.",
          instructions: `## The problem

Take three different kinds of token out of a line of text.

## Input

One line of text.

## Requirements

Using \`re.findall\`, show exactly three lines:

\`\`\`text
Numbers: ['12', '450', '7']
Words: ['Order', 'items', 'ref']
Codes: ['AB-12', 'XY-99']
\`\`\`

Where:

1. \`Numbers\` are runs of one or more digits.
2. \`Words\` are runs of one or more letters only, with no digits and no underscores.
3. \`Codes\` are exactly two capital letters, a hyphen, then exactly two digits.

## Example

Given \`Order 12 items ref AB-12 and 450 more XY-99 or 7\`, the output is:

\`\`\`text
Numbers: ['12', '12', '450', '99', '7']
Words: ['Order', 'items', 'ref', 'AB', 'and', 'more', 'XY', 'or']
Codes: ['AB-12', 'XY-99']
\`\`\`

Note that the digits inside the codes are still found by the number pattern, and the letters inside the codes are still found by the word pattern. The three searches are separate, and none of them rules out the others.

## Guidance

For words, \`\\w\` will not do, because it also includes digits and underscores. Use a class of letters only.

Write every pattern as a raw string.

## Constraints

Use \`re.findall\` three times. Print each result list directly, which gives the format with square brackets shown above.`,
          starterCode: `import re

text = input()
`,
          hint: "Numbers use r\"\\d+\". Words need a letters-only class such as r\"[A-Za-z]+\". Codes are r\"[A-Z]{2}-\\d{2}\". Assign each result to a variable first, because an expression inside an f-string cannot hold a backslash.",
          tests: [
            {
              input: "Order 12 items ref AB-12 and 450 more XY-99 or 7\n",
              expectedOutput:
                "Numbers: ['12', '12', '450', '99', '7']\nWords: ['Order', 'items', 'ref', 'AB', 'and', 'more', 'XY', 'or']\nCodes: ['AB-12', 'XY-99']",
              description: "All three kinds of token are found, and each search works on its own",
            },
            {
              input: "no tokens here\n",
              expectedOutput: "Numbers: []\nWords: ['no', 'tokens', 'here']\nCodes: []",
              description: "Patterns that match nothing give empty lists",
            },
            {
              input: "ZZ-00\n",
              expectedOutput: "Numbers: ['00']\nWords: ['ZZ']\nCodes: ['ZZ-00']",
              description: "A single code is also matched by the digit pattern and the letter pattern",
            },
            {
              input: "\n",
              expectedOutput: "Numbers: []\nWords: []\nCodes: []",
              description: "An empty line gives three empty lists",
            },
          ],
          solution: `import re

text = input()

numbers = re.findall(r"\\d+", text)
words = re.findall(r"[A-Za-z]+", text)
codes = re.findall(r"[A-Z]{2}-\\d{2}", text)

print(f"Numbers: {numbers}")
print(f"Words: {words}")
print(f"Codes: {codes}")
`,
        },
      ],
    ),

    lesson(
      "Anchors, Groups, and Validation",
      "Making a pattern cover the whole string, and pulling out the parts you need.",
      [
        {
          type: "lesson",
          title: "Anchors and Whole-String Matching",
          description: "The difference between finding a pattern and demanding one.",
          instructions: `## Searching finds patterns anywhere

\`\`\`python
import re

print(bool(re.search(r"\\d{4}", "1234")))
print(bool(re.search(r"\\d{4}", "abc1234xyz")))
\`\`\`

\`\`\`text
True
True
\`\`\`

Both are true, because \`search\` looks anywhere in the string. For finding things, that is exactly right. For **checking** input it is a disaster. A program that checks whether the input is a four-digit code would accept \`abc1234xyz\`.

## Anchors

An anchor fixes a pattern to a position instead of matching a character.

\`^\` means the start of the string. \`$\` means the end.

\`\`\`python
import re

print(bool(re.search(r"^\\d{4}$", "1234")))
print(bool(re.search(r"^\\d{4}$", "abc1234xyz")))
print(bool(re.search(r"^\\d{4}$", "12345")))
\`\`\`

\`\`\`text
True
False
False
\`\`\`

With both anchors, the pattern must account for the whole string. The last case fails because five digits cannot be exactly four with nothing left over.

## fullmatch

Python gives you a function that adds the anchors for you:

\`\`\`python
import re

print(bool(re.fullmatch(r"\\d{4}", "1234")))
print(bool(re.fullmatch(r"\\d{4}", "abc1234xyz")))
\`\`\`

\`\`\`text
True
False
\`\`\`

\`re.fullmatch\` requires the pattern to match the whole string. It does the same job as wrapping the pattern in \`^\` and \`$\`, and it is clearer, because the name of the function states the intention instead of hiding it inside the pattern.

There is also \`re.match\`, which anchors only at the start. It causes bugs often, because it accepts rubbish at the end: \`re.match(r"\\d{4}", "1234abc")\` succeeds. Prefer \`fullmatch\` for checking and \`search\` for finding.

> **Key idea**
> Use \`search\` to find a pattern inside text, and \`fullmatch\` to demand that the whole string is the pattern. Using \`search\` for checking accepts anything with the pattern buried inside it.

## Word boundaries

\`\\b\` matches the boundary between a word character and a character that is not part of a word:

\`\`\`python
import re

text = "cat concatenate cats"
print(re.findall(r"cat", text))
print(re.findall(r"\\bcat\\b", text))
\`\`\`

\`\`\`text
['cat', 'cat', 'cat']
['cat']
\`\`\`

The first found \`cat\` inside \`concatenate\` and inside \`cats\`. The second demanded a boundary on each side, so only the word on its own matched.

\`\\b\` matches a position, not a character, so it uses up nothing.

## Groups

Round brackets group part of a pattern, so that a quantifier applies to the whole group:

\`\`\`python
import re

print(bool(re.fullmatch(r"(ab)+", "ababab")))
print(bool(re.fullmatch(r"(ab)+", "aba")))
\`\`\`

\`\`\`text
True
False
\`\`\`

\`(ab)+\` means one or more repeats of \`ab\`. It does not mean \`a\` followed by one or more \`b\`.

## Groups that capture

Groups also **capture**. They remember what they matched, so you can fetch the parts:

\`\`\`python
import re

match = re.fullmatch(r"([A-Z]{3})-(\\d{4})", "ABC-1234")

if match:
    print(match.group(0))
    print(match.group(1))
    print(match.group(2))
    print(match.groups())
\`\`\`

\`\`\`text
ABC-1234
ABC
1234
('ABC', '1234')
\`\`\`

\`group(0)\` is the whole match. \`group(1)\` is the first group in brackets, numbered by the position of its opening bracket. \`groups()\` gives them all back as a tuple, which unpacks neatly:

\`\`\`python
import re

match = re.fullmatch(r"([A-Z]{3})-(\\d{4})", "ABC-1234")
prefix, number = match.groups()
print(f"prefix {prefix}, number {number}")
\`\`\`

\`\`\`text
prefix ABC, number 1234
\`\`\`

This answers a task that would otherwise need careful slicing. You check the shape and take out the parts in one operation.

## Named groups

Numbered groups become unreadable once there are more than two of them, and adding a group renumbers everything after it. Names fix both problems:

\`\`\`python
import re

pattern = r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})"
match = re.fullmatch(pattern, "2024-07-15")

if match:
    print(match.group("year"))
    print(match.group("day"))
    print(match.groupdict())
\`\`\`

\`\`\`text
2024
15
{'year': '2024', 'month': '07', 'day': '15'}
\`\`\`

\`(?P<name>...)\` gives a group a name. The notation is ugly, and it still earns its place. \`match.group("year")\` says what it fetches. \`match.group(1)\` does not.

\`groupdict()\` gives back every named group as a dictionary, and that is often exactly the structure you want to keep.

## Choosing between alternatives

\`|\` means "or". It matches either alternative:

\`\`\`python
import re

print(bool(re.fullmatch(r"cat|dog", "dog")))
print(re.findall(r"\\b(?:cat|dog)s?\\b", "one cat two dogs"))
\`\`\`

\`\`\`text
True
['cat', 'dogs']
\`\`\`

\`(?:...)\` is a **group that does not capture**. It groups the alternatives without remembering them. Use it when you need grouping but not the captured value, because it keeps the numbering of your real groups clean.

\`|\` comes very late in the order of operations, so \`^cat|dog$\` means "starts with cat, or ends with dog". That is almost certainly not what anyone wanted. Group the alternatives: \`^(?:cat|dog)$\`.

## Summary

\`^\` and \`$\` fix a pattern to the start and the end. \`fullmatch\` does both and says so in its name. \`\\b\` matches a word boundary. Round brackets group for quantifiers and capture the matched text, which you fetch by number, or by name with \`(?P<name>...)\`. \`|\` gives a choice and needs grouping.`,
        },
        {
          type: "exercise",
          title: "Validate an Identifier Format",
          description: "Use fullmatch to accept only strings that match an exact specification.",
          instructions: `## The problem

Write a checker for a booking reference.

## The format

A valid reference is:

1. Two or three capital letters.
2. A hyphen.
3. Exactly four digits.
4. Optionally, a hyphen followed by one capital letter.

Nothing else may appear, either before or after.

## Examples

\`\`\`text
AB-1234     valid
XYZ-0001    valid
AB-1234-C   valid
A-1234      invalid  (only one letter)
ABCD-1234   invalid  (four letters)
AB-123      invalid  (three digits)
AB-1234-c   invalid  (small letter at the end)
xAB-1234    invalid  (extra text before)
AB-1234x    invalid  (extra text after)
\`\`\`

## Requirements

1. Define \`is_valid(reference: str) -> bool\` using a single \`re.fullmatch\`.
2. Read one line and print exactly \`Valid\` or \`Invalid\`.

## Guidance

Use \`fullmatch\`, not \`search\`. With \`search\`, \`xAB-1234\` would be accepted, because the pattern appears inside it.

The optional ending is a group followed by \`?\`, which makes the whole group optional. Use a group that does not capture, since you do not need its value.

The number of letters is a range, written with braces.

## Constraints

Use exactly one regular expression. Do not check the parts with string methods.`,
          starterCode: `import re


def is_valid(reference: str) -> bool:
    return False


line = input()
print("Valid" if is_valid(line) else "Invalid")
`,
          hint: "The pattern is r\"[A-Z]{2,3}-\\d{4}(?:-[A-Z])?\" given to re.fullmatch. Wrap the result in bool(), so that the function returns a Boolean instead of a match object or None.",
          tests: [
            {
              input: "AB-1234\n",
              expectedOutput: "Valid",
              description: "Two letters and four digits is the basic valid form",
            },
            {
              input: "XYZ-0001\n",
              expectedOutput: "Valid",
              description: "Three letters are allowed as well",
            },
            {
              input: "AB-1234-C\n",
              expectedOutput: "Valid",
              description: "The optional capital letter at the end is accepted",
            },
            {
              input: "A-1234\n",
              expectedOutput: "Invalid",
              description: "One letter is below the smallest allowed number",
            },
            {
              input: "ABCD-1234\n",
              expectedOutput: "Invalid",
              description: "Four letters are more than the largest allowed number",
            },
            {
              input: "AB-123\n",
              expectedOutput: "Invalid",
              description: "Three digits do not meet the exact count",
            },
            {
              input: "AB-1234-c\n",
              expectedOutput: "Invalid",
              description: "A small letter at the end is refused",
            },
            {
              input: "xAB-1234\n",
              expectedOutput: "Invalid",
              description: "Text at the front is refused, because the whole string must match",
            },
            {
              input: "AB-1234x\n",
              expectedOutput: "Invalid",
              description: "Text at the end is refused, although re.match would have allowed it",
            },
          ],
          solution: `import re


def is_valid(reference: str) -> bool:
    """Return True when reference matches the booking format exactly."""
    return bool(re.fullmatch(r"[A-Z]{2,3}-\\d{4}(?:-[A-Z])?", reference))


line = input()
print("Valid" if is_valid(line) else "Invalid")
`,
        },
        {
          type: "exercise",
          title: "Extract Parts With Named Groups",
          description: "Capture the parts of a structured line and put them together again.",
          instructions: `## The problem

Read log lines and write them out in a different shape.

## The format

Each line looks like this:

\`\`\`text
2024-07-15 14:30 ERROR Disk almost full
\`\`\`

That is: a date as four digits, a hyphen, two digits, a hyphen, two digits; a space; a time as two digits, a colon, two digits; a space; a level made of capital letters; a space; and a message, which is the rest of the line.

## Requirements

1. Define \`parse_line(line: str) -> str\` that uses **named groups** to capture the date, the time, the level, and the message.
2. If the line does not match the format exactly, return \`Malformed\`.
3. Otherwise return the parts rearranged like this:

\`\`\`text
[ERROR] 15/07/2024 at 14:30 - Disk almost full
\`\`\`

Note that the date is reordered to day, month, year, with slashes.

4. Read one line and print the result.

## Examples

Given \`2024-07-15 14:30 ERROR Disk almost full\`, the output is the line above.

Given \`not a log line\`, the output is \`Malformed\`.

## Guidance

Name the groups \`year\`, \`month\`, \`day\`, \`hour\`, \`minute\`, \`level\`, and \`message\`. Then \`match.group("day")\` reads clearly, where \`match.group(3)\` would not.

For the message, match one or more of any character. It runs to the end of the line, so a greedy quantifier is right here.

Use \`fullmatch\`, and remember that it gives \`None\` when the line does not match. Check for that before you call \`.group\`.

## Constraints

Use named groups. Do not split the line on spaces.`,
          starterCode: `import re


def parse_line(line: str) -> str:
    return "Malformed"


print(parse_line(input()))
`,
          hint: "Build the pattern as r\"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2}) (?P<hour>\\d{2}):(?P<minute>\\d{2}) (?P<level>[A-Z]+) (?P<message>.+)\". Guard on match being None before you format anything.",
          tests: [
            {
              input: "2024-07-15 14:30 ERROR Disk almost full\n",
              expectedOutput: "[ERROR] 15/07/2024 at 14:30 - Disk almost full",
              description: "A well-formed line is read and reordered",
            },
            {
              input: "2023-01-02 09:05 INFO Started\n",
              expectedOutput: "[INFO] 02/01/2023 at 09:05 - Started",
              description: "Zeros at the front of the date and time are kept",
            },
            {
              input: "not a log line\n",
              expectedOutput: "Malformed",
              description: "A line that does not match the format is refused",
            },
            {
              input: "2024-07-15 14:30 error lowercase level\n",
              expectedOutput: "Malformed",
              description: "A level in small letters does not match the capital-letter class",
            },
            {
              input: "2024-7-15 14:30 WARN Short month\n",
              expectedOutput: "Malformed",
              description: "A one-digit month does not meet the exact digit count",
            },
          ],
          solution: `import re

PATTERN = (
    r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2}) "
    r"(?P<hour>\\d{2}):(?P<minute>\\d{2}) "
    r"(?P<level>[A-Z]+) (?P<message>.+)"
)


def parse_line(line: str) -> str:
    """Return the log line reformatted, or 'Malformed' if it does not match."""
    match = re.fullmatch(PATTERN, line)
    if match is None:
        return "Malformed"
    return (
        f"[{match.group('level')}] "
        f"{match.group('day')}/{match.group('month')}/{match.group('year')} "
        f"at {match.group('hour')}:{match.group('minute')} - {match.group('message')}"
    )


print(parse_line(input()))
`,
        },
      ],
    ),

    lesson(
      "Extraction and Substitution",
      "Finding every match, and rewriting text to follow a pattern.",
      [
        {
          type: "lesson",
          title: "findall, finditer, and sub",
          description: "Collecting every match, and replacing the text that matched.",
          instructions: `## Finding every match

\`re.findall\` gives back a list of every match, and the matches never overlap:

\`\`\`python
import re

text = "Costs 12, 450 and 7 pounds"
print(re.findall(r"\\d+", text))
\`\`\`

\`\`\`text
['12', '450', '7']
\`\`\`

With no groups in the pattern, it gives back the text that matched. With **one** group, it gives back what that group captured:

\`\`\`python
import re

text = "ABC-1234 and QRS-0001"
print(re.findall(r"[A-Z]{3}-(\\d{4})", text))
\`\`\`

\`\`\`text
['1234', '0001']
\`\`\`

The letters were matched but not returned, because a group was present, and \`findall\` reports groups instead of whole matches.

With **several** groups, each result is a tuple:

\`\`\`python
import re

text = "ABC-1234 and QRS-0001"
print(re.findall(r"([A-Z]{3})-(\\d{4})", text))
\`\`\`

\`\`\`text
[('ABC', '1234'), ('QRS', '0001')]
\`\`\`

This behaviour surprises people regularly. Adding a group to a \`findall\` pattern that already worked changes what comes back. When you need grouping without changing the result, use a group that does not capture: \`(?:...)\`.

## finditer

\`re.finditer\` gives back match objects instead of strings, so you also get positions and named groups:

\`\`\`python
import re

text = "ABC-1234 and QRS-0001"
for match in re.finditer(r"([A-Z]{3})-(\\d{4})", text):
    print(f"{match.group(0)} at {match.start()}, prefix {match.group(1)}")
\`\`\`

\`\`\`text
ABC-1234 at 0, prefix ABC
QRS-0001 at 13, prefix QRS
\`\`\`

Use \`findall\` when you want the text, and \`finditer\` when you need positions or several groups for each match.

## Replacing

\`re.sub\` replaces every match:

\`\`\`python
import re

text = "Call 555-0100 or 555-0199"
print(re.sub(r"\\d{3}-\\d{4}", "[redacted]", text))
\`\`\`

\`\`\`text
Call [redacted] or [redacted]
\`\`\`

Like every string operation, it gives back a new string. The original does not change.

A count limits how many are replaced:

\`\`\`python
import re

text = "a a a a"
print(re.sub(r"a", "b", text, count=2))
\`\`\`

\`\`\`text
b b a a
\`\`\`

## Using captured groups in the replacement

The replacement can refer to captured groups with \`\\1\`, \`\\2\`, or by name:

\`\`\`python
import re

text = "2024-07-15"
print(re.sub(r"(\\d{4})-(\\d{2})-(\\d{2})", r"\\3/\\2/\\1", text))
\`\`\`

\`\`\`text
15/07/2024
\`\`\`

The replacement is a raw string as well, because it holds backslashes.

Named groups are used with \`\\g<name>\`:

\`\`\`python
import re

pattern = r"(?P<first>\\w+) (?P<last>\\w+)"
print(re.sub(pattern, r"\\g<last>, \\g<first>", "Ada Lovelace"))
\`\`\`

\`\`\`text
Lovelace, Ada
\`\`\`

Reordering text like this with string methods would take several steps and careful counting of positions. As one substitution it is a single line that states the change directly.

## A function as the replacement

When the replacement depends on what was matched, pass a function. It receives the match object and gives back the replacement text:

\`\`\`python
import re


def double_number(match):
    return str(int(match.group()) * 2)


print(re.sub(r"\\d+", double_number, "a 3 b 10"))
\`\`\`

\`\`\`text
a 6 b 20
\`\`\`

This is a powerful combination. Regex finds the pieces, and ordinary Python decides what each piece becomes.

## Splitting

\`re.split\` splits on a pattern instead of a fixed string:

\`\`\`python
import re

text = "a1b22c333d"
print(re.split(r"\\d+", text))
\`\`\`

\`\`\`text
['a', 'b', 'c', 'd']
\`\`\`

This is useful when the separators vary. Note that a separator at the start or the end gives an empty string in the result, and you usually need to filter that out.

> **Key idea**
> \`findall\` gives back text, but its shape changes when the pattern has groups. \`sub\` gives back a new string, and it can use captured groups in its replacement, or hand the work to a function.

## Summary

\`findall\` collects matches, and returns groups instead of whole matches when the pattern has any. \`finditer\` gives match objects with positions. \`sub\` replaces matches and can use \`\\1\` or \`\\g<name>\` in the replacement, or take a function. \`re.split\` splits on a pattern.`,
        },
        {
          type: "lesson",
          title: "Keeping Patterns Maintainable",
          description: "When a regular expression is the wrong tool, and how to keep the right ones readable.",
          instructions: `## The temptation to use it everywhere

Regex is satisfying, and that is a danger. Once the notation feels familiar, it is tempting to reach for it all the time, even for jobs that an ordinary string method does better.

\`\`\`python
import re

text = "field notes"

print(bool(re.search(r"^field", text)))
print(text.startswith("field"))
\`\`\`

\`\`\`text
True
True
\`\`\`

Both work. The second is shorter, obvious to any reader, and much faster.

## When a string method is better

Prefer the string method when the question is:

**Does it start or end with this?** \`startswith\`, \`endswith\`.

**Does it hold this exact text?** the \`in\` operator.

**Replace this exact text.** \`replace\`.

**Split on a fixed separator.** \`split\`.

**Change the case, or remove spaces at the ends.** \`lower\`, \`upper\`, \`strip\`.

Reach for regex when the question is about a *shape* rather than a fixed string: runs of varying length, optional parts, choices between alternatives, or a structure whose pieces you need to take out.

> **Key idea**
> Regex answers questions about the shape of text. If you can ask the question with a string method, that is the better answer: shorter, clearer, and faster.

## When regex is completely the wrong tool

Some formats look regular and are not.

**HTML and XML** are nested, and nesting cannot be described by a regular expression. Patterns that seem to work will fail on real documents, in ways that are very tiring to track down. Use a parser.

**CSV** has quoting rules, as Module 10 showed. Use the \`csv\` module.

**JSON** is nested. Use the \`json\` module.

**Email addresses** follow a specification far more complicated than anyone expects. The practical approach is a loose check — something before an \`@\`, something after it, and a dot in the domain — together with actually sending a message if it matters.

The general lesson is worth keeping: when a format has a specification, use the library that was written against that specification.

## Making patterns readable

A pattern that you truly need can still be readable.

**Give it a name.** A pattern stored in a constant with a clear name explains itself everywhere it is used:

\`\`\`python
import re

POSTCODE = r"[A-Z]{1,2}\\d{1,2} ?\\d[A-Z]{2}"

print(bool(re.fullmatch(POSTCODE, "SW1A 1AA")))
print(bool(re.fullmatch(POSTCODE, "hello")))
\`\`\`

\`\`\`text
True
False
\`\`\`

**Build it from pieces.** String pieces written next to each other join automatically, so a long pattern can be built with one comment for each part:

\`\`\`python
import re

PATTERN = (
    r"(?P<code>[A-Z]{3})"   # three-letter prefix
    r"-"                     # separator
    r"(?P<number>\\d{4})"    # four-digit number
)

match = re.fullmatch(PATTERN, "ABC-1234")
print(match.group("number"))
\`\`\`

\`\`\`text
1234
\`\`\`

**Use verbose mode** for patterns that really are complicated. \`re.VERBOSE\` makes the engine ignore spaces and \`#\` comments inside the pattern:

\`\`\`python
import re

pattern = re.compile(r"""
    (?P<year>\\d{4})    # four-digit year
    -
    (?P<month>\\d{2})   # two-digit month
""", re.VERBOSE)

match = pattern.fullmatch("2024-07")
print(match.group("year"))
\`\`\`

\`\`\`text
2024
\`\`\`

Note that spaces inside the pattern are now ignored, so a real space must be written as \`\\ \` or as \`[ ]\`.

## Compiling

\`re.compile\` builds a pattern object once, and that is worth doing when a pattern is used many times:

\`\`\`python
import re

CODE = re.compile(r"[A-Z]{3}-\\d{4}")

for text in ["ABC-1234", "nope", "QRS-0001"]:
    print(bool(CODE.fullmatch(text)))
\`\`\`

\`\`\`text
True
False
True
\`\`\`

The methods on a compiled pattern take the text as their argument. Python remembers recent patterns anyway, so the difference in speed is small. The better reason is that naming the pattern makes the code readable.

## Test patterns against the cases they must refuse

A pattern that accepts what it should is only half tested. Check that it *refuses* what it should:

\`\`\`python
import re

CODE = re.compile(r"[A-Z]{3}-\\d{4}")

assert CODE.fullmatch("ABC-1234")
assert not CODE.fullmatch("AB-1234")
assert not CODE.fullmatch("ABC-123")
assert not CODE.fullmatch("abc-1234")
assert not CODE.fullmatch("xABC-1234")
print("pattern behaves as specified")
\`\`\`

\`\`\`text
pattern behaves as specified
\`\`\`

That last case is the one people forget, and it is exactly the one that catches a \`search\` where \`fullmatch\` was needed. A pattern that allows too much is more dangerous than one that allows too little, because it fails in silence.

## Summary

Use string methods for fixed text and regex for shapes. Never read HTML, CSV, or JSON with regex. Use the proper library. Name your patterns, build long ones from commented pieces, and use verbose mode when you need it. Always test that a pattern refuses what it should.`,
        },
        {
          type: "exercise",
          title: "Redact and Reformat Text",
          description: "Use sub with captured groups to change text in two ways.",
          instructions: `## The problem

Clean a line of text by hiding reference codes and reshaping dates.

## Input

One line of text.

## Requirements

Make two replacements, in this order:

1. Replace every reference code — three capital letters, a hyphen, four digits — with \`[REDACTED]\`.
2. Replace every date in the form \`YYYY-MM-DD\` with \`DD/MM/YYYY\`, using captured groups.

Then show exactly two lines:

\`\`\`text
Cleaned: Order [REDACTED] placed 15/07/2024
Codes removed: 1
\`\`\`

The second line reports how many codes were replaced.

## Example

Given \`Order ABC-1234 placed 2024-07-15\`, the output is the two lines above.

Given \`No codes or dates here\`, the output is:

\`\`\`text
Cleaned: No codes or dates here
Codes removed: 0
\`\`\`

## Guidance

Count the codes **before** you hide them, with \`findall\`. Otherwise the count will be zero, because the substitution has already removed them.

Do the code replacement before the date replacement. A code holds four digits and a hyphen, and doing the dates first would not touch it. But fixing a definite order is what makes the result predictable.

For the date, capture the three parts and use them in the replacement with \`\\1\`, \`\\2\`, and \`\\3\`. The replacement string must be raw as well.

## Constraints

Use \`re.sub\` for both changes. Do not use \`str.replace\`.`,
          starterCode: `import re

text = input()
`,
          hint: "codes = re.findall(r\"[A-Z]{3}-\\d{4}\", text) for the count. Then text = re.sub(r\"[A-Z]{3}-\\d{4}\", \"[REDACTED]\", text), and text = re.sub(r\"(\\d{4})-(\\d{2})-(\\d{2})\", r\"\\3/\\2/\\1\", text).",
          tests: [
            {
              input: "Order ABC-1234 placed 2024-07-15\n",
              expectedOutput: "Cleaned: Order [REDACTED] placed 15/07/2024\nCodes removed: 1",
              description: "A code is hidden and a date is reordered",
            },
            {
              input: "No codes or dates here\n",
              expectedOutput: "Cleaned: No codes or dates here\nCodes removed: 0",
              description: "Text with nothing to change passes through unaltered",
            },
            {
              input: "ABC-1234 and QRS-0001 on 2023-01-02\n",
              expectedOutput: "Cleaned: [REDACTED] and [REDACTED] on 02/01/2023\nCodes removed: 2",
              description: "Every code is hidden and counted",
            },
            {
              input: "2024-12-25\n",
              expectedOutput: "Cleaned: 25/12/2024\nCodes removed: 0",
              description: "A date on its own is reshaped, with no codes present",
            },
          ],
          solution: `import re

text = input()

codes = re.findall(r"[A-Z]{3}-\\d{4}", text)
text = re.sub(r"[A-Z]{3}-\\d{4}", "[REDACTED]", text)
text = re.sub(r"(\\d{4})-(\\d{2})-(\\d{2})", r"\\3/\\2/\\1", text)

print(f"Cleaned: {text}")
print(f"Codes removed: {len(codes)}")
`,
        },
        {
          type: "exercise",
          title: "Module 11 Checkpoint: Log Analyser",
          description: "Read, filter, and summarise structured log text with regular expressions.",
          instructions: `## The problem

Study a set of log lines, take the structure out of them, and report on it.

## Input

A series of lines ending with \`end\`. A well-formed line looks like this:

\`\`\`text
2024-07-15 14:30 ERROR disk full
\`\`\`

## Requirements

1. Use a compiled pattern with **named groups** for the date, time, level, and message.
2. Lines that do not match the format exactly are counted as malformed and otherwise ignored.
3. Count how many lines came at each level.
4. After \`end\`, report exactly these lines:
   - One line for each level, sorted by count with the highest first, then by level name, in the form \`ERROR: 2\`.
   - Then \`Malformed: 1\`.
   - Then \`First error: 15/07/2024 14:30\`, which is the date and time of the **first** \`ERROR\` line, written as day/month/year. If there were no errors, this line reads \`First error: none\`.

## Example

Given:

\`\`\`text
2024-07-15 14:30 ERROR disk full
2024-07-15 14:31 INFO started
garbage line
2024-07-16 09:00 ERROR retry failed
end
\`\`\`

the output is:

\`\`\`text
ERROR: 2
INFO: 1
Malformed: 1
First error: 15/07/2024 14:30
\`\`\`

## Guidance

Compile the pattern once, before the loop, and give it a name.

Use \`fullmatch\`, so that a line with rubbish at the end counts as malformed.

Record the first error as you go. Store it only when you do not already have one.

For the order of the levels, sort with a key that returns the negative count and the level name.

## Constraints

Use one regular expression with named groups. Do not split the lines on spaces.`,
          starterCode: `import re

PATTERN = re.compile(
    r"(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}) "
    r"(?P<level>[A-Z]+) (?P<message>.+)"
)

counts = {}
malformed = 0
first_error = None

line = input()
`,
          hint: "For each line, match = PATTERN.fullmatch(line). If it is None, add one to malformed. Otherwise count the level and, if first_error is None and the level is ERROR, store the date and time. Reshape the date by splitting it on hyphens.",
          tests: [
            {
              input:
                "2024-07-15 14:30 ERROR disk full\n2024-07-15 14:31 INFO started\ngarbage line\n2024-07-16 09:00 ERROR retry failed\nend\n",
              expectedOutput: "ERROR: 2\nINFO: 1\nMalformed: 1\nFirst error: 15/07/2024 14:30",
              description: "Levels are counted, malformed lines are kept apart, and the first error is reported",
            },
            {
              input: "end\n",
              expectedOutput: "Malformed: 0\nFirst error: none",
              description: "No input gives no level lines and reports no error",
            },
            {
              input: "2024-01-01 00:00 INFO all good\nend\n",
              expectedOutput: "INFO: 1\nMalformed: 0\nFirst error: none",
              description: "Logs with no errors still say so plainly",
            },
            {
              input: "bad\nalso bad\nend\n",
              expectedOutput: "Malformed: 2\nFirst error: none",
              description: "When every line is malformed, there are no level lines at all",
            },
            {
              input:
                "2024-03-04 08:00 WARN low space\n2024-03-04 08:01 WARN still low\n2024-03-04 08:02 ERROR out of space\nend\n",
              expectedOutput: "WARN: 2\nERROR: 1\nMalformed: 0\nFirst error: 04/03/2024 08:02",
              description: "Counts are ordered by how often they occur, and the first error is found late in the log",
            },
          ],
          solution: `import re

PATTERN = re.compile(
    r"(?P<date>\\d{4}-\\d{2}-\\d{2}) (?P<time>\\d{2}:\\d{2}) "
    r"(?P<level>[A-Z]+) (?P<message>.+)"
)

counts = {}
malformed = 0
first_error = None

line = input()
while line != "end":
    match = PATTERN.fullmatch(line)
    if match is None:
        malformed += 1
    else:
        level = match.group("level")
        counts[level] = counts.get(level, 0) + 1
        if level == "ERROR" and first_error is None:
            year, month, day = match.group("date").split("-")
            first_error = f"{day}/{month}/{year} {match.group('time')}"
    line = input()

for level in sorted(counts, key=lambda name: (-counts[name], name)):
    print(f"{level}: {counts[level]}")

print(f"Malformed: {malformed}")
print(f"First error: {first_error if first_error else 'none'}")
`,
        },
      ],
    ),
  ],
)

export default moduleEleven

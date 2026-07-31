import { module, lesson, type ModuleSource } from "../types.ts"

const moduleEleven: ModuleSource = module(
  "Regular Expressions and Text Processing",
  "Describing patterns in text: matching, validating, extracting, and substituting, and knowing when an ordinary string method is the better answer.",
  [
    lesson(
      "Why Regular Expressions Exist",
      "The kind of question string methods cannot answer, and the notation that can.",
      [
        {
          type: "lesson",
          title: "The Problem Patterns Solve",
          description: "A concrete task that string methods handle badly.",
          instructions: `## A task that gets out of hand

Suppose you must find every reference code in a piece of text. A code is three uppercase letters, a hyphen, and four digits: \`ABC-1234\`.

With the tools you have, you would split the text into words, then for each word check that it is eight characters long, that the first three are uppercase letters, that the fourth is a hyphen, and that the last four are digits:

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

It works. But it is twelve lines describing one simple shape, and it is fragile: it fails for a code followed by a full stop, because splitting on spaces leaves the punctuation attached.

Now imagine the rule changes to "three or four letters" and "two to six digits". Every check needs rewriting.

## A notation for shapes of text

A **regular expression**, usually shortened to *regex*, is a small language for describing patterns in text. The same rule above is written:

\`\`\`python
import re

text = "Refs ABC-1234 and XY-99 and QRS-0001 here"
print(re.findall(r"[A-Z]{3}-[0-9]{4}", text))
\`\`\`

\`\`\`text
['ABC-1234', 'QRS-0001']
\`\`\`

One line. Read it in pieces: \`[A-Z]\` means one uppercase letter, \`{3}\` means exactly three of those, \`-\` is a literal hyphen, \`[0-9]\` is one digit, and \`{4}\` means exactly four.

It is also more robust: it finds codes anywhere in the text, regardless of surrounding punctuation, because it never split on spaces in the first place.

## The trade

Regex is dense. \`[A-Z]{3}-[0-9]{4}\` is unreadable until you know the notation, and complicated patterns are genuinely hard to read even then.

What you gain is that patterns which would take dozens of lines of conditionals become one expression, and that expression can be changed in seconds when the rule changes.

The judgement to develop is *when* to use it. Regex is right for questions about the shape of text. It is wrong for questions an ordinary string method already answers, and the last lesson of this module examines that boundary.

> **Key idea**
> A regular expression describes the *shape* of a piece of text. Use one when the shape is the question, and a string method when it is not.

## Raw strings

Regex patterns are written as **raw strings**, marked with \`r\` before the quotation mark:

\`\`\`python
print("a\\tb")
print(r"a\\tb")
\`\`\`

\`\`\`text
a	b
a\\tb
\`\`\`

In an ordinary string, a backslash starts an escape sequence: \`\\t\` becomes a tab, \`\\n\` a newline. In a raw string, the backslash is just a backslash.

This matters because regex uses backslashes heavily for its own purposes. Without a raw string, \`"\\d"\` would first be interpreted by Python and only then by the regex engine, which leads to confusing failures and, in some cases, patterns that quietly mean something different.

The rule is simple: **always write regex patterns as raw strings.** There is no case where it hurts.

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

\`re.search\` looks for the pattern anywhere in the text. It returns a **match object** if found and \`None\` if not.

That \`None\` is why the \`if\` is needed. Calling \`.group()\` on \`None\` raises \`AttributeError: 'NoneType' object has no attribute 'group'\` — one of the most common regex mistakes, and now recognisable from Module 7 as "something gave me nothing".

\`match.group()\` returns the matched text.

## Summary

A regular expression describes the shape of text in a compact notation, replacing long chains of conditionals. Patterns are written as raw strings so backslashes reach the regex engine intact. \`re.search\` finds a pattern anywhere and returns \`None\` when it does not match, which must be checked before using the result.`,
        },
        {
          type: "lesson",
          title: "Character Classes and Quantifiers",
          description: "Describing which characters are allowed, and how many of them.",
          instructions: `## Literal characters

The simplest pattern is literal text, matching exactly itself:

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

The third is worth noting: \`cat\` appears inside \`concatenate\`, and \`search\` finds patterns anywhere. Anchors, later in this lesson, control that.

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

A hyphen inside brackets means a range. \`[a-z]\` is any lowercase letter, \`[A-Z]\` any uppercase, \`[0-9]\` any digit. Ranges combine: \`[a-zA-Z0-9]\` is any letter or digit.

A caret at the start negates the set:

\`\`\`python
import re

print(re.findall(r"[^0-9]", "a1b2"))
\`\`\`

\`\`\`text
['a', 'b']
\`\`\`

\`[^0-9]\` means "any character that is not a digit".

## Shorthand classes

Common sets have shorthands:

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

\`\\d\` is a digit, equivalent to \`[0-9]\`. \`\\w\` is a "word character": a letter, digit, or underscore. \`\\s\` is whitespace: space, tab, or newline.

Their capitals negate them. \`\\D\` is any non-digit, \`\\W\` any non-word character, \`\\S\` any non-whitespace.

A dot matches **any character except a newline**:

\`\`\`python
import re

print(re.findall(r"c.t", "cat cot c t cut"))
\`\`\`

\`\`\`text
['cat', 'cot', 'c t', 'cut']
\`\`\`

The dot is the most over-used piece of regex notation. It matches far more than people expect, including punctuation and digits. Prefer a specific class when you know what you want.

To match a literal dot, escape it: \`\\.\` means a full stop rather than "any character".

## Quantifiers

Quantifiers say how many times the preceding element may repeat:

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

\`+\` means one or more. \`*\` means zero or more. \`?\` means zero or one, making the preceding element optional.

Note the second result: \`\\d*\` matches an empty string, so it "finds" a match at every position. A pattern that can match nothing usually indicates a mistake — \`+\` is almost always what you meant.

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

Look closely at both results. \`78901\` yielded \`7890\` — four digits were found and the fifth left over. And \`4444\` yielded \`444\`, taking three and leaving one. Quantifiers take what they can and do not require the surrounding text to end. Anchors fix that.

## Greedy matching

Quantifiers are **greedy**: they match as much as possible.

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

The first pattern matched from the opening bracket to the *last* closing bracket, swallowing the middle. Adding \`?\` after the quantifier makes it **lazy**, matching as little as possible.

This is one of the most common regex surprises. When a pattern matches far more than intended, greediness is usually why.

Note also \`\\[\` and \`\\]\`: square brackets are regex syntax, so matching literal ones requires escaping.

> **Key idea**
> Quantifiers are greedy by default and take as much as they can. Add \`?\` after one to make it lazy. A pattern matching more than expected is usually a greediness problem.

## Characters needing escapes

These have special meaning and must be escaped with a backslash to match literally:

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

Writing \`\\d+.\\d+\` without escaping the dot would also match \`3x11\`, because an unescaped dot matches any character. That kind of mistake produces a pattern that works on your examples and fails on real data.

## Summary

Character classes describe which characters are allowed: \`[a-z]\`, \`[^0-9]\`, and the shorthands \`\\d\`, \`\\w\`, \`\\s\`. Quantifiers describe how many: \`+\`, \`*\`, \`?\`, and \`{n,m}\`. Quantifiers are greedy unless followed by \`?\`. Escape the special characters when you mean them literally.`,
        },
        {
          type: "exercise",
          title: "Find Patterns in Text",
          description: "Use character classes and quantifiers to extract several kinds of token.",
          instructions: `## The problem

Extract three different kinds of token from a line of text.

## Input

One line of text.

## Requirements

Using \`re.findall\`, display exactly three lines:

\`\`\`text
Numbers: ['12', '450', '7']
Words: ['Order', 'items', 'ref']
Codes: ['AB-12', 'XY-99']
\`\`\`

Where:

1. \`Numbers\` are runs of one or more digits.
2. \`Words\` are runs of one or more letters only — no digits, no underscores.
3. \`Codes\` are exactly two uppercase letters, a hyphen, then exactly two digits.

## Example

Given \`Order 12 items ref AB-12 and 450 more XY-99 or 7\`, the output is:

\`\`\`text
Numbers: ['12', '12', '450', '99', '7']
Words: ['Order', 'items', 'ref', 'AB', 'and', 'more', 'XY', 'or']
Codes: ['AB-12', 'XY-99']
\`\`\`

Note that digits inside codes are still found by the number pattern, and the letters inside codes are still found by the word pattern. The three searches are independent; none excludes the others.

## Guidance

For words, \`\\w\` will not do, because it includes digits and underscores. Use an explicit letter class instead.

Write every pattern as a raw string.

## Constraints

Use \`re.findall\` three times. Print each result list directly, which produces the bracketed format shown.`,
          starterCode: `import re

text = input()
`,
          hint: "Numbers use r\"\\d+\". Words need a letters-only class such as r\"[A-Za-z]+\". Codes are r\"[A-Z]{2}-\\d{2}\". Assign each result to a variable first: an f-string expression cannot contain a backslash.",
          tests: [
            {
              input: "Order 12 items ref AB-12 and 450 more XY-99 or 7\n",
              expectedOutput:
                "Numbers: ['12', '12', '450', '99', '7']\nWords: ['Order', 'items', 'ref', 'AB', 'and', 'more', 'XY', 'or']\nCodes: ['AB-12', 'XY-99']",
              description: "All three token types are extracted independently of one another",
            },
            {
              input: "no tokens here\n",
              expectedOutput: "Numbers: []\nWords: ['no', 'tokens', 'here']\nCodes: []",
              description: "Patterns that match nothing produce empty lists",
            },
            {
              input: "ZZ-00\n",
              expectedOutput: "Numbers: ['00']\nWords: ['ZZ']\nCodes: ['ZZ-00']",
              description: "A single code is also matched by the digit and letter patterns",
            },
            {
              input: "\n",
              expectedOutput: "Numbers: []\nWords: []\nCodes: []",
              description: "An empty line produces three empty lists",
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
      "Requiring a pattern to cover the whole string, and pulling out the parts you need.",
      [
        {
          type: "lesson",
          title: "Anchors and Whole-String Matching",
          description: "The difference between finding a pattern and requiring one.",
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

Both are true, because \`search\` looks anywhere in the string. For finding things that is exactly right. For **validation** it is disastrous: a program checking that input is a four-digit code would accept \`abc1234xyz\`.

## Anchors

An anchor ties a pattern to a position rather than matching a character.

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

With both anchors, the pattern must account for the entire string. The last case fails because five digits cannot be exactly four with nothing left over.

## fullmatch

Python provides a function that anchors for you:

\`\`\`python
import re

print(bool(re.fullmatch(r"\\d{4}", "1234")))
print(bool(re.fullmatch(r"\\d{4}", "abc1234xyz")))
\`\`\`

\`\`\`text
True
False
\`\`\`

\`re.fullmatch\` requires the pattern to match the whole string. It is equivalent to wrapping in \`^\` and \`$\` and is clearer, because the intention is stated by the function name rather than hidden in the pattern.

There is also \`re.match\`, which anchors only at the start. It is a frequent source of bugs, because it accepts trailing rubbish — \`re.match(r"\\d{4}", "1234abc")\` succeeds. Prefer \`fullmatch\` for validation and \`search\` for finding.

> **Key idea**
> Use \`search\` to find a pattern within text, and \`fullmatch\` to require that the whole string is the pattern. Using \`search\` for validation accepts anything with the pattern buried inside it.

## Word boundaries

\`\\b\` matches the boundary between a word character and a non-word character:

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

The first found \`cat\` inside \`concatenate\` and \`cats\`. The second required a boundary on each side, so only the standalone word matched.

\`\\b\` matches a position, not a character, so it consumes nothing.

## Groups

Parentheses group part of a pattern so a quantifier applies to the whole group:

\`\`\`python
import re

print(bool(re.fullmatch(r"(ab)+", "ababab")))
print(bool(re.fullmatch(r"(ab)+", "aba")))
\`\`\`

\`\`\`text
True
False
\`\`\`

\`(ab)+\` means one or more repetitions of \`ab\`, not \`a\` followed by one or more \`b\`.

## Capturing groups

Groups also **capture**: they remember what they matched, so you can retrieve the parts:

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

\`group(0)\` is the whole match. \`group(1)\` is the first parenthesised group, numbered by the position of its opening parenthesis. \`groups()\` returns them all as a tuple, which unpacks neatly:

\`\`\`python
import re

match = re.fullmatch(r"([A-Z]{3})-(\\d{4})", "ABC-1234")
prefix, number = match.groups()
print(f"prefix {prefix}, number {number}")
\`\`\`

\`\`\`text
prefix ABC, number 1234
\`\`\`

This is the answer to a task that would otherwise need careful slicing: validate the shape and pull out the parts in one operation.

## Named groups

Numbered groups become unreadable once there are more than two, and inserting a group renumbers everything after it. Names fix both problems:

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

\`(?P<name>...)\` names a group. The syntax is ugly, and it earns its place: \`match.group("year")\` says what it retrieves, while \`match.group(1)\` does not.

\`groupdict()\` returns every named group as a dictionary — often exactly the structure you want to keep.

## Alternation

\`|\` means "or", matching either alternative:

\`\`\`python
import re

print(bool(re.fullmatch(r"cat|dog", "dog")))
print(re.findall(r"\\b(?:cat|dog)s?\\b", "one cat two dogs"))
\`\`\`

\`\`\`text
True
['cat', 'dogs']
\`\`\`

\`(?:...)\` is a **non-capturing group**: it groups for the alternation without capturing. Use it when you need grouping but not the captured value, which keeps the numbering of real groups clean.

Alternation has very low precedence, so \`^cat|dog$\` means "starts with cat, or ends with dog" — almost certainly not what was intended. Group the alternatives: \`^(?:cat|dog)$\`.

## Summary

\`^\` and \`$\` anchor to the start and end; \`fullmatch\` does both and states the intent. \`\\b\` matches a word boundary. Parentheses group for quantifiers and capture the matched text, retrievable by number or by name with \`(?P<name>...)\`. \`|\` alternates and needs grouping.`,
        },
        {
          type: "exercise",
          title: "Validate an Identifier Format",
          description: "Use fullmatch to accept only strings matching a precise specification.",
          instructions: `## The problem

Write a validator for a booking reference.

## The format

A valid reference is:

1. Two or three uppercase letters.
2. A hyphen.
3. Exactly four digits.
4. Optionally, a hyphen followed by a single uppercase letter.

Nothing else may appear, before or after.

## Examples

\`\`\`text
AB-1234     valid
XYZ-0001    valid
AB-1234-C   valid
A-1234      invalid  (only one letter)
ABCD-1234   invalid  (four letters)
AB-123      invalid  (three digits)
AB-1234-c   invalid  (lowercase suffix)
xAB-1234    invalid  (extra text before)
AB-1234x    invalid  (extra text after)
\`\`\`

## Requirements

1. Define \`is_valid(reference: str) -> bool\` using a single \`re.fullmatch\`.
2. Read one line and print exactly \`Valid\` or \`Invalid\`.

## Guidance

Use \`fullmatch\` rather than \`search\`. With \`search\`, \`xAB-1234\` would be accepted, because the pattern appears inside it.

The optional suffix is a group followed by \`?\`, making the whole group optional. Use a non-capturing group, since you do not need its value.

The letter count is a range, written with braces.

## Constraints

Use exactly one regular expression. Do not check the parts with string methods.`,
          starterCode: `import re


def is_valid(reference: str) -> bool:
    return False


line = input()
print("Valid" if is_valid(line) else "Invalid")
`,
          hint: "The pattern is r\"[A-Z]{2,3}-\\d{4}(?:-[A-Z])?\" passed to re.fullmatch. Wrap the result in bool() so the function returns a Boolean rather than a match object or None.",
          tests: [
            {
              input: "AB-1234\n",
              expectedOutput: "Valid",
              description: "Two letters and four digits is the basic valid form",
            },
            {
              input: "XYZ-0001\n",
              expectedOutput: "Valid",
              description: "Three letters are also allowed",
            },
            {
              input: "AB-1234-C\n",
              expectedOutput: "Valid",
              description: "The optional uppercase suffix is accepted",
            },
            {
              input: "A-1234\n",
              expectedOutput: "Invalid",
              description: "A single letter is below the minimum",
            },
            {
              input: "ABCD-1234\n",
              expectedOutput: "Invalid",
              description: "Four letters exceed the maximum",
            },
            {
              input: "AB-123\n",
              expectedOutput: "Invalid",
              description: "Three digits do not satisfy the exact count",
            },
            {
              input: "AB-1234-c\n",
              expectedOutput: "Invalid",
              description: "A lowercase suffix is rejected",
            },
            {
              input: "xAB-1234\n",
              expectedOutput: "Invalid",
              description: "Leading text is rejected because the whole string must match",
            },
            {
              input: "AB-1234x\n",
              expectedOutput: "Invalid",
              description: "Trailing text is rejected, which re.match would have allowed",
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
          description: "Capture the components of a structured line and reassemble them.",
          instructions: `## The problem

Parse log lines and reformat them.

## The format

Each line looks like:

\`\`\`text
2024-07-15 14:30 ERROR Disk almost full
\`\`\`

That is: a date as four digits, hyphen, two digits, hyphen, two digits; a space; a time as two digits, colon, two digits; a space; a level of uppercase letters; a space; and a message which is the rest of the line.

## Requirements

1. Define \`parse_line(line: str) -> str\` that uses **named groups** to capture the date, time, level, and message.
2. If the line does not match the format exactly, return \`Malformed\`.
3. Otherwise return the components rearranged as:

\`\`\`text
[ERROR] 15/07/2024 at 14:30 - Disk almost full
\`\`\`

Note the date is reordered to day, month, year with slashes.

4. Read one line and print the result.

## Examples

Given \`2024-07-15 14:30 ERROR Disk almost full\`, the output is the line above.

Given \`not a log line\`, the output is \`Malformed\`.

## Guidance

Name the groups \`year\`, \`month\`, \`day\`, \`hour\`, \`minute\`, \`level\`, and \`message\`. Then \`match.group("day")\` reads clearly where \`match.group(3)\` would not.

For the message, match one or more of any character. Since it runs to the end of the line, a greedy quantifier is correct here.

Use \`fullmatch\`, and remember it returns \`None\` when the line does not match — check before calling \`.group\`.

## Constraints

Use named groups. Do not split the line on spaces.`,
          starterCode: `import re


def parse_line(line: str) -> str:
    return "Malformed"


print(parse_line(input()))
`,
          hint: "Build the pattern as r\"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2}) (?P<hour>\\d{2}):(?P<minute>\\d{2}) (?P<level>[A-Z]+) (?P<message>.+)\". Guard on match being None before formatting.",
          tests: [
            {
              input: "2024-07-15 14:30 ERROR Disk almost full\n",
              expectedOutput: "[ERROR] 15/07/2024 at 14:30 - Disk almost full",
              description: "A well-formed line is parsed and reordered",
            },
            {
              input: "2023-01-02 09:05 INFO Started\n",
              expectedOutput: "[INFO] 02/01/2023 at 09:05 - Started",
              description: "Leading zeros in the date and time are preserved",
            },
            {
              input: "not a log line\n",
              expectedOutput: "Malformed",
              description: "A line that does not match the format is rejected",
            },
            {
              input: "2024-07-15 14:30 error lowercase level\n",
              expectedOutput: "Malformed",
              description: "A lowercase level does not match the uppercase class",
            },
            {
              input: "2024-7-15 14:30 WARN Short month\n",
              expectedOutput: "Malformed",
              description: "A single-digit month does not satisfy the exact digit count",
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
      "Finding every match, and rewriting text according to a pattern.",
      [
        {
          type: "lesson",
          title: "findall, finditer, and sub",
          description: "Collecting every match and replacing matched text.",
          instructions: `## Finding every match

\`re.findall\` returns a list of every non-overlapping match:

\`\`\`python
import re

text = "Costs 12, 450 and 7 pounds"
print(re.findall(r"\\d+", text))
\`\`\`

\`\`\`text
['12', '450', '7']
\`\`\`

With no groups in the pattern, it returns the matched text. With **one** group, it returns what that group captured:

\`\`\`python
import re

text = "ABC-1234 and QRS-0001"
print(re.findall(r"[A-Z]{3}-(\\d{4})", text))
\`\`\`

\`\`\`text
['1234', '0001']
\`\`\`

The letters were matched but not returned, because a group was present and \`findall\` reports groups in preference to whole matches.

With **several** groups, each result is a tuple:

\`\`\`python
import re

text = "ABC-1234 and QRS-0001"
print(re.findall(r"([A-Z]{3})-(\\d{4})", text))
\`\`\`

\`\`\`text
[('ABC', '1234'), ('QRS', '0001')]
\`\`\`

This behaviour surprises people regularly. Adding a group to a working \`findall\` pattern changes what comes back. When you want grouping without changing the result, use a non-capturing group \`(?:...)\`.

## finditer

\`re.finditer\` yields match objects rather than strings, so you get positions and named groups too:

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

Use \`findall\` when you want the text and \`finditer\` when you need positions or several groups per match.

## Substitution

\`re.sub\` replaces every match:

\`\`\`python
import re

text = "Call 555-0100 or 555-0199"
print(re.sub(r"\\d{3}-\\d{4}", "[redacted]", text))
\`\`\`

\`\`\`text
Call [redacted] or [redacted]
\`\`\`

Like every string operation, it returns a new string; the original is unchanged.

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

The replacement is also a raw string, because it contains backslashes.

Named groups are referenced with \`\\g<name>\`:

\`\`\`python
import re

pattern = r"(?P<first>\\w+) (?P<last>\\w+)"
print(re.sub(pattern, r"\\g<last>, \\g<first>", "Ada Lovelace"))
\`\`\`

\`\`\`text
Lovelace, Ada
\`\`\`

Reordering text like this with string methods would take several steps and careful index arithmetic. As one substitution it is a single line that states the transformation directly.

## A function as the replacement

When the replacement depends on what was matched, pass a function. It receives the match object and returns the replacement text:

\`\`\`python
import re


def double_number(match):
    return str(int(match.group()) * 2)


print(re.sub(r"\\d+", double_number, "a 3 b 10"))
\`\`\`

\`\`\`text
a 6 b 20
\`\`\`

This is a powerful combination: regex finds the pieces, and ordinary Python decides what each becomes.

## Splitting

\`re.split\` splits on a pattern rather than a fixed string:

\`\`\`python
import re

text = "a1b22c333d"
print(re.split(r"\\d+", text))
\`\`\`

\`\`\`text
['a', 'b', 'c', 'd']
\`\`\`

Useful when separators vary. Note that a separator at the start or end produces an empty string in the result, which usually needs filtering out.

> **Key idea**
> \`findall\` returns text but changes shape when the pattern has groups. \`sub\` returns a new string and can reference captured groups in its replacement, or delegate to a function.

## Summary

\`findall\` collects matches, returning groups instead of whole matches when the pattern has any. \`finditer\` yields match objects with positions. \`sub\` replaces matches and can use \`\\1\` or \`\\g<name>\` in the replacement, or take a function. \`re.split\` splits on a pattern.`,
        },
        {
          type: "lesson",
          title: "Keeping Patterns Maintainable",
          description: "When a regular expression is the wrong tool, and how to make the right ones readable.",
          instructions: `## The temptation to over-use

Regex is satisfying, and that is a hazard. Once the notation is familiar, it is tempting to reach for it constantly — including for jobs an ordinary string method does better.

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

Both work. The second is shorter, obvious to any reader, and considerably faster.

## When a string method is better

Prefer the string method when the question is:

**Does it start or end with this?** \`startswith\`, \`endswith\`.

**Does it contain this exact text?** the \`in\` operator.

**Replace this exact text.** \`replace\`.

**Split on a fixed separator.** \`split\`.

**Change case, or trim whitespace.** \`lower\`, \`upper\`, \`strip\`.

Reach for regex when the question involves a *shape* rather than a fixed string: variable-length runs, optional parts, alternatives, or a structure whose pieces you need to extract.

> **Key idea**
> Regex answers questions about the shape of text. If you can express the question with a string method, that is the better answer — shorter, clearer, and faster.

## When regex is the wrong tool entirely

Some formats look regular and are not.

**HTML and XML** are nested, and nesting cannot be described by a regular expression. Patterns that appear to work fail on real documents in ways that are tedious to diagnose. Use a parser.

**CSV** has quoting rules, as Module 10 showed. Use the \`csv\` module.

**JSON** is nested. Use the \`json\` module.

**Email addresses** are governed by a specification far more complex than anyone expects. The pragmatic approach is a loose check — something before an \`@\`, something after it, a dot in the domain — combined with actually sending a message if it matters.

The pattern here is worth generalising: when a format has a specification, use the library written against that specification.

## Making patterns readable

A necessary pattern can still be readable.

**Name it.** A pattern assigned to a constant with a descriptive name explains itself at every use:

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

**Build it from pieces.** Adjacent string literals join automatically, so a long pattern can be assembled with a comment per part:

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

**Use verbose mode** for genuinely complex patterns. \`re.VERBOSE\` makes the engine ignore whitespace and \`#\` comments inside the pattern:

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

Note that whitespace inside the pattern is now ignored, so a literal space must be written as \`\\ \` or \`[ ]\`.

## Compiling

\`re.compile\` builds a pattern object once, which is worth doing when a pattern is used repeatedly:

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

The methods on a compiled pattern take the text as their argument. Python caches recent patterns anyway, so the speed difference is small; the readability of naming the pattern is the better reason.

## Test patterns against negative cases

A pattern that accepts what it should is only half tested. Check that it *rejects* what it should:

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

That last case is the one people forget, and it is precisely the one that catches a \`search\` where \`fullmatch\` was needed. A pattern too permissive is more dangerous than one too strict, because it fails silently.

## Summary

Use string methods for fixed text and regex for shapes. Never parse HTML, CSV, or JSON with regex; use the proper library. Name patterns, build long ones from commented pieces, and use verbose mode when needed. Always test that a pattern rejects what it should.`,
        },
        {
          type: "exercise",
          title: "Redact and Reformat Text",
          description: "Use sub with captured groups to transform text in two ways.",
          instructions: `## The problem

Clean a line of text by redacting reference codes and reformatting dates.

## Input

One line of text.

## Requirements

Apply two substitutions, in this order:

1. Replace every reference code — three uppercase letters, a hyphen, four digits — with \`[REDACTED]\`.
2. Replace every date in the form \`YYYY-MM-DD\` with \`DD/MM/YYYY\`, using captured groups.

Then display exactly two lines:

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

Count the codes **before** redacting them, with \`findall\`, or the count will be zero after the substitution has removed them.

Do the code substitution before the date substitution. A code contains four digits and a hyphen, and doing the dates first would not affect it — but establishing a definite order is what makes the result predictable.

For the date, capture the three parts and reference them in the replacement with \`\\1\`, \`\\2\`, and \`\\3\`. The replacement string must also be raw.

## Constraints

Use \`re.sub\` for both transformations. Do not use \`str.replace\`.`,
          starterCode: `import re

text = input()
`,
          hint: "codes = re.findall(r\"[A-Z]{3}-\\d{4}\", text) for the count. Then text = re.sub(r\"[A-Z]{3}-\\d{4}\", \"[REDACTED]\", text) and text = re.sub(r\"(\\d{4})-(\\d{2})-(\\d{2})\", r\"\\3/\\2/\\1\", text).",
          tests: [
            {
              input: "Order ABC-1234 placed 2024-07-15\n",
              expectedOutput: "Cleaned: Order [REDACTED] placed 15/07/2024\nCodes removed: 1",
              description: "A code is redacted and a date is reordered",
            },
            {
              input: "No codes or dates here\n",
              expectedOutput: "Cleaned: No codes or dates here\nCodes removed: 0",
              description: "Text with nothing to change passes through unaltered",
            },
            {
              input: "ABC-1234 and QRS-0001 on 2023-01-02\n",
              expectedOutput: "Cleaned: [REDACTED] and [REDACTED] on 02/01/2023\nCodes removed: 2",
              description: "Every code is redacted and counted",
            },
            {
              input: "2024-12-25\n",
              expectedOutput: "Cleaned: 25/12/2024\nCodes removed: 0",
              description: "A date alone is reformatted with no codes present",
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
          description: "Parse, filter, and summarise structured log text with regular expressions.",
          instructions: `## The problem

Analyse a set of log lines, extracting structure and reporting on it.

## Input

A series of lines ending with \`end\`. A well-formed line looks like:

\`\`\`text
2024-07-15 14:30 ERROR disk full
\`\`\`

## Requirements

1. Use a compiled pattern with **named groups** for the date, time, level, and message.
2. Lines that do not match the format exactly are counted as malformed and otherwise ignored.
3. Count how many lines occurred at each level.
4. Report, after \`end\`, exactly these lines:
   - One line per level, sorted by count descending then by level name, in the form \`ERROR: 2\`.
   - Then \`Malformed: 1\`.
   - Then \`First error: 15/07/2024 14:30\` — the date and time of the **first** \`ERROR\` line, reformatted to day/month/year. If there were no errors, this line reads \`First error: none\`.

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

Use \`fullmatch\` so a line with trailing rubbish is treated as malformed.

Record the first error as you go: only store it when you do not already have one.

For the level ordering, sort with a key returning the negative count and the level name.

## Constraints

Use one regular expression with named groups. Do not split lines on spaces.`,
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
          hint: "For each line, match = PATTERN.fullmatch(line). If None, increase malformed. Otherwise tally the level and, if first_error is None and the level is ERROR, store the date and time. Reformat the date by splitting it on hyphens.",
          tests: [
            {
              input:
                "2024-07-15 14:30 ERROR disk full\n2024-07-15 14:31 INFO started\ngarbage line\n2024-07-16 09:00 ERROR retry failed\nend\n",
              expectedOutput: "ERROR: 2\nINFO: 1\nMalformed: 1\nFirst error: 15/07/2024 14:30",
              description: "Levels are counted, malformed lines are separated, and the first error is reported",
            },
            {
              input: "end\n",
              expectedOutput: "Malformed: 0\nFirst error: none",
              description: "No input produces no level lines and reports no error",
            },
            {
              input: "2024-01-01 00:00 INFO all good\nend\n",
              expectedOutput: "INFO: 1\nMalformed: 0\nFirst error: none",
              description: "Logs without errors still report the absence explicitly",
            },
            {
              input: "bad\nalso bad\nend\n",
              expectedOutput: "Malformed: 2\nFirst error: none",
              description: "Only malformed lines produces no level lines at all",
            },
            {
              input:
                "2024-03-04 08:00 WARN low space\n2024-03-04 08:01 WARN still low\n2024-03-04 08:02 ERROR out of space\nend\n",
              expectedOutput: "WARN: 2\nERROR: 1\nMalformed: 0\nFirst error: 04/03/2024 08:02",
              description: "Counts are ordered by frequency and the first error is found late in the log",
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

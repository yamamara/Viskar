import { module, lesson, type ModuleSource } from "../types.ts"

const moduleTen: ModuleSource = module(
  "Files, CSV, and JSON",
  "Making data outlive the program that created it: reading and writing text files, and working with the two most common structured formats.",
  [
    lesson(
      "Reading and Writing Files",
      "Getting data out of a program and back in again.",
      [
        {
          type: "lesson",
          title: "Opening Files Safely",
          description: "The open function, the with statement, and what a file path means.",
          instructions: `## Data that outlives the program

Everything your programs have produced so far vanished when they finished. Variables exist only while a program runs.

**Persistence** is the ability to store data so it survives. The simplest form is a file.

## Paths

A **path** identifies a file. \`notes.txt\` is a *relative* path: it names a file in the program's current directory. \`/home/ada/notes.txt\` is an *absolute* path, naming a file from the root of the file system.

Relative paths are usually right, because they let a program work wherever it is installed. Absolute paths hard-code assumptions about one particular machine.

In this course, each program runs in its own private directory, so relative filenames are all you need — and files created by one exercise are invisible to the next. Every exercise creates the data it needs.

## Writing a file

\`\`\`python
with open("notes.txt", "w") as handle:
    handle.write("first line\\n")
    handle.write("second line\\n")

print("written")
\`\`\`

\`\`\`text
written
\`\`\`

\`open\` takes a path and a **mode**. \`"w"\` means write. It returns a **file object**, often called a handle, through which the file is read or written.

Note \`\\n\` at the end of each write. Unlike \`print\`, \`write\` adds nothing of its own. Without them, everything ends up on one line.

## The with statement

The \`with\` above is important. An open file consumes a resource that must be released; data written may sit in a buffer and only reach the disk when the file is closed.

Without \`with\`, you must close it yourself:

\`\`\`python
handle = open("notes.txt", "w")
handle.write("some text\\n")
handle.close()

print("written and closed")
\`\`\`

\`\`\`text
written and closed
\`\`\`

That works until something goes wrong between opening and closing. If an exception is raised in the middle, \`close()\` never runs, and the file may be left incomplete.

\`with\` closes the file automatically when the block ends — normally or by exception:

\`\`\`python
with open("notes.txt", "w") as handle:
    handle.write("safe\\n")

print("closed automatically")
\`\`\`

\`\`\`text
closed automatically
\`\`\`

This is the \`finally\` idea from Module 7, packaged. Always use \`with\`. There is no situation in ordinary code where opening a file without it is better.

> **Key idea**
> \`with open(...) as handle:\` guarantees the file is closed when the block ends, even if an exception occurs. Use it every time.

## Reading a whole file

\`\`\`python
with open("notes.txt", "w") as handle:
    handle.write("first\\nsecond\\n")

with open("notes.txt") as handle:
    content = handle.read()

print(repr(content))
\`\`\`

\`\`\`text
'first\\nsecond\\n'
\`\`\`

\`read()\` returns the entire contents as one string. The mode was omitted because \`"r"\` for reading is the default.

\`repr\` is used here deliberately, to make the newline characters visible. Printing \`content\` directly would show two lines and hide the structure.

## Reading line by line

\`\`\`python
with open("notes.txt", "w") as handle:
    handle.write("first\\nsecond\\nthird\\n")

with open("notes.txt") as handle:
    for line in handle:
        print(repr(line))
\`\`\`

\`\`\`text
'first\\n'
'second\\n'
'third\\n'
\`\`\`

Iterating a file object yields one line at a time. **Each line keeps its trailing newline**, which is the single most common surprise when working with files.

That matters immediately:

\`\`\`python
with open("data.txt", "w") as handle:
    handle.write("42\\n")

with open("data.txt") as handle:
    for line in handle:
        print(int(line.strip()) * 2)
\`\`\`

\`\`\`text
84
\`\`\`

\`int("42\\n")\` happens to work, since \`int\` tolerates surrounding whitespace. But \`line == "42"\` would be \`False\`, and \`len(line)\` is 3, not 2. Strip each line as you read it and the problem disappears.

Iterating is also memory-efficient: it reads one line at a time rather than loading the whole file, which matters for large files.

## readlines and splitlines

\`\`\`python
with open("notes.txt", "w") as handle:
    handle.write("a\\nb\\nc\\n")

with open("notes.txt") as handle:
    lines = handle.read().splitlines()

print(lines)
\`\`\`

\`\`\`text
['a', 'b', 'c']
\`\`\`

\`read().splitlines()\` gives a list of lines with the newlines already removed, which is often exactly what you want. \`readlines()\` also gives a list, but keeps the newlines.

## Summary

A path identifies a file; relative paths are usually right. \`open(path, mode)\` returns a handle, and \`with\` guarantees it is closed. \`write\` adds no newline of its own. Iterating a file gives lines that keep their trailing newline, so strip them.`,
        },
        {
          type: "lesson",
          title: "Modes, Appending, and Failures",
          description: "Choosing a mode without destroying data, and handling files that are not there.",
          instructions: `## The modes

The mode decides what \`open\` does and what is permitted.

\`"r"\` — read. The file must exist; otherwise \`FileNotFoundError\`. The default.

\`"w"\` — write. Creates the file, or **empties it completely** if it exists.

\`"a"\` — append. Creates the file if needed, and adds to the end of an existing one.

\`"x"\` — exclusive create. Creates the file, but raises \`FileExistsError\` if it already exists.

## The danger of "w"

\`"w"\` destroys existing content immediately, before you write anything:

\`\`\`python
with open("log.txt", "w") as handle:
    handle.write("original content\\n")

with open("log.txt", "w") as handle:
    handle.write("replacement\\n")

with open("log.txt") as handle:
    print(handle.read().strip())
\`\`\`

\`\`\`text
replacement
\`\`\`

The original is gone. There is no warning and no undo.

This is a genuinely common way to lose data. The habit worth forming is to pause whenever you type \`"w"\` and ask whether the file might already contain something you want.

When adding to a record, use \`"a"\`:

\`\`\`python
with open("log.txt", "w") as handle:
    handle.write("first entry\\n")

with open("log.txt", "a") as handle:
    handle.write("second entry\\n")

with open("log.txt") as handle:
    print(handle.read().strip())
\`\`\`

\`\`\`text
first entry
second entry
\`\`\`

When a file must not be overwritten at all, \`"x"\` makes that a rule the operating system enforces rather than one you have to remember.

## Handling missing files

Reading a file that does not exist raises \`FileNotFoundError\`:

\`\`\`python
try:
    with open("missing.txt") as handle:
        content = handle.read()
except FileNotFoundError:
    content = ""

print(f"read {len(content)} characters")
\`\`\`

\`\`\`text
read 0 characters
\`\`\`

There are two approaches, and the choice matters.

**Check first:**

\`\`\`python
import os

if os.path.exists("missing.txt"):
    with open("missing.txt") as handle:
        content = handle.read()
else:
    content = ""

print(f"read {len(content)} characters")
\`\`\`

\`\`\`text
read 0 characters
\`\`\`

**Or try and handle the failure**, as in the first example.

The second is generally preferred for files, because checking first contains a subtle flaw: the file may be deleted between the check and the open. The gap is tiny but real, and on a busy system it eventually happens. Attempting the operation and handling failure has no gap.

This is a case where exception handling beats validation, and it is worth understanding why rather than treating it as arbitrary. Validation wins when the check is reliable; here it is not.

> **Key idea**
> \`"w"\` empties an existing file before writing. Use \`"a"\` to add and \`"x"\` to refuse to overwrite. Prefer \`try\`/\`except FileNotFoundError\` over checking existence first, because the file can change between the check and the open.

## Other file exceptions

\`PermissionError\` — the file exists but you may not read or write it.

\`IsADirectoryError\` — the path names a directory.

\`UnicodeDecodeError\` — the bytes are not valid text in the expected encoding, usually because the file is not a text file at all.

Catch the specific one you can handle. Catching all of them and reporting "file error" tells a user nothing about what to do.

## Text and binary

Text mode decodes bytes into characters using an **encoding**. Almost always this should be UTF-8, which can represent every character in every language:

\`\`\`python
with open("notes.txt", "w", encoding="utf-8") as handle:
    handle.write("café — naïve\\n")

with open("notes.txt", encoding="utf-8") as handle:
    print(handle.read().strip())
\`\`\`

\`\`\`text
café — naïve
\`\`\`

The default encoding depends on the system, so a program that omits it can work on one machine and produce \`UnicodeDecodeError\` on another. Stating \`encoding="utf-8"\` explicitly avoids a class of bug that is tedious to diagnose.

Adding \`"b"\` to a mode opens the file in **binary**, giving raw bytes rather than text. That is what you need for images, audio, and compressed files, none of which are text at all.

## Writing safely

Two habits worth adopting:

Write to a temporary file and rename it when complete. A crash partway through then leaves the original intact rather than a half-written file.

Never open a file for writing while reading it. Read everything, close it, transform the data in memory, then write.

## Summary

\`"r"\` reads and requires existence, \`"w"\` empties, \`"a"\` appends, \`"x"\` refuses to overwrite. Prefer catching \`FileNotFoundError\` to checking existence first. Always specify \`encoding="utf-8"\` for text.`,
        },
        {
          type: "exercise",
          title: "Write, Append, and Read Back",
          description: "Create a file, add to it, and report on its contents.",
          instructions: `## The problem

Build a small log file and then summarise it.

## Input

A series of lines ending with \`end\`. Each other line is an entry to record.

## Requirements

1. Write the **first** entry to a file named \`log.txt\` using write mode, creating the file.
2. Append every subsequent entry to the same file.
3. Each entry occupies its own line in the file.
4. After \`end\`, read the file back and display exactly:

\`\`\`text
Entries: 3
First: alpha
Last: gamma
\`\`\`

If there were no entries at all, do not create the file, and display:

\`\`\`text
Entries: 0
\`\`\`

with nothing else.

## Example

Given \`alpha\`, \`beta\`, \`gamma\`, \`end\`, the output is the three lines above.

## Guidance

Write mode empties the file, so it must be used only once — for the first entry. Everything after that appends.

Remember that \`write\` adds no newline. You must include \`\\n\` yourself, or all the entries will end up on one line.

When reading back, \`read().splitlines()\` gives a list with the newlines already removed, which makes counting and indexing straightforward.

## Constraints

Use \`with\` for every file operation. The file is created fresh for each run, so you need not worry about content left by a previous run.`,
          starterCode: `entries = []

line = input()
`,
          hint: "Collect the entries into a list first, then decide: if the list is empty just print Entries: 0. Otherwise write the first with mode \"w\" and append the rest with mode \"a\", each followed by a newline.",
          tests: [
            {
              input: "alpha\nbeta\ngamma\nend\n",
              expectedOutput: "Entries: 3\nFirst: alpha\nLast: gamma",
              description: "Three entries are written, appended, and read back in order",
            },
            {
              input: "only\nend\n",
              expectedOutput: "Entries: 1\nFirst: only\nLast: only",
              description: "A single entry is both the first and the last",
            },
            {
              input: "end\n",
              expectedOutput: "Entries: 0",
              description: "No entries produces only the count line and no file",
            },
            {
              input: "a\nb\nend\n",
              expectedOutput: "Entries: 2\nFirst: a\nLast: b",
              description: "Two entries confirm the append preserves order",
            },
          ],
          solution: `entries = []

line = input()
while line != "end":
    entries.append(line)
    line = input()

if not entries:
    print("Entries: 0")
else:
    with open("log.txt", "w", encoding="utf-8") as handle:
        handle.write(entries[0] + "\\n")

    for entry in entries[1:]:
        with open("log.txt", "a", encoding="utf-8") as handle:
            handle.write(entry + "\\n")

    with open("log.txt", encoding="utf-8") as handle:
        lines = handle.read().splitlines()

    print(f"Entries: {len(lines)}")
    print(f"First: {lines[0]}")
    print(f"Last: {lines[-1]}")
`,
        },
        {
          type: "exercise",
          title: "Handle a Missing File",
          description: "Read a file that may not exist, without letting the program crash.",
          instructions: `## The problem

Write a function that reads a file's lines, returning an empty list when the file does not exist.

## Requirements

1. Define \`read_lines(path: str) -> list[str]\` which:
   - Returns a list of the file's lines with trailing newlines removed.
   - Returns an empty list if the file does not exist, rather than raising.
2. Define \`summarise(lines: list[str]) -> str\` which returns:
   - \`No data\` for an empty list.
   - Otherwise \`3 lines, longest: gamma\` — the count, and the longest line. Ties are broken by whichever comes first in the file.

## Then

Read one line of input, the filename to read. Before reading it, create a file named \`present.txt\` containing three lines: \`alpha\`, \`beta\`, and \`gamma\`.

Then call the two functions with the supplied filename and print the summary.

## Examples

Given \`present.txt\`, the output is:

\`\`\`text
3 lines, longest: alpha
\`\`\`

Given \`absent.txt\`, the output is:

\`\`\`text
No data
\`\`\`

## Details

Note the first example carefully. \`alpha\`, \`beta\`, and \`gamma\` have lengths 5, 4, and 5. \`alpha\` and \`gamma\` tie at 5, and \`alpha\` comes first, so it wins.

## Guidance

Wrap only the \`open\` call in \`try\`, and catch \`FileNotFoundError\` specifically. Catching everything would also hide mistakes in your own code.

For the longest line, iterating and keeping the best so far naturally gives the first-wins behaviour, because you only replace when something is strictly longer.

## Constraints

Do not use \`os.path.exists\`. The point of the exercise is to attempt the operation and handle its failure.`,
          starterCode: `def read_lines(path: str) -> list[str]:
    return []


def summarise(lines: list[str]) -> str:
    return "No data"


with open("present.txt", "w", encoding="utf-8") as handle:
    handle.write("alpha\\nbeta\\ngamma\\n")

filename = input()
print(summarise(read_lines(filename)))
`,
          hint: "In read_lines: try opening and return handle.read().splitlines(), and except FileNotFoundError: return []. In summarise, guard the empty list then loop keeping the longest, replacing only when strictly longer.",
          tests: [
            {
              input: "present.txt\n",
              expectedOutput: "3 lines, longest: alpha",
              description: "An existing file is read and the first of the tied longest lines wins",
            },
            {
              input: "absent.txt\n",
              expectedOutput: "No data",
              description: "A missing file returns an empty list instead of raising",
            },
          ],
          solution: `def read_lines(path: str) -> list[str]:
    """Return the file's lines without newlines, or [] if it does not exist."""
    try:
        with open(path, encoding="utf-8") as handle:
            return handle.read().splitlines()
    except FileNotFoundError:
        return []


def summarise(lines: list[str]) -> str:
    """Return a one-line summary, or 'No data' when there are no lines."""
    if not lines:
        return "No data"
    longest = lines[0]
    for line in lines:
        if len(line) > len(longest):
            longest = line
    return f"{len(lines)} lines, longest: {longest}"


with open("present.txt", "w", encoding="utf-8") as handle:
    handle.write("alpha\\nbeta\\ngamma\\n")

filename = input()
print(summarise(read_lines(filename)))
`,
        },
      ],
    ),

    lesson(
      "Comma-Separated Values",
      "The most common format for tabular data, and the module that handles its awkward cases.",
      [
        {
          type: "lesson",
          title: "Rows, Headers, and the csv Module",
          description: "Why splitting on commas is not enough, and what to use instead.",
          instructions: `## Tabular data as text

**CSV** — comma-separated values — stores a table as text. Each line is a row; commas separate the columns:

\`\`\`text
title,pages,status
Tidal Systems,320,done
Coastal Birds,180,reading
\`\`\`

The first row is usually a **header**, naming the columns. It looks like data but describes it, and must be handled separately.

CSV is ubiquitous because every spreadsheet and database can read and write it, and because it is plain text a person can inspect.

## Why not just split on commas

The obvious approach:

\`\`\`python
line = "Tidal Systems,320,done"
print(line.split(","))
\`\`\`

\`\`\`text
['Tidal Systems', '320', 'done']
\`\`\`

That works until a value contains a comma. CSV handles this by quoting:

\`\`\`text
title,pages,status
"Birds, Coastal",180,reading
\`\`\`

Now splitting on commas gives four pieces instead of three, and every column after the first is wrong:

\`\`\`python
line = '"Birds, Coastal",180,reading'
print(line.split(","))
\`\`\`

\`\`\`text
['"Birds', ' Coastal"', '180', 'reading']
\`\`\`

There are further complications: a quoted value may contain newlines, and a quote inside a quoted value is doubled. Handling all of it correctly is more work than it appears, and getting it subtly wrong corrupts data silently.

> **Key idea**
> Never parse CSV by splitting on commas. Quoted fields containing commas will silently produce wrong data. Use the \`csv\` module, which handles the rules correctly.

## Reading with the csv module

\`\`\`python
import csv

with open("books.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write('title,pages,status\\n')
    handle.write('"Birds, Coastal",180,reading\\n')
    handle.write('Tidal Systems,320,done\\n')

with open("books.csv", encoding="utf-8", newline="") as handle:
    reader = csv.reader(handle)
    for row in reader:
        print(row)
\`\`\`

\`\`\`text
['title', 'pages', 'status']
['Birds, Coastal', '180', 'reading']
['Tidal Systems', '320', 'done']
\`\`\`

The quoted field came through as one value with its comma intact.

\`csv.reader\` gives each row as a list of strings. Two details matter.

**Every value is a string.** \`'180'\` is text, not a number. Convert what you need, exactly as with \`input()\`.

**\`newline=""\` is required.** The csv module handles line endings itself, and omitting this causes problems on some systems. Include it whenever opening a file for csv.

## Handling the header

The header arrives as the first row, so skip it deliberately:

\`\`\`python
import csv

with open("books.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write('title,pages\\nTidal Systems,320\\nCoastal Birds,180\\n')

with open("books.csv", encoding="utf-8", newline="") as handle:
    reader = csv.reader(handle)
    header = next(reader)
    total = 0
    for row in reader:
        total += int(row[1])

print(header)
print(f"Total pages: {total}")
\`\`\`

\`\`\`text
['title', 'pages']
Total pages: 500
\`\`\`

\`next(reader)\` reads one row and advances, so the loop starts at the first data row. Forgetting this gives \`ValueError: invalid literal for int()\` when the header text hits a conversion — a distinctive symptom worth recognising.

## Writing CSV

\`\`\`python
import csv

rows = [
    ["title", "pages"],
    ["Birds, Coastal", 180],
    ["Tidal Systems", 320],
]

with open("out.csv", "w", encoding="utf-8", newline="") as handle:
    writer = csv.writer(handle)
    writer.writerows(rows)

with open("out.csv", encoding="utf-8", newline="") as handle:
    print(handle.read().strip())
\`\`\`

\`\`\`text
title,pages
"Birds, Coastal",180
Tidal Systems,320
\`\`\`

The writer quoted the value containing a comma automatically and left the others alone. Doing that correctly by hand requires knowing every rule; the module already does.

\`writerow\` writes one row; \`writerows\` writes many.

## Summary

CSV stores tabular data with one row per line and an optional header. Splitting on commas breaks on quoted fields, so use the \`csv\` module. Values arrive as strings and must be converted. Open csv files with \`newline=""\`, and skip the header with \`next(reader)\`.`,
        },
        {
          type: "lesson",
          title: "DictReader and DictWriter",
          description: "Working with columns by name instead of by position.",
          instructions: `## The problem with positions

Reading rows as lists means referring to columns by index:

\`\`\`python
row = ["Tidal Systems", "320", "done"]
print(row[1])
\`\`\`

\`\`\`text
320
\`\`\`

\`row[1]\` says nothing about what it holds. Worse, if a column is inserted into the file, every index shifts and the program silently reads the wrong data.

This is the same argument that motivated dictionaries in Module 5: position is the wrong handle when the thing has a name.

## DictReader

\`csv.DictReader\` reads each row as a dictionary keyed by the header:

\`\`\`python
import csv

with open("books.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write("title,pages,status\\n")
    handle.write("Tidal Systems,320,done\\n")
    handle.write("Coastal Birds,180,reading\\n")

with open("books.csv", encoding="utf-8", newline="") as handle:
    reader = csv.DictReader(handle)
    for row in reader:
        print(f"{row['title']}: {row['pages']} pages, {row['status']}")
\`\`\`

\`\`\`text
Tidal Systems: 320 pages, done
Coastal Birds: 180 pages, reading
\`\`\`

Three improvements. The header is consumed automatically, so no \`next\` call is needed. Columns are reached by name, so the code says what it means. And inserting a column into the file changes nothing, because nothing depends on position.

Note the quoting inside the f-string: \`row['title']\` uses single quotes because the f-string is delimited by double quotes.

## Converting as you read

Values are still strings. Convert them once, as you build your data:

\`\`\`python
import csv

with open("books.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write("title,pages\\nTidal Systems,320\\nCoastal Birds,180\\n")

books = []
with open("books.csv", encoding="utf-8", newline="") as handle:
    for row in csv.DictReader(handle):
        books.append({"title": row["title"], "pages": int(row["pages"])})

print(books)
print(sum(book["pages"] for book in books))
\`\`\`

\`\`\`text
[{'title': 'Tidal Systems', 'pages': 320}, {'title': 'Coastal Birds', 'pages': 180}]
500
\`\`\`

Converting at the boundary means the rest of the program works with proper types and never has to remember that pages arrived as text.

That list of dictionaries is exactly the "list of records" shape from Module 5. It is the natural in-memory form for tabular data, and everything you learned about iterating, sorting, and grouping applies unchanged.

## DictWriter

\`\`\`python
import csv

books = [
    {"title": "Tidal Systems", "pages": 320},
    {"title": "Coastal Birds", "pages": 180},
]

with open("out.csv", "w", encoding="utf-8", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=["title", "pages"])
    writer.writeheader()
    writer.writerows(books)

with open("out.csv", encoding="utf-8", newline="") as handle:
    print(handle.read().strip())
\`\`\`

\`\`\`text
title,pages
Tidal Systems,320
Coastal Birds,180
\`\`\`

\`fieldnames\` states the column order, since dictionaries carry no inherent notion of which column comes first. \`writeheader()\` writes that row.

A dictionary missing one of the named fields raises \`ValueError\` unless a default is supplied — which is helpful, since a silently blank column is worse than a loud failure.

## Cleaning imported data

Data from outside your program is rarely clean. Values arrive with stray spaces, inconsistent case, missing entries, and occasional nonsense. Handle it at the boundary:

\`\`\`python
import csv

with open("books.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write("title,pages\\n")
    handle.write("  Tidal Systems  ,320\\n")
    handle.write("Broken Record,not a number\\n")
    handle.write("Coastal Birds,180\\n")

books = []
skipped = 0
with open("books.csv", encoding="utf-8", newline="") as handle:
    for row in csv.DictReader(handle):
        title = row["title"].strip()
        try:
            pages = int(row["pages"])
        except ValueError:
            skipped += 1
            continue
        books.append({"title": title, "pages": pages})

print(books)
print(f"Skipped: {skipped}")
\`\`\`

\`\`\`text
[{'title': 'Tidal Systems', 'pages': 320}, {'title': 'Coastal Birds', 'pages': 180}]
Skipped: 1
\`\`\`

Three techniques combine here: stripping whitespace, attempting conversion inside \`try\`, and \`continue\` to skip a bad row without abandoning the rest.

Deciding what to do with bad rows is a real design choice. Skipping silently loses information; stopping entirely may be too strict. Counting them and reporting, as above, is usually the right balance.

> **Key idea**
> Convert and clean data at the point it enters your program. Everything past that boundary can then assume the data is correct, which removes defensive checks from the rest of the code.

## Summary

\`DictReader\` reads rows as dictionaries keyed by the header, so columns are reached by name and are unaffected by reordering. \`DictWriter\` needs \`fieldnames\` and \`writeheader()\`. Convert types and clean values at the boundary, and decide deliberately what to do with rows that fail.`,
        },
        {
          type: "exercise",
          title: "Summarise a CSV File",
          description: "Read tabular data with DictReader, convert it, and report on it.",
          instructions: `## The problem

Read a CSV file of study sessions and report totals per subject.

## Setup

Your program must first create a file named \`sessions.csv\` containing exactly this content:

\`\`\`text
subject,minutes,mode
history,40,revision
biology,25,reading
history,15,essay
statistics,60,practice
\`\`\`

The starter code does this for you.

## Requirements

1. Read the file with \`csv.DictReader\`.
2. Total the minutes for each subject.
3. Display one line per subject, sorted by total minutes descending, then by subject name:

\`\`\`text
statistics: 60
history: 55
biology: 25
\`\`\`

4. Then display one final line with the overall total:

\`\`\`text
Total: 140
\`\`\`

Note the ordering: \`statistics\` comes first with 60 minutes, then \`history\` with 55 from two sessions, then \`biology\` with 25.

## Guidance

Use \`DictReader\` and reach columns by name. The header is consumed automatically, so there is no row to skip.

Convert \`minutes\` to an integer as you read each row.

Group into a dictionary of subject to total, then sort the keys with a key returning the negative total and the name.

## Constraints

Open the file with \`newline=""\`. Do not split lines on commas yourself.`,
          starterCode: `import csv

with open("sessions.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write("subject,minutes,mode\\n")
    handle.write("history,40,revision\\n")
    handle.write("biology,25,reading\\n")
    handle.write("history,15,essay\\n")
    handle.write("statistics,60,practice\\n")

totals = {}
`,
          hint: "Loop over csv.DictReader(handle), doing totals[row[\"subject\"]] = totals.get(row[\"subject\"], 0) + int(row[\"minutes\"]). Then sort with key=lambda name: (-totals[name], name).",
          tests: [
            {
              expectedOutput: "statistics: 60\nhistory: 55\nbiology: 25\nTotal: 140",
              description: "Subjects are grouped, totalled, and ordered by minutes descending",
            },
          ],
          solution: `import csv

with open("sessions.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write("subject,minutes,mode\\n")
    handle.write("history,40,revision\\n")
    handle.write("biology,25,reading\\n")
    handle.write("history,15,essay\\n")
    handle.write("statistics,60,practice\\n")

totals = {}
with open("sessions.csv", encoding="utf-8", newline="") as handle:
    for row in csv.DictReader(handle):
        subject = row["subject"]
        totals[subject] = totals.get(subject, 0) + int(row["minutes"])

for subject in sorted(totals, key=lambda name: (-totals[name], name)):
    print(f"{subject}: {totals[subject]}")

print(f"Total: {sum(totals.values())}")
`,
        },
      ],
    ),

    lesson(
      "JSON",
      "A structured format that maps directly onto Python's own collections.",
      [
        {
          type: "lesson",
          title: "JSON Values and the json Module",
          description: "Converting between Python data and text, in both directions.",
          instructions: `## Beyond flat tables

CSV represents a table: rows and columns, all values text. It cannot naturally represent a book with a list of tags, or a record containing another record.

**JSON** — JavaScript Object Notation — is a text format for structured data with nesting and types. It is the standard format for web APIs and configuration files.

\`\`\`text
{
  "title": "Tidal Systems",
  "pages": 320,
  "finished": true,
  "tags": ["marine", "reference"]
}
\`\`\`

## JSON maps onto Python

The correspondence is close, which is why working with JSON in Python is comfortable:

An object becomes a dictionary. An array becomes a list. A string becomes a string. A number becomes an \`int\` or \`float\`. \`true\` and \`false\` become \`True\` and \`False\`. \`null\` becomes \`None\`.

Note the capitalisation difference: JSON writes \`true\`, \`false\`, and \`null\` in lowercase, while Python writes \`True\`, \`False\`, and \`None\`. The module handles the translation; the difference matters only when reading raw JSON by eye.

## The four functions

The \`json\` module provides four functions, and the naming is worth learning deliberately because it is easy to reach for the wrong one.

\`json.dumps\` converts Python data **to** a JSON string. \`json.loads\` converts a JSON string **to** Python data. The \`s\` means "string".

\`json.dump\` writes Python data to a **file**. \`json.load\` reads from a file. No \`s\`.

So: \`dump\` writes, \`load\` reads, and the \`s\` suffix means a string rather than a file.

\`\`\`python
import json

book = {"title": "Tidal Systems", "pages": 320, "tags": ["marine"]}

text = json.dumps(book)
print(text)
print(type(text).__name__)

restored = json.loads(text)
print(restored["pages"] + 1)
\`\`\`

\`\`\`text
{"title": "Tidal Systems", "pages": 320, "tags": ["marine"]}
str
321
\`\`\`

\`dumps\` produced a string. \`loads\` turned it back into a dictionary whose values have their proper types — \`320\` is an integer, so arithmetic works immediately.

That is a significant advantage over CSV, where everything arrives as text and must be converted.

## Readable output

\`\`\`python
import json

book = {"title": "Tidal Systems", "pages": 320}
print(json.dumps(book, indent=2))
\`\`\`

\`\`\`text
{
  "title": "Tidal Systems",
  "pages": 320
}
\`\`\`

\`indent=2\` produces output a person can read, which matters for configuration files kept in version control. Without it, everything is on one line — more compact, and appropriate for data sent over a network.

\`sort_keys=True\` orders the keys alphabetically, which makes output stable regardless of insertion order:

\`\`\`python
import json

book = {"pages": 320, "title": "Tidal Systems"}
print(json.dumps(book, sort_keys=True))
\`\`\`

\`\`\`text
{"pages": 320, "title": "Tidal Systems"}
\`\`\`

That is worth using whenever output is compared or stored, because it removes an irrelevant source of difference.

## Files

\`\`\`python
import json

books = [
    {"title": "Tidal Systems", "pages": 320},
    {"title": "Coastal Birds", "pages": 180},
]

with open("books.json", "w", encoding="utf-8") as handle:
    json.dump(books, handle, indent=2)

with open("books.json", encoding="utf-8") as handle:
    loaded = json.load(handle)

print(len(loaded))
print(loaded[0]["title"])
print(sum(book["pages"] for book in loaded))
\`\`\`

\`\`\`text
2
Tidal Systems
500
\`\`\`

The whole structure — a list of dictionaries — survived the round trip with its types intact.

## What JSON cannot store

JSON has no tuples, sets, or dates. A tuple becomes a list on the way out and stays a list on the way back:

\`\`\`python
import json

original = {"point": (1, 2)}
restored = json.loads(json.dumps(original))
print(restored)
print(type(restored["point"]).__name__)
\`\`\`

\`\`\`text
{'point': [1, 2]}
list
\`\`\`

A set raises \`TypeError\`. Convert to a list before saving.

Dates must be stored as strings, conventionally in ISO format such as \`"2024-07-15"\`, and parsed back when loaded.

Dictionary keys must be strings. An integer key becomes a string key on the round trip, which is a genuine trap:

\`\`\`python
import json

counts = {1: "one", 2: "two"}
restored = json.loads(json.dumps(counts))
print(restored)
\`\`\`

\`\`\`text
{'1': 'one', '2': 'two'}
\`\`\`

The keys are now strings. Any code looking up \`counts[1]\` will raise \`KeyError\`.

> **Key idea**
> A JSON round trip is not always lossless. Tuples become lists, sets are rejected, and dictionary keys become strings. Design your data with the format's limits in mind.

## Malformed JSON

\`\`\`python
import json

try:
    json.loads("{not valid}")
except json.JSONDecodeError as error:
    print(f"Could not parse: {error.msg}")
\`\`\`

\`\`\`text
Could not parse: Expecting property name enclosed in double quotes
\`\`\`

\`JSONDecodeError\` is a subclass of \`ValueError\`, so catching either works. Any JSON from outside your program should be parsed inside a \`try\`.

## Summary

JSON stores nested, typed data and maps closely onto Python's collections. \`dumps\`/\`loads\` work with strings; \`dump\`/\`load\` work with files. Use \`indent\` for readability and \`sort_keys\` for stable output. Tuples become lists, sets are unsupported, and keys become strings.`,
        },
        {
          type: "lesson",
          title: "Validating Imported Data",
          description: "Treating external data as untrusted, and failing usefully when it is wrong.",
          instructions: `## Data from outside is not trustworthy

Data your program creates is under your control. Data arriving from a file, a network, or a person is not. It may be missing fields, hold the wrong types, or be structured differently from what you expect.

The consequences of assuming it is correct show up far from the cause:

\`\`\`python
import json

text = '{"title": "Tidal Systems"}'
book = json.loads(text)
print(book.get("pages", "no pages recorded"))
\`\`\`

\`\`\`text
no pages recorded
\`\`\`

Writing \`book["pages"]\` there would raise \`KeyError\` — perhaps in a report function three layers away, where the message tells you nothing about which record was malformed.

## Validate at the boundary

The remedy is to check the data once, where it enters, and reject or repair anything wrong. After that, the rest of the program can assume it is correct.

\`\`\`python
import json


def validate_book(record):
    """Return an error message for an invalid book record, or '' if valid."""
    if not isinstance(record, dict):
        return "record is not an object"
    if "title" not in record:
        return "missing title"
    if not isinstance(record["title"], str) or record["title"].strip() == "":
        return "title must be non-empty text"
    if "pages" not in record:
        return "missing pages"
    if not isinstance(record["pages"], int):
        return "pages must be a whole number"
    if record["pages"] < 0:
        return "pages cannot be negative"
    return ""


good = json.loads('{"title": "Tidal Systems", "pages": 320}')
bad = json.loads('{"title": "", "pages": 320}')

print(validate_book(good) or "valid")
print(validate_book(bad) or "valid")
\`\`\`

\`\`\`text
valid
title must be non-empty text
\`\`\`

\`isinstance(value, type)\` reports whether a value is of a given type. It is the right tool here because JSON can supply anything: a number where text was expected, a list where an object was expected.

\`validate_book(good) or "valid"\` uses truthiness — an empty string is false, so the \`or\` supplies the alternative. A neat idiom, though a plain \`if\` is clearer when the logic grows.

## Reporting which record failed

When processing many records, say which one was wrong:

\`\`\`python
import json


def validate(record):
    if "title" not in record:
        return "missing title"
    if not isinstance(record.get("pages"), int):
        return "pages must be a whole number"
    return ""


text = '[{"title": "A", "pages": 100}, {"title": "B", "pages": "many"}, {"pages": 50}]'
records = json.loads(text)

accepted = []
for position, record in enumerate(records, start=1):
    problem = validate(record)
    if problem:
        print(f"Record {position} rejected: {problem}")
    else:
        accepted.append(record)

print(f"Accepted {len(accepted)} of {len(records)}")
\`\`\`

\`\`\`text
Record 2 rejected: pages must be a whole number
Record 3 rejected: missing title
Accepted 1 of 3
\`\`\`

\`enumerate(records, start=1)\` numbers from 1 rather than 0, which is what a person expects when told "record 2".

The program processed everything it could and reported precisely what it could not. That is usually better than stopping at the first problem, and much better than silently skipping.

## A caution about booleans

\`isinstance(True, int)\` is \`True\` in Python, because \`bool\` is a subclass of \`int\`. So a validator checking \`isinstance(value, int)\` accepts \`True\` as a page count.

If that matters, exclude it explicitly:

\`\`\`python
def is_whole_number(value):
    return isinstance(value, int) and not isinstance(value, bool)


print(is_whole_number(320))
print(is_whole_number(True))
\`\`\`

\`\`\`text
True
False
\`\`\`

This is the kind of detail that only surfaces when data is genuinely untrusted, which is exactly when it matters.

## Reject, repair, or default?

Three reasonable responses to a bad record, and the choice is a design decision:

**Reject it** and report. Right when the data must be correct.

**Repair it** with a sensible default — an absent \`tags\` list becomes \`[]\`. Right when the field is genuinely optional.

**Fail entirely.** Right when partial data is worse than none, as in a financial import.

What is never right is ignoring the problem and hoping. A bad value that travels through a program surfaces later, far from its cause, as a confusing failure — which is the fail-fast argument from Module 7 applied to data.

> **Key idea**
> Validate external data once, at the boundary, and decide deliberately whether to reject, repair, or fail. Past that point the rest of your program can trust its inputs.

## Summary

Treat all external data as untrusted. Validate at the boundary with \`isinstance\` and explicit key checks, report which record failed and why, and choose deliberately between rejecting, repairing, and failing. Remember that \`bool\` counts as \`int\`.`,
        },
        {
          type: "exercise",
          title: "Round-Trip JSON Data",
          description: "Write structured data to a file, read it back, and summarise it.",
          instructions: `## The problem

Save a set of records as JSON, load them again, and report on them.

## Input

A series of lines in the form \`title|pages|tag\`, ending with \`end\`.

## Requirements

1. Build a list of dictionaries, one per record, with keys \`title\`, \`pages\`, and \`tags\`. \`pages\` must be an integer. \`tags\` must be a **list** containing the single tag.
2. Write the list to \`library.json\` using \`json.dump\` with \`indent=2\`.
3. Read it back with \`json.load\`.
4. Display exactly three lines from the **loaded** data:

\`\`\`text
Records: 2
Total pages: 500
Tags: marine, reference
\`\`\`

Where \`Tags\` lists every distinct tag, sorted alphabetically and joined by \`, \`.

## Example

Given \`Tidal Systems|320|marine\`, \`Coastal Birds|180|reference\`, \`end\`, the output is the three lines above.

Given only \`end\`:

\`\`\`text
Records: 0
Total pages: 0
Tags:
\`\`\`

Note that the last line is \`Tags:\` with nothing after it.

## Guidance

The summary must be computed from the data you loaded back, not from the list you built. That is what makes it a genuine round trip.

Collect the distinct tags into a set, then sort it before joining. \`", ".join(items)\` combines a list of strings with that separator.

## Constraints

Use \`json.dump\` and \`json.load\` with a file, not \`dumps\` and \`loads\`.`,
          starterCode: `import json

records = []

line = input()
`,
          hint: "Split each line on \"|\" into three parts and append {\"title\": title, \"pages\": int(pages), \"tags\": [tag]}. After dumping and loading, use sum(r[\"pages\"] for r in loaded) and build a set from every tag in every record.",
          tests: [
            {
              input: "Tidal Systems|320|marine\nCoastal Birds|180|reference\nend\n",
              expectedOutput: "Records: 2\nTotal pages: 500\nTags: marine, reference",
              description: "Records survive the round trip with integer pages and list tags",
            },
            {
              input: "end\n",
              expectedOutput: "Records: 0\nTotal pages: 0\nTags:",
              description: "An empty set of records writes and reads back as an empty list",
            },
            {
              input: "A|10|x\nB|20|x\nend\n",
              expectedOutput: "Records: 2\nTotal pages: 30\nTags: x",
              description: "A repeated tag appears only once in the summary",
            },
            {
              input: "Solo|5|zeta\nend\n",
              expectedOutput: "Records: 1\nTotal pages: 5\nTags: zeta",
              description: "A single record round-trips correctly",
            },
          ],
          solution: `import json

records = []

line = input()
while line != "end":
    title, pages, tag = line.split("|")
    records.append({"title": title, "pages": int(pages), "tags": [tag]})
    line = input()

with open("library.json", "w", encoding="utf-8") as handle:
    json.dump(records, handle, indent=2)

with open("library.json", encoding="utf-8") as handle:
    loaded = json.load(handle)

tags = set()
total = 0
for record in loaded:
    total += record["pages"]
    for tag in record["tags"]:
        tags.add(tag)

print(f"Records: {len(loaded)}")
print(f"Total pages: {total}")
print(f"Tags: {', '.join(sorted(tags))}")
`,
        },
        {
          type: "exercise",
          title: "Module 10 Checkpoint: Import, Validate, Report",
          description: "Read a CSV file, validate every row, write valid records as JSON, and report.",
          instructions: `## The problem

Build a small import pipeline: read tabular data, reject anything invalid with a specific reason, save what survives, and report.

## Setup

The starter code creates \`incoming.csv\` with this content:

\`\`\`text
title,pages,status
Tidal Systems,320,done
,180,reading
Broken Record,many,done
Coastal Birds,-40,done
Deep Water,400,unknown
Salt Marshes,150,reading
\`\`\`

## Requirements

1. Read the file with \`csv.DictReader\`.
2. Validate each row in this order, rejecting with the first message that applies:
   - Empty title (after stripping): \`missing title\`
   - Pages not a whole number: \`bad pages\`
   - Pages negative: \`negative pages\`
   - Status not \`done\` or \`reading\`: \`bad status\`
3. For each rejected row, display \`Row N rejected: MESSAGE\` where N counts data rows from 1.
4. Write the accepted records to \`clean.json\` with \`json.dump\`, each a dictionary with keys \`title\`, \`pages\`, and \`status\`, with \`pages\` as an integer.
5. Read that file back and display exactly two final lines:

\`\`\`text
Accepted: 2
Total pages: 470
\`\`\`

## Expected output

\`\`\`text
Row 2 rejected: missing title
Row 3 rejected: bad pages
Row 4 rejected: negative pages
Row 5 rejected: bad status
Accepted: 2
Total pages: 470
\`\`\`

Two of the six data rows survive: \`Tidal Systems\` at 320 pages and \`Salt Marshes\` at 150, giving 470.

## Guidance

Number the data rows with \`enumerate(reader, start=1)\`, so the header does not count.

Attempt the page conversion inside \`try\` and catch \`ValueError\` to produce the \`bad pages\` message; the negative check happens only after a successful conversion.

The final totals must be computed from the data read back out of \`clean.json\`.

## Constraints

Use \`csv.DictReader\` for reading and \`json.dump\` / \`json.load\` for the JSON file.`,
          starterCode: `import csv
import json

with open("incoming.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write("title,pages,status\\n")
    handle.write("Tidal Systems,320,done\\n")
    handle.write(",180,reading\\n")
    handle.write("Broken Record,many,done\\n")
    handle.write("Coastal Birds,-40,done\\n")
    handle.write("Deep Water,400,unknown\\n")
    handle.write("Salt Marshes,150,reading\\n")

accepted = []
`,
          hint: "Write a validate(row) helper returning an error message or \"\". Loop with enumerate(csv.DictReader(handle), start=1), print rejections, and append cleaned dictionaries to accepted. Then dump, load, and summarise the loaded list.",
          tests: [
            {
              expectedOutput:
                "Row 2 rejected: missing title\nRow 3 rejected: bad pages\nRow 4 rejected: negative pages\nRow 5 rejected: bad status\nAccepted: 2\nTotal pages: 470",
              description: "Each invalid row is rejected with its own reason and only valid records are saved",
            },
          ],
          solution: `import csv
import json

with open("incoming.csv", "w", encoding="utf-8", newline="") as handle:
    handle.write("title,pages,status\\n")
    handle.write("Tidal Systems,320,done\\n")
    handle.write(",180,reading\\n")
    handle.write("Broken Record,many,done\\n")
    handle.write("Coastal Birds,-40,done\\n")
    handle.write("Deep Water,400,unknown\\n")
    handle.write("Salt Marshes,150,reading\\n")

accepted = []

with open("incoming.csv", encoding="utf-8", newline="") as handle:
    for position, row in enumerate(csv.DictReader(handle), start=1):
        title = row["title"].strip()
        if title == "":
            print(f"Row {position} rejected: missing title")
            continue

        try:
            pages = int(row["pages"])
        except ValueError:
            print(f"Row {position} rejected: bad pages")
            continue

        if pages < 0:
            print(f"Row {position} rejected: negative pages")
            continue

        status = row["status"].strip()
        if status not in ("done", "reading"):
            print(f"Row {position} rejected: bad status")
            continue

        accepted.append({"title": title, "pages": pages, "status": status})

with open("clean.json", "w", encoding="utf-8") as handle:
    json.dump(accepted, handle, indent=2)

with open("clean.json", encoding="utf-8") as handle:
    loaded = json.load(handle)

print(f"Accepted: {len(loaded)}")
print(f"Total pages: {sum(record['pages'] for record in loaded)}")
`,
        },
      ],
    ),
  ],
)

export default moduleTen

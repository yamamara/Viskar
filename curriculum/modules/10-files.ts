import { module, lesson, type ModuleSource } from "../types.ts"

const moduleTen: ModuleSource = module(
  "Files, CSV, and JSON",
  "Making data outlive the program that made it: reading and writing text files, and working with the two most common structured formats.",
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

Everything your programs have produced so far disappeared when they finished. Variables exist only while a program runs.

**Persistence** means keeping data so that it survives. The simplest form is a file.

## Paths

A **path** names a file. \`notes.txt\` is a *relative* path: it names a file in the folder where the program is running. \`/home/ada/notes.txt\` is an *absolute* path, naming a file from the very top of the file system.

Relative paths are usually the right choice, because they let a program work wherever it is installed. An absolute path builds in an assumption about one particular machine.

In this course, every program runs in its own private folder, so relative filenames are all you need. Files made by one exercise cannot be seen by the next. Every exercise creates the data it needs.

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

\`open\` takes a path and a **mode**. \`"w"\` means write. It gives back a **file object**, often called a handle, and you read or write the file through it.

Note the \`\\n\` at the end of each write. Unlike \`print\`, \`write\` adds nothing of its own. Without them, everything ends up on one line.

## The with statement

The \`with\` above matters. An open file uses a resource that must be given back, and data you write may sit in a buffer and only reach the disk when the file is closed.

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

That works until something goes wrong between the opening and the closing. If an exception is raised in the middle, \`close()\` never runs, and the file may be left half finished.

\`with\` closes the file for you when the block ends, whether it ends normally or through an exception:

\`\`\`python
with open("notes.txt", "w") as handle:
    handle.write("safe\\n")

print("closed automatically")
\`\`\`

\`\`\`text
closed automatically
\`\`\`

This is the \`finally\` idea from Module 7, packed into one statement. Always use \`with\`. In ordinary code there is no situation where opening a file without it is better.

> **Key idea**
> \`with open(...) as handle:\` promises that the file is closed when the block ends, even if an exception happens. Use it every time.

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

\`read()\` gives back the whole contents as one string. The mode was left out because \`"r"\` for reading is the default.

\`repr\` is used here on purpose, to make the newline characters visible. Printing \`content\` directly would show two lines and hide the structure.

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

Going through a file object gives you one line at a time. **Each line keeps its newline at the end**, and that is the single most common surprise when working with files.

It matters straight away:

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

\`int("42\\n")\` happens to work, because \`int\` allows spaces and newlines around the number. But \`line == "42"\` would be \`False\`, and \`len(line)\` is 3, not 2. Strip each line as you read it, and the problem disappears.

Going line by line also uses little memory. It reads one line at a time instead of loading the whole file, and that matters for large files.

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

\`read().splitlines()\` gives a list of lines with the newlines already removed, and that is often exactly what you want. \`readlines()\` also gives a list, but it keeps the newlines.

## Summary

A path names a file, and relative paths are usually right. \`open(path, mode)\` gives a handle, and \`with\` promises it is closed. \`write\` adds no newline of its own. Going through a file gives lines that keep their newline, so strip them.`,
        },
        {
          type: "lesson",
          title: "Modes, Appending, and Failures",
          description: "Choosing a mode without destroying data, and dealing with files that are not there.",
          instructions: `## The modes

The mode decides what \`open\` does and what you are allowed to do.

\`"r"\` — read. The file must exist, or you get \`FileNotFoundError\`. This is the default.

\`"w"\` — write. It creates the file, or **empties it completely** if it already exists.

\`"a"\` — append. It creates the file if needed, and adds to the end of a file that exists.

\`"x"\` — create only. It creates the file, but raises \`FileExistsError\` if the file is already there.

## The danger of "w"

\`"w"\` destroys the existing content at once, before you write anything:

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

The original is gone. There is no warning, and there is no undo.

This is a genuinely common way to lose data. The habit worth building is to stop whenever you type \`"w"\` and ask whether the file might already hold something you want to keep.

When you are adding to a record, use \`"a"\`:

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

When a file must never be overwritten, \`"x"\` turns that into a rule the operating system enforces, instead of one you have to remember.

## Dealing with missing files

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

**Or try it and handle the failure**, as in the first example.

For files, the second is usually better, because checking first has a quiet flaw. The file may be deleted between the check and the open. The gap is tiny but real, and on a busy machine it eventually happens. Trying the operation and handling the failure leaves no gap at all.

This is a case where exception handling beats checking first, and it is worth understanding why, rather than taking it as a rule with no reason behind it. Checking wins when the check is dependable. Here it is not.

> **Key idea**
> \`"w"\` empties an existing file before writing. Use \`"a"\` to add, and \`"x"\` to refuse to overwrite. Prefer \`try\`/\`except FileNotFoundError\` over checking that the file exists, because the file can change between the check and the open.

## Other file exceptions

\`PermissionError\` — the file exists, but you are not allowed to read or write it.

\`IsADirectoryError\` — the path names a folder, not a file.

\`UnicodeDecodeError\` — the bytes are not valid text in the expected encoding, usually because the file is not a text file at all.

Catch the exact one you can deal with. Catching all of them and reporting "file error" tells a user nothing about what to do next.

## Text and binary

Text mode turns bytes into characters using an **encoding**. Almost always this should be UTF-8, which can hold every character in every language:

\`\`\`python
with open("notes.txt", "w", encoding="utf-8") as handle:
    handle.write("café — naïve\\n")

with open("notes.txt", encoding="utf-8") as handle:
    print(handle.read().strip())
\`\`\`

\`\`\`text
café — naïve
\`\`\`

The default encoding depends on the machine, so a program that leaves it out can work on one computer and raise \`UnicodeDecodeError\` on another. Writing \`encoding="utf-8"\` yourself avoids a kind of bug that is very tiring to track down.

Adding \`"b"\` to a mode opens the file in **binary**, which gives you raw bytes instead of text. That is what you need for images, sound, and compressed files, none of which are text at all.

## Writing safely

Two habits are worth taking up.

Write to a temporary file and rename it when you have finished. Then a crash partway through leaves the original file whole, instead of leaving a half-written file.

Never open a file for writing while you are reading it. Read everything, close it, change the data in memory, and then write.

## Summary

\`"r"\` reads and needs the file to exist. \`"w"\` empties it. \`"a"\` adds to the end. \`"x"\` refuses to overwrite. Prefer catching \`FileNotFoundError\` to checking that the file exists. Always give \`encoding="utf-8"\` for text.`,
        },
        {
          type: "exercise",
          title: "Write, Append, and Read Back",
          description: "Create a file, add to it, and then report on what it holds.",
          instructions: `## The problem

Build a small log file and then summarise it.

## Input

A series of lines ending with \`end\`. Every other line is an entry to record.

## Requirements

1. Write the **first** entry to a file named \`log.txt\` using write mode, which creates the file.
2. Append every later entry to the same file.
3. Each entry has its own line in the file.
4. After \`end\`, read the file back and show exactly:

\`\`\`text
Entries: 3
First: alpha
Last: gamma
\`\`\`

If there were no entries at all, do not create the file, and show:

\`\`\`text
Entries: 0
\`\`\`

with nothing else.

## Example

Given \`alpha\`, \`beta\`, \`gamma\`, \`end\`, the output is the three lines above.

## Guidance

Write mode empties the file, so use it only once, for the first entry. Everything after that appends.

Remember that \`write\` adds no newline. You must put \`\\n\` in yourself, or all the entries will end up on one line.

When you read the file back, \`read().splitlines()\` gives a list with the newlines already removed, and that makes counting and indexing simple.

## Constraints

Use \`with\` for every file operation. The file is made fresh on each run, so you need not worry about anything left over from a previous run.`,
          starterCode: `entries = []

line = input()
`,
          hint: "Collect the entries into a list first, then decide. If the list is empty, just print Entries: 0. Otherwise write the first entry with mode \"w\" and append the rest with mode \"a\", each followed by a newline.",
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
              description: "No entries gives only the count line, and no file",
            },
            {
              input: "a\nb\nend\n",
              expectedOutput: "Entries: 2\nFirst: a\nLast: b",
              description: "Two entries show that appending keeps the order",
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

Write a function that reads the lines of a file, and gives back an empty list when the file does not exist.

## Requirements

1. Define \`read_lines(path: str) -> list[str]\`, which:
   - Returns a list of the file's lines, with the newlines removed.
   - Returns an empty list if the file does not exist, instead of raising an error.
2. Define \`summarise(lines: list[str]) -> str\`, which returns:
   - \`No data\` for an empty list.
   - Otherwise \`3 lines, longest: gamma\` — the count, and the longest line. When two lines tie, the one that comes first in the file wins.

## Then

Read one line of input: the name of the file to read. Before reading it, create a file named \`present.txt\` holding three lines: \`alpha\`, \`beta\`, and \`gamma\`.

Then call the two functions with the filename you were given, and print the summary.

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

Look at the first example carefully. \`alpha\`, \`beta\`, and \`gamma\` have lengths 5, 4, and 5. \`alpha\` and \`gamma\` tie at 5, and \`alpha\` comes first, so it wins.

## Guidance

Wrap only the \`open\` call in \`try\`, and catch \`FileNotFoundError\` exactly. Catching everything would also hide mistakes in your own code.

For the longest line, looping and keeping the best so far gives the first-wins behaviour naturally, because you replace it only when a line is strictly longer.

## Constraints

Do not use \`os.path.exists\`. The point of this exercise is to try the operation and handle its failure.`,
          starterCode: `def read_lines(path: str) -> list[str]:
    return []


def summarise(lines: list[str]) -> str:
    return "No data"


with open("present.txt", "w", encoding="utf-8") as handle:
    handle.write("alpha\\nbeta\\ngamma\\n")

filename = input()
print(summarise(read_lines(filename)))
`,
          hint: "In read_lines: try opening the file and return handle.read().splitlines(), and use except FileNotFoundError: return []. In summarise, guard the empty list, then loop keeping the longest line, replacing it only when a line is strictly longer.",
          tests: [
            {
              input: "present.txt\n",
              expectedOutput: "3 lines, longest: alpha",
              description: "An existing file is read, and the first of the two longest lines wins",
            },
            {
              input: "absent.txt\n",
              expectedOutput: "No data",
              description: "A missing file gives an empty list instead of raising an error",
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
      "The most common format for table data, and the module that deals with its awkward cases.",
      [
        {
          type: "lesson",
          title: "Rows, Headers, and the csv Module",
          description: "Why splitting on commas is not enough, and what to use instead.",
          instructions: `## Table data written as text

**CSV** stands for comma-separated values. It stores a table as text. Each line is a row, and commas separate the columns:

\`\`\`text
title,pages,status
Tidal Systems,320,done
Coastal Birds,180,reading
\`\`\`

The first row is usually a **header** that names the columns. It looks like data but describes it, so it must be handled separately.

CSV is used everywhere, because every spreadsheet and every database can read and write it, and because it is plain text that a person can look at.

## Why you cannot just split on commas

Here is the obvious approach:

\`\`\`python
line = "Tidal Systems,320,done"
print(line.split(","))
\`\`\`

\`\`\`text
['Tidal Systems', '320', 'done']
\`\`\`

That works until a value itself holds a comma. CSV deals with this by putting quotes around the value:

\`\`\`text
title,pages,status
"Birds, Coastal",180,reading
\`\`\`

Now splitting on commas gives four pieces instead of three, and every column after the first one is wrong:

\`\`\`python
line = '"Birds, Coastal",180,reading'
print(line.split(","))
\`\`\`

\`\`\`text
['"Birds', ' Coastal"', '180', 'reading']
\`\`\`

There are more complications. A quoted value may hold newlines, and a quote inside a quoted value is written twice. Handling all of that correctly is more work than it looks, and getting it slightly wrong spoils your data in silence.

> **Key idea**
> Never read CSV by splitting on commas. Quoted fields that hold commas will quietly give you wrong data. Use the \`csv\` module, which follows the rules correctly.

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

The quoted field arrived as one value, with its comma still inside it.

\`csv.reader\` gives each row as a list of strings. Two details matter.

**Every value is a string.** \`'180'\` is text, not a number. Convert what you need, exactly as you do with \`input()\`.

**\`newline=""\` is required.** The csv module deals with line endings itself, and leaving this out causes trouble on some systems. Include it whenever you open a file for csv.

## Handling the header

The header arrives as the first row, so skip it on purpose:

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

\`next(reader)\` reads one row and moves on, so the loop starts at the first row of real data. If you forget this, you get \`ValueError: invalid literal for int()\` when the header text meets a conversion. That is a distinctive sign worth recognising.

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

The writer put quotes around the value with a comma in it, and left the others alone. Doing that correctly by hand means knowing every rule. The module already knows them.

\`writerow\` writes one row. \`writerows\` writes many.

## Summary

CSV stores table data with one row for each line, and usually a header. Splitting on commas breaks on quoted fields, so use the \`csv\` module. Values arrive as strings and must be converted. Open csv files with \`newline=""\`, and skip the header with \`next(reader)\`.`,
        },
        {
          type: "lesson",
          title: "DictReader and DictWriter",
          description: "Working with columns by name instead of by position.",
          instructions: `## The problem with positions

Reading rows as lists means naming columns by their index:

\`\`\`python
row = ["Tidal Systems", "320", "done"]
print(row[1])
\`\`\`

\`\`\`text
320
\`\`\`

\`row[1]\` says nothing about what it holds. Worse, if someone adds a column to the file, every index moves, and your program quietly reads the wrong data.

This is the same argument that led to dictionaries in Module 5. Position is the wrong handle when the thing has a name.

## DictReader

\`csv.DictReader\` reads each row as a dictionary, using the header for the keys:

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

Three things improved. The header is used up for you, so you need no \`next\` call. Columns are reached by name, so the code says what it means. And adding a column to the file changes nothing, because nothing depends on position.

Note the quotes inside the f-string. \`row['title']\` uses single quotes, because the f-string itself is inside double quotes.

## Converting as you read

The values are still strings. Convert them once, as you build your data:

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

Converting at the boundary means the rest of the program works with proper types, and never has to remember that the pages arrived as text.

That list of dictionaries is exactly the "list of records" shape from Module 5. It is the natural way to hold table data in memory, and everything you learned about going through, sorting, and grouping applies without change.

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

\`fieldnames\` gives the order of the columns, because a dictionary has no idea which column should come first. \`writeheader()\` writes that first row.

A dictionary that is missing one of the named fields raises \`ValueError\`, unless you supply a default. That is helpful, because a quietly blank column is worse than a loud failure.

## Cleaning data that comes in

Data from outside your program is rarely tidy. Values arrive with extra spaces, capital letters in odd places, missing entries, and occasional nonsense. Deal with it at the boundary:

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

Three techniques come together here: stripping spaces, trying the conversion inside \`try\`, and using \`continue\` to skip a bad row without giving up on the rest.

Deciding what to do with bad rows is a real design choice. Skipping them in silence loses information. Stopping completely may be too strict. Counting them and reporting the count, as above, is usually the right balance.

> **Key idea**
> Convert and clean data at the point where it enters your program. Everything past that boundary can then assume the data is correct, which removes defensive checks from the rest of the code.

## Summary

\`DictReader\` reads rows as dictionaries keyed by the header, so columns are reached by name and are not affected by reordering. \`DictWriter\` needs \`fieldnames\` and \`writeheader()\`. Convert types and clean values at the boundary, and decide on purpose what to do with rows that fail.`,
        },
        {
          type: "exercise",
          title: "Summarise a CSV File",
          description: "Read table data with DictReader, convert it, and report on it.",
          instructions: `## The problem

Read a CSV file of study sessions and report the totals for each subject.

## Setup

Your program must first create a file named \`sessions.csv\` holding exactly this:

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
2. Add up the minutes for each subject.
3. Show one line for each subject, sorted by total minutes with the highest first, then by subject name:

\`\`\`text
statistics: 60
history: 55
biology: 25
\`\`\`

4. Then show one last line with the overall total:

\`\`\`text
Total: 140
\`\`\`

Note the order. \`statistics\` comes first with 60 minutes, then \`history\` with 55 from two sessions, then \`biology\` with 25.

## Guidance

Use \`DictReader\` and reach the columns by name. The header is used up for you, so there is no row to skip.

Convert \`minutes\` to an integer as you read each row.

Group the data into a dictionary from subject to total, then sort the keys with a key that returns the negative total and the name.

## Constraints

Open the file with \`newline=""\`. Do not split the lines on commas yourself.`,
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
              description: "Subjects are grouped, added up, and ordered by minutes with the highest first",
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
      "A structured format that matches Python's own collections almost exactly.",
      [
        {
          type: "lesson",
          title: "JSON Values and the json Module",
          description: "Converting between Python data and text, in both directions.",
          instructions: `## Beyond flat tables

CSV holds a table: rows and columns, with every value as text. It cannot naturally hold a book with a list of tags, or a record that holds another record inside it.

**JSON** stands for JavaScript Object Notation. It is a text format for structured data, with nesting and with types. It is the standard format for web APIs and for configuration files.

\`\`\`text
{
  "title": "Tidal Systems",
  "pages": 320,
  "finished": true,
  "tags": ["marine", "reference"]
}
\`\`\`

## JSON matches Python

The two match closely, and that is why working with JSON in Python is comfortable.

An object becomes a dictionary. An array becomes a list. A string stays a string. A number becomes an \`int\` or a \`float\`. \`true\` and \`false\` become \`True\` and \`False\`. \`null\` becomes \`None\`.

Note the difference in capital letters. JSON writes \`true\`, \`false\`, and \`null\` in small letters, while Python writes \`True\`, \`False\`, and \`None\`. The module translates for you. The difference only matters when you read raw JSON with your own eyes.

## The four functions

The \`json\` module gives you four functions. The names are worth learning carefully, because it is easy to reach for the wrong one.

\`json.dumps\` turns Python data **into** a JSON string. \`json.loads\` turns a JSON string **into** Python data. The \`s\` means "string".

\`json.dump\` writes Python data to a **file**. \`json.load\` reads from a file. No \`s\`.

So: \`dump\` writes, \`load\` reads, and the \`s\` at the end means a string rather than a file.

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

\`dumps\` produced a string. \`loads\` turned it back into a dictionary whose values have their proper types. \`320\` is an integer, so arithmetic works at once.

That is a real advantage over CSV, where everything arrives as text and must be converted.

## Output a person can read

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

\`indent=2\` gives output that a person can read, and that matters for configuration files kept under version control. Without it, everything sits on one line. That is smaller, and it suits data sent over a network.

\`sort_keys=True\` puts the keys in alphabetical order, which makes the output the same whatever order the keys were added in:

\`\`\`python
import json

book = {"pages": 320, "title": "Tidal Systems"}
print(json.dumps(book, sort_keys=True))
\`\`\`

\`\`\`text
{"pages": 320, "title": "Tidal Systems"}
\`\`\`

That is worth using whenever the output is compared or stored, because it removes a difference that means nothing.

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

The whole structure, a list of dictionaries, survived the journey out and back with its types unchanged.

## What JSON cannot hold

JSON has no tuples, no sets, and no dates. A tuple becomes a list on the way out, and it stays a list on the way back:

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

A set raises \`TypeError\`. Change it to a list before saving.

Dates must be stored as strings, usually in the form \`"2024-07-15"\`, and read back into dates when they are loaded.

Dictionary keys must be strings. An integer key becomes a string key on the journey, and that is a real trap:

\`\`\`python
import json

counts = {1: "one", 2: "two"}
restored = json.loads(json.dumps(counts))
print(restored)
\`\`\`

\`\`\`text
{'1': 'one', '2': 'two'}
\`\`\`

The keys are now strings. Any code that looks up \`counts[1]\` will raise \`KeyError\`.

> **Key idea**
> A journey out to JSON and back does not always return exactly what you sent. Tuples become lists, sets are refused, and dictionary keys become strings. Design your data with those limits in mind.

## Broken JSON

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

\`JSONDecodeError\` is a kind of \`ValueError\`, so catching either one works. Any JSON from outside your program should be read inside a \`try\`.

## Summary

JSON holds nested data with types, and it matches Python's collections closely. \`dumps\` and \`loads\` work with strings. \`dump\` and \`load\` work with files. Use \`indent\` to make it readable and \`sort_keys\` for steady output. Tuples become lists, sets are not supported, and keys become strings.`,
        },
        {
          type: "lesson",
          title: "Validating Imported Data",
          description: "Treating data from outside as untrusted, and failing in a useful way when it is wrong.",
          instructions: `## Data from outside cannot be trusted

Data that your program made is under your control. Data that arrives from a file, from a network, or from a person is not. It may have missing fields, hold the wrong types, or be arranged differently from what you expect.

If you assume it is correct, the trouble shows up a long way from its cause:

\`\`\`python
import json

text = '{"title": "Tidal Systems"}'
book = json.loads(text)
print(book.get("pages", "no pages recorded"))
\`\`\`

\`\`\`text
no pages recorded
\`\`\`

Writing \`book["pages"]\` there would raise \`KeyError\`, perhaps inside a reporting function three layers away, where the message tells you nothing about which record was broken.

## Check at the boundary

The answer is to check the data once, where it comes in, and to refuse or repair anything wrong. After that, the rest of the program can assume that the data is correct.

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

\`isinstance(value, type)\` says whether a value is of a given type. It is the right tool here, because JSON can give you anything: a number where you expected text, or a list where you expected an object.

\`validate_book(good) or "valid"\` uses the truth rules. An empty string counts as false, so \`or\` supplies the other value. It is a neat trick, although a plain \`if\` is clearer once the logic grows.

## Saying which record failed

When you handle many records, say which one was wrong:

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

\`enumerate(records, start=1)\` numbers from 1 instead of 0, and that is what a person expects when they are told "record 2".

The program handled everything it could and reported exactly what it could not. That is usually better than stopping at the first problem, and far better than skipping in silence.

## A warning about Booleans

\`isinstance(True, int)\` is \`True\` in Python, because \`bool\` is built on top of \`int\`. So a check using \`isinstance(value, int)\` will accept \`True\` as a page count.

If that matters, rule it out on purpose:

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

This is the kind of detail that only appears when the data really is untrusted, and that is exactly when it matters.

## Refuse, repair, or fail?

There are three fair answers to a bad record, and choosing between them is a design decision.

**Refuse it** and report. Right when the data must be correct.

**Repair it** with a sensible default. A missing \`tags\` list becomes \`[]\`. Right when the field really is optional.

**Fail completely.** Right when partial data is worse than none, as in a financial import.

What is never right is ignoring the problem and hoping. A bad value that travels through a program appears later, far from its cause, as a confusing failure. That is the fail-fast argument from Module 7, applied to data.

> **Key idea**
> Check data from outside once, at the boundary, and decide on purpose whether to refuse, repair, or fail. Past that point, the rest of your program can trust its inputs.

## Summary

Treat all data from outside as untrusted. Check it at the boundary with \`isinstance\` and explicit key checks, report which record failed and why, and choose on purpose between refusing, repairing, and failing. Remember that \`bool\` counts as \`int\`.`,
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

1. Build a list of dictionaries, one for each record, with the keys \`title\`, \`pages\`, and \`tags\`. \`pages\` must be an integer. \`tags\` must be a **list** holding the single tag.
2. Write the list to \`library.json\` using \`json.dump\` with \`indent=2\`.
3. Read it back with \`json.load\`.
4. Show exactly three lines, worked out from the data you **loaded back**:

\`\`\`text
Records: 2
Total pages: 500
Tags: marine, reference
\`\`\`

\`Tags\` lists every different tag, in alphabetical order, joined by \`, \`.

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

The summary must be worked out from the data you loaded back, not from the list you built. That is what makes it a real journey out and back.

Collect the different tags into a set, then sort it before joining. \`", ".join(items)\` joins a list of strings with that separator.

## Constraints

Use \`json.dump\` and \`json.load\` with a file, not \`dumps\` and \`loads\`.`,
          starterCode: `import json

records = []

line = input()
`,
          hint: "Split each line on \"|\" into three parts and append {\"title\": title, \"pages\": int(pages), \"tags\": [tag]}. After dumping and loading, use sum(r[\"pages\"] for r in loaded), and build a set from every tag in every record.",
          tests: [
            {
              input: "Tidal Systems|320|marine\nCoastal Birds|180|reference\nend\n",
              expectedOutput: "Records: 2\nTotal pages: 500\nTags: marine, reference",
              description: "Records survive the journey with integer pages and list tags",
            },
            {
              input: "end\n",
              expectedOutput: "Records: 0\nTotal pages: 0\nTags:",
              description: "An empty set of records is written and read back as an empty list",
            },
            {
              input: "A|10|x\nB|20|x\nend\n",
              expectedOutput: "Records: 2\nTotal pages: 30\nTags: x",
              description: "A tag used twice appears only once in the summary",
            },
            {
              input: "Solo|5|zeta\nend\n",
              expectedOutput: "Records: 1\nTotal pages: 5\nTags: zeta",
              description: "A single record goes out and comes back correctly",
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
          description: "Read a CSV file, check every row, write the good records as JSON, and report.",
          instructions: `## The problem

Build a small import pipeline. Read table data, refuse anything invalid with an exact reason, save what survives, and report.

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
2. Check each row in this order, refusing it with the first message that applies:
   - Empty title, after stripping: \`missing title\`
   - Pages not a whole number: \`bad pages\`
   - Pages negative: \`negative pages\`
   - Status not \`done\` or \`reading\`: \`bad status\`
3. For each refused row, show \`Row N rejected: MESSAGE\`, where N counts the data rows from 1.
4. Write the accepted records to \`clean.json\` with \`json.dump\`. Each one is a dictionary with the keys \`title\`, \`pages\`, and \`status\`, with \`pages\` as an integer.
5. Read that file back and show exactly two last lines:

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

Two of the six data rows survive: \`Tidal Systems\` with 320 pages and \`Salt Marshes\` with 150, giving 470.

## Guidance

Number the data rows with \`enumerate(reader, start=1)\`, so that the header is not counted.

Try the page conversion inside \`try\` and catch \`ValueError\` to give the \`bad pages\` message. The check for a negative number happens only after the conversion has worked.

The final totals must be worked out from the data read back out of \`clean.json\`.

## Constraints

Use \`csv.DictReader\` for reading, and \`json.dump\` and \`json.load\` for the JSON file.`,
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
          hint: "Write a validate(row) helper that returns an error message or \"\". Loop with enumerate(csv.DictReader(handle), start=1), print the refusals, and append cleaned dictionaries to accepted. Then dump, load, and summarise the loaded list.",
          tests: [
            {
              expectedOutput:
                "Row 2 rejected: missing title\nRow 3 rejected: bad pages\nRow 4 rejected: negative pages\nRow 5 rejected: bad status\nAccepted: 2\nTotal pages: 470",
              description: "Every bad row is refused with its own reason, and only good records are saved",
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

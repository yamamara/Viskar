import { module, lesson, type ModuleSource } from "../types.ts"

const moduleTwelve: ModuleSource = module(
  "Classes and Object-Oriented Design",
  "Bundling data with the operations that belong to it: defining classes, protecting invariants, composing objects, and judging when a class is the wrong answer.",
  [
    lesson(
      "From Records to Objects",
      "The limits of dictionaries as records, and the syntax that replaces them.",
      [
        {
          type: "lesson",
          title: "Why Classes Exist",
          description: "What a dictionary of fields cannot guarantee.",
          instructions: `## Records as dictionaries

You have represented records as dictionaries since Module 5:

\`\`\`python
book = {"title": "Tidal Systems", "pages": 320, "read": 120}


def progress(record):
    return record["read"] / record["pages"] * 100


print(f"{progress(book):.1f}%")
\`\`\`

\`\`\`text
37.5%
\`\`\`

This works, and for simple data it remains a perfectly good choice. But it has three weaknesses that grow with the program.

**Nothing guarantees the shape.** A dictionary missing \`pages\` is still a valid dictionary. The failure appears wherever someone reads the missing key, which may be far from where the bad record was created.

**Nothing guarantees the values are sensible.** \`{"pages": -5}\` is accepted. So is \`{"read": 900, "pages": 320}\`, describing a book read past its own end.

**The data and its operations are separate.** \`progress\` works on book dictionaries, but nothing connects them. Another programmer must discover which functions apply to which dictionaries by reading the code.

## What a class provides

A **class** defines a new type. It bundles together the data an object holds and the operations that make sense for it, and it controls how instances come into existence.

\`\`\`python
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages
        self.read = 0

    def progress(self):
        return self.read / self.pages * 100


book = Book("Tidal Systems", 320)
book.read = 120
print(f"{book.progress():.1f}%")
\`\`\`

\`\`\`text
37.5%
\`\`\`

Three things changed. Every \`Book\` is created the same way, so every one has the same fields. The operation lives with the data and is reached as \`book.progress()\`. And there is now a place to enforce rules, which the next lesson uses.

## Vocabulary

A **class** is the definition — the template describing what every instance has and can do.

An **object**, or **instance**, is a particular thing built from that template. \`Book\` is the class; \`book\` is an object.

An **attribute** is a piece of data belonging to an object: \`book.title\`.

A **method** is a function belonging to an object: \`book.progress()\`.

The class-versus-object distinction is worth being precise about. \`Book\` describes what books are like. \`Book("Tidal Systems", 320)\` produces one specific book. Confusing the two produces errors like calling a method on the class rather than on an instance.

> **Key idea**
> A class is a definition; an object is one thing made from it. The class says what every instance will have; each instance holds its own values.

## Objects you already use

This is not new machinery. Everything in Python is an object:

\`\`\`python
text = "field notes"
print(type(text).__name__)
print(text.upper())

values = [3, 1, 2]
print(type(values).__name__)
values.sort()
print(values)
\`\`\`

\`\`\`text
str
FIELD NOTES
field notes
list
[1, 2, 3]
\`\`\`

Two details in that output are worth pausing on. The third line is \`field notes\`, unchanged, because \`upper()\` returned a new string rather than modifying the original. The last is \`[1, 2, 3]\`, sorted, because \`sort()\` modified the list in place.

That is the immutable-versus-mutable distinction from Module 5, now visible as a difference between two classes: \`str\` methods return new values, \`list\` methods often change the object.

\`str\` and \`list\` are classes, \`upper\` and \`sort\` are methods, and the dot has meant "belonging to this object" since Module 2.

## When a class earns its place

Classes are not automatically better. A good rule:

Use a class when you have **data and behaviour that belong together**, especially when the data has rules about what makes it valid.

Do not use one for a bag of values with no behaviour — a dictionary or a tuple is clearer. Do not use one for a single function; a function is a function.

The next lessons build the machinery, and the last lesson of this module returns to this judgement in detail.

## Summary

A dictionary cannot guarantee its own shape or the sensibility of its values, and keeps data separate from the operations on it. A class defines a type that bundles both, controls construction, and provides a place to enforce rules. A class is the definition; an object is an instance of it.`,
        },
        {
          type: "lesson",
          title: "Defining a Class",
          description: "The class statement, __init__, self, and how methods are called.",
          instructions: `## The class statement

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    def hours(self):
        return self.minutes / 60


session = Session("history", 90)
print(session.subject)
print(session.hours())
\`\`\`

\`\`\`text
history
1.5
\`\`\`

\`class\` introduces the definition. The name uses capitalised words with no underscores — \`Session\`, \`StudyPlan\` — which distinguishes classes from functions at a glance.

Inside, indented, are the methods. A method is a function defined in a class body.

## __init__

\`__init__\` runs automatically when an object is created. Its job is to set up the object's initial state.

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        print(f"creating a session for {subject}")
        self.subject = subject
        self.minutes = minutes


session = Session("biology", 45)
print(session.minutes)
\`\`\`

\`\`\`text
creating a session for biology
45
\`\`\`

Writing \`Session("biology", 45)\` creates a new object and calls \`__init__\` on it with those arguments.

The double underscores mark it as special to Python. Such names are sometimes called *dunder* methods, and there are several; you meet two more shortly.

\`__init__\` is not a constructor in the sense used in some other languages — the object already exists when it runs. Its job is initialisation, which is what the name says.

## self

Every method's first parameter is \`self\`, which refers to the particular object the method was called on.

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    def describe(self):
        return f"{self.subject}: {self.minutes} minutes"


first = Session("history", 90)
second = Session("biology", 45)
print(first.describe())
print(second.describe())
\`\`\`

\`\`\`text
history: 90 minutes
biology: 45 minutes
\`\`\`

One class, two objects, each with its own attributes. When \`first.describe()\` runs, \`self\` is \`first\`; when \`second.describe()\` runs, \`self\` is \`second\`. That is how one definition serves any number of objects.

\`self\` is not a keyword — it is a naming convention, universally followed. Naming it something else works and confuses every reader.

Note that you never pass \`self\` yourself. \`first.describe()\` supplies it automatically. Forgetting to *declare* it is the most common beginner error here:

\`\`\`python
class Broken:
    def __init__(self, value):
        self.value = value

    def show(self):
        return self.value


print(Broken(5).show())
\`\`\`

\`\`\`text
5
\`\`\`

Had \`show\` been written as \`def show():\`, calling it would raise \`TypeError: show() takes 0 positional arguments but 1 was given\`. That message is confusing until you know that the object is passed automatically — then it says exactly what happened.

> **Key idea**
> \`self\` is the object the method was called on. Every method declares it as the first parameter, and callers never supply it.

## Attributes

An attribute is created by assigning to \`self.name\` inside a method, conventionally all in \`__init__\` so that every instance has the same set from birth:

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes
        self.completed = False

    def complete(self):
        self.completed = True


session = Session("history", 90)
print(session.completed)
session.complete()
print(session.completed)
\`\`\`

\`\`\`text
False
True
\`\`\`

\`completed\` takes no constructor argument because every session starts the same way. Initialising it in \`__init__\` anyway means the attribute always exists, so no code has to check whether it is there.

Attributes can also be read and written directly from outside:

\`\`\`python
class Session:
    def __init__(self, minutes):
        self.minutes = minutes


session = Session(90)
session.minutes = 120
print(session.minutes)
\`\`\`

\`\`\`text
120
\`\`\`

Python does not prevent this. Whether it should be prevented is the subject of the next lesson.

## Methods that use other methods

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    def hours(self):
        return self.minutes / 60

    def summary(self):
        return f"{self.subject}: {self.hours():.1f}h"


print(Session("statistics", 150).summary())
\`\`\`

\`\`\`text
statistics: 2.5h
\`\`\`

A method calls another through \`self\`. Writing \`hours()\` without \`self\` would raise \`NameError\`, because the method is not a plain name in scope — it belongs to the object.

## Summary

\`class Name:\` defines a type, with capitalised naming. \`__init__\` initialises a new object's attributes. Every method takes \`self\` first, referring to the object it was called on, supplied automatically at the call. Methods reach attributes and other methods through \`self\`.`,
        },
        {
          type: "exercise",
          title: "Define a Class With Behaviour",
          description: "Write a class that stores data and computes results from it.",
          instructions: `## The problem

Define a class representing a reading record.

## Requirements

Define a class \`Reading\` with:

1. \`__init__(self, title, total_pages)\` storing both values, and setting \`pages_read\` to \`0\`.
2. A method \`record(self, pages)\` that adds \`pages\` to \`pages_read\` and returns nothing.
3. A method \`remaining(self)\` returning how many pages are left.
4. A method \`percent(self)\` returning the percentage read as a float.
5. A method \`summary(self)\` returning a string of the form \`Tidal Systems: 120/320 (37.5%)\`, with the percentage to **one** decimal place.

## Then

Read input and drive the object:

- The first line is the title.
- The second line is the total pages, a whole number.
- Every line after that is a number of pages read in one sitting, ending with the line \`end\`.

Finally print the result of \`summary()\`.

## Example

Given \`Tidal Systems\`, \`320\`, \`100\`, \`20\`, \`end\`, the output is:

\`\`\`text
Tidal Systems: 120/320 (37.5%)
\`\`\`

## Guidance

\`record\` modifies the object, so it changes \`self.pages_read\` rather than returning a new value. This is a method whose purpose is a side effect on its own object, which is normal and different from the free functions of Module 2.

\`summary\` should call \`percent\` through \`self\` rather than repeating the calculation.

## Constraints

All four methods must exist and be used. Print exactly once, at the end.`,
          starterCode: `class Reading:
    def __init__(self, title, total_pages):
        self.title = title


title = input()
total = int(input())
`,
          hint: "Set self.pages_read = 0 in __init__. record does self.pages_read += pages. percent returns self.pages_read / self.total_pages * 100. summary uses an f-string with {self.percent():.1f}.",
          tests: [
            {
              input: "Tidal Systems\n320\n100\n20\nend\n",
              expectedOutput: "Tidal Systems: 120/320 (37.5%)",
              description: "Two sittings accumulate and the percentage is computed from the total",
            },
            {
              input: "Coastal Birds\n200\nend\n",
              expectedOutput: "Coastal Birds: 0/200 (0.0%)",
              description: "A book with no sittings recorded reports zero progress",
            },
            {
              input: "Short Work\n50\n50\nend\n",
              expectedOutput: "Short Work: 50/50 (100.0%)",
              description: "A finished book reports one hundred percent",
            },
            {
              input: "Deep Water\n300\n33\n33\n33\nend\n",
              expectedOutput: "Deep Water: 99/300 (33.0%)",
              description: "Three sittings accumulate correctly",
            },
          ],
          solution: `class Reading:
    def __init__(self, title, total_pages):
        self.title = title
        self.total_pages = total_pages
        self.pages_read = 0

    def record(self, pages):
        self.pages_read += pages

    def remaining(self):
        return self.total_pages - self.pages_read

    def percent(self):
        return self.pages_read / self.total_pages * 100

    def summary(self):
        return f"{self.title}: {self.pages_read}/{self.total_pages} ({self.percent():.1f}%)"


title = input()
total = int(input())
reading = Reading(title, total)

line = input()
while line != "end":
    reading.record(int(line))
    line = input()

print(reading.summary())
`,
        },
      ],
    ),

    lesson(
      "Invariants and Representation",
      "Making invalid objects impossible, and controlling how objects appear.",
      [
        {
          type: "lesson",
          title: "Validation and Invariants",
          description: "Using __init__ and properties to keep an object's state sensible.",
          instructions: `## An invariant

An **invariant** is something that must always be true of an object, for its whole life. For a reading record: pages read is never negative, and never exceeds the total.

A dictionary cannot enforce an invariant. A class can, because every object must pass through \`__init__\`.

## Validating on construction

\`\`\`python
class Reading:
    def __init__(self, title, total_pages):
        if not title.strip():
            raise ValueError("title must not be empty")
        if total_pages <= 0:
            raise ValueError(f"total_pages must be positive, got {total_pages}")
        self.title = title.strip()
        self.total_pages = total_pages
        self.pages_read = 0


good = Reading("Tidal Systems", 320)
print(good.title)

try:
    Reading("", 320)
except ValueError as error:
    print(f"rejected: {error}")
\`\`\`

\`\`\`text
Tidal Systems
rejected: title must not be empty
\`\`\`

An invalid \`Reading\` now cannot exist. Every method can assume \`total_pages\` is positive without checking, because construction is the only way in.

This is the fail-fast principle from Module 7 applied to objects: reject bad data at the boundary, and everything past it can be trusted.

## The gap

Validation in \`__init__\` covers construction. It does not cover later changes:

\`\`\`python
class Reading:
    def __init__(self, total_pages):
        if total_pages <= 0:
            raise ValueError("total_pages must be positive")
        self.total_pages = total_pages


reading = Reading(320)
reading.total_pages = -5
print(reading.total_pages)
\`\`\`

\`\`\`text
-5
\`\`\`

The invariant is broken and nothing objected. Assigning to an attribute bypasses \`__init__\` entirely.

## Properties

A **property** is an attribute whose reads and writes run code:

\`\`\`python
class Reading:
    def __init__(self, total_pages):
        self._total_pages = 0
        self.total_pages = total_pages

    @property
    def total_pages(self):
        return self._total_pages

    @total_pages.setter
    def total_pages(self, value):
        if value <= 0:
            raise ValueError(f"total_pages must be positive, got {value}")
        self._total_pages = value


reading = Reading(320)
print(reading.total_pages)

try:
    reading.total_pages = -5
except ValueError as error:
    print(f"rejected: {error}")
\`\`\`

\`\`\`text
320
rejected: total_pages must be positive
\`\`\`

The invariant now holds for the object's whole life.

Read the mechanism carefully. \`@property\` marks the getter, which runs on every read. \`@total_pages.setter\` marks the setter, which runs on every assignment. The real value lives in \`_total_pages\`, and the leading underscore is a convention meaning "internal; do not touch from outside".

Note also that \`__init__\` assigns to \`self.total_pages\`, the property, rather than to \`_total_pages\` directly. That routes construction through the same validation, so the rule is written once.

The \`@\` lines are **decorators**, which Module 13 explains. For now, treat them as markers.

## Computed properties

A property need not store anything. It can compute a value on each read:

\`\`\`python
class Reading:
    def __init__(self, total_pages, pages_read):
        self.total_pages = total_pages
        self.pages_read = pages_read

    @property
    def remaining(self):
        return self.total_pages - self.pages_read

    @property
    def finished(self):
        return self.pages_read >= self.total_pages


reading = Reading(320, 320)
print(reading.remaining)
print(reading.finished)
\`\`\`

\`\`\`text
0
True
\`\`\`

\`reading.remaining\` reads like an attribute and is calculated fresh each time, so it can never disagree with the values it derives from. Storing it as a real attribute would risk exactly that.

The rule of thumb: use a property for something cheap that feels like data, and a method for something that does work or has side effects.

## Encapsulation

**Encapsulation** means keeping internal details inside an object and exposing a deliberate interface.

Python has no truly private attributes. The convention is a leading underscore:

\`\`\`python
class Counter:
    def __init__(self):
        self._count = 0

    def increment(self):
        self._count += 1

    @property
    def value(self):
        return self._count


counter = Counter()
counter.increment()
counter.increment()
print(counter.value)
\`\`\`

\`\`\`text
2
\`\`\`

\`_count\` is reachable from outside; the underscore asks you not to. Python's approach is to trust the programmer rather than enforce access, which is a genuine design philosophy rather than an oversight.

The practical benefit is that the internal representation can change without breaking callers, as long as the public interface stays the same.

> **Key idea**
> Validate in \`__init__\` so an invalid object cannot be created, and use a property setter so it cannot become invalid later. Prefix internal attributes with an underscore to mark them as not part of the interface.

## Do not over-apply this

A property that only reads and writes an attribute, with no validation, adds nothing:

\`\`\`python
class Pointless:
    def __init__(self, value):
        self._value = value

    @property
    def value(self):
        return self._value

    @value.setter
    def value(self, new_value):
        self._value = new_value


thing = Pointless(5)
thing.value = 10
print(thing.value)
\`\`\`

\`\`\`text
10
\`\`\`

That is six lines achieving what a plain attribute does in none. In some languages such accessors are required; in Python they are not, because a plain attribute can be *turned into* a property later without changing any calling code.

Start with plain attributes. Add a property when there is a rule to enforce.

## Summary

An invariant is something always true of an object. Validate in \`__init__\` so invalid objects cannot be created, and use property setters so they cannot become invalid. Computed properties derive values on read. Use a leading underscore for internals, and do not write properties that merely pass values through.`,
        },
        {
          type: "lesson",
          title: "__str__ and __repr__",
          description: "Controlling how an object appears, for users and for developers.",
          instructions: `## The default is unhelpful

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes


session = Session("history", 90)
print(type(session).__name__)
\`\`\`

\`\`\`text
Session
\`\`\`

Printing the object itself would produce something like \`<__main__.Session object at 0x7f3c8a1b2d50>\`: the class name and a memory address. That is technically accurate and useless, and the address changes every run, so it cannot even appear in an example.

## __str__

\`__str__\` defines what \`print\` and \`str()\` produce:

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    def __str__(self):
        return f"{self.subject} for {self.minutes} minutes"


session = Session("history", 90)
print(session)
print(str(session))
print(f"Today: {session}")
\`\`\`

\`\`\`text
history for 90 minutes
history for 90 minutes
Today: history for 90 minutes
\`\`\`

One method changed all three, because \`print\`, \`str()\`, and f-string interpolation all use \`__str__\`.

It must **return** a string. Printing inside it instead produces \`None\` where the text should be — the print-versus-return confusion of Module 2, in a new place.

\`__str__\` is for people. It should read naturally and may omit detail.

## __repr__

\`__repr__\` is the developer-facing representation, used in the interactive interpreter, in error messages, and when an object appears inside a list:

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    def __repr__(self):
        return f"Session({self.subject!r}, {self.minutes})"


sessions = [Session("history", 90), Session("biology", 45)]
print(sessions)
print(repr(sessions[0]))
\`\`\`

\`\`\`text
[Session('history', 90), Session('biology', 45)]
\`\`\`

The list printed usefully. Without \`__repr__\` it would have shown two memory addresses.

Note that \`print(sessions)\` used \`__repr__\`, not \`__str__\`. Containers always display their contents using \`__repr__\`, which is why defining it matters even when you have a \`__str__\`.

The convention is that \`__repr__\` should look like code that would recreate the object. \`Session('history', 90)\` could be pasted into a program. That is why \`{self.subject!r}\` is used: it adds the quotation marks, and \`!r\` is the same conversion introduced for debugging in Module 7.

## Which to define

If you define only one, define \`__repr__\`. It is used as a fallback when \`__str__\` is absent, so one method covers both:

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    def __repr__(self):
        return f"Session({self.subject!r}, {self.minutes})"


session = Session("history", 90)
print(session)
print([session])
\`\`\`

\`\`\`text
Session('history', 90)
[Session('history', 90)]
\`\`\`

Define \`__str__\` as well when a friendlier form is worth having.

> **Key idea**
> \`__str__\` is for users and \`__repr__\` is for developers. Containers always use \`__repr__\`. If you write only one, write \`__repr__\`, since it serves as a fallback.

## Comparison and equality

By default, two objects are equal only if they are the *same object*:

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y


first = Point(1, 2)
second = Point(1, 2)
print(first == second)
print(first == first)
\`\`\`

\`\`\`text
False
True
\`\`\`

Two points with identical values are not equal, because the default comparison is identity — the \`is\` versus \`==\` distinction from Module 3, now visible for your own types.

\`__eq__\` defines value equality:

\`\`\`python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __eq__(self, other):
        if not isinstance(other, Point):
            return NotImplemented
        return self.x == other.x and self.y == other.y

    def __repr__(self):
        return f"Point({self.x}, {self.y})"


print(Point(1, 2) == Point(1, 2))
print(Point(1, 2) == Point(3, 4))
print(Point(1, 2) == "not a point")
\`\`\`

\`\`\`text
True
False
False
\`\`\`

The \`isinstance\` check matters. Returning \`NotImplemented\` for an unrelated type tells Python to try the comparison the other way round before deciding, rather than claiming inequality outright.

## Operator overloading

\`__eq__\` is one of a family of methods behind operators. \`__add__\` defines \`+\`, \`__lt__\` defines \`<\`, \`__len__\` defines \`len()\`:

\`\`\`python
class Duration:
    def __init__(self, minutes):
        self.minutes = minutes

    def __add__(self, other):
        return Duration(self.minutes + other.minutes)

    def __repr__(self):
        return f"Duration({self.minutes})"


total = Duration(90) + Duration(45)
print(total)
\`\`\`

\`\`\`text
Duration(135)
\`\`\`

Adding two durations is meaningful, so \`+\` is a reasonable spelling for it.

Use this sparingly. An operator whose meaning is not immediately obvious makes code harder to read, not easier. \`+\` for combining durations is fine; \`+\` for "add a user to a group" is not, because a reader cannot guess it. When in doubt, write a named method.

## Summary

\`__str__\` produces user-facing text and \`__repr__\` produces developer-facing text that ideally looks like code recreating the object. Containers use \`__repr__\`. \`__eq__\` defines value equality and should return \`NotImplemented\` for unrelated types. Overload operators only where the meaning is obvious.`,
        },
        {
          type: "exercise",
          title: "Enforce an Invariant",
          description: "Use validation and a property so an object can never hold invalid data.",
          instructions: `## The problem

Define a class whose state cannot become invalid, whether at construction or afterwards.

## Requirements

Define a class \`Thermostat\` with:

1. \`__init__(self, target)\` which sets the target temperature.
2. A property \`target\` whose setter raises \`ValueError\` with the message \`target must be between 5 and 30\` when the value is outside that inclusive range.
3. Construction must go through the same validation, so \`Thermostat(50)\` raises.
4. A \`__repr__\` returning \`Thermostat(21)\`.

## Then

Read a series of lines ending with \`end\`. The first line is the initial target. Each subsequent line is a new target to set.

- If construction fails, print \`Rejected: <message>\` and stop, printing nothing else.
- For each later value, print \`Rejected: <message>\` if it is refused, and otherwise print nothing.
- After \`end\`, print the object's \`repr\`.

## Examples

Given \`21\`, \`25\`, \`40\`, \`18\`, \`end\`:

\`\`\`text
Rejected: target must be between 5 and 30
Thermostat(18)
\`\`\`

Given \`50\`, \`end\`:

\`\`\`text
Rejected: target must be between 5 and 30
\`\`\`

## Guidance

Store the real value in \`self._target\` and have \`__init__\` assign to \`self.target\`, the property, so the validation runs once and is written once.

Wrap the construction in \`try\` so a rejected initial value can be reported without stopping the program with a traceback.

Note that a rejected assignment leaves the previous value in place — which is exactly the point of validating in the setter.

## Constraints

The range check must appear in exactly one place.`,
          starterCode: `class Thermostat:
    def __init__(self, target):
        self.target = target


line = input()
`,
          hint: "Define @property def target returning self._target, and @target.setter validating 5 <= value <= 30 before assigning self._target. __init__ assigns self.target = target so it goes through the setter.",
          tests: [
            {
              input: "21\n25\n40\n18\nend\n",
              expectedOutput: "Rejected: target must be between 5 and 30\nThermostat(18)",
              description: "An out-of-range assignment is refused while valid ones are applied",
            },
            {
              input: "50\nend\n",
              expectedOutput: "Rejected: target must be between 5 and 30",
              description: "An invalid initial value is rejected and nothing else is printed",
            },
            {
              input: "5\n30\nend\n",
              expectedOutput: "Thermostat(30)",
              description: "Both range boundaries are accepted",
            },
            {
              input: "20\n4\n31\nend\n",
              expectedOutput:
                "Rejected: target must be between 5 and 30\nRejected: target must be between 5 and 30\nThermostat(20)",
              description: "Rejected assignments leave the previous valid value untouched",
            },
          ],
          solution: `class Thermostat:
    def __init__(self, target):
        self.target = target

    @property
    def target(self):
        return self._target

    @target.setter
    def target(self, value):
        if not 5 <= value <= 30:
            raise ValueError("target must be between 5 and 30")
        self._target = value

    def __repr__(self):
        return f"Thermostat({self.target})"


line = input()
try:
    thermostat = Thermostat(int(line))
except ValueError as error:
    print(f"Rejected: {error}")
else:
    line = input()
    while line != "end":
        try:
            thermostat.target = int(line)
        except ValueError as error:
            print(f"Rejected: {error}")
        line = input()
    print(repr(thermostat))
`,
        },
      ],
    ),

    lesson(
      "Composition, Class Members, and Inheritance",
      "Building objects from other objects, sharing data across a class, and extending a type.",
      [
        {
          type: "lesson",
          title: "Class Variables and Alternative Constructors",
          description: "Data shared by every instance, and methods belonging to the class rather than an object.",
          instructions: `## Instance and class attributes

An attribute assigned in \`__init__\` belongs to one object. An attribute assigned in the class body belongs to the class and is shared by every instance:

\`\`\`python
class Session:
    MINUTES_PER_HOUR = 60

    def __init__(self, minutes):
        self.minutes = minutes

    def hours(self):
        return self.minutes / Session.MINUTES_PER_HOUR


print(Session(90).hours())
print(Session.MINUTES_PER_HOUR)
\`\`\`

\`\`\`text
1.5
60
\`\`\`

\`MINUTES_PER_HOUR\` exists once, on the class, and is reachable without any instance. Capitals mark it as a constant, following the convention from Module 6.

This is the natural home for values shared by every instance: limits, defaults, and conversion factors.

## The mutable class attribute trap

A shared *mutable* class attribute causes a bug identical in spirit to the mutable default argument of Module 6:

\`\`\`python
class Basket:
    items = []

    def add(self, item):
        self.items.append(item)


first = Basket()
second = Basket()
first.add("apple")
print(second.items)
\`\`\`

\`\`\`text
['apple']
\`\`\`

Both baskets share one list, so adding to one appears in the other. The fix is to create the list per instance in \`__init__\`:

\`\`\`python
class Basket:
    def __init__(self):
        self.items = []

    def add(self, item):
        self.items.append(item)


first = Basket()
second = Basket()
first.add("apple")
print(second.items)
\`\`\`

\`\`\`text
[]
\`\`\`

The rule generalises: class attributes are for constants; anything per-object belongs in \`__init__\`.

> **Key idea**
> A class attribute is shared by every instance. Use one only for immutable constants; putting a list or dictionary there makes every object share it.

## Class methods

A **class method** belongs to the class rather than to an instance. It takes \`cls\` instead of \`self\`:

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    @classmethod
    def from_text(cls, text):
        subject, minutes = text.split(":")
        return cls(subject, int(minutes))

    def __repr__(self):
        return f"Session({self.subject!r}, {self.minutes})"


print(Session.from_text("history:90"))
\`\`\`

\`\`\`text
Session('history', 90)
\`\`\`

\`from_text\` is an **alternative constructor**: another way to create an object. \`cls\` is the class itself, so \`cls(subject, ...)\` creates an instance.

This pattern is worth recognising. A class often has one natural \`__init__\` taking its real components, plus class methods building instances from other formats — a line of text, a dictionary, a file row. Putting each construction route in its own named method is far clearer than one \`__init__\` full of conditionals.

## Static methods

A **static method** belongs to the class by association but takes neither \`self\` nor \`cls\`:

\`\`\`python
class Session:
    @staticmethod
    def is_valid_subject(name):
        return name.isalpha() and len(name) >= 3


print(Session.is_valid_subject("history"))
print(Session.is_valid_subject("hi"))
\`\`\`

\`\`\`text
True
False
\`\`\`

It is a plain function living inside the class because it is related to it. If it never touches the class or its instances, ask whether it should simply be a module-level function — often the honest answer is yes.

## Composition

**Composition** means an object holding other objects:

\`\`\`python
class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes


class StudyPlan:
    def __init__(self, name):
        self.name = name
        self.sessions = []

    def add(self, session):
        self.sessions.append(session)

    def total_minutes(self):
        return sum(session.minutes for session in self.sessions)

    def subjects(self):
        return sorted({session.subject for session in self.sessions})


plan = StudyPlan("Revision week")
plan.add(Session("history", 90))
plan.add(Session("biology", 45))
plan.add(Session("history", 30))

print(plan.total_minutes())
print(plan.subjects())
\`\`\`

\`\`\`text
165
['biology', 'history']
\`\`\`

A \`StudyPlan\` *has* sessions. Each class stays small and has one job: \`Session\` knows about one session, \`StudyPlan\` knows about a collection of them.

Composition is the most useful structural tool in object-oriented design, and it is under-taught relative to inheritance. Most real designs are mostly composition.

Note \`{session.subject for session in self.sessions}\` — a **set comprehension**, building a set directly. The same syntax with square brackets builds a list, and Module 13 covers comprehensions in full.

## Summary

Class attributes are shared by all instances and should be immutable constants. \`@classmethod\` takes \`cls\` and is the natural way to write alternative constructors. \`@staticmethod\` takes neither and is often better as a plain function. Composition — objects holding other objects — keeps classes small and focused.`,
        },
        {
          type: "lesson",
          title: "Inheritance, and When Not to Use a Class",
          description: "Extending an existing type, and the judgement about whether to use one at all.",
          instructions: `## Inheritance

**Inheritance** creates a new class based on an existing one, receiving its attributes and methods:

\`\`\`python
class Activity:
    def __init__(self, name, minutes):
        self.name = name
        self.minutes = minutes

    def describe(self):
        return f"{self.name}: {self.minutes} minutes"


class TimedReading(Activity):
    def __init__(self, name, minutes, pages):
        super().__init__(name, minutes)
        self.pages = pages

    def describe(self):
        base = super().describe()
        return f"{base}, {self.pages} pages"


print(Activity("walk", 30).describe())
print(TimedReading("Tidal Systems", 45, 20).describe())
\`\`\`

\`\`\`text
walk: 30 minutes
Tidal Systems: 45 minutes, 20 pages
\`\`\`

\`class TimedReading(Activity):\` makes \`TimedReading\` a **subclass** of \`Activity\`. It gets everything \`Activity\` has and may add or replace.

\`super()\` refers to the parent class. \`super().__init__(name, minutes)\` runs the parent's initialisation so the shared setup is written once; \`super().describe()\` calls the parent's version and builds on it.

Replacing a method is called **overriding**. \`TimedReading.describe\` overrides \`Activity.describe\`, and Python picks the most specific version for the actual object.

## The relationship inheritance expresses

Inheritance means "is a kind of". A \`TimedReading\` is a kind of \`Activity\`, so anywhere an \`Activity\` is expected, a \`TimedReading\` will do.

That test is worth applying strictly. If the honest relationship is "has a" rather than "is a", use composition. A \`StudyPlan\` has sessions; it is not a kind of session, so it should not inherit from one.

The most common inheritance mistake is using it for code reuse alone. If two classes share some code but are not kinds of the same thing, extract the shared code into a function or a separate class, and keep them independent.

> **Key idea**
> Inherit only when the subclass genuinely *is a kind of* the parent. Sharing code is not a reason to inherit; extract a function or compose instead.

## Exceptions are classes

Every exception is a class, which is why you can define your own:

\`\`\`python
class ValidationError(Exception):
    """Raised when a record fails validation."""


def check(value):
    if value < 0:
        raise ValidationError(f"value must not be negative, got {value}")
    return value


try:
    check(-5)
except ValidationError as error:
    print(f"caught: {error}")
\`\`\`

\`\`\`text
caught: value must not be negative, got -5
\`\`\`

Inheriting from \`Exception\` is all that is required; the body can be just a docstring.

A custom exception lets callers catch exactly your failure without also catching unrelated \`ValueError\`s from elsewhere. Define one when a program has a failure mode of its own that callers may want to handle specifically.

## Dataclasses

Many classes are mostly \`__init__\` and \`__repr__\`. The \`dataclasses\` module generates both:

\`\`\`python
from dataclasses import dataclass


@dataclass
class Point:
    x: int
    y: int


first = Point(1, 2)
print(first)
print(first == Point(1, 2))
\`\`\`

\`\`\`text
Point(x=1, y=2)
True
\`\`\`

Three lines produced \`__init__\`, \`__repr__\`, and \`__eq__\`. The type hints are required by the syntax, though they are not enforced any more than usual.

Use a dataclass when a class is mainly a structured record. Add methods to it as normal. Write a full class when construction needs real logic or validation, though dataclasses support that too through \`__post_init__\`.

## When not to use a class

Classes have a cost: more code, more indirection, more to hold in mind. Several situations do not warrant one.

**A single function is not a class.** If a class has one method besides \`__init__\`, and its attributes are only that method's inputs, it should be a function taking those inputs.

**Plain data with no rules is not a class.** A dictionary or a named tuple is clearer, and JSON and CSV read into dictionaries naturally.

**A collection of unrelated functions is not a class.** Group them in a module instead; that is what modules are for.

**Grouping constants does not need a class.** Module-level constants work and are simpler.

The signal that a class *is* warranted: data with rules about validity, several operations that all need the same data, or several things sharing an interface while differing in behaviour.

## A worked judgement

Consider formatting a duration. As a class:

\`\`\`python
class DurationFormatter:
    def __init__(self, minutes):
        self.minutes = minutes

    def format(self):
        return f"{self.minutes // 60}h {self.minutes % 60}m"


print(DurationFormatter(75).format())
\`\`\`

\`\`\`text
1h 15m
\`\`\`

Six lines, an object created to be used once, and a two-step call. As a function:

\`\`\`python
def format_duration(minutes):
    return f"{minutes // 60}h {minutes % 60}m"


print(format_duration(75))
\`\`\`

\`\`\`text
1h 15m
\`\`\`

Two lines, one call, nothing to construct. The function is plainly better, and no amount of familiarity with classes should make the first version look preferable.

Object orientation is a tool, not a goal. Some problems are naturally about objects with state and rules; many are not.

## Summary

Inheritance expresses "is a kind of" and uses \`super()\` to reach the parent. Do not inherit merely to share code. Exceptions are classes and custom ones let callers catch your specific failures. Dataclasses generate boilerplate for record-like classes. Prefer a function when a class would hold no meaningful state.`,
        },
        {
          type: "exercise",
          title: "Compose Objects Into a Collection",
          description: "Build a class that holds other objects and reports on them.",
          instructions: `## The problem

Model study sessions and a plan that contains them.

## Requirements

Define two classes.

\`Session\`:

1. \`__init__(self, subject, minutes)\`.
2. A class method \`from_text(cls, text)\` building a \`Session\` from a string like \`history:90\`.
3. A \`__repr__\` returning \`Session('history', 90)\`.

\`StudyPlan\`:

1. \`__init__(self, name)\` with an empty list of sessions.
2. \`add(self, session)\`.
3. \`total_minutes(self)\` returning the total.
4. \`subjects(self)\` returning a sorted list of the distinct subjects.
5. \`busiest(self)\` returning the subject with the most total minutes, ties broken alphabetically, or an empty string when there are no sessions.

## Then

Read a plan name, then lines of the form \`subject:minutes\` ending with \`end\`. Build the objects and display exactly four lines:

\`\`\`text
Plan: Revision week
Total: 165
Subjects: ['biology', 'history']
Busiest: history
\`\`\`

## Example

Given \`Revision week\`, \`history:90\`, \`biology:45\`, \`history:30\`, \`end\`, the output is the four lines above.

With no sessions at all:

\`\`\`text
Plan: Empty week
Total: 0
Subjects: []
Busiest:
\`\`\`

## Guidance

Use \`Session.from_text\` to build each session rather than splitting in the main loop. That keeps the parsing rule inside the class that owns the format.

For \`busiest\`, total the minutes per subject into a dictionary, then sort as in earlier modules.

Remember that the sessions list must be created in \`__init__\`, not in the class body, or every plan would share one list.

## Constraints

Both classes must be used. The main code should contain no parsing logic of its own.`,
          starterCode: `class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes


class StudyPlan:
    def __init__(self, name):
        self.name = name


name = input()
`,
          hint: "In Session, add @classmethod from_text(cls, text) that splits on \":\" and returns cls(subject, int(minutes)). In StudyPlan.busiest, build totals with a dictionary then sorted(totals, key=lambda s: (-totals[s], s))[0], guarding the empty case.",
          tests: [
            {
              input: "Revision week\nhistory:90\nbiology:45\nhistory:30\nend\n",
              expectedOutput:
                "Plan: Revision week\nTotal: 165\nSubjects: ['biology', 'history']\nBusiest: history",
              description: "Sessions are composed into a plan which reports totals and the busiest subject",
            },
            {
              input: "Empty week\nend\n",
              expectedOutput: "Plan: Empty week\nTotal: 0\nSubjects: []\nBusiest:",
              description: "A plan with no sessions reports zeroes and an empty busiest subject",
            },
            {
              input: "Tie week\nart:30\nmaths:30\nend\n",
              expectedOutput: "Plan: Tie week\nTotal: 60\nSubjects: ['art', 'maths']\nBusiest: art",
              description: "Equal totals are broken alphabetically",
            },
            {
              input: "Single\nphysics:120\nend\n",
              expectedOutput: "Plan: Single\nTotal: 120\nSubjects: ['physics']\nBusiest: physics",
              description: "One session makes its subject the busiest",
            },
          ],
          solution: `class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes

    @classmethod
    def from_text(cls, text):
        """Build a Session from a 'subject:minutes' string."""
        subject, minutes = text.split(":")
        return cls(subject, int(minutes))

    def __repr__(self):
        return f"Session({self.subject!r}, {self.minutes})"


class StudyPlan:
    def __init__(self, name):
        self.name = name
        self.sessions = []

    def add(self, session):
        self.sessions.append(session)

    def total_minutes(self):
        return sum(session.minutes for session in self.sessions)

    def subjects(self):
        return sorted({session.subject for session in self.sessions})

    def busiest(self):
        """Return the subject with the most minutes, or '' when there are none."""
        if not self.sessions:
            return ""
        totals = {}
        for session in self.sessions:
            totals[session.subject] = totals.get(session.subject, 0) + session.minutes
        return sorted(totals, key=lambda subject: (-totals[subject], subject))[0]


name = input()
plan = StudyPlan(name)

line = input()
while line != "end":
    plan.add(Session.from_text(line))
    line = input()

print(f"Plan: {plan.name}")
print(f"Total: {plan.total_minutes()}")
print(f"Subjects: {plan.subjects()}")
print(f"Busiest: {plan.busiest()}")
`,
        },
        {
          type: "exercise",
          title: "Module 12 Checkpoint: Inheritance and Custom Exceptions",
          description: "Build a small class hierarchy with validation, overriding, and a custom exception.",
          instructions: `## The problem

Model library items of two kinds, sharing what they have in common.

## Requirements

Define a custom exception \`ItemError\` inheriting from \`Exception\`.

Define a base class \`Item\`:

1. \`__init__(self, title, days)\` where \`days\` is the loan period. Raise \`ItemError\` with message \`title must not be empty\` for a blank title, and \`days must be positive\` for a loan period of zero or less.
2. A method \`late_fee(self, days_overdue)\` returning \`days_overdue * 10\` as the base rate in pence, or \`0\` when not overdue.
3. A \`__repr__\` returning \`Item('Tidal Systems', 21)\`.

Define \`Reference(Item)\`:

1. Loan period is always \`3\` days, so \`__init__(self, title)\` takes only a title and passes \`3\` to the parent.
2. \`late_fee\` overrides the base: the rate is \`50\` pence per day.
3. \`__repr__\` returns \`Reference('Atlas')\`.

## Then

Read lines of the form \`kind|title|overdue\` where kind is \`item\` or \`reference\`, ending with \`end\`. For \`item\`, the loan period is always \`21\`.

For each line, print either the repr and fee, or the rejection message:

\`\`\`text
Item('Tidal Systems', 21) fee 30
Reference('Atlas') fee 100
Rejected: title must not be empty
\`\`\`

The fee line format is \`<repr> fee <pence>\`.

## Example

Given \`item|Tidal Systems|3\`, \`reference|Atlas|2\`, \`item||1\`, \`end\`, the output is the three lines above.

## Guidance

\`Reference.__init__\` should call \`super().__init__(title, 3)\` so the validation is written once and inherited.

\`late_fee\` in \`Reference\` overrides the parent's version entirely; it does not need to call \`super()\`.

Catch \`ItemError\` around the construction of each object so one bad line does not stop the program.

## Constraints

\`Reference\` must inherit from \`Item\`. The title validation must exist only in \`Item\`.`,
          starterCode: `class ItemError(Exception):
    """Raised when an item cannot be created."""


class Item:
    def __init__(self, title, days):
        self.title = title
        self.days = days


line = input()
`,
          hint: "Item.__init__ validates then assigns. Reference(Item) defines __init__(self, title) calling super().__init__(title, 3), overrides late_fee with a 50 rate, and overrides __repr__. In the loop, build the right class inside try/except ItemError.",
          tests: [
            {
              input: "item|Tidal Systems|3\nreference|Atlas|2\nitem||1\nend\n",
              expectedOutput:
                "Item('Tidal Systems', 21) fee 30\nReference('Atlas') fee 100\nRejected: title must not be empty",
              description: "Both kinds compute their own fee and an invalid title is rejected",
            },
            {
              input: "item|Book|0\nend\n",
              expectedOutput: "Item('Book', 21) fee 0",
              description: "An item that is not overdue owes nothing",
            },
            {
              input: "reference|Maps|0\nend\n",
              expectedOutput: "Reference('Maps') fee 0",
              description: "The override still returns zero when not overdue",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No input produces no output at all",
            },
            {
              input: "reference||5\nend\n",
              expectedOutput: "Rejected: title must not be empty",
              description: "The inherited validation rejects a blank title on the subclass too",
            },
          ],
          solution: `class ItemError(Exception):
    """Raised when an item cannot be created."""


class Item:
    BASE_RATE = 10

    def __init__(self, title, days):
        if not title.strip():
            raise ItemError("title must not be empty")
        if days <= 0:
            raise ItemError("days must be positive")
        self.title = title.strip()
        self.days = days

    def late_fee(self, days_overdue):
        if days_overdue <= 0:
            return 0
        return days_overdue * Item.BASE_RATE

    def __repr__(self):
        return f"Item({self.title!r}, {self.days})"


class Reference(Item):
    REFERENCE_RATE = 50

    def __init__(self, title):
        super().__init__(title, 3)

    def late_fee(self, days_overdue):
        if days_overdue <= 0:
            return 0
        return days_overdue * Reference.REFERENCE_RATE

    def __repr__(self):
        return f"Reference({self.title!r})"


line = input()
while line != "end":
    kind, title, overdue = line.split("|")
    try:
        if kind == "reference":
            item = Reference(title)
        else:
            item = Item(title, 21)
    except ItemError as error:
        print(f"Rejected: {error}")
    else:
        print(f"{item!r} fee {item.late_fee(int(overdue))}")
    line = input()
`,
        },
      ],
    ),
  ],
)

export default moduleTwelve

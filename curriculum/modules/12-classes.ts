import { module, lesson, type ModuleSource } from "../types.ts"

const moduleTwelve: ModuleSource = module(
  "Classes and Object-Oriented Design",
  "Keeping data together with the operations that belong to it: defining classes, protecting rules, building objects from other objects, and judging when a class is the wrong answer.",
  [
    lesson(
      "From Records to Objects",
      "The limits of dictionaries as records, and the notation that replaces them.",
      [
        {
          type: "lesson",
          title: "Why Classes Exist",
          description: "What a dictionary of fields cannot promise.",
          instructions: `## Records as dictionaries

You have kept records in dictionaries since Module 5:

\`\`\`python
book = {"title": "Tidal Systems", "pages": 320, "read": 120}


def progress(record):
    return record["read"] / record["pages"] * 100


print(f"{progress(book):.1f}%")
\`\`\`

\`\`\`text
37.5%
\`\`\`

This works, and for simple data it stays a perfectly good choice. But it has three weaknesses, and they grow as the program grows.

**Nothing promises the shape.** A dictionary with no \`pages\` key is still a valid dictionary. The failure appears wherever somebody reads the missing key, which may be far from the place where the bad record was made.

**Nothing promises that the values make sense.** \`{"pages": -5}\` is accepted. So is \`{"read": 900, "pages": 320}\`, which describes a book read past its own last page.

**The data and its operations are kept apart.** \`progress\` works on book dictionaries, but nothing joins them together. Another programmer has to work out which functions belong to which dictionaries by reading the code.

## What a class gives you

A **class** defines a new type. It keeps together the data an object holds and the operations that make sense for it, and it controls how new instances are made.

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

Three things changed. Every \`Book\` is made in the same way, so every one has the same fields. The operation lives with the data, and you reach it as \`book.progress()\`. And there is now one place to enforce rules, which the next lesson uses.

## The words to know

A **class** is the definition. It is the pattern describing what every instance has and can do.

An **object**, also called an **instance**, is one particular thing built from that pattern. \`Book\` is the class. \`book\` is an object.

An **attribute** is a piece of data belonging to an object: \`book.title\`.

A **method** is a function belonging to an object: \`book.progress()\`.

The difference between a class and an object is worth being exact about. \`Book\` describes what books are like. \`Book("Tidal Systems", 320)\` makes one particular book. Mixing up the two gives errors such as calling a method on the class instead of on an instance.

> **Key idea**
> A class is a definition. An object is one thing made from it. The class says what every instance will have. Each instance holds its own values.

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

Two details in that output are worth stopping on. The third line is \`field notes\`, unchanged, because \`upper()\` gave back a new string instead of changing the original. The last line is \`[1, 2, 3]\`, sorted, because \`sort()\` changed the list in place.

That is the difference between values that can change and values that cannot, from Module 5, now visible as a difference between two classes. \`str\` methods give back new values. \`list\` methods often change the object.

\`str\` and \`list\` are classes, \`upper\` and \`sort\` are methods, and the dot has meant "belonging to this object" ever since Module 2.

## When a class earns its place

Classes are not automatically better. Here is a good rule.

Use a class when you have **data and behaviour that belong together**, and especially when the data has rules about what counts as valid.

Do not use one for a bag of values with no behaviour. A dictionary or a tuple is clearer. Do not use one for a single function. A function is a function.

The next lessons build the machinery, and the last lesson of this module comes back to this judgement in detail.

## Summary

A dictionary cannot promise its own shape or that its values make sense, and it keeps the data apart from the operations on it. A class defines a type that holds both, controls how objects are made, and gives you a place to enforce rules. A class is the definition. An object is one instance of it.`,
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

\`class\` starts the definition. The name uses capitalised words with no underscores — \`Session\`, \`StudyPlan\` — which lets a reader tell classes from functions at a glance.

Inside, indented, are the methods. A method is a function defined inside a class body.

## __init__

\`__init__\` runs on its own whenever an object is made. Its job is to set up the object's starting state.

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

Writing \`Session("biology", 45)\` makes a new object and calls \`__init__\` on it with those arguments.

The two underscores on each side mark the name as special to Python. Such names are sometimes called *dunder* methods, from "double underscore". There are several, and you meet two more shortly.

\`__init__\` is not a constructor in the sense that some other languages use the word. The object already exists when it runs. Its job is to set the object up, which is what the name says.

## self

The first parameter of every method is \`self\`. It refers to the particular object the method was called on.

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

One class, two objects, and each has its own attributes. When \`first.describe()\` runs, \`self\` is \`first\`. When \`second.describe()\` runs, \`self\` is \`second\`. That is how one definition serves any number of objects.

\`self\` is not a keyword. It is a naming habit, and everybody follows it. Naming it something else works, and it confuses every reader.

Note that you never pass \`self\` yourself. \`first.describe()\` supplies it for you. Forgetting to *declare* it is the most common beginner mistake here:

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

If \`show\` had been written as \`def show():\`, calling it would raise \`TypeError: show() takes 0 positional arguments but 1 was given\`. That message makes no sense until you know that the object is passed for you. After that, it says exactly what happened.

> **Key idea**
> \`self\` is the object that the method was called on. Every method declares it as the first parameter, and callers never supply it.

## Attributes

An attribute is created by assigning to \`self.name\` inside a method. By habit this is done in \`__init__\`, so that every instance has the same set of attributes from birth:

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

\`completed\` takes no argument when the object is made, because every session starts in the same state. Setting it in \`__init__\` anyway means the attribute always exists, so no other code has to check whether it is there.

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

Python does not stop this. Whether it should be stopped is the subject of the next lesson.

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

One method calls another through \`self\`. Writing \`hours()\` without \`self\` would raise \`NameError\`, because the method is not an ordinary name in scope. It belongs to the object.

## Summary

\`class Name:\` defines a type, with capitalised naming. \`__init__\` sets up the attributes of a new object. Every method takes \`self\` first, which refers to the object it was called on, and Python supplies it at the call. Methods reach attributes and other methods through \`self\`.`,
        },
        {
          type: "exercise",
          title: "Define a Class With Behaviour",
          description: "Write a class that holds data and works out results from it.",
          instructions: `## The problem

Define a class that stands for a reading record.

## Requirements

Define a class \`Reading\` with:

1. \`__init__(self, title, total_pages)\`, which stores both values and sets \`pages_read\` to \`0\`.
2. A method \`record(self, pages)\`, which adds \`pages\` to \`pages_read\` and returns nothing.
3. A method \`remaining(self)\`, which returns how many pages are left.
4. A method \`percent(self)\`, which returns the percentage read, as a float.
5. A method \`summary(self)\`, which returns a string of the form \`Tidal Systems: 120/320 (37.5%)\`, with the percentage to **one** decimal place.

## Then

Read the input and drive the object:

- The first line is the title.
- The second line is the total pages, a whole number.
- Every line after that is a number of pages read in one sitting. The list ends with the line \`end\`.

Finally print the result of \`summary()\`.

## Example

Given \`Tidal Systems\`, \`320\`, \`100\`, \`20\`, \`end\`, the output is:

\`\`\`text
Tidal Systems: 120/320 (37.5%)
\`\`\`

## Guidance

\`record\` changes the object, so it changes \`self.pages_read\` instead of returning a new value. This is a method whose purpose is an effect on its own object. That is normal, and it is different from the free functions of Module 2.

\`summary\` should call \`percent\` through \`self\`, instead of repeating the calculation.

## Constraints

All four methods must exist and must be used. Print exactly once, at the end.`,
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
              description: "Two sittings add up, and the percentage is worked out from the total",
            },
            {
              input: "Coastal Birds\n200\nend\n",
              expectedOutput: "Coastal Birds: 0/200 (0.0%)",
              description: "A book with no sittings recorded reports no progress",
            },
            {
              input: "Short Work\n50\n50\nend\n",
              expectedOutput: "Short Work: 50/50 (100.0%)",
              description: "A finished book reports one hundred percent",
            },
            {
              input: "Deep Water\n300\n33\n33\n33\nend\n",
              expectedOutput: "Deep Water: 99/300 (33.0%)",
              description: "Three sittings add up correctly",
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
          description: "Using __init__ and properties to keep the state of an object sensible.",
          instructions: `## An invariant

An **invariant** is something that must always be true of an object, for its whole life. For a reading record: the pages read is never negative, and never more than the total.

A dictionary cannot enforce an invariant. A class can, because every object must pass through \`__init__\`.

## Checking when the object is made

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

An invalid \`Reading\` now cannot exist. Every method can assume that \`total_pages\` is positive without checking, because making the object is the only way in.

This is the fail-fast rule from Module 7, applied to objects. Refuse bad data at the boundary, and everything past that point can be trusted.

## The gap

Checking in \`__init__\` covers the moment the object is made. It does not cover later changes:

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

The invariant is broken, and nothing objected. Assigning to an attribute goes right past \`__init__\`.

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

The invariant now holds for the whole life of the object.

Read the machinery carefully. \`@property\` marks the getter, which runs on every read. \`@total_pages.setter\` marks the setter, which runs on every assignment. The real value lives in \`_total_pages\`, and the underscore at the front is a habit meaning "internal; do not touch from outside".

Notice too that \`__init__\` assigns to \`self.total_pages\`, the property, and not to \`_total_pages\` directly. That sends the construction through the same check, so the rule is written once.

The \`@\` lines are **decorators**, which Module 13 explains. For now, treat them as markers.

## Properties that calculate

A property does not have to store anything. It can work out a value on every read:

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

\`reading.remaining\` reads like an attribute, and it is calculated fresh every time, so it can never disagree with the values it comes from. Storing it as a real attribute would risk exactly that.

Here is a rule of thumb. Use a property for something cheap that feels like data. Use a method for something that does work or has an effect.

## Encapsulation

**Encapsulation** means keeping the inner details inside an object and offering a chosen interface to the outside.

Python has no truly private attributes. The habit is an underscore at the front:

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

\`_count\` can be reached from outside. The underscore asks you not to. Python trusts the programmer rather than enforcing access, and that is a real design choice, not an oversight.

The practical benefit is that you can change how something is stored inside without breaking any caller, as long as the public interface stays the same.

> **Key idea**
> Check in \`__init__\` so an invalid object cannot be made, and use a property setter so it cannot become invalid later. Put an underscore in front of internal attributes to mark them as not part of the interface.

## Do not use this everywhere

A property that only reads and writes an attribute, with no checking, adds nothing:

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

That is six lines doing what a plain attribute does in none. Some languages require such accessors. Python does not, because a plain attribute can be *turned into* a property later without changing any calling code.

Start with plain attributes. Add a property when there is a rule to enforce.

## Summary

An invariant is something that is always true of an object. Check in \`__init__\` so invalid objects cannot be made, and use property setters so they cannot become invalid. Properties that calculate work out values on every read. Use an underscore at the front for internals, and do not write properties that only pass values through.`,
        },
        {
          type: "lesson",
          title: "__str__ and __repr__",
          description: "Controlling how an object appears, both for users and for programmers.",
          instructions: `## The default is not helpful

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

Printing the object itself would give something like \`<__main__.Session object at 0x7f3c8a1b2d50>\`: the class name and a memory address. That is technically true and completely useless. The address changes on every run, so it cannot even be shown in an example.

## __str__

\`__str__\` decides what \`print\` and \`str()\` produce:

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

One method changed all three, because \`print\`, \`str()\`, and putting a value into an f-string all use \`__str__\`.

It must **return** a string. Printing inside it instead gives \`None\` where the text should be. That is the print-versus-return confusion from Module 2, in a new place.

\`__str__\` is for people. It should read naturally, and it may leave out detail.

## __repr__

\`__repr__\` is the version for programmers. It is used in the interactive interpreter, in error messages, and whenever an object appears inside a list:

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

Note that \`print(sessions)\` used \`__repr__\`, not \`__str__\`. A container always shows its contents using \`__repr__\`, and that is why defining it matters even when you also have a \`__str__\`.

The habit is that \`__repr__\` should look like code that would make the object again. \`Session('history', 90)\` could be pasted into a program. That is why \`{self.subject!r}\` is used: it adds the quotation marks, and \`!r\` is the same conversion you met for debugging in Module 7.

## Which one to define

If you define only one, define \`__repr__\`. Python uses it as a fallback when \`__str__\` is missing, so one method covers both:

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
> \`__str__\` is for users and \`__repr__\` is for programmers. Containers always use \`__repr__\`. If you write only one, write \`__repr__\`, because it also serves as a fallback.

## Comparing objects

By default, two objects are equal only when they are the *same object*:

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

Two points with the same values are not equal, because the default comparison is identity. That is the \`is\` and \`==\` difference from Module 3, now visible for your own types.

\`__eq__\` defines equality by value:

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

The \`isinstance\` check matters. Returning \`NotImplemented\` for an unrelated type tells Python to try the comparison the other way round before it decides, instead of simply claiming that the two are different.

## Giving operators a meaning

\`__eq__\` is one of a family of methods that sit behind the operators. \`__add__\` defines \`+\`, \`__lt__\` defines \`<\`, and \`__len__\` defines \`len()\`:

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

Adding two lengths of time means something, so \`+\` is a reasonable way to write it.

Use this sparingly. An operator whose meaning is not immediately obvious makes code harder to read, not easier. \`+\` for joining two durations is fine. \`+\` for "add a user to a group" is not, because a reader cannot guess it. When in doubt, write a method with a name.

## Summary

\`__str__\` gives text for users, and \`__repr__\` gives text for programmers that ideally looks like code making the object again. Containers use \`__repr__\`. \`__eq__\` defines equality by value and should return \`NotImplemented\` for unrelated types. Give operators a meaning only where that meaning is obvious.`,
        },
        {
          type: "exercise",
          title: "Enforce an Invariant",
          description: "Use checking and a property so that an object can never hold invalid data.",
          instructions: `## The problem

Define a class whose state cannot become invalid, either when it is made or afterwards.

## Requirements

Define a class \`Thermostat\` with:

1. \`__init__(self, target)\`, which sets the target temperature.
2. A property \`target\` whose setter raises \`ValueError\` with the message \`target must be between 5 and 30\` when the value falls outside that range. Both 5 and 30 are allowed.
3. Making the object must go through the same check, so \`Thermostat(50)\` raises an error.
4. A \`__repr__\` that returns \`Thermostat(21)\`.

## Then

Read a series of lines ending with \`end\`. The first line is the starting target. Each line after that is a new target to set.

- If making the object fails, print \`Rejected: <message>\` and stop, printing nothing else.
- For each later value, print \`Rejected: <message>\` if it is refused, and print nothing if it is accepted.
- After \`end\`, print the \`repr\` of the object.

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

Keep the real value in \`self._target\`, and have \`__init__\` assign to \`self.target\`, the property. Then the check runs once and is written once.

Wrap the construction in \`try\`, so that a refused starting value can be reported without stopping the program with a traceback.

Note that a refused assignment leaves the previous value in place. That is exactly the point of checking inside the setter.

## Constraints

The range check must appear in exactly one place.`,
          starterCode: `class Thermostat:
    def __init__(self, target):
        self.target = target


line = input()
`,
          hint: "Define @property def target returning self._target, and @target.setter checking 5 <= value <= 30 before assigning self._target. __init__ assigns self.target = target, so it goes through the setter.",
          tests: [
            {
              input: "21\n25\n40\n18\nend\n",
              expectedOutput: "Rejected: target must be between 5 and 30\nThermostat(18)",
              description: "A value outside the range is refused, while valid ones are applied",
            },
            {
              input: "50\nend\n",
              expectedOutput: "Rejected: target must be between 5 and 30",
              description: "An invalid starting value is refused and nothing else is printed",
            },
            {
              input: "5\n30\nend\n",
              expectedOutput: "Thermostat(30)",
              description: "Both ends of the range are accepted",
            },
            {
              input: "20\n4\n31\nend\n",
              expectedOutput:
                "Rejected: target must be between 5 and 30\nRejected: target must be between 5 and 30\nThermostat(20)",
              description: "Refused assignments leave the previous valid value untouched",
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
      "Building objects out of other objects, sharing data across a class, and extending a type.",
      [
        {
          type: "lesson",
          title: "Class Variables and Alternative Constructors",
          description: "Data shared by every instance, and methods that belong to the class instead of an object.",
          instructions: `## Attributes of an instance and of a class

An attribute assigned in \`__init__\` belongs to one object. An attribute assigned in the body of the class belongs to the class, and every instance shares it:

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

\`MINUTES_PER_HOUR\` exists once, on the class, and you can reach it without any instance at all. The capital letters mark it as a constant, following the habit from Module 6.

This is the natural home for values that every instance shares: limits, defaults, and conversion factors.

## The trap of a class attribute that can change

A shared class attribute that *can change* causes a bug of the same kind as the mutable default argument in Module 6:

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

Both baskets share one list, so adding to one shows up in the other. The repair is to create the list for each instance in \`__init__\`:

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

The general rule: class attributes are for constants. Anything that belongs to one object belongs in \`__init__\`.

> **Key idea**
> A class attribute is shared by every instance. Use one only for constants that cannot change. Putting a list or a dictionary there makes every object share it.

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

\`from_text\` is an **alternative constructor**: another way to make an object. \`cls\` is the class itself, so \`cls(subject, ...)\` makes an instance.

This pattern is worth recognising. A class often has one natural \`__init__\` that takes its real parts, plus class methods that build instances from other forms: a line of text, a dictionary, a row from a file. Putting each way of building into its own named method is far clearer than one \`__init__\` full of conditions.

## Static methods

A **static method** belongs to the class only by association. It takes neither \`self\` nor \`cls\`:

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

It is an ordinary function that lives inside the class because it is related to it. If it never touches the class or its instances, ask whether it should simply be a function at module level. Often the honest answer is yes.

## Composition

**Composition** means one object holding other objects:

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

A \`StudyPlan\` *has* sessions. Each class stays small and does one job. \`Session\` knows about one session, and \`StudyPlan\` knows about a group of them.

Composition is the most useful building tool in object-oriented design, and it is taught far less than inheritance. Most real designs are mostly composition.

Note \`{session.subject for session in self.sessions}\`. That is a **set comprehension**, which builds a set directly. The same form with square brackets builds a list, and Module 13 covers comprehensions in full.

## Summary

Class attributes are shared by every instance, and they should be constants that cannot change. \`@classmethod\` takes \`cls\` and is the natural way to write alternative constructors. \`@staticmethod\` takes neither, and it is often better as a plain function. Composition, where objects hold other objects, keeps classes small and focused.`,
        },
        {
          type: "lesson",
          title: "Inheritance, and When Not to Use a Class",
          description: "Extending a type that already exists, and judging whether to use a class at all.",
          instructions: `## Inheritance

**Inheritance** makes a new class based on one that already exists. The new class receives its attributes and methods:

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

\`class TimedReading(Activity):\` makes \`TimedReading\` a **subclass** of \`Activity\`. It gets everything \`Activity\` has, and it may add to that or replace parts of it.

\`super()\` refers to the parent class. \`super().__init__(name, minutes)\` runs the parent's setup, so the shared work is written once. \`super().describe()\` calls the parent's version and builds on it.

Replacing a method is called **overriding**. \`TimedReading.describe\` overrides \`Activity.describe\`, and Python picks the most specific version for the actual object.

## The relationship that inheritance expresses

Inheritance means "is a kind of". A \`TimedReading\` is a kind of \`Activity\`, so anywhere an \`Activity\` is expected, a \`TimedReading\` will do.

That test is worth applying strictly. If the honest relationship is "has a" rather than "is a", use composition. A \`StudyPlan\` has sessions. It is not a kind of session, so it should not inherit from one.

The most common mistake with inheritance is using it only to share code. If two classes share some code but are not kinds of the same thing, take the shared code out into a function or a separate class, and keep the two classes independent.

> **Key idea**
> Inherit only when the subclass truly *is a kind of* the parent. Sharing code is not a reason to inherit. Take out a function, or use composition, instead.

## Exceptions are classes

Every exception is a class, and that is why you can define your own:

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

Inheriting from \`Exception\` is all you need. The body can be nothing but a docstring.

Your own exception lets callers catch exactly your failure, without also catching unrelated \`ValueError\`s from somewhere else. Define one when your program has a kind of failure of its own that callers may want to handle in a particular way.

## Dataclasses

Many classes are mostly \`__init__\` and \`__repr__\`. The \`dataclasses\` module writes both for you:

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

Three lines produced \`__init__\`, \`__repr__\`, and \`__eq__\`. The type hints are required by the notation, although they are no more enforced here than anywhere else.

Use a dataclass when a class is mainly a structured record. Add methods to it as normal. Write a full class when making the object needs real logic or checking, although dataclasses support that too, through \`__post_init__\`.

## When not to use a class

Classes cost something: more code, more indirection, and more to hold in your head. Several situations do not deserve one.

**A single function is not a class.** If a class has one method besides \`__init__\`, and its attributes are only the inputs of that method, it should be a function taking those inputs.

**Plain data with no rules is not a class.** A dictionary or a named tuple is clearer, and JSON and CSV read into dictionaries naturally.

**A group of unrelated functions is not a class.** Put them in a module instead. That is what modules are for.

**Grouping constants needs no class.** Constants at module level work and are simpler.

Here is the sign that a class *is* deserved: data with rules about what is valid, several operations that all need the same data, or several things that share an interface while behaving differently.

## A worked judgement

Think about formatting a length of time. As a class:

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

Six lines, an object made only to be used once, and a call in two steps. As a function:

\`\`\`python
def format_duration(minutes):
    return f"{minutes // 60}h {minutes % 60}m"


print(format_duration(75))
\`\`\`

\`\`\`text
1h 15m
\`\`\`

Two lines, one call, and nothing to build. The function is plainly better, and no amount of comfort with classes should make the first version look preferable.

Object orientation is a tool, not a goal. Some problems are naturally about objects with state and rules. Many are not.

## Summary

Inheritance says "is a kind of", and \`super()\` reaches the parent. Do not inherit only to share code. Exceptions are classes, and your own exception lets callers catch your particular failure. Dataclasses write the repetitive parts of record-like classes. Prefer a function when a class would hold no meaningful state.`,
        },
        {
          type: "exercise",
          title: "Compose Objects Into a Collection",
          description: "Build a class that holds other objects and reports on them.",
          instructions: `## The problem

Model study sessions, and a plan that holds them.

## Requirements

Define two classes.

\`Session\`:

1. \`__init__(self, subject, minutes)\`.
2. A class method \`from_text(cls, text)\` that builds a \`Session\` from a string like \`history:90\`.
3. A \`__repr__\` that returns \`Session('history', 90)\`.

\`StudyPlan\`:

1. \`__init__(self, name)\`, with an empty list of sessions.
2. \`add(self, session)\`.
3. \`total_minutes(self)\`, which returns the total.
4. \`subjects(self)\`, which returns a sorted list of the different subjects.
5. \`busiest(self)\`, which returns the subject with the most total minutes. Ties are settled alphabetically, and an empty string is returned when there are no sessions.

## Then

Read a plan name, then lines of the form \`subject:minutes\`, ending with \`end\`. Build the objects and show exactly four lines:

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

Use \`Session.from_text\` to build each session, instead of splitting the line in the main loop. That keeps the rule about the format inside the class that owns the format.

For \`busiest\`, add up the minutes for each subject into a dictionary, then sort as you did in earlier modules.

Remember that the list of sessions must be created in \`__init__\`, not in the body of the class. Otherwise every plan would share one list.

## Constraints

Both classes must be used. The main code should hold no parsing logic of its own.`,
          starterCode: `class Session:
    def __init__(self, subject, minutes):
        self.subject = subject
        self.minutes = minutes


class StudyPlan:
    def __init__(self, name):
        self.name = name


name = input()
`,
          hint: "In Session, add @classmethod from_text(cls, text) that splits on \":\" and returns cls(subject, int(minutes)). In StudyPlan.busiest, build the totals with a dictionary, then use sorted(totals, key=lambda s: (-totals[s], s))[0], guarding the empty case first.",
          tests: [
            {
              input: "Revision week\nhistory:90\nbiology:45\nhistory:30\nend\n",
              expectedOutput:
                "Plan: Revision week\nTotal: 165\nSubjects: ['biology', 'history']\nBusiest: history",
              description: "Sessions are gathered into a plan, which reports totals and the busiest subject",
            },
            {
              input: "Empty week\nend\n",
              expectedOutput: "Plan: Empty week\nTotal: 0\nSubjects: []\nBusiest:",
              description: "A plan with no sessions reports zeros and an empty busiest subject",
            },
            {
              input: "Tie week\nart:30\nmaths:30\nend\n",
              expectedOutput: "Plan: Tie week\nTotal: 60\nSubjects: ['art', 'maths']\nBusiest: art",
              description: "Equal totals are settled alphabetically",
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
          description: "Build a small family of classes with checking, overriding, and an exception of your own.",
          instructions: `## The problem

Model library items of two kinds, sharing what they have in common.

## Requirements

Define your own exception \`ItemError\`, inheriting from \`Exception\`.

Define a base class \`Item\`:

1. \`__init__(self, title, days)\`, where \`days\` is the loan period. Raise \`ItemError\` with the message \`title must not be empty\` for a blank title, and \`days must be positive\` for a loan period of zero or less.
2. A method \`late_fee(self, days_overdue)\`, which returns \`days_overdue * 10\` as the base rate in paisa, or \`0\` when the item is not overdue.
3. A \`__repr__\` that returns \`Item('Tidal Systems', 21)\`.

Define \`Reference(Item)\`:

1. The loan period is always \`3\` days, so \`__init__(self, title)\` takes only a title and passes \`3\` to the parent.
2. \`late_fee\` overrides the base version: the rate is \`50\` paisa for each day.
3. \`__repr__\` returns \`Reference('Atlas')\`.

## Then

Read lines of the form \`kind|title|overdue\`, where kind is \`item\` or \`reference\`, ending with \`end\`. For \`item\`, the loan period is always \`21\`.

For each line, print either the repr and the fee, or the refusal message:

\`\`\`text
Item('Tidal Systems', 21) fee 30
Reference('Atlas') fee 100
Rejected: title must not be empty
\`\`\`

The fee line has the form \`<repr> fee <paisa>\`.

## Example

Given \`item|Tidal Systems|3\`, \`reference|Atlas|2\`, \`item||1\`, \`end\`, the output is the three lines above.

## Guidance

\`Reference.__init__\` should call \`super().__init__(title, 3)\`, so that the checking is written once and inherited.

\`late_fee\` in \`Reference\` replaces the parent's version completely. It does not need to call \`super()\`.

Catch \`ItemError\` around the making of each object, so that one bad line does not stop the program.

## Constraints

\`Reference\` must inherit from \`Item\`. The title check must exist only in \`Item\`.`,
          starterCode: `class ItemError(Exception):
    """Raised when an item cannot be created."""


class Item:
    def __init__(self, title, days):
        self.title = title
        self.days = days


line = input()
`,
          hint: "Item.__init__ checks first, then assigns. Reference(Item) defines __init__(self, title) calling super().__init__(title, 3), overrides late_fee with a rate of 50, and overrides __repr__. In the loop, build the right class inside try/except ItemError.",
          tests: [
            {
              input: "item|Tidal Systems|3\nreference|Atlas|2\nitem||1\nend\n",
              expectedOutput:
                "Item('Tidal Systems', 21) fee 30\nReference('Atlas') fee 100\nRejected: title must not be empty",
              description: "Both kinds work out their own fee, and an invalid title is refused",
            },
            {
              input: "item|Book|0\nend\n",
              expectedOutput: "Item('Book', 21) fee 0",
              description: "An item that is not overdue owes nothing",
            },
            {
              input: "reference|Maps|0\nend\n",
              expectedOutput: "Reference('Maps') fee 0",
              description: "The replaced method still gives zero when the item is not overdue",
            },
            {
              input: "end\n",
              expectedOutput: "",
              expectEmpty: true,
              description: "No input gives no output at all",
            },
            {
              input: "reference||5\nend\n",
              expectedOutput: "Rejected: title must not be empty",
              description: "The inherited check refuses a blank title on the subclass as well",
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

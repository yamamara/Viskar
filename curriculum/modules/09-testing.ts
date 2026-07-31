import { module, lesson, type ModuleSource } from "../types.ts"

const moduleNine: ModuleSource = module(
  "Testing and Code Quality",
  "Checking that code is correct and keeping it correct: test cases, assertions, regression tests, refactoring safely, and writing code others can read.",
  [
    lesson(
      "Why Tests Exist",
      "The failure of manual checking, and how to choose cases that find real defects.",
      [
        {
          type: "lesson",
          title: "The Limits of Checking by Hand",
          description: "Why running a program and looking at the output stops working.",
          instructions: `## How you have been testing

Until now, your method has been: run the program, look at the output, decide whether it seems right. This works, for a while.

It fails for three reasons, and each becomes more serious as programs grow.

**It does not scale.** Checking one function by hand takes thirty seconds. A program with forty functions takes twenty minutes, every time you change anything. In practice nobody does it, so most of the program goes unchecked after every change.

**It is not repeatable.** You checked the empty-list case last Tuesday. Did you check it after Thursday's change? You cannot remember, and neither can anyone else.

**It only covers what you happen to try.** People test the case they were thinking about while writing the code — which is precisely the case the code already handles.

## What a test is

A **test** is code that checks other code and reports whether the answer was right. Being code, it runs in a second and gives the same verdict every time.

The simplest form uses \`assert\`:

\`\`\`python
def double(value):
    return value * 2


assert double(3) == 6
assert double(0) == 0
assert double(-2) == -4
print("All tests passed")
\`\`\`

\`\`\`text
All tests passed
\`\`\`

Each \`assert\` states something that must be true. If it is, nothing happens and the program continues. If it is not, Python raises \`AssertionError\` immediately and the program stops.

Silence means success. That takes a moment to get used to: a test suite that prints nothing has found nothing wrong.

## Watching a test fail

A test you have never seen fail is not yet trustworthy. Consider a deliberately broken function:

\`\`\`python
def double(value):
    return value + 2


try:
    assert double(3) == 6
    print("passed")
except AssertionError:
    print("failed as expected")
\`\`\`

\`\`\`text
failed as expected
\`\`\`

\`double(3)\` returns \`5\`, so the assertion fails. Note that this happens to pass for \`double(2)\`, which returns \`4\` — a reminder that one lucky test case proves very little.

## What tests actually give you

The obvious benefit is catching mistakes. There are two larger ones.

**Confidence to change code.** Without tests, every edit to working code risks breaking something silently, so people avoid improving code they do not fully understand. With tests, you make the change and run them. This is what makes the refactoring of Module 6 practical rather than theoretical.

**A specification you can execute.** A test says what the function is supposed to do, in a form that cannot drift out of date. A comment claiming a function handles empty input may be years stale. A passing test proving it is true right now.

> **Key idea**
> Tests are not mainly about finding bugs today. They are about being able to change code tomorrow without fear, and about recording what the code is supposed to do in a form that cannot go stale.

## What to test

Test the **logic**, not the plumbing. The functions worth testing are the ones that take input and return output — the pure functions of Module 2.

This explains why the course has insisted on separating computation from printing. A function that returns can be tested with one line. A function that prints can only be tested by capturing its output, which is far more work. A function that both computes and prints usually cannot be tested at all without restructuring.

So the design advice and the testing advice are the same advice: keep the logic in pure functions, and keep printing at the edges.

## Testing does not prove correctness

An important limit. Tests show that specific cases produce specific answers. They cannot show that *all* cases do.

A function passing twenty tests may still fail on the twenty-first input. Tests reduce risk; they do not eliminate it, and treating a green test suite as proof of correctness is a mistake.

The response is not to give up but to choose cases deliberately, which is the next stage.

## Summary

Manual checking does not scale, is not repeatable, and covers only what you thought to try. A test is code that checks code and reports a verdict. The real value is the confidence to change code and an executable record of intent. Tests reduce risk; they never prove correctness.`,
        },
        {
          type: "lesson",
          title: "Choosing Test Cases",
          description: "Which inputs actually find defects, and which merely feel reassuring.",
          instructions: `## Not all tests are equal

Given \`add(a, b)\`, these tests are nearly worthless:

\`\`\`python
def add(a, b):
    return a + b


assert add(1, 2) == 3
assert add(2, 3) == 5
assert add(3, 4) == 7
print("done")
\`\`\`

\`\`\`text
done
\`\`\`

Three tests, one scenario. Any defect surviving the first survives all three.

Useful tests probe *different* aspects. Three categories cover most of what matters.

## Normal cases

The inputs the function will usually receive. These confirm the basic idea works.

One or two are enough. Adding a fifth normal case almost never finds anything.

## Boundary cases

The inputs where behaviour changes. These are where most defects live.

For a function classifying scores with a pass mark of 60, the boundaries are \`59\`, \`60\`, and \`61\`:

\`\`\`python
def classify(score):
    if score >= 60:
        return "pass"
    return "fail"


assert classify(59) == "fail"
assert classify(60) == "pass"
assert classify(61) == "pass"
print("boundaries checked")
\`\`\`

\`\`\`text
boundaries checked
\`\`\`

Those three catch the off-by-one mistake of writing \`>\` instead of \`>=\`. A test with \`80\` never would.

Boundaries to look for: the smallest and largest valid inputs, the exact threshold in any comparison, the first and last item of a collection, and zero.

## Degenerate cases

The emptiest or smallest possible input: an empty list, an empty string, zero, a single item.

These are forgotten most often and fail most often:

\`\`\`python
def mean(values):
    if not values:
        return 0.0
    return sum(values) / len(values)


assert mean([2, 4]) == 3.0
assert mean([5]) == 5.0
assert mean([]) == 0.0
print("degenerate cases checked")
\`\`\`

\`\`\`text
degenerate cases checked
\`\`\`

Without the guard, the third assertion would raise \`ZeroDivisionError\`. Writing the test forces the question "what should this do with no data?" — a question that has to be answered by someone, and is best answered deliberately.

## Invalid cases

Where a function is documented to reject bad input, test that it does:

\`\`\`python
def set_rating(value):
    if not 1 <= value <= 5:
        raise ValueError("rating must be 1 to 5")
    return value


assert set_rating(3) == 3

try:
    set_rating(9)
    print("no exception raised")
except ValueError:
    print("correctly rejected 9")
\`\`\`

\`\`\`text
correctly rejected 9
\`\`\`

Testing that something *fails* correctly is as important as testing that it succeeds. A validation function that never rejects anything passes every happy-path test.

Note the structure: call the function, then a line that should not be reached, then the handler. If no exception is raised, the \`print\` inside \`try\` runs and the test reports the problem.

> **Key idea**
> A normal case shows the function works. A boundary case shows where it stops working. A degenerate case shows whether anyone thought about emptiness. Write all three.

## Test the contract, not the implementation

Test what the function promises, not how it happens to work today.

\`\`\`python
def top_scores(scores):
    return sorted(scores, reverse=True)[:3]


assert top_scores([50, 90, 70, 60]) == [90, 70, 60]
assert top_scores([10]) == [10]
assert top_scores([]) == []
print("contract checked")
\`\`\`

\`\`\`text
contract checked
\`\`\`

Those tests describe what the function returns. If someone rewrites it to use a different sorting approach, the tests still pass, because the promise has not changed. A test tied to internal details fails whenever the code is improved, which teaches people to delete tests.

## How many is enough?

There is no formula. A reasonable target for an ordinary function is one or two normal cases, every boundary, the degenerate case, and one invalid case if it rejects anything. That is usually four to six tests.

More useful than counting: ask "if I broke this function subtly, would a test notice?" If the honest answer is no, add the test that would.

## Summary

Choose cases that probe different behaviour: normal, boundary, degenerate, and invalid. Boundaries and empty inputs find the most defects. Test what the function promises, not how it currently works.`,
        },
        {
          type: "exercise",
          title: "Write Tests That Find a Bug",
          description: "Add assertions covering boundary and degenerate cases for a subtly wrong function.",
          instructions: `## The problem

The function \`band\` in the editor classifies a score. It is **subtly wrong**: it handles ordinary scores correctly and fails at one boundary.

## The intended behaviour

\`\`\`text
score >= 70  -> "high"
score >= 40  -> "medium"
otherwise    -> "low"
\`\`\`

## Your task

1. Add assertions that check the function against the specification, including every boundary.
2. Fix the function so all your assertions pass.
3. Print \`All tests passed\` at the end.

## Requirements

Your program must include assertions covering at least these inputs: \`39\`, \`40\`, \`69\`, \`70\`, and \`0\`.

The final output must be exactly:

\`\`\`text
All tests passed
\`\`\`

## Guidance

Write the assertions **first**, before looking hard at the function. Run them. One will fail, and the failure tells you exactly which boundary is wrong — which is faster than reading the code and more reliable than guessing.

Remember that a passing assertion prints nothing. If your program prints only the final line, every assertion passed.

## Constraints

Do not change the specification to match the code. Fix the code to match the specification.`,
          starterCode: `def band(score):
    if score > 70:
        return "high"
    if score >= 40:
        return "medium"
    return "low"


print("All tests passed")
`,
          hint: "The bug is that the high boundary uses > rather than >=, so a score of exactly 70 is classified as medium. Add assert band(70) == \"high\" and the failure appears immediately.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "Every assertion passes once the boundary comparison is corrected",
            },
          ],
          solution: `def band(score):
    if score >= 70:
        return "high"
    if score >= 40:
        return "medium"
    return "low"


assert band(0) == "low"
assert band(39) == "low"
assert band(40) == "medium"
assert band(69) == "medium"
assert band(70) == "high"
assert band(95) == "high"

print("All tests passed")
`,
        },
      ],
    ),

    lesson(
      "Structuring Tests",
      "Organising checks so a failure tells you what broke.",
      [
        {
          type: "lesson",
          title: "Arrange, Act, Assert",
          description: "A three-part shape that makes tests readable, and naming that makes failures diagnostic.",
          instructions: `## Grouping tests into functions

Loose assertions work for a handful of checks. Beyond that, group them into named functions:

\`\`\`python
def mean(values):
    if not values:
        return 0.0
    return sum(values) / len(values)


def test_mean_of_several_values():
    assert mean([2, 4, 6]) == 4.0


def test_mean_of_single_value():
    assert mean([5]) == 5.0


def test_mean_of_empty_list_is_zero():
    assert mean([]) == 0.0


test_mean_of_several_values()
test_mean_of_single_value()
test_mean_of_empty_list_is_zero()
print("All tests passed")
\`\`\`

\`\`\`text
All tests passed
\`\`\`

Grouping buys two things. Related checks sit together, and — more importantly — each group has a **name**.

## Names are the error message

When an assertion fails, the traceback names the function it was in. So the function name is what tells you what broke.

Compare:

\`\`\`text
AssertionError in test_1
AssertionError in test_mean_of_empty_list_is_zero
\`\`\`

The second names the defect. That is why test names are long and descriptive, in a way that would be poor style anywhere else. The convention is \`test_\` followed by what is being checked and what should happen.

Good: \`test_shorten_returns_text_unchanged_when_it_fits\`.

Poor: \`test_shorten_2\`.

> **Key idea**
> A test function's name is the message you get when it fails. Write it as a claim about behaviour, not as a number.

## Arrange, act, assert

Within a test, three steps in order:

\`\`\`python
def total_with_tax(amounts, rate):
    return sum(amounts) * (1 + rate)


def test_total_applies_tax_to_the_sum():
    amounts = [100, 50]
    rate = 0.2

    result = total_with_tax(amounts, rate)

    assert result == 180.0


test_total_applies_tax_to_the_sum()
print("passed")
\`\`\`

\`\`\`text
passed
\`\`\`

**Arrange** sets up the inputs. **Act** performs the one operation under test. **Assert** checks the result.

Separating them, with blank lines, makes tests skimmable: a reader sees immediately what was given, what was done, and what was expected. It also encourages one action per test, which is what makes a failure diagnostic.

## One reason to fail

A test asserting six unrelated things tells you little when it fails, because you learn only that one of six claims is false.

\`\`\`python
def shorten(text, limit):
    if len(text) <= limit:
        return text
    if limit <= 3:
        return "." * limit
    return text[:limit - 3] + "..."


def test_shorten_leaves_short_text_unchanged():
    assert shorten("abc", 10) == "abc"


def test_shorten_truncates_to_exact_limit():
    result = shorten("abcdefgh", 5)
    assert result == "ab..."
    assert len(result) == 5


def test_shorten_handles_limit_below_ellipsis():
    assert shorten("abcdefgh", 2) == ".."


test_shorten_leaves_short_text_unchanged()
test_shorten_truncates_to_exact_limit()
test_shorten_handles_limit_below_ellipsis()
print("All tests passed")
\`\`\`

\`\`\`text
All tests passed
\`\`\`

Three tests, three names, three distinct claims. The second contains two assertions, which is fine because both describe the same behaviour: the result is correct *and* it has the promised length.

The rule is one *reason* to fail, not one assertion.

## Testing that something raises

\`\`\`python
def set_rating(value):
    if not 1 <= value <= 5:
        raise ValueError("rating must be 1 to 5")
    return value


def test_set_rating_rejects_values_above_five():
    try:
        set_rating(9)
    except ValueError:
        return
    assert False, "expected ValueError for a rating of 9"


test_set_rating_rejects_values_above_five()
print("passed")
\`\`\`

\`\`\`text
passed
\`\`\`

The structure matters. If the call raises, \`except\` catches it and \`return\` ends the test successfully. If it does *not* raise, execution reaches \`assert False\`, which fails with a message explaining what was expected.

Without that final line the test would pass whether or not the exception was raised, which is worse than having no test at all — it reports success while checking nothing.

\`assert condition, "message"\` attaches an explanation shown when the assertion fails. Worth using wherever the reason would not be obvious.

## Independence

Each test must pass regardless of whether others ran, and in any order. A test depending on state left behind by another will fail mysteriously when tests are reordered or run alone.

In practice: create the data each test needs inside that test, and do not share mutable state between them.

\`\`\`python
def add_entry(entries, name):
    return entries + [name]


def test_add_entry_appends_to_an_empty_list():
    entries = []
    assert add_entry(entries, "first") == ["first"]


def test_add_entry_leaves_the_original_unchanged():
    entries = ["existing"]
    add_entry(entries, "new")
    assert entries == ["existing"]


test_add_entry_appends_to_an_empty_list()
test_add_entry_leaves_the_original_unchanged()
print("All tests passed")
\`\`\`

\`\`\`text
All tests passed
\`\`\`

Each test builds its own \`entries\`. The second also demonstrates a valuable kind of check: confirming that a function does *not* modify its argument.

## Summary

Group assertions into named test functions; the name is the failure message. Arrange, act, assert, separated by blank lines. Aim for one reason to fail. Test that invalid input raises, and make the test fail when it does not. Keep tests independent.`,
        },
        {
          type: "lesson",
          title: "pytest, Regression Tests, and Refactoring",
          description: "How tests are run in practice, and the two habits that make them pay.",
          instructions: `## Running tests automatically

Calling every test function by hand does not scale either. Real projects use a **test runner**: a tool that finds test functions, runs them, and reports results.

The standard choice for Python is **pytest**, a third-party package installed with \`pip install pytest\`.

With pytest, tests go in a file whose name starts with \`test_\`, and the runner finds them:

\`\`\`text
# test_durations.py
from durations import format_duration


def test_minutes_only():
    assert format_duration(45) == "45m"


def test_whole_hours():
    assert format_duration(120) == "2h"
\`\`\`

Running \`pytest\` in that directory discovers both functions and reports:

\`\`\`text
test_durations.py ..                    [100%]
2 passed in 0.01s
\`\`\`

No calls at the bottom of the file. The runner finds anything named \`test_*\` and runs it.

When something fails, pytest shows the assertion, the values involved, and the exact line — considerably more useful than a bare \`AssertionError\`.

\`\`\`text
E       assert '2h 0m' == '2h'
E         - 2h
E         + 2h 0m
\`\`\`

**pytest is not available in this course's environment**, which runs Python in your browser with the standard library only. The exercises here therefore call test functions explicitly and print a summary. Everything about *how to write* a test transfers unchanged; only the mechanism for running them differs.

The standard library also includes \`unittest\`, which needs no installation but is more verbose. Most modern projects use pytest.

## Regression tests

A **regression** is a defect that reappears after being fixed. Regression tests prevent them.

The discipline is simple and repays itself immediately. When you find a bug:

1. Write a test that reproduces it. Watch it fail.
2. Fix the bug.
3. Watch the test pass.
4. Keep the test forever.

Step 1 matters more than it appears. A test you have watched fail is a test you know actually checks something. A test written after the fix might pass for the wrong reason, and you would never know.

\`\`\`python
def split_name(full_name):
    parts = full_name.strip().split()
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], parts[-1]


def test_split_name_handles_a_single_word():
    assert split_name("Ada") == ("Ada", "")


def test_split_name_handles_empty_input():
    assert split_name("   ") == ("", "")


test_split_name_handles_a_single_word()
test_split_name_handles_empty_input()
print("All tests passed")
\`\`\`

\`\`\`text
All tests passed
\`\`\`

Both tests came from real failures: the original version raised \`IndexError\` on a single word and on empty input. Now those cases cannot break again without something noticing.

Over time a project's test suite becomes a record of every mistake anyone has made in it. That is a genuinely valuable asset.

## Refactoring under test

Module 6 defined refactoring as changing structure without changing behaviour, and noted that tests are what make it safe. Here is the loop:

1. Make sure the tests pass **before** you start. If they do not, you are debugging, not refactoring.
2. Make one small structural change.
3. Run the tests.
4. If they pass, continue. If not, undo the change.

The discipline is in step 4. A failing test after a refactoring means the change altered behaviour. Undoing is faster than investigating, because the change was small.

\`\`\`python
def describe(values):
    if not values:
        return "no data"
    total = sum(values)
    mean = total / len(values)
    return f"{len(values)} values, total {total}, mean {mean:.1f}"


def test_describe_reports_counts_and_mean():
    assert describe([2, 4]) == "2 values, total 6, mean 3.0"


def test_describe_handles_no_data():
    assert describe([]) == "no data"


test_describe_reports_counts_and_mean()
test_describe_handles_no_data()
print("All tests passed")
\`\`\`

\`\`\`text
All tests passed
\`\`\`

With those in place, you can restructure \`describe\` freely — extract helpers, rename variables, change the loop — and know within a second whether you broke it.

> **Key idea**
> Write a failing test before fixing a bug, and keep it. Run the tests before, during, and after any refactoring, and undo rather than investigate when one fails.

## Separating logic from interface

One design decision affects testability more than any other: keeping the logic separate from input and output.

\`\`\`python
def parse_line(line):
    name, score = line.split(":")
    return name, int(score)


def best_name(records):
    if not records:
        return ""
    return sorted(records, key=lambda pair: (-pair[1], pair[0]))[0][0]


def main():
    lines = ["ana:12", "raj:9"]
    records = [parse_line(line) for line in lines]
    print(f"Winner: {best_name(records)}")


def test_best_name_breaks_ties_alphabetically():
    assert best_name([("raj", 9), ("ana", 9)]) == "ana"


test_best_name_breaks_ties_alphabetically()
main()
\`\`\`

\`\`\`text
Winner: ana
\`\`\`

\`parse_line\` and \`best_name\` are pure and trivially testable. \`main\` does the input and output and contains no logic worth testing.

This is the same structure recommended in Modules 2, 6, and 8, arrived at from a different direction. Code that is easy to test is code that was well designed, and difficulty in testing is usually a design problem rather than a testing problem.

## Summary

pytest discovers and runs \`test_*\` functions and reports failures in detail. Write a failing test before fixing a bug and keep it forever. Refactor only with passing tests, in small steps, undoing when one fails. Testability follows from keeping logic separate from input and output.`,
        },
        {
          type: "exercise",
          title: "Test a Function Thoroughly",
          description: "Write named test functions covering normal, boundary, and degenerate cases.",
          instructions: `## The problem

The function \`price_band\` is supplied and is **correct**. Your job is to write tests for it.

## The specification

\`\`\`text
price < 0        -> "invalid"
0 <= price < 10  -> "budget"
10 <= price < 50 -> "standard"
price >= 50      -> "premium"
\`\`\`

## Requirements

1. Write **at least five** test functions, each named \`test_\` followed by a description of what it checks.
2. Between them, they must cover: a negative price, exactly \`0\`, a value just below \`10\`, exactly \`10\`, exactly \`50\`, and a value above \`50\`.
3. Each test must contain at least one \`assert\`.
4. Call every test function.
5. Print exactly \`All tests passed\` at the end.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

Boundaries are where defects live, so most of your tests should sit on them. \`9.99\` and \`10\` are far more informative than \`25\`.

Name each test as a claim: \`test_price_band_treats_exactly_ten_as_standard\` says what it checks and becomes the message if it ever fails.

Since the function is already correct, all your tests will pass first time. To confirm they genuinely check something, temporarily change a \`<\` to \`<=\` in the function and watch a test fail — then change it back.

## Constraints

Do not modify \`price_band\`. Passing assertions print nothing, so the only output is the final line.`,
          starterCode: `def price_band(price):
    if price < 0:
        return "invalid"
    if price < 10:
        return "budget"
    if price < 50:
        return "standard"
    return "premium"


print("All tests passed")
`,
          hint: "Write functions like def test_price_band_rejects_negative_prices(): assert price_band(-1) == \"invalid\". Cover -1, 0, 9.99, 10, 50 and 75, then call each function before the final print.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "Every test function passes against the supplied implementation",
            },
          ],
          solution: `def price_band(price):
    if price < 0:
        return "invalid"
    if price < 10:
        return "budget"
    if price < 50:
        return "standard"
    return "premium"


def test_price_band_rejects_negative_prices():
    assert price_band(-1) == "invalid"


def test_price_band_treats_zero_as_budget():
    assert price_band(0) == "budget"


def test_price_band_treats_just_under_ten_as_budget():
    assert price_band(9.99) == "budget"


def test_price_band_treats_exactly_ten_as_standard():
    assert price_band(10) == "standard"


def test_price_band_treats_exactly_fifty_as_premium():
    assert price_band(50) == "premium"


def test_price_band_treats_large_values_as_premium():
    assert price_band(75) == "premium"


test_price_band_rejects_negative_prices()
test_price_band_treats_zero_as_budget()
test_price_band_treats_just_under_ten_as_budget()
test_price_band_treats_exactly_ten_as_standard()
test_price_band_treats_exactly_fifty_as_premium()
test_price_band_treats_large_values_as_premium()

print("All tests passed")
`,
        },
        {
          type: "exercise",
          title: "Test That Invalid Input Raises",
          description: "Write a test that fails when an expected exception is not raised.",
          instructions: `## The problem

The function \`parse_quantity\` should convert text to a whole number and raise \`ValueError\` for anything invalid. It currently returns \`0\` for invalid input instead of raising, which is the bug you must find with a test and then fix.

## The intended behaviour

\`\`\`text
"12"   -> 12
"0"    -> 0
"abc"  -> raises ValueError
""     -> raises ValueError
"-3"   -> raises ValueError   (quantities cannot be negative)
\`\`\`

## Requirements

1. Write a test function checking that valid text converts correctly.
2. Write a test function checking that invalid text **raises** \`ValueError\`. It must fail if no exception is raised.
3. Write a test function checking that a negative quantity raises \`ValueError\`.
4. Fix \`parse_quantity\` so all your tests pass.
5. Call every test and print exactly \`All tests passed\`.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

The structure for testing an exception is: call the function inside \`try\`, \`return\` from the \`except\` block on success, and put \`assert False, "expected ValueError"\` after the \`try\` statement so the test fails when nothing was raised.

That last line is what makes the test real. Without it the test would pass whether or not the function raised, which is the most dangerous kind of test: one that reports success while checking nothing.

## Constraints

\`parse_quantity\` must raise rather than return a sentinel value. A returned \`0\` is indistinguishable from a genuine quantity of zero, which is exactly why raising is correct here.`,
          starterCode: `def parse_quantity(raw):
    try:
        return int(raw)
    except ValueError:
        return 0


print("All tests passed")
`,
          hint: "Replace the except branch with raise ValueError(f\"invalid quantity: {raw}\") and add a check that rejects negatives. For the exception tests, use try/except/return followed by assert False with a message.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "Valid conversions succeed and every invalid input raises as the tests require",
            },
          ],
          solution: `def parse_quantity(raw):
    """Return raw as a non-negative whole number.

    Raises ValueError for text that is not a whole number and for negative
    quantities, so that callers cannot mistake a failure for a real zero.
    """
    value = int(raw)
    if value < 0:
        raise ValueError(f"quantity cannot be negative: {raw}")
    return value


def test_parse_quantity_converts_valid_text():
    assert parse_quantity("12") == 12
    assert parse_quantity("0") == 0


def test_parse_quantity_rejects_non_numeric_text():
    try:
        parse_quantity("abc")
    except ValueError:
        return
    assert False, "expected ValueError for non-numeric text"


def test_parse_quantity_rejects_empty_text():
    try:
        parse_quantity("")
    except ValueError:
        return
    assert False, "expected ValueError for empty text"


def test_parse_quantity_rejects_negative_values():
    try:
        parse_quantity("-3")
    except ValueError:
        return
    assert False, "expected ValueError for a negative quantity"


test_parse_quantity_converts_valid_text()
test_parse_quantity_rejects_non_numeric_text()
test_parse_quantity_rejects_empty_text()
test_parse_quantity_rejects_negative_values()

print("All tests passed")
`,
        },
      ],
    ),

    lesson(
      "Readable Code",
      "Style conventions, and why consistency matters more than preference.",
      [
        {
          type: "lesson",
          title: "PEP 8 and Practical Style",
          description: "The conventions Python programmers share, and the reasoning behind them.",
          instructions: `## Code is read more than written

A line of code is written once and read many times — by colleagues, and by you in six months, when you will remember nothing about it. Optimising for the reader is therefore almost always right.

Python has a style guide called **PEP 8**. It is a set of conventions, not rules the interpreter enforces, and following it means your code looks like everyone else's, which is the point.

## Naming

\`\`\`python
unread_messages = 12
MAX_RETRIES = 3


def format_duration(minutes):
    return f"{minutes}m"


print(unread_messages, MAX_RETRIES, format_duration(5))
\`\`\`

\`\`\`text
12 3 5m
\`\`\`

Variables and functions use lowercase with underscores. Constants use capitals. Classes, which arrive in Module 12, use capitalised words with no underscores.

Beyond the mechanics, names should say what a thing *is*:

\`\`\`python
d = 21
days_until_due = 21
print(d, days_until_due)
\`\`\`

\`\`\`text
21 21
\`\`\`

The second needs no comment. Short names are acceptable only where scope is tiny and meaning is obvious — \`i\` for a loop index, \`_\` for a value you ignore.

Avoid names that shadow built-ins. Calling a variable \`list\`, \`str\`, \`sum\`, or \`type\` makes the real one unreachable in that scope and produces confusing failures later.

## Whitespace

Four spaces per indentation level. Never mix tabs and spaces.

Spaces around operators and after commas, but not inside brackets:

\`\`\`python
total = sum([1, 2, 3]) * 2
values = {"a": 1, "b": 2}
print(total, values["a"])
\`\`\`

\`\`\`text
12 1
\`\`\`

Two blank lines between top-level definitions, one between logical sections inside a function. Blank lines are punctuation: they group related lines into paragraphs, and code without them is as hard to read as prose without them.

## Line length

PEP 8 suggests keeping lines under 79 characters, which many projects relax to around 100. The specific number matters less than having one, so that lines do not sprawl.

Long expressions break inside brackets:

\`\`\`python
records = [
    ("history", 40),
    ("biology", 25),
    ("statistics", 60),
]
print(len(records))
\`\`\`

\`\`\`text
3
\`\`\`

The trailing comma after the last item is conventional in Python: it means adding an entry changes one line rather than two, which makes the change easier to review.

## Imports

At the top, one per line, grouped: standard library first, then third-party, then your own modules, with a blank line between groups.

\`\`\`python
import math
import statistics

print(math.floor(statistics.mean([1, 2, 4])))
\`\`\`

\`\`\`text
2
\`\`\`

## Comparisons

\`\`\`python
values = []
flag = False

if not values:
    print("empty")

if not flag:
    print("flag is off")
\`\`\`

\`\`\`text
empty
flag is off
\`\`\`

Write \`if not values:\` rather than \`if len(values) == 0:\`, and \`if not flag:\` rather than \`if flag == False:\`. Use \`is None\` for \`None\`, never \`== None\`.

## Consistency beats preference

Many style choices are arbitrary. Whether to use single or double quotes matters far less than picking one and staying with it.

Consistent code lets a reader stop noticing the formatting and attend to the meaning. Inconsistent code makes every difference look potentially significant.

This is also why automated tools are widely used. A **formatter** such as Black rewrites code into a standard layout, and a **linter** such as Ruff or Flake8 reports style problems and likely mistakes. Neither is available in this environment, but both are standard in professional work, and the reason is the same: consistency is worth more than any individual's preference, and machines are better at it than people.

> **Key idea**
> Style conventions exist so that readers spend their attention on meaning rather than on layout. Consistency matters more than which convention you pick.

## Comments that earn their place

Module 1 covered this and it bears repeating in this context. Comments should explain *why*, not *what*:

\`\`\`python
RETRY_LIMIT = 3

# Three attempts matches the upstream service's own retry budget;
# more would exceed its rate limit.
print(RETRY_LIMIT)
\`\`\`

\`\`\`text
3
\`\`\`

A comment restating the code is a maintenance liability, because it can become false. Code cannot lie about what it does; comments can.

## Summary

PEP 8 gives Python a shared style: snake case for names, capitals for constants, four-space indentation, spaces around operators, grouped imports at the top. Names should state what a value is. Consistency matters more than any individual choice, which is why formatters and linters are standard tools.`,
        },
        {
          type: "exercise",
          title: "Module 9 Checkpoint: Test and Clean a Module",
          description: "Fix a defect, add regression tests, and improve style without changing behaviour.",
          instructions: `## The problem

The program in the editor computes statistics about study sessions. It has three problems:

1. A **defect**: \`busiest_subject\` returns the wrong subject when two subjects tie, and crashes on empty input.
2. **No tests**.
3. **Poor style**: unclear names, a magic number, and no documentation.

## Your task

Address all three.

## Requirements

1. Fix \`busiest_subject\` so that:
   - It returns the subject with the greatest total minutes.
   - Ties are broken alphabetically.
   - It returns an empty string for an empty dictionary rather than raising.
2. Give it a docstring stating those decisions.
3. Write **at least three** test functions with descriptive \`test_\` names, covering a clear winner, a tie, and empty input. Call them all.
4. Replace the magic number \`60\` with a named constant in capitals.
5. Rename \`f\` and \`x\` to something meaningful.
6. Print exactly \`All tests passed\` at the end and nothing else.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

Write the tie test **first** and watch it fail. That is the regression-test discipline: a test you have seen fail is a test you know works.

For the tie-break, sorting the subjects by a key of the negative total and then the name handles both rules at once — the same pattern used in earlier modules.

The style changes must not alter behaviour. Your tests are what prove they did not.

## Constraints

The only output is the final line. Passing assertions print nothing.`,
          starterCode: `def busiest_subject(d):
    f = ""
    x = 0
    for k in d:
        if sum(d[k]) > x:
            x = sum(d[k])
            f = k
    return f


def to_hours(m):
    return m / 60


print("All tests passed")
`,
          hint: "Rewrite busiest_subject to guard the empty dictionary, then return sorted(totals, key=lambda name: (-sum(totals[name]), name))[0]. Add MINUTES_PER_HOUR = 60 and use it in to_hours. Then write the three tests and call them.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "The tie-breaking and empty-input tests pass against the corrected implementation",
            },
          ],
          solution: `MINUTES_PER_HOUR = 60


def busiest_subject(sessions: dict) -> str:
    """Return the subject with the greatest total minutes.

    Ties are broken alphabetically, so the earliest name wins when several
    subjects share the highest total. Returns an empty string for an empty
    dictionary rather than raising, so callers need no special case.
    """
    if not sessions:
        return ""
    ordered = sorted(sessions, key=lambda name: (-sum(sessions[name]), name))
    return ordered[0]


def to_hours(minutes: int) -> float:
    """Return minutes expressed as hours."""
    return minutes / MINUTES_PER_HOUR


def test_busiest_subject_finds_the_clear_winner():
    sessions = {"history": [40, 15], "biology": [25]}
    assert busiest_subject(sessions) == "history"


def test_busiest_subject_breaks_ties_alphabetically():
    sessions = {"maths": [30], "art": [30]}
    assert busiest_subject(sessions) == "art"


def test_busiest_subject_returns_empty_string_for_no_data():
    assert busiest_subject({}) == ""


def test_to_hours_converts_minutes():
    assert to_hours(90) == 1.5


test_busiest_subject_finds_the_clear_winner()
test_busiest_subject_breaks_ties_alphabetically()
test_busiest_subject_returns_empty_string_for_no_data()
test_to_hours_converts_minutes()

print("All tests passed")
`,
        },
        {
          type: "exercise",
          title: "Improve Names and Structure",
          description: "Rewrite working code so a reader can follow it, without changing behaviour.",
          instructions: `## The problem

The function in the editor is correct. It is also very hard to read: the names say nothing, a magic number appears twice, and there is no documentation.

## Your task

Improve it without changing what it does.

## Requirements

1. Rename \`f\`, \`x\`, \`y\`, and \`z\` to names that state what they hold.
2. Replace the repeated literal \`1000\` with a named constant in capitals.
3. Add a docstring stating what the function returns and what it does with an empty list.
4. Keep the behaviour identical.

## Expected output

\`\`\`text
Large: 2
Total: 4200
Mean: 1400.0
\`\`\`

## Input

One line of whole numbers separated by spaces.

## Guidance

Run the original first and record its output. Make one change at a time and run again after each, exactly as Module 6 describes. The test proves only that the behaviour did not change — the improvement is in the code, and that is the point.

Ask what each value *means* rather than what type it is. \`x\` holding a count of large values is better named \`large_count\` than \`number\`.

## Constraints

Do not change the function's signature or its results. The empty-list behaviour must stay exactly as it is.`,
          starterCode: `def f(a):
    x = 0
    y = 0
    for i in a:
        y += i
        if i >= 1000:
            x += 1
    if len(a) == 0:
        z = 0.0
    else:
        z = y / len(a)
    return x, y, z


values = [int(part) for part in input().split()]
x, y, z = f(values)
print(f"Large: {x}")
print(f"Total: {y}")
print(f"Mean: {z}")
`,
          hint: "Rename f to something like summarise_readings, a to readings, x to large_count, y to total, z to mean. Add LARGE_THRESHOLD = 1000 at module level and use it in the comparison.",
          tests: [
            {
              input: "1200 800 2200\n",
              expectedOutput: "Large: 2\nTotal: 4200\nMean: 1400.0",
              description: "Behaviour is unchanged for a typical set of readings",
            },
            {
              input: "\n",
              expectedOutput: "Large: 0\nTotal: 0\nMean: 0.0",
              description: "The empty-list behaviour is preserved rather than raising",
            },
            {
              input: "1000\n",
              expectedOutput: "Large: 1\nTotal: 1000\nMean: 1000.0",
              description: "The threshold remains inclusive after the constant is introduced",
            },
            {
              input: "1 2 3\n",
              expectedOutput: "Large: 0\nTotal: 6\nMean: 2.0",
              description: "Small values count towards the total but not the large count",
            },
          ],
          solution: `LARGE_THRESHOLD = 1000


def summarise_readings(readings):
    """Return the count of large readings, their total, and the mean.

    A reading counts as large when it reaches LARGE_THRESHOLD. An empty list
    returns a mean of 0.0 rather than raising, so callers summarising possibly
    empty groups need no special case.
    """
    large_count = 0
    total = 0
    for reading in readings:
        total += reading
        if reading >= LARGE_THRESHOLD:
            large_count += 1

    if len(readings) == 0:
        mean = 0.0
    else:
        mean = total / len(readings)

    return large_count, total, mean


values = [int(part) for part in input().split()]
large_count, total, mean = summarise_readings(values)
print(f"Large: {large_count}")
print(f"Total: {total}")
print(f"Mean: {mean}")
`,
        },
      ],
    ),
  ],
)

export default moduleNine

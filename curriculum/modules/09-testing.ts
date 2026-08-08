import { module, lesson, type ModuleSource } from "../types.ts"

const moduleNine: ModuleSource = module(
  "Testing and Code Quality",
  "Checking that code is correct and keeping it correct: test cases, assertions, tests against old bugs, safe reworking, and writing code that others can read.",
  [
    lesson(
      "Why Tests Exist",
      "Why checking by hand stops working, and how to choose cases that find real faults.",
      [
        {
          type: "lesson",
          title: "The Limits of Checking by Hand",
          description: "Why running a program and looking at the output stops being enough.",
          instructions: `## How you have been testing

Until now your method has been: run the program, look at the output, and decide whether it seems right. This works for a while.

It fails for three reasons, and each one grows more serious as programs grow.

**It does not grow with the program.** Checking one function by hand takes thirty seconds. A program with forty functions takes twenty minutes, every time you change anything. In practice nobody does that, so most of the program goes unchecked after every change.

**It cannot be repeated exactly.** You checked the empty-list case last Tuesday. Did you check it again after Thursday's change? You cannot remember, and nobody else can either.

**It only covers what you happened to try.** People test the case they were thinking about while writing the code, and that is exactly the case the code already handles.

## What a test is

A **test** is code that checks other code and reports whether the answer was right. Because it is code, it runs in a second and gives the same verdict every time.

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

Each \`assert\` states something that must be true. If it is true, nothing happens and the program carries on. If it is not true, Python raises \`AssertionError\` at once and the program stops.

Silence means success. That takes a little getting used to. A set of tests that prints nothing has found nothing wrong.

## Watching a test fail

A test you have never seen fail is not yet worth trusting. Look at a function that is broken on purpose:

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

\`double(3)\` returns \`5\`, so the assertion fails. Note that this same broken function passes for \`double(2)\`, which returns \`4\`. That is a reminder that one lucky test case proves very little.

## What tests really give you

The obvious benefit is catching mistakes. There are two bigger ones.

**Confidence to change code.** Without tests, every edit to working code risks breaking something in silence, so people avoid improving code they do not fully understand. With tests, you make the change and run them. This is what turns the refactoring of Module 6 from an idea into a practical habit.

**A specification you can run.** A test says what the function is supposed to do, in a form that cannot quietly go out of date. A comment claiming that a function handles empty input may be years out of date. A passing test proves it is true right now.

> **Key idea**
> Tests are not mainly about finding bugs today. They are about being able to change code tomorrow without fear, and about recording what the code should do in a form that cannot go stale.

## What to test

Test the **logic**, not the plumbing. The functions worth testing are the ones that take input and return output: the pure functions of Module 2.

This explains why the course has insisted on keeping calculation apart from printing. A function that returns can be tested in one line. A function that prints can only be tested by capturing its output, which is much more work. A function that both calculates and prints usually cannot be tested at all until it is restructured.

So the design advice and the testing advice are the same advice: keep the logic in pure functions, and keep printing at the edges.

## Testing does not prove correctness

Here is an important limit. Tests show that particular cases give particular answers. They cannot show that *every* case does.

A function that passes twenty tests may still fail on the twenty-first input. Tests lower the risk. They do not remove it, and treating a set of passing tests as proof of correctness is a mistake.

The answer is not to give up but to choose your cases on purpose, and that is the next stage.

## Summary

Checking by hand does not grow with the program, cannot be repeated exactly, and covers only what you thought to try. A test is code that checks code and reports a verdict. Its real value is the confidence to change code, and a record of intent that you can run. Tests lower risk. They never prove correctness.`,
        },
        {
          type: "lesson",
          title: "Choosing Test Cases",
          description: "Which inputs really find faults, and which only feel comforting.",
          instructions: `## Not all tests are equal

Given \`add(a, b)\`, these tests are almost worthless:

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

Three tests, one situation. Any fault that survives the first one survives all three.

Useful tests examine *different* things. Three kinds cover most of what matters.

## Normal cases

These are the inputs the function will usually receive. They show that the basic idea works.

One or two are enough. Adding a fifth normal case almost never finds anything new.

## Boundary cases

These are the inputs where the behaviour changes. Most faults live here.

For a function that sorts scores with a pass mark of 60, the boundaries are \`59\`, \`60\`, and \`61\`:

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

Boundaries to look for: the smallest and the largest valid input, the exact limit in any comparison, the first and last item of a collection, and zero.

## Emptiest cases

These are the emptiest or smallest possible inputs: an empty list, an empty string, zero, a single item.

They are the ones people forget most often, and the ones that fail most often:

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

Without the guard, the third assertion would raise \`ZeroDivisionError\`. Writing the test forces the question "what should this do with no data?" Somebody has to answer that question, and it is best answered on purpose.

## Invalid cases

Where a function is documented to refuse bad input, test that it really does:

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

Testing that something *fails* correctly is as important as testing that it works. A checking function that never refuses anything passes every easy test.

Notice the shape: call the function, then a line that should never be reached, then the handler. If no exception is raised, the \`print\` inside \`try\` runs and the test reports the problem.

> **Key idea**
> A normal case shows that the function works. A boundary case shows where it stops working. An emptiest case shows whether anyone thought about having no data. Write all three.

## Test the promise, not the method

Test what the function promises, not the way it happens to work today.

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

Those tests describe what the function returns. If someone rewrites it with a different sorting method, the tests still pass, because the promise has not changed. A test tied to internal details fails whenever the code is improved, and that teaches people to delete tests.

## How many are enough?

There is no formula. A fair target for an ordinary function is one or two normal cases, every boundary, the emptiest case, and one invalid case if the function refuses anything. That is usually four to six tests.

More useful than counting: ask "if I broke this function in a small way, would a test notice?" If the honest answer is no, add the test that would.

## Summary

Choose cases that examine different behaviour: normal, boundary, emptiest, and invalid. Boundaries and empty inputs find the most faults. Test what the function promises, not the way it works at the moment.`,
        },
        {
          type: "exercise",
          title: "Write Tests That Find a Bug",
          description: "Add assertions that cover boundary and empty cases for a function that is slightly wrong.",
          instructions: `## The problem

The function \`band\` in the editor sorts a score into a group. It is **slightly wrong**. It handles ordinary scores correctly and fails at one boundary.

## The intended behaviour

\`\`\`text
score >= 70  -> "high"
score >= 40  -> "medium"
otherwise    -> "low"
\`\`\`

## Your task

1. Add assertions that check the function against this specification, including every boundary.
2. Fix the function so that all your assertions pass.
3. Print \`All tests passed\` at the end.

## Requirements

Your program must hold assertions that cover at least these inputs: \`39\`, \`40\`, \`69\`, \`70\`, and \`0\`.

The final output must be exactly:

\`\`\`text
All tests passed
\`\`\`

## Guidance

Write the assertions **first**, before you study the function closely. Run them. One will fail, and the failure tells you exactly which boundary is wrong. That is faster than reading the code, and safer than guessing.

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
          hint: "The bug is that the high boundary uses > instead of >=, so a score of exactly 70 is called medium. Add assert band(70) == \"high\" and the failure appears at once.",
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
      "Arranging your checks so that a failure tells you exactly what broke.",
      [
        {
          type: "lesson",
          title: "Arrange, Act, Assert",
          description: "A three-part shape that makes tests readable, and naming that makes failures useful.",
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

Grouping buys you two things. Related checks sit together, and, more importantly, each group has a **name**.

## The name is the error message

When an assertion fails, the traceback names the function it was inside. So the name of the function is what tells you what broke.

Compare these two:

\`\`\`text
AssertionError in test_1
AssertionError in test_mean_of_empty_list_is_zero
\`\`\`

The second one names the fault. That is why test names are long and descriptive, in a way that would be poor style anywhere else. The habit is \`test_\` followed by what is being checked and what should happen.

Good: \`test_shorten_returns_text_unchanged_when_it_fits\`.

Poor: \`test_shorten_2\`.

> **Key idea**
> The name of a test function is the message you get when it fails. Write it as a claim about behaviour, not as a number.

## Arrange, act, assert

Inside a test there are three steps, in order:

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

**Arrange** sets up the inputs. **Act** does the one operation being tested. **Assert** checks the result.

Keeping them apart, with blank lines between them, makes tests easy to skim. A reader sees at once what was given, what was done, and what was expected. It also pushes you towards one action for each test, and that is what makes a failure tell you something.

## One reason to fail

A test that asserts six unrelated things tells you little when it fails, because you learn only that one of the six claims is false.

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

Three tests, three names, three separate claims. The second one holds two assertions, and that is fine, because both describe the same behaviour: the result is correct *and* it has the promised length.

The rule is one *reason* to fail, not one assertion.

## Testing that something raises an error

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

The shape matters. If the call raises, \`except\` catches it and \`return\` ends the test successfully. If it does *not* raise, the program reaches \`assert False\`, which fails with a message explaining what was expected.

Without that last line, the test would pass whether or not the exception was raised. That is worse than having no test at all, because it reports success while checking nothing.

\`assert condition, "message"\` attaches an explanation that is shown when the assertion fails. It is worth using wherever the reason would not be obvious.

## Tests must not depend on each other

Each test must pass whether or not the others ran, and in any order. A test that depends on data left behind by another test will fail in a puzzling way when the tests are reordered or run alone.

In practice this means: create the data each test needs inside that test, and do not share changeable data between tests.

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

Each test builds its own \`entries\`. The second one also shows a valuable kind of check: making sure a function does *not* change its argument.

## Summary

Group assertions into named test functions, because the name is the failure message. Arrange, act, assert, with blank lines between them. Aim for one reason to fail. Test that invalid input raises an error, and make the test fail when it does not. Keep tests independent of each other.`,
        },
        {
          type: "lesson",
          title: "pytest, Regression Tests, and Refactoring",
          description: "How tests are run in real projects, and the two habits that make them pay.",
          instructions: `## Running tests automatically

Calling every test function by hand does not work for long either. Real projects use a **test runner**: a tool that finds the test functions, runs them, and reports the results.

The usual choice for Python is **pytest**, a third-party package installed with \`pip install pytest\`.

With pytest, tests go in a file whose name starts with \`test_\`, and the runner finds them:

\`\`\`text
# test_durations.py
from durations import format_duration


def test_minutes_only():
    assert format_duration(45) == "45m"


def test_whole_hours():
    assert format_duration(120) == "2h"
\`\`\`

Running \`pytest\` in that folder finds both functions and reports:

\`\`\`text
test_durations.py ..                    [100%]
2 passed in 0.01s
\`\`\`

There are no calls at the bottom of the file. The runner finds anything named \`test_*\` and runs it.

When something fails, pytest shows you the assertion, the values involved, and the exact line. That is far more useful than a bare \`AssertionError\`.

\`\`\`text
E       assert '2h 0m' == '2h'
E         - 2h
E         + 2h 0m
\`\`\`

**pytest is not available in this course's environment**, which runs Python in your browser with the standard library only. So the exercises here call the test functions themselves and print a summary. Everything about *how to write* a test carries over unchanged. Only the way you run them is different.

The standard library also includes \`unittest\`, which needs no installation but takes more typing. Most modern projects use pytest.

## Tests against old bugs

A **regression** is a fault that comes back after it was fixed. Tests kept from old bugs prevent that.

The routine is simple, and it pays for itself at once. When you find a bug:

1. Write a test that causes it. Watch it fail.
2. Fix the bug.
3. Watch the test pass.
4. Keep the test for ever.

Step 1 matters more than it looks. A test you have watched fail is a test you know really checks something. A test written after the fix might pass for the wrong reason, and you would never find out.

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

Both tests came from real failures. The first version raised \`IndexError\` on a single word and on empty input. Now those cases cannot break again without something noticing.

Over time, the tests of a project become a record of every mistake anyone has made in it. That is a genuinely valuable thing to own.

## Refactoring with tests

Module 6 said that refactoring means changing structure without changing behaviour, and that tests are what make it safe. Here is the loop:

1. Make sure the tests pass **before** you start. If they do not, you are debugging, not refactoring.
2. Make one small change to the structure.
3. Run the tests.
4. If they pass, carry on. If not, undo the change.

The discipline is in step 4. A failing test after a refactoring means the change altered the behaviour. Undoing is faster than investigating, because the change was small.

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

With those in place, you can restructure \`describe\` freely — pull out helpers, rename variables, change the loop — and know within a second whether you broke it.

> **Key idea**
> Write a failing test before you fix a bug, and keep it. Run the tests before, during, and after any refactoring, and undo rather than investigate when one fails.

## Keeping logic apart from input and output

One design decision affects how testable your code is more than any other: keeping the logic separate from input and output.

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

\`parse_line\` and \`best_name\` are pure, and testing them is easy. \`main\` does the input and output, and it holds no logic worth testing.

This is the same structure recommended in Modules 2, 6, and 8, reached from a different direction. Code that is easy to test is code that was designed well, and trouble in testing is usually a design problem rather than a testing problem.

## Summary

pytest finds and runs \`test_*\` functions and reports failures in detail. Write a failing test before you fix a bug, and keep it for ever. Refactor only when the tests pass, in small steps, undoing when one fails. Code becomes testable when its logic is kept apart from its input and output.`,
        },
        {
          type: "exercise",
          title: "Test a Function Thoroughly",
          description: "Write named test functions that cover normal, boundary, and emptiest cases.",
          instructions: `## The problem

The function \`price_band\` is given to you, and it is **correct**. Your job is to write tests for it.

## The specification

\`\`\`text
price < 0        -> "invalid"
0 <= price < 10  -> "budget"
10 <= price < 50 -> "standard"
price >= 50      -> "premium"
\`\`\`

## Requirements

1. Write **at least five** test functions. Name each one \`test_\` followed by a description of what it checks.
2. Between them they must cover: a negative price, exactly \`0\`, a value just below \`10\`, exactly \`10\`, exactly \`50\`, and a value above \`50\`.
3. Each test must hold at least one \`assert\`.
4. Call every test function.
5. Print exactly \`All tests passed\` at the end.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

Boundaries are where faults live, so most of your tests should sit on them. \`9.99\` and \`10\` tell you far more than \`25\` does.

Name each test as a claim. \`test_price_band_treats_exactly_ten_as_standard\` says what it checks, and it becomes the message if it ever fails.

The function is already correct, so all your tests will pass the first time. To prove that they really check something, change a \`<\` to \`<=\` in the function for a moment and watch a test fail. Then change it back.

## Constraints

Do not change \`price_band\`. Passing assertions print nothing, so the only output is the final line.`,
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
          hint: "Write functions like def test_price_band_rejects_negative_prices(): assert price_band(-1) == \"invalid\". Cover -1, 0, 9.99, 10, 50, and 75, then call each function before the final print.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "Every test function passes against the function that was given",
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
          description: "Write a test that fails when an expected error is not raised.",
          instructions: `## The problem

The function \`parse_quantity\` should turn text into a whole number and raise \`ValueError\` for anything invalid. At the moment it returns \`0\` for invalid input instead of raising. That is the bug you must catch with a test and then fix.

## The intended behaviour

\`\`\`text
"12"   -> 12
"0"    -> 0
"abc"  -> raises ValueError
""     -> raises ValueError
"-3"   -> raises ValueError   (quantities cannot be negative)
\`\`\`

## Requirements

1. Write a test function that checks valid text converting correctly.
2. Write a test function that checks invalid text **raising** \`ValueError\`. It must fail if no error is raised.
3. Write a test function that checks a negative quantity raising \`ValueError\`.
4. Fix \`parse_quantity\` so that all your tests pass.
5. Call every test and print exactly \`All tests passed\`.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

The shape for testing an error is: call the function inside \`try\`, \`return\` from the \`except\` block when it worked, and put \`assert False, "expected ValueError"\` after the \`try\` statement so that the test fails when nothing was raised.

That last line is what makes the test real. Without it, the test would pass whether or not the function raised anything. That is the most dangerous kind of test: one that reports success while checking nothing.

## Constraints

\`parse_quantity\` must raise instead of returning a special value. A returned \`0\` cannot be told apart from a real quantity of zero, and that is exactly why raising is correct here.`,
          starterCode: `def parse_quantity(raw):
    try:
        return int(raw)
    except ValueError:
        return 0


print("All tests passed")
`,
          hint: "Replace the except branch with raise ValueError(f\"invalid quantity: {raw}\") and add a check that refuses negative values. For the error tests, use try, except, return, followed by assert False with a message.",
          tests: [
            {
              expectedOutput: "All tests passed",
              description: "Valid conversions work, and every invalid input raises an error as the tests require",
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
      "Shared style habits, and why being consistent matters more than personal taste.",
      [
        {
          type: "lesson",
          title: "PEP 8 and Practical Style",
          description: "The habits that Python programmers share, and the reasons behind them.",
          instructions: `## Code is read more often than it is written

A line of code is written once and read many times: by your colleagues, and by you in six months, when you will remember nothing about it. So writing for the reader is almost always right.

Python has a style guide called **PEP 8**. It is a set of shared habits, not rules that the interpreter enforces. Following it means your code looks like everyone else's, and that is the point.

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

Variables and functions use small letters with underscores. Constants use capital letters. Classes, which arrive in Module 12, use capitalised words with no underscores.

Beyond those mechanics, a name should say what a thing *is*:

\`\`\`python
d = 21
days_until_due = 21
print(d, days_until_due)
\`\`\`

\`\`\`text
21 21
\`\`\`

The second name needs no comment. Short names are acceptable only where the scope is tiny and the meaning is obvious: \`i\` for a loop index, \`_\` for a value you ignore.

Avoid names that hide built-ins. Calling a variable \`list\`, \`str\`, \`sum\`, or \`type\` makes the real one unreachable in that part of the program, and it produces confusing failures later.

## Spacing

Four spaces for each level of indentation. Never mix tabs and spaces.

Put spaces around operators and after commas, but not just inside brackets:

\`\`\`python
total = sum([1, 2, 3]) * 2
values = {"a": 1, "b": 2}
print(total, values["a"])
\`\`\`

\`\`\`text
12 1
\`\`\`

Leave two blank lines between top-level definitions, and one between sections inside a function. Blank lines are punctuation. They group related lines into paragraphs, and code without them is as hard to read as prose without them.

## Line length

PEP 8 suggests keeping lines under 79 characters, and many projects relax that to about 100. The exact number matters less than having one, so that lines do not sprawl across the screen.

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

The comma after the last item is a normal Python habit. It means that adding an entry changes one line instead of two, which makes the change easier to check.

## Imports

Put them at the top, one for each line, in groups: standard library first, then third-party packages, then your own modules, with a blank line between the groups.

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

## Being consistent beats personal taste

Many style choices could have gone either way. Whether you use single or double quotes matters far less than picking one and staying with it.

Consistent code lets a reader stop noticing the layout and pay attention to the meaning. Inconsistent code makes every small difference look as though it might be important.

This is also why automatic tools are widely used. A **formatter** such as Black rewrites code into one standard layout. A **linter** such as Ruff or Flake8 reports style problems and likely mistakes. Neither is available in this environment, but both are standard in professional work, and the reason is the same: consistency is worth more than any one person's taste, and machines are better at it than people are.

> **Key idea**
> Style habits exist so that readers spend their attention on meaning instead of on layout. Being consistent matters more than which habit you choose.

## Comments that earn their place

Module 1 covered this, and it is worth repeating here. Comments should explain *why*, not *what*:

\`\`\`python
RETRY_LIMIT = 3

# Three attempts matches the upstream service's own retry budget;
# more would exceed its rate limit.
print(RETRY_LIMIT)
\`\`\`

\`\`\`text
3
\`\`\`

A comment that repeats the code is a burden, because it can become false. Code cannot lie about what it does. Comments can.

## Summary

PEP 8 gives Python a shared style: small letters with underscores for names, capitals for constants, four spaces of indentation, spaces around operators, and grouped imports at the top. Names should say what a value is. Consistency matters more than any single choice, and that is why formatters and linters are standard tools.`,
        },
        {
          type: "exercise",
          title: "Module 9 Checkpoint: Test and Clean a Module",
          description: "Fix a fault, add tests that guard against it, and improve the style without changing behaviour.",
          instructions: `## The problem

The program in the editor works out statistics about study sessions. It has three problems:

1. A **fault**: \`busiest_subject\` returns the wrong subject when two subjects tie, and it crashes on empty input.
2. **No tests**.
3. **Poor style**: unclear names, an unexplained number, and no documentation.

## Your task

Deal with all three.

## Requirements

1. Fix \`busiest_subject\` so that:
   - It returns the subject with the greatest total minutes.
   - Ties are settled alphabetically.
   - It returns an empty string for an empty dictionary instead of raising an error.
2. Give it a docstring that records those decisions.
3. Write **at least three** test functions with clear \`test_\` names, covering a clear winner, a tie, and empty input. Call them all.
4. Replace the unexplained number \`60\` with a named constant in capital letters.
5. Rename \`f\` and \`x\` to something meaningful.
6. Print exactly \`All tests passed\` at the end, and nothing else.

## Expected output

\`\`\`text
All tests passed
\`\`\`

## Guidance

Write the tie test **first** and watch it fail. That is the discipline for a bug test: a test you have seen fail is a test you know works.

For the tie, sorting the subjects by a key of the negative total and then the name deals with both rules at once. It is the same pattern used in earlier modules.

The style changes must not change the behaviour. Your tests are what prove that they did not.

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
              description: "The tie test and the empty-input test pass against the corrected function",
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
          description: "Rewrite working code so that a reader can follow it, without changing what it does.",
          instructions: `## The problem

The function in the editor is correct. It is also very hard to read. The names say nothing, an unexplained number appears twice, and there is no documentation.

## Your task

Improve it without changing what it does.

## Requirements

1. Rename \`f\`, \`x\`, \`y\`, and \`z\` to names that say what they hold.
2. Replace the repeated number \`1000\` with a named constant in capital letters.
3. Add a docstring saying what the function returns and what it does with an empty list.
4. Keep the behaviour exactly the same.

## Expected output

\`\`\`text
Large: 2
Total: 4200
Mean: 1400.0
\`\`\`

## Input

One line of whole numbers separated by spaces.

## Guidance

Run the original first and write its output down. Make one change at a time and run again after each one, exactly as Module 6 describes. The test proves only that the behaviour did not change. The improvement is in the code, and that is the point.

Ask what each value *means*, not what type it is. If \`x\` holds a count of large values, \`large_count\` is a better name than \`number\`.

## Constraints

Do not change the function's parameters or its results. The behaviour for an empty list must stay exactly as it is.`,
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
          hint: "Rename f to something like summarise_readings, a to readings, x to large_count, y to total, and z to mean. Add LARGE_THRESHOLD = 1000 at the top of the file and use it in the comparison.",
          tests: [
            {
              input: "1200 800 2200\n",
              expectedOutput: "Large: 2\nTotal: 4200\nMean: 1400.0",
              description: "The behaviour is unchanged for an ordinary set of readings",
            },
            {
              input: "\n",
              expectedOutput: "Large: 0\nTotal: 0\nMean: 0.0",
              description: "The behaviour for an empty list is kept, and no error is raised",
            },
            {
              input: "1000\n",
              expectedOutput: "Large: 1\nTotal: 1000\nMean: 1000.0",
              description: "The limit still includes an equal value after the constant is introduced",
            },
            {
              input: "1 2 3\n",
              expectedOutput: "Large: 0\nTotal: 6\nMean: 2.0",
              description: "Small values add to the total but not to the count of large readings",
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

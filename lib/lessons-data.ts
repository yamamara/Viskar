// Lesson content and structure
export interface TestCase {
  input: string
  expectedOutput: string
  description: string
}

export interface Stage {
  id: number
  title: string
  description: string
  instructions: string
  starterCode: string
  testCases: TestCase[]
  hint?: string
}

export interface Lesson {
  id: number
  title: string
  description: string
  stages: Stage[]
}

export interface Module {
  id: number
  title: string
  description: string
  lessons: Lesson[]
}

export const modules: Module[] = [
  {
    id: 1,
    title: "Python Basics",
    description: "Learn the fundamentals of Python programming",
    lessons: [
      {
        id: 1,
        title: "Hello, Python!",
        description: "Write your first Python program",
        stages: [
          {
            id: 1,
            title: "Print Your Name",
            description: "Learn how to use the print function",
            instructions: "Use the print() function to display your name on the screen.",
            starterCode: "# Write your code below\n",
            testCases: [
              {
                input: "",
                expectedOutput: ".*",
                description: "Should print something",
              },
            ],
            hint: "Use print('Your Name') to display text",
          },
          {
            id: 2,
            title: "Print Multiple Lines",
            description: "Print multiple messages",
            instructions: "Print 'Hello' on one line and 'World' on the next line.",
            starterCode: "# Print two messages\n",
            testCases: [
              {
                input: "",
                expectedOutput: "Hello\\nWorld",
                description: "Should print 'Hello' then 'World' on separate lines",
              },
            ],
            hint: "Use print() twice",
          },
          {
            id: 3,
            title: "Print with Variables",
            description: "Store and print a message",
            instructions: "Create a variable called 'message' with the value 'Python is fun!' and print it.",
            starterCode: "# Create a variable and print it\n",
            testCases: [
              {
                input: "",
                expectedOutput: "Python is fun!",
                description: "Should print 'Python is fun!'",
              },
            ],
            hint: "Use message = 'Python is fun!' then print(message)",
          },
        ],
      },
      {
        id: 2,
        title: "Variables and Types",
        description: "Learn about variables and data types",
        stages: [
          {
            id: 1,
            title: "Creating Variables",
            description: "Create different types of variables",
            instructions:
              "Create a variable 'age' with value 10, 'name' with your name, and 'score' with 95.5. Print all three.",
            starterCode: "# Create three variables\n",
            testCases: [
              {
                input: "",
                expectedOutput: ".*10.*95\\.5.*",
                description: "Should print all three values",
              },
            ],
          },
          {
            id: 2,
            title: "Variable Math",
            description: "Perform calculations with variables",
            instructions: "Create two variables 'x' and 'y' with values 5 and 3. Print their sum.",
            starterCode: "# Create variables and add them\n",
            testCases: [
              {
                input: "",
                expectedOutput: "8",
                description: "Should print 8",
              },
            ],
            hint: "Use x + y to add variables",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Control Flow",
    description: "Learn to make decisions in your code",
    lessons: [
      {
        id: 1,
        title: "If Statements",
        description: "Make decisions with if statements",
        stages: [
          {
            id: 1,
            title: "Simple If",
            description: "Check if a number is positive",
            instructions: "Create a variable 'num' with value 5. If num is greater than 0, print 'Positive'.",
            starterCode: "# Write an if statement\n",
            testCases: [
              {
                input: "",
                expectedOutput: "Positive",
                description: "Should print 'Positive'",
              },
            ],
            hint: "Use if num > 0:",
          },
          {
            id: 2,
            title: "If-Else",
            description: "Handle both conditions",
            instructions:
              "Create a variable 'num'. If it's greater than 0, print 'Positive', otherwise print 'Not positive'.",
            starterCode: "num = -3\n# Write if-else statement\n",
            testCases: [
              {
                input: "",
                expectedOutput: "Not positive",
                description: "Should print 'Not positive' for -3",
              },
            ],
          },
        ],
      },
    ],
  },
]

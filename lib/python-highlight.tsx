import type { ReactNode } from "react"

const KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del",
  "elif", "else", "except", "False", "finally", "for", "from", "global", "if", "import",
  "in", "is", "lambda", "None", "nonlocal", "not", "or", "pass", "raise", "return",
  "True", "try", "while", "with", "yield",
])

const BUILTINS = new Set([
  "print", "input", "len", "range", "str", "int", "float", "list", "dict", "tuple",
  "set", "abs", "max", "min", "sum", "sorted", "reversed", "enumerate", "zip", "map",
  "filter", "any", "all", "type", "isinstance", "open", "round", "format",
])

const TOKEN_RE = new RegExp(
  [
    "(#[^\\n]*)", // comment
    "(\"\"\"[\\s\\S]*?\"\"\"|'''[\\s\\S]*?'''|\"(?:[^\"\\\\\\n]|\\\\.)*\"|'(?:[^'\\\\\\n]|\\\\.)*')", // string
    "(\\b\\d+(?:\\.\\d+)?\\b)", // number
    "([A-Za-z_][A-Za-z0-9_]*)", // word
  ].join("|"),
  "g",
)

/**
 * Colorizes Python source using the design system's syntax tokens:
 * sky for keywords, amber for strings, violet for functions.
 */
export function highlightPython(code: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0
  let key = 0

  for (const match of code.matchAll(TOKEN_RE)) {
    const [text, comment, string, number, word] = match
    const start = match.index ?? 0

    if (start > cursor) {
      nodes.push(code.slice(cursor, start))
    }

    let token: string | null = null
    if (comment) token = "token-comment"
    else if (string) token = "token-string"
    else if (number) token = "token-number"
    else if (word && KEYWORDS.has(word)) token = "token-keyword"
    else if (word && BUILTINS.has(word)) token = "token-function"

    nodes.push(
      token ? (
        <span key={key++} className={token}>
          {text}
        </span>
      ) : (
        text
      ),
    )
    cursor = start + text.length
  }

  if (cursor < code.length) {
    nodes.push(code.slice(cursor))
  }

  return nodes
}

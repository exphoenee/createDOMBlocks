export type SupportedLanguage = "javascript" | "typescript" | "python" | "bash" | "powershell" | "html" | "css";

interface TokenPattern {
  regex: RegExp;
  className: string;
}

const JS_KEYWORDS = new Set([
  "abstract", "arguments", "async", "await", "boolean", "break", "byte",
  "case", "catch", "char", "class", "const", "continue", "debugger",
  "default", "delete", "do", "double", "else", "enum", "export",
  "extends", "false", "final", "finally", "float", "for", "from",
  "function", "goto", "if", "implements", "import", "in", "instanceof",
  "int", "interface", "let", "long", "native", "new", "null", "of",
  "package", "private", "protected", "public", "return", "short",
  "static", "super", "switch", "synchronized", "this", "throw",
  "throws", "transient", "true", "try", "typeof", "undefined", "var",
  "void", "volatile", "while", "with", "yield",
]);

const TS_KEYWORDS = new Set([
  ...JS_KEYWORDS,
  "any", "constructor", "declare", "enum", "keyof", "module", "namespace",
  "never", "object", "readonly", "require", "set", "get",
  "string", "symbol", "type", "unique", "unknown", "as",
]);

const PY_KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await",
  "break", "class", "continue", "def", "del", "elif", "else", "except",
  "finally", "for", "from", "global", "if", "import", "in", "is",
  "lambda", "nonlocal", "not", "or", "pass", "raise", "return",
  "try", "while", "with", "yield", "self", "cls",
]);

const BASH_KEYWORDS = new Set([
  "if", "then", "else", "elif", "fi", "case", "esac", "for", "while",
  "until", "do", "done", "in", "function", "return", "exit", "local",
  "export", "source", "alias", "unalias", "declare", "typeset",
  "readonly", "shift", "trap", "wait", "eval", "exec", "set", "unset",
]);

const BASH_BUILTINS = new Set([
  "echo", "printf", "read", "test", "cd", "pwd", "ls", "cp", "mv", "rm",
  "mkdir", "rmdir", "cat", "head", "tail", "grep", "find", "sed", "awk",
  "sort", "uniq", "wc", "curl", "wget", "chmod", "chown", "ln", "touch",
  "tar", "gzip", "gunzip", "ssh", "scp", "git", "npm", "node", "npx",
  "export", "source", "alias", "history", "env", "which", "type",
]);

const PS_KEYWORDS = new Set([
  "begin", "break", "catch", "class", "continue", "data", "do", "dynamicparam",
  "else", "elseif", "end", "exit", "filter", "finally", "for", "foreach",
  "from", "function", "if", "in", "inlinescript", "param", "process",
  "return", "switch", "throw", "trap", "try", "until", "using", "while",
  "workflow", "where", "foreach", "hidden", "static", "abstract",
]);

const PS_BUILTINS = new Set([
  "Write-Host", "Write-Output", "Write-Error", "Write-Warning", "Write-Verbose",
  "Get-ChildItem", "Set-Location", "Get-Location", "Copy-Item", "Move-Item",
  "Remove-Item", "New-Item", "Get-Content", "Set-Content", "Test-Path",
  "Select-String", "ForEach-Object", "Where-Object", "Sort-Object",
  "Import-Csv", "Export-Csv", "Invoke-Command", "Get-Help", "Get-Command",
  "Out-Null", "Out-File", "Select-Object", "Measure-Object", "Group-Object",
  "ForEach-Object", "Where-Object", "Sort-Object", "Compare-Object",
]);

const JS_BUILTINS = new Set([
  "console", "document", "window", "Math", "JSON", "Array", "Object",
  "String", "Number", "Boolean", "Date", "RegExp", "Error", "Promise",
  "Map", "Set", "WeakMap", "WeakSet", "Symbol", "Proxy", "Reflect",
  "parseInt", "parseFloat", "isNaN", "isFinite", "setTimeout",
  "setInterval", "clearTimeout", "clearInterval", "fetch", "alert",
  "confirm", "prompt", "require", "module", "exports",
]);

const TS_BUILTINS = new Set([
  ...JS_BUILTINS,
  "Record", "Partial", "Required", "Readonly", "Pick", "Omit",
  "Exclude", "Extract", "NonNullable", "ReturnType", "Parameters",
  "HTMLElement", "Event", "NodeList",
]);

const PY_BUILTINS = new Set([
  "print", "len", "range", "int", "str", "float", "list", "dict",
  "set", "tuple", "bool", "type", "input", "open", "super", "property",
  "staticmethod", "classmethod", "enumerate", "zip", "map", "filter",
  "sorted", "reversed", "abs", "max", "min", "sum", "any", "all",
  "isinstance", "issubclass", "hasattr", "getattr", "setattr", "delattr",
  "repr", "id", "hash", "callable", "iter", "next",
]);

function getLanguagePatterns(lang: SupportedLanguage): TokenPattern[] {
  const patterns: TokenPattern[] = [];

  if (lang === "bash") {
    patterns.push({ regex: /#.*$/gm, className: "hl-comment" });
    patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
    patterns.push({ regex: /\$\{?[\w]+\}?/g, className: "hl-variable" });
    patterns.push({ regex: /\b\d+\b/g, className: "hl-number" });
    patterns.push({ regex: /[|&;><]+/g, className: "hl-operator" });
    patterns.push({
      regex: new RegExp(`\\b(?:${Array.from(BASH_KEYWORDS).join("|")})\\b`, "g"),
      className: "hl-keyword",
    });
    patterns.push({
      regex: new RegExp(`\\b(?:${Array.from(BASH_BUILTINS).join("|")})\\b`, "g"),
      className: "hl-builtin",
    });
    return patterns;
  }

  if (lang === "powershell") {
    patterns.push({ regex: /#.*$/gm, className: "hl-comment" });
    patterns.push({ regex: /<#[\s\S]*?#>/g, className: "hl-comment" });
    patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
    patterns.push({ regex: /\$[\w]+/g, className: "hl-variable" });
    patterns.push({ regex: /\b\d+\b/g, className: "hl-number" });
    patterns.push({
      regex: new RegExp(`\\b(?:${Array.from(PS_KEYWORDS).join("|")})\\b`, "g"),
      className: "hl-keyword",
    });
    patterns.push({
      regex: new RegExp(`(?:${Array.from(PS_BUILTINS).join("|")})`, "g"),
      className: "hl-builtin",
    });
    return patterns;
  }

  if (lang === "html") {
    patterns.push({ regex: /&lt;!--[\s\S]*?--&gt;/g, className: "hl-comment" });
    patterns.push({ regex: /&lt;\/?[\w-]+/g, className: "hl-keyword" });
    patterns.push({ regex: /&gt;/g, className: "hl-keyword" });
    patterns.push({ regex: /[\w-]+=/g, className: "hl-attr" });
    patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
    return patterns;
  }

  if (lang === "css") {
    patterns.push({ regex: /\/\*[\s\S]*?\*\//g, className: "hl-comment" });
    patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, className: "hl-string" });
    patterns.push({ regex: /\b\d+\.?\d*(?:px|em|rem|%|vh|vw|s|ms)?\b/g, className: "hl-number" });
    patterns.push({ regex: /#[\da-fA-F]{3,8}\b/g, className: "hl-number" });
    patterns.push({ regex: /[\w-]+(?=\s*:)/g, className: "hl-attr" });
    patterns.push({ regex: /:[\w-]+/g, className: "hl-keyword" });
    return patterns;
  }

  const keywords = lang === "python" ? PY_KEYWORDS : lang === "typescript" ? TS_KEYWORDS : JS_KEYWORDS;
  const builtins = lang === "python" ? PY_BUILTINS : lang === "typescript" ? TS_BUILTINS : JS_BUILTINS;

  // Python triple-quoted strings — must come before generic strings
  if (lang === "python") {
    patterns.push({ regex: /"""[\s\S]*?"""|'''[\s\S]*?'''/g, className: "hl-string" });
  }

  // Generic strings before comments — so // inside URLs isn't treated as a comment
  patterns.push({ regex: /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`/g, className: "hl-string" });

  if (lang === "python") {
    patterns.push({ regex: /#.*$/gm, className: "hl-comment" });
  } else {
    patterns.push({ regex: /\/\/.*$/gm, className: "hl-comment" });
    patterns.push({ regex: /\/\*[\s\S]*?\*\//g, className: "hl-comment" });
  }

  if (lang === "python") {
    patterns.push({ regex: /\b(?:0x[\da-fA-F]+|0o[0-7]+|0b[01]+|\d+\.?\d*(?:e[+-]?\d+)?)\b/g, className: "hl-number" });
  } else {
    patterns.push({ regex: /\b\d+\.?\d*(?:e[+-]?\d+)?\b/g, className: "hl-number" });
  }

  patterns.push({ regex: /[=!<>&|+\-*/%]+/g, className: "hl-operator" });

  patterns.push({
    regex: new RegExp(`\\b(?:${Array.from(keywords).join("|")})\\b`, "g"),
    className: "hl-keyword",
  });

  patterns.push({
    regex: new RegExp(`\\b(?:${Array.from(builtins).join("|")})\\b`, "g"),
    className: "hl-builtin",
  });

  if (lang === "typescript") {
    patterns.push({ regex: /\b(?:string|number|boolean|any|void|never|null|undefined|unknown|object|symbol|bigint)\b/g, className: "hl-type" });
  }

  if (lang === "python") {
    patterns.push({ regex: /\b(?:class|def)\s+(\w+)/g, className: "hl-function" });
  } else {
    patterns.push({ regex: /\b(?:function|class)\s+(\w+)/g, className: "hl-function" });
    patterns.push({ regex: /(\w+)\s*(?=\()/g, className: "hl-function" });
  }

  return patterns;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function highlightCode(code: string, language?: string): string {
  if (!language) return escapeHtml(code);

  const lang = language.toLowerCase() as SupportedLanguage;
  const validLangs: SupportedLanguage[] = ["javascript", "typescript", "python", "bash", "powershell", "html", "css"];
  if (!validLangs.includes(lang)) {
    return escapeHtml(code);
  }

  const patterns = getLanguagePatterns(lang);

  const tokens: { start: number; end: number; className: string }[] = [];

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match;
    while ((match = regex.exec(code)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const overlap = tokens.some((t) => start < t.end && end > t.start);
      if (!overlap) {
        tokens.push({ start, end, className: pattern.className });
      }
    }
  }

  tokens.sort((a, b) => a.start - b.start);

  let result = "";
  let lastEnd = 0;

  for (const token of tokens) {
    if (token.start > lastEnd) {
      result += escapeHtml(code.slice(lastEnd, token.start));
    }
    result += `<span class="${token.className}">${escapeHtml(code.slice(token.start, token.end))}</span>`;
    lastEnd = token.end;
  }

  if (lastEnd < code.length) {
    result += escapeHtml(code.slice(lastEnd));
  }

  return result;
}

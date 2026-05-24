"use client";

import { Check, Copy } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { cn } from "@/src/lib/cn";

export type CodeBlockLanguage = "python" | "typescript" | "javascript" | "bash" | "shell" | "json" | "curl" | "text";
export type CopyButtonVariant = "icon" | "text";

type CodeBlockProps = {
  code: string;
  language?: CodeBlockLanguage;
  filename?: string;
  header?: ReactNode;
  className?: string;
  contentClassName?: string;
  copyButtonVariant?: CopyButtonVariant;
  wrapLines?: boolean;
};

type Token = {
  text: string;
  className: string;
};

const JS_KEYWORDS = /\b(const|let|var|function|return|if|else|for|while|await|async|try|catch|throw|new|class|import|from|export|default|switch|case|break|continue|typeof|instanceof)\b/;
const PYTHON_KEYWORDS = /\b(def|class|return|if|elif|else|for|while|import|from|as|try|except|finally|raise|with|lambda|pass|yield|True|False|None|await|async)\b/;
const SHELL_KEYWORDS = /\b(if|then|fi|for|do|done|case|esac|export|echo|while|in)\b/;
const NUMBER_PATTERN = /^-?\d+(\.\d+)?$/;

function normalizeLanguage(language?: CodeBlockLanguage): CodeBlockLanguage {
  if (!language) return "text";
  if (language === "shell") return "bash";
  return language;
}

function tokenizeJsonLine(line: string): Token[] {
  const tokenRegex =
    /(\"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\\"])*\"\s*:|\"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\\"])*\"|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)/g;
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), className: "text-slate-700" });
    }

    const token = match[0];
    let className = "text-slate-600";
    if (/^\".*\":$/.test(token)) className = "text-amber-700/70";
    else if (/^\"/.test(token)) className = "text-teal-700/75";
    else if (/^(true|false)$/.test(token)) className = "text-indigo-700/65";
    else if (/^null$/.test(token)) className = "text-slate-500";
    else className = "text-sky-700/65";

    tokens.push({ text: token, className });
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), className: "text-slate-700" });
  }

  return tokens;
}

function tokenizeCodeLine(line: string, language: CodeBlockLanguage): Token[] {
  const commentDelimiter = language === "python" ? "#" : "//";
  const commentIndex = line.indexOf(commentDelimiter);
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : "";
  const body = commentIndex >= 0 ? line.slice(0, commentIndex) : line;

  const chunks = body.split(/(\s+|[(){}\[\],.:=<>+\-*/])/g).filter((chunk) => chunk.length > 0);
  const tokens: Token[] = chunks.map((chunk) => {
    if (/^\s+$/.test(chunk)) return { text: chunk, className: "text-slate-700" };
    if (/^[(){}\[\],.:=<>+\-*/]$/.test(chunk)) return { text: chunk, className: "text-slate-400" };
    if (/^(['"`]).*\1$/.test(chunk)) return { text: chunk, className: "text-teal-700/75" };
    if (NUMBER_PATTERN.test(chunk)) return { text: chunk, className: "text-sky-700/65" };

    const keywordRegex =
      language === "python" ? PYTHON_KEYWORDS : language === "bash" || language === "curl" ? SHELL_KEYWORDS : JS_KEYWORDS;

    if (keywordRegex.test(chunk)) return { text: chunk, className: "text-slate-800" };
    if (chunk.startsWith("$") && (language === "bash" || language === "curl")) return { text: chunk, className: "text-amber-700/70" };
    return { text: chunk, className: "text-slate-700" };
  });

  if (commentPart) {
    tokens.push({ text: commentPart, className: "text-slate-500" });
  }

  return tokens;
}

function renderHighlightedCode(code: string, language: CodeBlockLanguage, wrapLines = false) {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    const tokens = language === "json" ? tokenizeJsonLine(line) : tokenizeCodeLine(line, language);

    return (
      <span key={`line-${lineIndex}`} className={cn("block", wrapLines ? "whitespace-pre-wrap break-words [overflow-wrap:anywhere]" : "whitespace-pre")}>
        {tokens.length ? tokens.map((token, tokenIndex) => <span key={`${lineIndex}-${tokenIndex}`} className={token.className}>{token.text}</span>) : "\u00A0"}
      </span>
    );
  });
}

function CopyControl({ code, variant = "icon" }: { code: string; variant?: CopyButtonVariant }) {
  const [copied, setCopied] = useState(false);

  const ariaLabel = copied ? "已複製" : "複製程式碼";

  async function onCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "absolute";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  if (variant === "text") {
    return (
      <button
        type="button"
        onClick={() => void onCopy()}
        className="inline-flex h-7 items-center rounded-md border border-slate-200 bg-white px-2.5 text-[11px] font-medium leading-none text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800"
        aria-label={ariaLabel}
      >
        {copied ? "已複製" : "複製"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function CodeBlock({ code, language, filename, header, className, contentClassName, copyButtonVariant = "icon", wrapLines = false }: CodeBlockProps) {
  const normalizedLanguage = normalizeLanguage(language);
  const highlighted = useMemo(() => renderHighlightedCode(code, normalizedLanguage, wrapLines), [code, normalizedLanguage, wrapLines]);

  return (
    <div className={cn("group overflow-hidden rounded-lg border border-slate-200 bg-slate-50", className)}>
      {header || filename ? (
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2">
          <div className="min-w-0">
            {header ?? (filename ? <span className="truncate text-[11px] font-medium text-slate-500">{filename}</span> : null)}
          </div>
          <CopyControl code={code} variant={copyButtonVariant} />
        </div>
      ) : (
        <div className="flex justify-end px-3 pt-3">
          <CopyControl code={code} variant={copyButtonVariant} />
        </div>
      )}
      <pre className={cn(wrapLines ? "overflow-x-hidden" : "overflow-x-auto", "px-4 pb-4 pt-2 text-xs leading-6", contentClassName)}>
        <code className="font-mono">{highlighted}</code>
      </pre>
    </div>
  );
}

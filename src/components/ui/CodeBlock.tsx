import { useMemo, useState } from "react";
import { Check, Copy, FileCode2, TerminalSquare } from "lucide-react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import vscDarkPlus from "react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus";

interface CodeBlockProps {
  code: string;
  language?: string;
  /** Caminho do arquivo ou título da janela. */
  title?: string;
  /** Usuário mostrado no prompt (modo shell). */
  user?: string;
  /** Máquina mostrada no prompt (modo shell). */
  host?: string;
  /** Diretório mostrado no prompt (modo shell). */
  cwd?: string;
  /** Força mostrar como arquivo, mesmo sendo bash. */
  asFile?: boolean;
}

/** Apelidos: nome usado nas páginas -> gramática real do Prism. */
const ALIASES: Record<string, string> = {
  html: "markup",
  xml: "markup",
  svg: "markup",
  apache: "apacheconf",
  dockerfile: "docker",
  "ssh-config": "ini",
  conf: "ini",
  cfg: "ini",
  desktop: "ini",
  service: "ini",
  js: "javascript",
  ts: "typescript",
  py: "python",
  yml: "yaml",
  md: "markdown",
};

/** Linguagens que renderizamos como sessão de terminal de verdade. */
const SHELL = new Set(["bash", "sh", "shell", "zsh", "console", "terminal"]);

/** Gramáticas que o Prism carrega sob demanda. Fora daqui: texto puro. */
const SUPPORTED = new Set([
  "apacheconf",
  "c",
  "docker",
  "http",
  "ini",
  "javascript",
  "json",
  "markdown",
  "markup",
  "nginx",
  "php",
  "python",
  "sql",
  "toml",
  "typescript",
  "yaml",
]);

type Seg = { cls: string; text: string };

type ShellLine =
  | { kind: "blank" }
  | { kind: "comment"; text: string }
  | { kind: "raw"; text: string }
  | { kind: "cmd"; raw: string; segs: Seg[]; cont: boolean };

/* Paleta de cores do terminal. */
const C = {
  text: "text-[#d3d7cf]",
  bright: "text-[#eeeeec]",
  dim: "text-[#8a8f8a]",
  green: "text-[#8ae234]",
  blue: "text-[#729fcf]",
  cyan: "text-[#34e2e2]",
  red: "text-[#ef2929]",
  yellow: "text-[#fce94f]",
  magenta: "text-[#ad7fa8]",
};

const TOKEN =
  /('[^']*'?|"[^"]*"?|`[^`]*`?|\$\{[^}]*\}|\$[A-Za-z_][A-Za-z0-9_]*|&&|\|\||>>|<<-?|[|;>&<]|\s+|[^\s|;<>&]+)/g;

const OPERATORS = new Set(["&&", "||", "|", ";", ">", ">>", "<", "<<", "<<-", "&"]);
const PREFIXES = new Set(["sudo", "time", "env", "nohup", "doas"]);

/** Colore um comando digitado, do jeito que a gente lê no terminal. */
function tokenizeCommand(raw: string): Seg[] {
  const segs: Seg[] = [];
  let waitingCommand = true;

  const matches = raw.match(TOKEN) ?? [raw];
  for (let i = 0; i < matches.length; i++) {
    const t = matches[i];

    if (/^\s+$/.test(t)) {
      segs.push({ cls: "", text: t });
      continue;
    }

    // Comentário no fim da linha: o resto todo é comentário.
    if (t.startsWith("#")) {
      segs.push({ cls: C.dim + " italic", text: matches.slice(i).join("") });
      break;
    }

    if (OPERATORS.has(t)) {
      segs.push({ cls: C.magenta + " font-semibold", text: t });
      waitingCommand = true;
      continue;
    }

    if (PREFIXES.has(t)) {
      segs.push({ cls: C.red + " font-semibold", text: t });
      continue;
    }

    if (t.startsWith("-")) {
      segs.push({ cls: C.cyan, text: t });
      continue;
    }

    if (t.startsWith("$")) {
      segs.push({ cls: C.magenta, text: t });
      continue;
    }

    if (/^['"`]/.test(t)) {
      segs.push({ cls: C.green, text: t });
      continue;
    }

    if (waitingCommand) {
      segs.push({ cls: C.bright + " font-semibold", text: t });
      waitingCommand = false;
      continue;
    }

    segs.push({ cls: C.text, text: t });
  }

  return segs;
}

/**
 * Transforma o texto do bloco em linhas de sessão: comentários, comandos
 * (com continuação de linha) e corpo de heredoc — que não é comando e por
 * isso não recebe prompt.
 */
function parseShell(code: string): ShellLine[] {
  const out: ShellLine[] = [];
  const lines = code.replace(/\s+$/, "").split("\n");
  let continuing = false;
  let heredoc: string | null = null;

  for (const line of lines) {
    if (heredoc !== null) {
      out.push({ kind: "raw", text: line });
      if (line.trim() === heredoc) heredoc = null;
      continue;
    }

    if (line.trim() === "") {
      out.push({ kind: "blank" });
      continuing = false;
      continue;
    }

    if (!continuing && line.trimStart().startsWith("#")) {
      out.push({ kind: "comment", text: line.trim().replace(/^#\s?/, "") });
      continue;
    }

    out.push({
      kind: "cmd",
      raw: line,
      segs: tokenizeCommand(line),
      cont: continuing,
    });

    const hd = line.match(/<<-?\s*['"]?([A-Za-z_][A-Za-z0-9_]*)['"]?/);
    if (hd) heredoc = hd[1];

    continuing = /\\\s*$/.test(line);
  }

  return out;
}

function delay(i: number): string {
  return `${Math.min(i * 26, 320)}ms`;
}

/**
 * Bloco de código. Quando a linguagem é bash/sh, vira uma sessão de terminal
 * real: prompt de shell, cursor piscando e comentários separados
 * dos comandos. Para conteúdo de arquivo, mostra a janela do editor.
 */
export function CodeBlock({
  code,
  language = "bash",
  title,
  user = "wallyson",
  host = "alpine",
  cwd = "~",
  asFile = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState<"all" | "cmd" | null>(null);

  const key = language.toLowerCase();
  const grammar = ALIASES[key] ?? key;
  const isShell = !asFile && SHELL.has(key);
  const body = code.trim();

  const shellLines = useMemo(
    () => (isShell ? parseShell(body) : []),
    [isShell, body],
  );

  const lastCmd = useMemo(() => {
    for (let i = shellLines.length - 1; i >= 0; i--) {
      if (shellLines[i].kind === "cmd") return i;
    }
    return -1;
  }, [shellLines]);

  const onlyCommands = useMemo(
    () =>
      shellLines
        .filter((l) => l.kind === "cmd" || l.kind === "raw")
        .map((l) => (l.kind === "cmd" ? l.raw : l.kind === "raw" ? l.text : ""))
        .join("\n"),
    [shellLines],
  );

  const copy = (text: string, which: "all" | "cmd") => {
    navigator.clipboard.writeText(text);
    setCopied(which);
    setTimeout(() => setCopied(null), 1800);
  };

  const highlight = SUPPORTED.has(grammar);

  return (
    <div className={`term-window my-6 ${isShell ? "term-window--shell" : ""}`}>
      {/* Barra de título da janela */}
      <div className="term-titlebar">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="term-dot bg-[#ed6a5e]" />
            <span className="term-dot bg-[#f4bf50]" />
            <span className="term-dot bg-[#61c554]" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono min-w-0">
            {isShell ? (
              <TerminalSquare className="w-3.5 h-3.5 text-[#69B1E8] shrink-0" />
            ) : (
              <FileCode2 className="w-3.5 h-3.5 text-[#729fcf] shrink-0" />
            )}
            <span className="truncate text-gray-300/90">
              {title ?? (isShell ? `${user}@${host}: ${cwd}` : language)}
            </span>
            {!isShell && (
              <span className="hidden sm:inline text-[10px] uppercase tracking-wider text-gray-500 border border-white/10 rounded px-1.5 py-px">
                {language}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isShell && (
            <button
              onClick={() => copy(onlyCommands, "cmd")}
              className="term-btn hidden sm:inline-flex"
              title="Copiar só os comandos (sem os comentários)"
              aria-label="Copiar só os comandos"
            >
              {copied === "cmd" ? (
                <Check className="w-4 h-4 text-[#8ae234]" />
              ) : (
                <span className="font-mono text-xs font-bold">$</span>
              )}
            </button>
          )}
          <button
            onClick={() => copy(body, "all")}
            className="term-btn"
            title={isShell ? "Copiar tudo (com comentários)" : "Copiar código"}
            aria-label="Copiar"
          >
            {copied === "all" ? (
              <Check className="w-4 h-4 text-[#8ae234]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Corpo */}
      {isShell ? (
        <div className="term-body term-scanlines term-scroll px-4 py-3.5 font-mono text-[13px] leading-[1.7] overflow-x-auto">
          {shellLines.map((line, i) => {
            if (line.kind === "blank") {
              return <div key={i} className="h-3" aria-hidden="true" />;
            }

            if (line.kind === "comment") {
              return (
                <div
                  key={i}
                  className={`term-line term-comment ${C.dim} italic`}
                  style={{ animationDelay: delay(i) }}
                >
                  <span className="select-none opacity-60">#</span> {line.text}
                </div>
              );
            }

            if (line.kind === "raw") {
              return (
                <div
                  key={i}
                  className={`term-line whitespace-pre-wrap break-words ${C.text}`}
                  style={{ animationDelay: delay(i) }}
                >
                  {line.text}
                </div>
              );
            }

            return (
              <div
                key={i}
                className="term-line group whitespace-pre-wrap break-words"
                style={{ animationDelay: delay(i) }}
              >
                {line.cont ? (
                  <span className={`select-none ${C.dim}`}>{"> "}</span>
                ) : (
                  <span className="select-none">
                    <span className={`${C.green} font-bold`}>
                      {user}@{host}
                    </span>
                    <span className={C.text}>:</span>
                    <span className={`${C.blue} font-bold`}>{cwd}</span>
                    <span className={C.text}>$ </span>
                  </span>
                )}
                {line.segs.map((s, k) => (
                  <span key={k} className={s.cls}>
                    {s.text}
                  </span>
                ))}
                {i === lastCmd && <span className="term-cursor" />}
                <button
                  onClick={() => copy(line.raw, "cmd")}
                  className="term-line-copy"
                  title="Copiar esta linha"
                  aria-label="Copiar esta linha"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="term-file term-scroll px-4 py-3.5 text-[13px] font-mono overflow-x-auto">
          {highlight ? (
            <SyntaxHighlighter
              language={grammar}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                fontSize: "13px",
                lineHeight: 1.7,
              }}
              wrapLongLines={true}
            >
              {body}
            </SyntaxHighlighter>
          ) : (
            <pre
              className="m-0 p-0 text-[#d3d7cf]"
              style={{ fontSize: "13px", lineHeight: 1.7, background: "transparent" }}
            >
              {body}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, TerminalSquare } from "lucide-react";

export type LineType = "cmd" | "out" | "err" | "ok" | "warn" | "comment";

export interface TermLine {
  type: LineType;
  text: string;
  /** Sobrescreve o diretório do prompt só nesta linha. */
  cwd?: string;
}

interface TerminalProps {
  lines: TermLine[];
  title?: string;
  user?: string;
  host?: string;
  cwd?: string;
  /** Revela linha por linha ao entrar na tela. */
  animate?: boolean;
  className?: string;
}

/* Cores do terminal. */
const OUT_COLOR: Record<LineType, string> = {
  cmd: "text-[#eeeeec]",
  out: "text-[#d3d7cf]",
  err: "text-[#ef2929]",
  ok: "text-[#8ae234]",
  warn: "text-[#fce94f]",
  comment: "text-[#8a8f8a] italic",
};

/** Prompt de shell: usuário@host verde, caminho azul, $ claro. */
function Prompt({ user, host, cwd }: { user: string; host: string; cwd: string }) {
  return (
    <span className="select-none">
      <span className="text-[#8ae234] font-bold">
        {user}@{host}
      </span>
      <span className="text-[#d3d7cf]">:</span>
      <span className="text-[#729fcf] font-bold">{cwd}</span>
      <span className="text-[#d3d7cf]">$ </span>
    </span>
  );
}

/**
 * Janela de terminal. Use para mostrar comandos COM a saída real.
 * Para conteúdo de arquivo ou uma sequência de comandos, use <CodeBlock />.
 */
export function Terminal({
  lines,
  title,
  user = "wallyson",
  host = "alpine",
  cwd = "~",
  animate = true,
  className = "",
}: TerminalProps) {
  const [copied, setCopied] = useState(false);

  const commands = lines
    .filter((l) => l.type === "cmd")
    .map((l) => l.text)
    .join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(commands);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: animate ? 0.09 : 0 } },
  };
  const item = {
    hidden: { opacity: 0, y: 3 },
    show: { opacity: 1, y: 0, transition: { duration: 0.16 } },
  };

  const lastCmd = lines.reduce(
    (acc, l, i) => (l.type === "cmd" ? i : acc),
    -1,
  );

  return (
    <div className={`term-window term-window--shell my-6 ${className}`}>
      {/* Barra de título estilo GNOME / Ptyxis */}
      <div className="term-titlebar">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex gap-1.5 shrink-0">
            <span className="term-dot bg-[#ed6a5e]" />
            <span className="term-dot bg-[#f4bf50]" />
            <span className="term-dot bg-[#61c554]" />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono min-w-0">
            <TerminalSquare className="w-3.5 h-3.5 text-[#69B1E8] shrink-0" />
            <span className="truncate text-gray-300/90">
              {title ?? `${user}@${host}: ${cwd}`}
            </span>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="term-btn shrink-0"
          title="Copiar os comandos"
          aria-label="Copiar os comandos"
        >
          {copied ? (
            <Check className="w-4 h-4 text-[#8ae234]" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Corpo */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="term-body term-scanlines term-scroll px-4 py-3.5 font-mono text-[13px] leading-[1.7] overflow-x-auto"
      >
        {lines.map((line, i) => {
          const isCmd = line.type === "cmd";
          return (
            <motion.div
              key={i}
              variants={item}
              className={`whitespace-pre-wrap break-words ${OUT_COLOR[line.type]}`}
            >
              {isCmd && <Prompt user={user} host={host} cwd={line.cwd ?? cwd} />}
              {line.type === "comment" && (
                <span className="select-none opacity-60">#{" "}</span>
              )}
              <span className={isCmd ? "font-semibold" : ""}>{line.text}</span>
              {isCmd && i === lastCmd && <span className="term-cursor" />}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

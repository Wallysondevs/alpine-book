interface Props {
  size?: number;
  className?: string;
  /** "roundel" = picos brancos sobre disco azul Alpine · "mark" = só os picos em currentColor */
  variant?: "roundel" | "mark";
}

// Marca do alpine-book: um par de picos (montanha) — a estilização do Alpine Linux.
export function AlpineLogo({ size = 40, className, variant = "roundel" }: Props) {
  const roundel = variant === "roundel";
  const peakColor = roundel ? "#fff" : "currentColor";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Alpine Linux"
      role="img"
    >
      {roundel && <circle cx="50" cy="50" r="50" fill="#0D597F" />}

      {/* Cume secundário ao fundo — acento azul-claro (só no roundel). */}
      {roundel && (
        <path
          d="M50 76 L67 44 L94 76 Z"
          fill="#69B1E8"
          opacity="0.6"
        />
      )}

      {/* Cordilheira principal (dois picos) com neve no topo. */}
      <path
        d="M14 76 L40 34 L53 54 L66 38 L88 76 Z"
        fill={peakColor}
      />
      {/* Linha de neve destacando o pico maior. */}
      <path
        d="M40 34 L31 48 L36 45 L42 51 L47 45 L53 54 L40 34 Z"
        fill={roundel ? "#0D597F" : "none"}
        opacity={roundel ? 0.9 : 0}
      />
    </svg>
  );
}

// ARQUIVO GERADO por gen.py a partir da tabela de páginas do SPEC §5.
// Gerado para o alpine-book.

export type Nivel = "iniciante" | "intermediario" | "avancado";

export const LEVELS: Record<string, Nivel> = {
  "/": "iniciante",
  "/historia": "iniciante",
  "/filosofia": "iniciante",
  "/musl-busybox": "iniciante",
  "/instalacao": "iniciante",
  "/primeiros-passos": "iniciante",
  "/localizacao": "iniciante",
  "/apk": "iniciante",
  "/repositorios": "intermediario",
  "/binarios-terceiros": "intermediario",
  "/abuild": "avancado",
  "/sistema-arquivos": "iniciante",
  "/navegacao": "iniciante",
  "/manipulacao-arquivos": "iniciante",
  "/visualizacao": "iniciante",
  "/permissoes": "intermediario",
  "/disco": "iniciante",
  "/fstab": "intermediario",
  "/compressao": "iniciante",
  "/lvm": "avancado",
  "/openrc": "intermediario",
  "/boot": "avancado",
  "/logs": "intermediario",
  "/hardware": "iniciante",
  "/usuarios": "intermediario",
  "/processos": "iniciante",
  "/monitoracao": "intermediario",
  "/cron": "intermediario",
  "/shell-ash": "iniciante",
  "/bash-zsh": "iniciante",
  "/variaveis-ambiente": "iniciante",
  "/aliases": "iniciante",
  "/man-pages": "iniciante",
  "/redirecionamento": "intermediario",
  "/scripts": "intermediario",
  "/avancado": "avancado",
  "/redes": "intermediario",
  "/interfaces": "intermediario",
  "/awall": "intermediario",
  "/ssh": "intermediario",
  "/dns": "intermediario",
  "/vpn": "intermediario",
  "/docker": "intermediario",
  "/alpine-em-containers": "intermediario",
  "/kvm": "avancado",
  "/nginx": "intermediario",
  "/php": "intermediario",
  "/mariadb": "intermediario",
  "/postgresql": "intermediario",
  "/build-base": "intermediario",
  "/python": "intermediario",
  "/nodejs": "intermediario",
  "/git": "iniciante",
  "/vim": "iniciante",
  "/seguranca": "avancado",
  "/hardening": "avancado",
  "/luks": "avancado",
  "/gpg": "intermediario",
  "/diskless": "avancado",
  "/atualizacoes": "intermediario",
  "/backup": "intermediario",
  "/glossario": "iniciante",
  "/troubleshooting": "intermediario",
  "/referencias": "iniciante",
};

export const LEVEL_COUNTS: Record<Nivel, number> = {
  iniciante: 31,
  intermediario: 37,
  avancado: 14,
};

export const LEVEL_LABEL: Record<Nivel, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export const LEVEL_SHORT: Record<Nivel, string> = {
  iniciante: "I",
  intermediario: "M",
  avancado: "A",
};

/** Classe de texto para o badge de nivel na Sidebar. */
export const LEVEL_TEXT: Record<Nivel, string> = {
  iniciante: "text-emerald-500",
  intermediario: "text-amber-500",
  avancado: "text-rose-500",
};

/** Classe do botao de filtro quando o nivel esta ativo. */
export const LEVEL_PILL: Record<Nivel, string> = {
  iniciante: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  intermediario: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  avancado: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

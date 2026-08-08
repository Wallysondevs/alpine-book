import { useSyncExternalStore } from "react";

export interface Lesson {
  path: string;
  label: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

// Ordem oficial do curso — espelha a navegação da Sidebar.
// Usada para: trilha na Home, navegação "anterior/próxima" e progresso.
export const MODULES: Module[] = [
  {
    title: "Introdu\u00e7\u00e3o",
    lessons: [
      { path: "/historia", label: "Hist\u00f3ria do Alpine Linux" },
      { path: "/filosofia", label: "Filosofia: simples, seguro, leve" },
      { path: "/musl-busybox", label: "musl libc & BusyBox" },
    ],
  },
  {
    title: "Instala\u00e7\u00e3o & Setup",
    lessons: [
      { path: "/instalacao", label: "Guia de Instala\u00e7\u00e3o" },
      { path: "/primeiros-passos", label: "Primeiros Passos" },
      { path: "/localizacao", label: "Teclado & Timezone" },
    ],
  },
  {
    title: "Gerenciamento de Pacotes",
    lessons: [
      { path: "/apk", label: "apk (Completo)" },
      { path: "/repositorios", label: "Reposit\u00f3rios & Branches" },
      { path: "/binarios-terceiros", label: "Software fora dos reposit\u00f3rios" },
      { path: "/abuild", label: "Criando pacotes (aports & abuild)" },
    ],
  },
  {
    title: "Sistema de Arquivos",
    lessons: [
      { path: "/sistema-arquivos", label: "Hierarquia & BusyBox" },
      { path: "/navegacao", label: "Navega\u00e7\u00e3o" },
      { path: "/manipulacao-arquivos", label: "Manipula\u00e7\u00e3o" },
      { path: "/visualizacao", label: "Visualiza\u00e7\u00e3o" },
      { path: "/permissoes", label: "Permiss\u00f5es" },
      { path: "/disco", label: "Discos e Parti\u00e7\u00f5es" },
      { path: "/fstab", label: "fstab (Montagem Autom\u00e1tica)" },
      { path: "/compressao", label: "Compress\u00e3o" },
      { path: "/lvm", label: "LVM Avan\u00e7ado" },
    ],
  },
  {
    title: "Init & Boot",
    lessons: [
      { path: "/openrc", label: "OpenRC (Servi\u00e7os)" },
      { path: "/boot", label: "Boot & Bootloader" },
      { path: "/logs", label: "Logs (syslog)" },
      { path: "/hardware", label: "Informa\u00e7\u00f5es de Hardware" },
    ],
  },
  {
    title: "Administra\u00e7\u00e3o do Sistema",
    lessons: [
      { path: "/usuarios", label: "Usu\u00e1rios, Grupos & doas" },
      { path: "/processos", label: "Processos" },
      { path: "/monitoracao", label: "Monitoramento" },
      { path: "/cron", label: "Cron (Agendamento)" },
    ],
  },
  {
    title: "Terminal & Shell",
    lessons: [
      { path: "/shell-ash", label: "Shell BusyBox (ash)" },
      { path: "/bash-zsh", label: "Bash & Zsh" },
      { path: "/variaveis-ambiente", label: "Vari\u00e1veis de Ambiente" },
      { path: "/aliases", label: "Aliases e Fun\u00e7\u00f5es" },
      { path: "/man-pages", label: "Documenta\u00e7\u00e3o (man)" },
      { path: "/redirecionamento", label: "Redirecionamento" },
      { path: "/scripts", label: "Scripts de Shell" },
      { path: "/avancado", label: "Comandos Avan\u00e7ados" },
    ],
  },
  {
    title: "Redes",
    lessons: [
      { path: "/redes", label: "Fundamentos de Rede" },
      { path: "/interfaces", label: "Config de Rede (interfaces)" },
      { path: "/awall", label: "Firewall (awall)" },
      { path: "/ssh", label: "SSH" },
      { path: "/dns", label: "DNS" },
      { path: "/vpn", label: "VPN (WireGuard)" },
    ],
  },
  {
    title: "Containers & Virtualiza\u00e7\u00e3o",
    lessons: [
      { path: "/docker", label: "Docker" },
      { path: "/alpine-em-containers", label: "Alpine como imagem base" },
      { path: "/kvm", label: "KVM (QEMU)" },
    ],
  },
  {
    title: "Servidores",
    lessons: [
      { path: "/nginx", label: "Nginx" },
      { path: "/php", label: "PHP-FPM" },
      { path: "/mariadb", label: "MariaDB" },
      { path: "/postgresql", label: "PostgreSQL" },
    ],
  },
  {
    title: "Desenvolvimento",
    lessons: [
      { path: "/build-base", label: "Compila\u00e7\u00e3o & build-base" },
      { path: "/python", label: "Python" },
      { path: "/nodejs", label: "Node.js" },
      { path: "/git", label: "Git" },
      { path: "/vim", label: "Vim & Neovim" },
    ],
  },
  {
    title: "Seguran\u00e7a",
    lessons: [
      { path: "/seguranca", label: "Seguran\u00e7a B\u00e1sica" },
      { path: "/hardening", label: "Hardening & Auditoria" },
      { path: "/luks", label: "LUKS (Criptografia)" },
      { path: "/gpg", label: "GPG (Chaves)" },
    ],
  },
  {
    title: "Modos Especiais & Manuten\u00e7\u00e3o",
    lessons: [
      { path: "/diskless", label: "Diskless Mode (roda na RAM)" },
      { path: "/atualizacoes", label: "Atualiza\u00e7\u00f5es & Release Upgrade" },
      { path: "/backup", label: "Backup" },
    ],
  },
  {
    title: "Extras",
    lessons: [
      { path: "/glossario", label: "Gloss\u00e1rio" },
      { path: "/troubleshooting", label: "Troubleshooting" },
      { path: "/referencias", label: "Refer\u00eancias" },
    ],
  },
];

// Lista achatada, na ordem do curso.
export const COURSE: (Lesson & { module: string; index: number })[] = MODULES.flatMap(
  (m) => m.lessons.map((l) => ({ ...l, module: m.title })),
).map((l, index) => ({ ...l, index }));

export const TOTAL_LESSONS = COURSE.length;

export function lessonAt(path: string) {
  const i = COURSE.findIndex((l) => l.path === path);
  if (i === -1) return null;
  return {
    current: COURSE[i],
    prev: i > 0 ? COURSE[i - 1] : null,
    next: i < COURSE.length - 1 ? COURSE[i + 1] : null,
    position: i + 1,
  };
}

// ---------- Progresso (localStorage, reativo) ----------

const KEY = "alpine-curso-progresso";
const listeners = new Set<() => void>();

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

function write(paths: string[]) {
  localStorage.setItem(KEY, JSON.stringify(paths));
  listeners.forEach((fn) => fn());
}

export function toggleDone(path: string) {
  const cur = read();
  write(cur.includes(path) ? cur.filter((p) => p !== path) : [...cur, path]);
}

export function isDone(path: string) {
  return read().includes(path);
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  window.addEventListener("storage", fn);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", fn);
  };
}

// Snapshot estável para evitar loop no useSyncExternalStore.
let cache: string[] = [];
let cacheRaw = "";
function snapshot(): string[] {
  const raw = localStorage.getItem(KEY) || "[]";
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    try {
      cache = JSON.parse(raw);
    } catch {
      cache = [];
    }
  }
  return cache;
}

export function useProgress() {
  const done = useSyncExternalStore(subscribe, snapshot, () => cache);
  return {
    done,
    count: done.length,
    percent: TOTAL_LESSONS ? Math.round((done.length / TOTAL_LESSONS) * 100) : 0,
    has: (path: string) => done.includes(path),
    toggle: toggleDone,
  };
}

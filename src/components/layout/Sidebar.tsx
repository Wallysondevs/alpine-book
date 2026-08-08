import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  BookOpen, Terminal, HardDrive, Shield, Settings,
  FileText, Users, Network, Cpu, Clock, History, PenTool,
  Search, X, Package, Server, Code2, Database, Cloud,
  Monitor, Music, Gamepad2, Lock, Wrench, RotateCcw,
  Globe, Container, Wifi, Archive, Key, Layers, Download, Sparkles
} from "lucide-react";
import { Check } from "lucide-react";
import { AlpineLogo } from "@/components/ui/AlpineLogo";
import { useProgress, TOTAL_LESSONS } from "@/lib/course";
import {
  LEVELS,
  LEVEL_COUNTS,
  LEVEL_LABEL,
  LEVEL_SHORT,
  LEVEL_TEXT,
  LEVEL_PILL,
  type Nivel,
} from "@/lib/levels";

const NAVIGATION = [
  {
    title: "Introdu\u00e7\u00e3o",
    items: [
      { path: "/", label: "Início", icon: BookOpen },
      { path: "/historia", label: "Hist\u00f3ria do Alpine Linux", icon: History },
      { path: "/filosofia", label: "Filosofia: simples, seguro, leve", icon: PenTool },
      { path: "/musl-busybox", label: "musl libc & BusyBox", icon: Cpu },
    ]
  },
  {
    title: "Instala\u00e7\u00e3o & Setup",
    items: [
      { path: "/instalacao", label: "Guia de Instala\u00e7\u00e3o", icon: HardDrive },
      { path: "/primeiros-passos", label: "Primeiros Passos", icon: Clock },
      { path: "/localizacao", label: "Teclado & Timezone", icon: Globe },
    ]
  },
  {
    title: "Gerenciamento de Pacotes",
    items: [
      { path: "/apk", label: "apk (Completo)", icon: Package },
      { path: "/repositorios", label: "Reposit\u00f3rios & Branches", icon: Layers },
      { path: "/binarios-terceiros", label: "Software fora dos reposit\u00f3rios", icon: Download },
      { path: "/abuild", label: "Criando pacotes (aports & abuild)", icon: Code2 },
    ]
  },
  {
    title: "Sistema de Arquivos",
    items: [
      { path: "/sistema-arquivos", label: "Hierarquia & BusyBox", icon: FileText },
      { path: "/navegacao", label: "Navega\u00e7\u00e3o", icon: Search },
      { path: "/manipulacao-arquivos", label: "Manipula\u00e7\u00e3o", icon: FileText },
      { path: "/visualizacao", label: "Visualiza\u00e7\u00e3o", icon: FileText },
      { path: "/permissoes", label: "Permiss\u00f5es", icon: Shield },
      { path: "/disco", label: "Discos e Parti\u00e7\u00f5es", icon: HardDrive },
      { path: "/fstab", label: "fstab (Montagem Autom\u00e1tica)", icon: HardDrive },
      { path: "/compressao", label: "Compress\u00e3o", icon: Archive },
      { path: "/lvm", label: "LVM Avan\u00e7ado", icon: Layers },
    ]
  },
  {
    title: "Init & Boot",
    items: [
      { path: "/openrc", label: "OpenRC (Servi\u00e7os)", icon: Settings },
      { path: "/boot", label: "Boot & Bootloader", icon: Cpu },
      { path: "/logs", label: "Logs (syslog)", icon: FileText },
      { path: "/hardware", label: "Informa\u00e7\u00f5es de Hardware", icon: Cpu },
    ]
  },
  {
    title: "Administra\u00e7\u00e3o do Sistema",
    items: [
      { path: "/usuarios", label: "Usu\u00e1rios, Grupos & doas", icon: Users },
      { path: "/processos", label: "Processos", icon: Cpu },
      { path: "/monitoracao", label: "Monitoramento", icon: Cpu },
      { path: "/cron", label: "Cron (Agendamento)", icon: Clock },
    ]
  },
  {
    title: "Terminal & Shell",
    items: [
      { path: "/shell-ash", label: "Shell BusyBox (ash)", icon: Terminal },
      { path: "/bash-zsh", label: "Bash & Zsh", icon: Terminal },
      { path: "/variaveis-ambiente", label: "Vari\u00e1veis de Ambiente", icon: Terminal },
      { path: "/aliases", label: "Aliases e Fun\u00e7\u00f5es", icon: Terminal },
      { path: "/man-pages", label: "Documenta\u00e7\u00e3o (man)", icon: BookOpen },
      { path: "/redirecionamento", label: "Redirecionamento", icon: Terminal },
      { path: "/scripts", label: "Scripts de Shell", icon: Terminal },
      { path: "/avancado", label: "Comandos Avan\u00e7ados", icon: Terminal },
    ]
  },
  {
    title: "Redes",
    items: [
      { path: "/redes", label: "Fundamentos de Rede", icon: Network },
      { path: "/interfaces", label: "Config de Rede (interfaces)", icon: Wifi },
      { path: "/awall", label: "Firewall (awall)", icon: Shield },
      { path: "/ssh", label: "SSH", icon: Key },
      { path: "/dns", label: "DNS", icon: Globe },
      { path: "/vpn", label: "VPN (WireGuard)", icon: Lock },
    ]
  },
  {
    title: "Containers & Virtualiza\u00e7\u00e3o",
    items: [
      { path: "/docker", label: "Docker", icon: Container },
      { path: "/alpine-em-containers", label: "Alpine como imagem base", icon: Container },
      { path: "/kvm", label: "KVM (QEMU)", icon: Cpu },
    ]
  },
  {
    title: "Servidores",
    items: [
      { path: "/nginx", label: "Nginx", icon: Server },
      { path: "/php", label: "PHP-FPM", icon: Server },
      { path: "/mariadb", label: "MariaDB", icon: Database },
      { path: "/postgresql", label: "PostgreSQL", icon: Database },
    ]
  },
  {
    title: "Desenvolvimento",
    items: [
      { path: "/build-base", label: "Compila\u00e7\u00e3o & build-base", icon: Code2 },
      { path: "/python", label: "Python", icon: Code2 },
      { path: "/nodejs", label: "Node.js", icon: Code2 },
      { path: "/git", label: "Git", icon: Code2 },
      { path: "/vim", label: "Vim & Neovim", icon: FileText },
    ]
  },
  {
    title: "Seguran\u00e7a",
    items: [
      { path: "/seguranca", label: "Seguran\u00e7a B\u00e1sica", icon: Shield },
      { path: "/hardening", label: "Hardening & Auditoria", icon: Lock },
      { path: "/luks", label: "LUKS (Criptografia)", icon: Lock },
      { path: "/gpg", label: "GPG (Chaves)", icon: Key },
    ]
  },
  {
    title: "Modos Especiais & Manuten\u00e7\u00e3o",
    items: [
      { path: "/diskless", label: "Diskless Mode (roda na RAM)", icon: Layers },
      { path: "/atualizacoes", label: "Atualiza\u00e7\u00f5es & Release Upgrade", icon: RotateCcw },
      { path: "/backup", label: "Backup", icon: Archive },
    ]
  },
  {
    title: "Extras",
    items: [
      { path: "/glossario", label: "Gloss\u00e1rio", icon: BookOpen },
      { path: "/troubleshooting", label: "Troubleshooting", icon: Wrench },
      { path: "/referencias", label: "Refer\u00eancias", icon: Sparkles },
    ]
  },
];

const CHAVE_NIVEL = "alpine-sidebar-nivel";
type Filtro = Nivel | "todos";
const FILTROS: Filtro[] = ["todos", "iniciante", "intermediario", "avancado"];

function lerNivel(): Filtro {
  try {
    const raw = localStorage.getItem(CHAVE_NIVEL) as Filtro | null;
    return raw && FILTROS.includes(raw) ? raw : "todos";
  } catch {
    return "todos";
  }
}

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const { has } = useProgress();
  const [nivel, setNivel] = useState<Filtro>(lerNivel);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_NIVEL, nivel);
    } catch {
      /* sem localStorage: o filtro vale so nesta sessao */
    }
  }, [nivel]);

  // A Home fica sempre visivel; secao sem topico do nivel escolhido desaparece.
  const secoes = useMemo(
    () =>
      NAVIGATION.map((section) => ({
        ...section,
        items:
          nivel === "todos"
            ? section.items
            : section.items.filter(
                (i) => i.path === "/" || LEVELS[i.path] === nivel,
              ),
      })).filter((section) => section.items.length > 0),
    [nivel],
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={cn(
        "fixed top-0 bottom-0 left-0 z-50 w-72 bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between lg:justify-center mb-8">
            <Link href="/" className="flex items-center gap-3 group">
              <AlpineLogo size={40} className="drop-shadow-[0_4px_12px_rgba(13,89,127,0.5)]" />
              <div>
                <h1 className="font-bold text-sm">Curso de Alpine Linux</h1>
                <p className="text-xs text-muted-foreground">3.24 · simples, seguro, leve</p>
              </div>
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtro por nivel */}
          <div className="mb-6 flex items-center gap-1 text-[10px]">
            <span className="text-muted-foreground mr-0.5">nível:</span>
            {FILTROS.map((f) => {
              const ativo = nivel === f;
              const total = f === "todos" ? TOTAL_LESSONS : LEVEL_COUNTS[f];
              return (
                <button
                  key={f}
                  onClick={() => setNivel(f)}
                  title={`${f === "todos" ? "Todos os tópicos" : LEVEL_LABEL[f]} (${total})`}
                  className={cn(
                    "px-1.5 py-0.5 rounded border transition-colors",
                    ativo
                      ? cn(
                          "border-transparent font-bold",
                          f === "todos"
                            ? "bg-primary/15 text-primary"
                            : LEVEL_PILL[f],
                        )
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {f === "todos" ? "todos" : LEVEL_SHORT[f]} {total}
                </button>
              );
            })}
          </div>

          <nav className="space-y-6">
            {secoes.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  {section.title}
                </h2>
                <ul className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;
                    return (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          className={cn(
                            "flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-sm transition-colors",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-accent"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                          {item.path !== "/" && LEVELS[item.path] && (
                            <span
                              className={cn(
                                "shrink-0 text-[9px] font-bold",
                                isActive
                                  ? "text-primary-foreground/70"
                                  : LEVEL_TEXT[LEVELS[item.path]],
                              )}
                              title={LEVEL_LABEL[LEVELS[item.path]]}
                            >
                              {LEVEL_SHORT[LEVELS[item.path]]}
                            </span>
                          )}
                          {has(item.path) && <Check className="w-3.5 h-3.5 ml-auto text-green-500 flex-shrink-0" />}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}

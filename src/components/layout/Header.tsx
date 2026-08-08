import { Menu, Search, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { EVENTO_ABRIR_BUSCA } from "@/components/layout/CommandPalette";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  function abrirBusca() {
    window.dispatchEvent(new Event(EVENTO_ABRIR_BUSCA));
  }

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-border px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <button
          onClick={abrirBusca}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 hover:bg-muted border border-border rounded-lg text-sm text-muted-foreground transition-colors w-64">
          <Search className="w-4 h-4" />
          <span>Pesquisar conteúdo...</span>
          <span className="ml-auto text-xs opacity-50 border border-border rounded px-1.5 py-0.5">Ctrl+K</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={abrirBusca}
          className="sm:hidden p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Buscar (Ctrl+K)"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Alternar tema"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}

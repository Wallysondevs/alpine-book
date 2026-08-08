import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, ArrowLeft, ArrowRight } from "lucide-react";
import { DifficultyBadge } from "../ui/DifficultyBadge";
import { lessonAt, TOTAL_LESSONS, useProgress } from "@/lib/course";

interface PageContainerProps {
  title: string;
  subtitle?: string;
  difficulty?: "iniciante" | "intermediario" | "avancado";
  timeToRead?: string;
  children: ReactNode;
}

export function PageContainer({ title, subtitle, difficulty, timeToRead, children }: PageContainerProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [location] = useLocation();
  const { has, toggle } = useProgress();
  const nav = lessonAt(location);
  const done = nav ? has(nav.current.path) : false;

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress(Number(`${totalScroll / windowHeight}`));
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 pb-24">
      <div
        className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {nav && (
              <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                {nav.current.module} · Lição {nav.position} de {TOTAL_LESSONS}
              </span>
            )}
            {difficulty && <DifficultyBadge level={difficulty} />}
            {timeToRead && (
              <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                ⏱ {timeToRead} de leitura
              </span>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed">{subtitle}</p>
          )}
        </header>

        <div className="prose prose-invert max-w-none page-content">
          {children}
        </div>

        {/* -------- Rodapé do curso -------- */}
        {nav && (
          <div className="mt-16 pt-8 border-t border-border">
            <button
              onClick={() => toggle(nav.current.path)}
              className={`w-full mb-6 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all ${
                done
                  ? "bg-green-500/15 text-green-500 border border-green-500/30"
                  : "bg-primary text-primary-foreground hover:-translate-y-0.5 shadow-lg shadow-primary/20"
              }`}
            >
              {done ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              {done ? "Lição concluída — clique para desmarcar" : "Marcar lição como concluída"}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nav.prev ? (
                <Link
                  href={nav.prev.path}
                  className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-0.5 transition-all shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">Anterior</span>
                    <span className="block font-semibold truncate">{nav.prev.label}</span>
                  </span>
                </Link>
              ) : <div className="hidden sm:block" />}

              {nav.next ? (
                <Link
                  href={nav.next.path}
                  className="group flex items-center justify-end gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/40 transition-colors text-right"
                >
                  <span className="min-w-0">
                    <span className="block text-xs text-muted-foreground">Próxima</span>
                    <span className="block font-semibold truncate">{nav.next.label}</span>
                  </span>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ) : (
                <Link
                  href="/"
                  className="group flex items-center justify-end gap-3 p-4 rounded-xl bg-primary/10 border border-primary/30 transition-colors text-right"
                >
                  <span>
                    <span className="block text-xs text-muted-foreground">Fim do curso</span>
                    <span className="block font-semibold text-primary">Voltar ao início 🎉</span>
                  </span>
                  <ArrowRight className="w-5 h-5 text-primary shrink-0" />
                </Link>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

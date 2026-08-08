import { useState, useEffect, lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

import Home from "@/pages/Home";
const Historia = lazy(() => import("@/pages/Historia"));
const Filosofia = lazy(() => import("@/pages/Filosofia"));
const MuslBusyBox = lazy(() => import("@/pages/MuslBusyBox"));
const Instalacao = lazy(() => import("@/pages/Instalacao"));
const PrimeirosPassos = lazy(() => import("@/pages/PrimeirosPassos"));
const Localizacao = lazy(() => import("@/pages/Localizacao"));
const Apk = lazy(() => import("@/pages/Apk"));
const Repositorios = lazy(() => import("@/pages/Repositorios"));
const BinariosTerceiros = lazy(() => import("@/pages/BinariosTerceiros"));
const Abuild = lazy(() => import("@/pages/Abuild"));
const SistemaArquivos = lazy(() => import("@/pages/SistemaArquivos"));
const Navegacao = lazy(() => import("@/pages/Navegacao"));
const ManipulacaoArquivos = lazy(() => import("@/pages/ManipulacaoArquivos"));
const Visualizacao = lazy(() => import("@/pages/Visualizacao"));
const Permissoes = lazy(() => import("@/pages/Permissoes"));
const Disco = lazy(() => import("@/pages/Disco"));
const Fstab = lazy(() => import("@/pages/Fstab"));
const Compressao = lazy(() => import("@/pages/Compressao"));
const LVM = lazy(() => import("@/pages/LVM"));
const OpenRC = lazy(() => import("@/pages/OpenRC"));
const Boot = lazy(() => import("@/pages/Boot"));
const Logs = lazy(() => import("@/pages/Logs"));
const Hardware = lazy(() => import("@/pages/Hardware"));
const Usuarios = lazy(() => import("@/pages/Usuarios"));
const Processos = lazy(() => import("@/pages/Processos"));
const Monitoracao = lazy(() => import("@/pages/Monitoracao"));
const Cron = lazy(() => import("@/pages/Cron"));
const ShellAsh = lazy(() => import("@/pages/ShellAsh"));
const BashZsh = lazy(() => import("@/pages/BashZsh"));
const VariaveisAmbiente = lazy(() => import("@/pages/VariaveisAmbiente"));
const Aliases = lazy(() => import("@/pages/Aliases"));
const ManPages = lazy(() => import("@/pages/ManPages"));
const Redirecionamento = lazy(() => import("@/pages/Redirecionamento"));
const Scripts = lazy(() => import("@/pages/Scripts"));
const Avancado = lazy(() => import("@/pages/Avancado"));
const Redes = lazy(() => import("@/pages/Redes"));
const Interfaces = lazy(() => import("@/pages/Interfaces"));
const Awall = lazy(() => import("@/pages/Awall"));
const Ssh = lazy(() => import("@/pages/Ssh"));
const Dns = lazy(() => import("@/pages/Dns"));
const Vpn = lazy(() => import("@/pages/Vpn"));
const Docker = lazy(() => import("@/pages/Docker"));
const AlpineEmContainers = lazy(() => import("@/pages/AlpineEmContainers"));
const Kvm = lazy(() => import("@/pages/Kvm"));
const Nginx = lazy(() => import("@/pages/Nginx"));
const Php = lazy(() => import("@/pages/Php"));
const Mariadb = lazy(() => import("@/pages/Mariadb"));
const Postgresql = lazy(() => import("@/pages/Postgresql"));
const BuildBase = lazy(() => import("@/pages/BuildBase"));
const Python = lazy(() => import("@/pages/Python"));
const Nodejs = lazy(() => import("@/pages/Nodejs"));
const Git = lazy(() => import("@/pages/Git"));
const Vim = lazy(() => import("@/pages/Vim"));
const Seguranca = lazy(() => import("@/pages/Seguranca"));
const Hardening = lazy(() => import("@/pages/Hardening"));
const Luks = lazy(() => import("@/pages/Luks"));
const Gpg = lazy(() => import("@/pages/Gpg"));
const Diskless = lazy(() => import("@/pages/Diskless"));
const Atualizacoes = lazy(() => import("@/pages/Atualizacoes"));
const Backup = lazy(() => import("@/pages/Backup"));
const Glossario = lazy(() => import("@/pages/Glossario"));
const Troubleshooting = lazy(() => import("@/pages/Troubleshooting"));
const Referencias = lazy(() => import("@/pages/Referencias"));

import NotFound from "@/pages/not-found";

import { CommandPalette } from "@/components/layout/CommandPalette";

const queryClient = new QueryClient();

function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [location] = useHashLocation();
  useEffect(() => {
    setIsSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <CommandPalette />

      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 transition-all duration-300">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}

function CarregandoTopico() {
  return (
    <div className="flex items-center justify-center py-24 px-6">
      <div className="font-mono text-sm text-muted-foreground">
        <span className="text-primary">●</span> carregando tópico...
      </div>
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Suspense fallback={<CarregandoTopico />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/historia" component={Historia} />
        <Route path="/filosofia" component={Filosofia} />
        <Route path="/musl-busybox" component={MuslBusyBox} />
        <Route path="/instalacao" component={Instalacao} />
        <Route path="/primeiros-passos" component={PrimeirosPassos} />
        <Route path="/localizacao" component={Localizacao} />
        <Route path="/apk" component={Apk} />
        <Route path="/repositorios" component={Repositorios} />
        <Route path="/binarios-terceiros" component={BinariosTerceiros} />
        <Route path="/abuild" component={Abuild} />
        <Route path="/sistema-arquivos" component={SistemaArquivos} />
        <Route path="/navegacao" component={Navegacao} />
        <Route path="/manipulacao-arquivos" component={ManipulacaoArquivos} />
        <Route path="/visualizacao" component={Visualizacao} />
        <Route path="/permissoes" component={Permissoes} />
        <Route path="/disco" component={Disco} />
        <Route path="/fstab" component={Fstab} />
        <Route path="/compressao" component={Compressao} />
        <Route path="/lvm" component={LVM} />
        <Route path="/openrc" component={OpenRC} />
        <Route path="/boot" component={Boot} />
        <Route path="/logs" component={Logs} />
        <Route path="/hardware" component={Hardware} />
        <Route path="/usuarios" component={Usuarios} />
        <Route path="/processos" component={Processos} />
        <Route path="/monitoracao" component={Monitoracao} />
        <Route path="/cron" component={Cron} />
        <Route path="/shell-ash" component={ShellAsh} />
        <Route path="/bash-zsh" component={BashZsh} />
        <Route path="/variaveis-ambiente" component={VariaveisAmbiente} />
        <Route path="/aliases" component={Aliases} />
        <Route path="/man-pages" component={ManPages} />
        <Route path="/redirecionamento" component={Redirecionamento} />
        <Route path="/scripts" component={Scripts} />
        <Route path="/avancado" component={Avancado} />
        <Route path="/redes" component={Redes} />
        <Route path="/interfaces" component={Interfaces} />
        <Route path="/awall" component={Awall} />
        <Route path="/ssh" component={Ssh} />
        <Route path="/dns" component={Dns} />
        <Route path="/vpn" component={Vpn} />
        <Route path="/docker" component={Docker} />
        <Route path="/alpine-em-containers" component={AlpineEmContainers} />
        <Route path="/kvm" component={Kvm} />
        <Route path="/nginx" component={Nginx} />
        <Route path="/php" component={Php} />
        <Route path="/mariadb" component={Mariadb} />
        <Route path="/postgresql" component={Postgresql} />
        <Route path="/build-base" component={BuildBase} />
        <Route path="/python" component={Python} />
        <Route path="/nodejs" component={Nodejs} />
        <Route path="/git" component={Git} />
        <Route path="/vim" component={Vim} />
        <Route path="/seguranca" component={Seguranca} />
        <Route path="/hardening" component={Hardening} />
        <Route path="/luks" component={Luks} />
        <Route path="/gpg" component={Gpg} />
        <Route path="/diskless" component={Diskless} />
        <Route path="/atualizacoes" component={Atualizacoes} />
        <Route path="/backup" component={Backup} />
        <Route path="/glossario" component={Glossario} />
        <Route path="/troubleshooting" component={Troubleshooting} />
        <Route path="/referencias" component={Referencias} />

        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter hook={useHashLocation}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;

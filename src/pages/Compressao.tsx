import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Compressao() {
  return (
    <PageContainer
      title="Compressão &amp; Arquivos"
      subtitle="tar, gzip, bzip2, xz, zip, unzip — empacote e comprima no Alpine com as ferramentas certas."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Navegação básica e manipulação de arquivos. Os comandos <code>tar</code>{" "}
        e <code>gzip</code> são BusyBox — já estão no sistema.
      </AlertBox>

      <p>
        No Linux, empacotar e comprimir são duas operações separadas. O{" "}
        <code>tar</code> junta arquivos num só (tape archive). O{" "}
        <code>gzip</code>/<code>bzip2</code>/<code>xz</code> comprime. O
        Alpine traz o tar do BusyBox com suporte a todos os formatos comuns.
      </p>

      <h2>1. tar: o empacotador universal</h2>
      <CodeBlock
        title="tar — operações essenciais"
        code={`# CRIAR arquivo tar
tar -cf backup.tar diretorio/

# CRIAR e COMPRIMIR (combinações mais usadas)
tar -czf backup.tar.gz diretorio/     # gzip  (rápido, tamanho médio)
tar -cjf backup.tar.bz2 diretorio/    # bzip2 (mais lento, menor)
tar -cJf backup.tar.xz diretorio/     # xz    (lento, o menor)

# EXTRAIR
tar -xf backup.tar.gz
tar -xzf backup.tar.gz -C /destino/   # extrai em diretório específico

# LISTAR conteúdo (sem extrair)
tar -tzf backup.tar.gz
tar -tjf backup.tar.bz2

# As flags:
# c = create   x = extract   t = list
# z = gzip     j = bzip2     J = xz
# f = file     v = verbose   C = change directory`}
      />

      <Terminal
        title="Criando e extraindo na prática"
        lines={[
          { type: "cmd", text: "tar -czf projetos.tar.gz ~/projetos/" },
          { type: "cmd", text: "ls -lh projetos.tar.gz" },
          { type: "out", text: "-rw-r--r-- 1 wallyson wallyson 2.3M ... projetos.tar.gz" },
          { type: "cmd", text: "tar -tzf projetos.tar.gz | head -5" },
          { type: "out", text: "projetos/" },
          { type: "out", text: "projetos/app/" },
          { type: "out", text: "projetos/app/main.py" },
          { type: "cmd", text: "tar -xzf projetos.tar.gz -C /tmp/" },
          { type: "ok", text: "# Extraído em /tmp/projetos/" },
        ]}
      />

      <p>
        O tar do <strong>BusyBox suporta</strong> gzip, bzip2 e xz nativamente —
        você não precisa instalar nada para esses formatos. Só precisa dos
        pacotes de compressão se for usar as ferramentas separadamente.
      </p>

      <h2>2. gzip, bzip2, xz: compressão individual</h2>
      <CodeBlock
        title="Compressão de arquivos únicos"
        code={`# gzip — o mais comum (.gz)
gzip arquivo.txt           # comprime (apaga original)
gzip -k arquivo.txt        # comprime MANTENDO original
gunzip arquivo.txt.gz      # descomprime
zcat arquivo.txt.gz        # lê sem descomprimir

# bzip2 — melhor compressão (.bz2)
apk add bzip2
bzip2 arquivo.txt
bunzip2 arquivo.txt.bz2

# xz — compressão máxima (.xz)
apk add xz
xz arquivo.txt
unxz arquivo.txt.xz
xzcat arquivo.txt.xz       # lê sem descomprimir

# Comparação prática (arquivo de log de 100 MB):
# gzip  → 10 MB, 2 segundos
# bzip2 →  7 MB, 8 segundos
# xz    →  5 MB, 25 segundos`}
      />

      <h2>3. zip e unzip: compatibilidade multiplataforma</h2>
      <p>
        O formato <code>.zip</code> é universal (Windows, Mac, Linux). Não vem
        instalado, mas o pacote é minúsculo:
      </p>
      <CodeBlock
        title="zip e unzip"
        code={`apk add zip unzip

# Criar zip
zip -r backup.zip diretorio/

# Extrair
unzip backup.zip
unzip backup.zip -d /destino/

# Listar conteúdo
unzip -l backup.zip`}
      />

      <h2>4. 7-Zip (7z): compressão extrema</h2>
      <CodeBlock
        title="7z no Alpine"
        code={`apk add 7zip

# Criar
7z a backup.7z diretorio/

# Extrair
7z x backup.7z

# Listar
7z l backup.7z

# 7z geralmente produz arquivos MENORES que tar.xz,
# mas é mais lento e menos integrado ao ecossistema Linux.`}
      />

      <h2>5. Comparativo e recomendações</h2>
      <CodeBlock
        title="Quando usar cada formato"
        code={`# Distribuir software:      tar.gz  (universal no mundo Linux)
# Backup local:             tar.xz  (melhor compressão)
# Enviar para Windows/Mac:  .zip    (eles abrem nativamente)
# Compressão máxima:        7z      (para arquivos enormes)
# Logs e texto puro:        gzip    (rápido, eficiente em texto)
# Binários:                 xz      (melhor compressão em binários)

# Script de backup rápido:
tar -cJf "backup-$(date +%Y%m%d).tar.xz" /home /etc /var/log
# Cria backup com data no nome, compressão xz.`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>tar -czf</code> (gzip), <code>-cjf</code> (bzip2), <code>-cJf</code> (xz) para criar</li>
          <li><code>tar -xzf</code> para extrair; <code>-tzf</code> para listar</li>
          <li><code>gzip</code> é o mais rápido; <code>xz</code> o que mais comprime</li>
          <li><code>zip/unzip</code> para compatibilidade com outros SOs</li>
          <li>O BusyBox tar já suporta gzip, bzip2 e xz — zero pacotes extras</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}
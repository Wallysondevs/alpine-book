import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Fstab() {
  return (
    <PageContainer
      title="fstab — Montagem Automática"
      subtitle="Configure montagens persistentes com /etc/fstab: UUIDs, opções, swap e solução de problemas."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Saber montar e desmontar partições manualmente (<code>mount</code> /
        <code>umount</code>). O capítulo anterior cobre isso.
      </AlertBox>

      <p>
        Montar discos manualmente com <code>mount</code> funciona para testes,
        mas no boot você quer que tudo suba automaticamente. O arquivo{" "}
        <code>/etc/fstab</code> (filesystem table) é a lista de montagens
        permanentes que o sistema lê durante a inicialização.
      </p>

      <h2>1. Anatomia do fstab</h2>
      <Terminal
        title="Um fstab típico do Alpine"
        lines={[
          { type: "cmd", text: "cat /etc/fstab" },
          { type: "out", text: "# <fs>          <mountpoint>  <type>  <opts>       <dump> <pass>" },
          { type: "out", text: "UUID=abc123...  /            ext4    noatime       0      1" },
          { type: "out", text: "UUID=def456...  /boot        ext4    defaults      0      2" },
          { type: "out", text: "UUID=ghi789...  swap         swap    defaults      0      0" },
          { type: "out", text: "tmpfs           /tmp         tmpfs   noatime,size=2G 0   0" },
        ]}
      />

      <CodeBlock
        title="As 6 colunas do fstab"
        code={`# Coluna  Campo         Significado
# 1       fs             Dispositivo (UUID, /dev/sda1, LABEL, ou tmpfs)
# 2       mountpoint     Onde montar (deve existir como diretório)
# 3       type           Sistema de arquivos (ext4, xfs, btrfs, swap, tmpfs...)
# 4       opts           Opções de montagem (separadas por vírgula)
# 5       dump           Backup com dump(8)? 0=não, 1=sim (quase sempre 0)
# 6       pass           Ordem do fsck no boot: 0=não checar, 1=raiz, 2=outros`}
      />

      <h2>2. Identificando dispositivos: UUID é o caminho</h2>
      <CodeBlock
        title="Três formas de referenciar um dispositivo no fstab"
        code={`# ✅ UUID (RECOMENDADO) — não muda entre boots
UUID=a1b2c3d4-...  /mnt/dados  ext4  defaults  0  2

# ⚠️  LABEL — legível, mas labels duplicadas causam conflito
LABEL="Dados"      /mnt/dados  ext4  defaults  0  2

# ❌ /dev/sdX — PODE MUDAR se adicionar/remover discos
/dev/sdb1          /mnt/dados  ext4  defaults  0  2`}
      />

      <h2>3. Opções de montagem essenciais</h2>
      <CodeBlock
        title="Opções mais usadas no fstab"
        code={`defaults      = rw, suid, dev, exec, auto, nouser, async
noatime       = NÃO atualiza timestamp de acesso (PERFORMANCE!)
nodiratime    = não atualiza timestamp de acesso de diretórios
relatime      = atualiza acesso só se for mais antigo que modificação
ro            = read-only (montagem somente leitura)
rw            = read-write
noexec        = bloqueia execução de binários (segurança em /tmp)
nosuid        = ignora bits SUID/SGID (segurança)
user          = permite que usuário comum monte
noauto        = NÃO monta automaticamente no boot (montagem manual)

# Combinação típica para discos de dados:
UUID=xxx  /mnt/dados  ext4  defaults,noatime  0  2

# Combinação de segurança para /tmp:
tmpfs     /tmp        tmpfs  noexec,nosuid,size=2G  0  0`}
      />

      <h2>4. Configurando swap no fstab</h2>
      <CodeBlock
        title="Swap em partição ou arquivo"
        code={`# Swap em PARTIÇÃO
UUID=xxx  none  swap  sw  0  0

# Swap em ARQUIVO (caminho absoluto)
/swapfile  none  swap  sw  0  0

# Conferir depois do boot:
swapon --show
free -h | grep Swap`}
      />

      <h2>5. Testando sem reboot: mount -a</h2>
      <p>
        Você <strong>não precisa reiniciar</strong> para testar o fstab:
      </p>
      <Terminal
        title="Testando fstab sem reboot"
        lines={[
          { type: "cmd", text: "mount -a" },
          { type: "comment", text: "# Se não houver output, tudo montou sem erros." },
          { type: "cmd", text: "mount -a -v" },
          { type: "out", text: "/                    : already mounted" },
          { type: "out", text: "/mnt/dados           : successfully mounted" },
          { type: "out", text: "swap                 : ignored" },
          { type: "ok", text: "# -v (verbose) mostra o que aconteceu." },
        ]}
      />

      <AlertBox type="warning" title="Sempre teste com mount -a ANTES de reiniciar">
        Um erro de digitação no fstab pode impedir o boot. Se você rodar{" "}
        <code>mount -a</code> e der erro, corrija antes de reiniciar. Se o
        sistema não bootar, use um live USB, monte a raiz e edite o fstab.
      </AlertBox>

      <h2>6. Erros comuns e soluções</h2>
      <CodeBlock
        title="Debugging de fstab"
        code={`# Erro: "mount: /mnt/dados: mount point does not exist."
# → Crie o diretório: mkdir -p /mnt/dados

# Erro: "mount: /mnt/dados: wrong fs type..."
# → Instale as ferramentas do filesystem:
#   ext4 → apk add e2fsprogs
#   xfs  → apk add xfsprogs
#   btrfs → apk add btrfs-progs

# Erro: "mount: /mnt/dados: can't find UUID=xxx"
# → O UUID mudou? Rode blkid e confira.

# Erro: "mount: /mnt/dados: special device ... does not exist."
# → O disco não está conectado? Use nofail:
#   UUID=xxx  /mnt/dados  ext4  defaults,nofail  0  2
#   Com nofail, o boot continua mesmo se o disco faltar.

# Ver mensagens detalhadas de montagem:
dmesg | grep -i mount
dmesg | grep -i "sd[a-z]"`}
      />

      <h2>7. fstab no Alpine: o que vem por padrão</h2>
      <Terminal
        title="fstab mínimo pós-instalação"
        lines={[
          { type: "cmd", text: "cat /etc/fstab" },
          { type: "out", text: "UUID=abc123...  /            ext4    noatime  0  1" },
          { type: "out", text: "tmpfs           /tmp         tmpfs   defaults 0  0" },
          { type: "comment", text: "# Só duas linhas. Minimalismo Alpine." },
        ]}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>/etc/fstab</code> = 6 colunas: fs, mountpoint, type, opts, dump, pass</li>
          <li><strong>Sempre use UUID</strong> (não /dev/sdX)</li>
          <li><code>noatime</code> melhora performance; <code>nofail</code> evita pânico no boot</li>
          <li>Teste com <code>mount -a -v</code> antes de reiniciar</li>
          <li>Swap: <code>UUID=xxx none swap sw 0 0</code></li>
          <li>Se o boot falhar: live USB → monte a raiz → edite o fstab</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}
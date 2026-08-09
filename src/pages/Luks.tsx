import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Luks() {
  return (
    <PageContainer
      title="LUKS — Criptografia de Disco"
      subtitle="Criptografe partições com LUKS: setup, montagem automática e boas práticas no Alpine."
      difficulty="avancado"
      timeToRead="18 min"
    >
      <AlertBox type="danger" title="⚠️  Criptografar apaga os dados da partição">
        FAÇA BACKUP antes. Criptografar um disco em uso <strong>destrói</strong>{" "}
        todos os dados. Este capítulo assume disco vazio ou dados já copiados.
      </AlertBox>

      <p>
        LUKS (Linux Unified Key Setup) é o padrão de criptografia de disco no
        Linux. Uma partição LUKS é ilegível sem a senha — protege dados em caso
        de roubo físico do servidor ou laptop.
      </p>

      <h2>1. Instalação e preparação</h2>
      <CodeBlock
        code={`# Instalar ferramentas
apk add cryptsetup

# Carregar módulo do kernel
modprobe dm-crypt

# Verificar partição alvo (EX: /dev/sdb1 — DISCO VAZIO!)
lsblk`}
      />

      <h2>2. Criar partição criptografada</h2>
      <CodeBlock
        code={`# ⚠️  Isso APAGA /dev/sdb1

# Formatar como LUKS
cryptsetup luksFormat /dev/sdb1
# WARNING: This will overwrite data on /dev/sdb1 irrevocably.
# Are you sure? (Type 'yes'): yes
# Enter passphrase: ********
# Verify passphrase: ********

# Abrir (desbloquear) o volume
cryptsetup open /dev/sdb1 dados-cripto
# Enter passphrase: ********

# Agora /dev/mapper/dados-cripto é um dispositivo normal
# Formatar com ext4
mkfs.ext4 /dev/mapper/dados-cripto

# Montar e usar
mount /dev/mapper/dados-cripto /mnt/dados
# Use normalmente — tudo é criptografado/descriptografado em tempo real.`}
      />

      <h2>3. Montagem automática no boot</h2>
      <CodeBlock
        title="/etc/fstab — entrada para volume LUKS"
        code={`# O volume aparece como /dev/mapper/dados-cripto
/dev/mapper/dados-cripto  /mnt/dados  ext4  defaults,noatime  0  2`}
      />

      <CodeBlock
        title="/etc/crypttab — desbloquear no boot"
        code={`# Formato: <nome> <dispositivo> <keyfile> <opções>
dados-cripto  /dev/sdb1  none  luks`}
      />

      <p>
        Com essa config, o boot <strong>vai pedir a senha</strong> para
        desbloquear o disco. Para servidores headless (sem teclado), use
        keyfile ou dropbear SSH no initramfs.
      </p>

      <h2>4. Comandos de gerenciamento</h2>
      <CodeBlock
        code={`# Status do volume
cryptsetup status dados-cripto

# Adicionar segunda senha (backup)
cryptsetup luksAddKey /dev/sdb1

# Remover senha
cryptsetup luksRemoveKey /dev/sdb1

# Trocar senha
cryptsetup luksChangeKey /dev/sdb1

# Backup do header LUKS (ESSENCIAL!)
cryptsetup luksHeaderBackup /dev/sdb1 \\
  --header-backup-file /root/luks-header-backup.bin
# Guarde o backup em local seguro. Se o header corromper,
# os dados são PERDIDOS mesmo com a senha.

# Fechar volume
umount /mnt/dados
cryptsetup close dados-cripto`}
      />

      <h2>5. Criptografar o disco raiz (/)</h2>
      <p>
        Criptografar a partição raiz é mais complexo e requer initramfs com
        suporte a cryptsetup. O Alpine suporta via mkinitfs:
      </p>
      <CodeBlock
        code={`# Adicionar cryptsetup ao initramfs
echo "features=\"base ext4 cryptsetup keymap\"" >> /etc/mkinitfs/mkinitfs.conf

# Configurar /etc/crypttab e /etc/fstab com o volume criptografado
# Atualizar initramfs
mkinitfs -c /etc/mkinitfs/mkinitfs.conf -b / $(cat /etc/mkinitfs/kernel-version)

# No boot, será solicitada a senha LUKS antes de montar o /.`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add cryptsetup</code></li>
          <li><code>cryptsetup luksFormat /dev/sdb1</code> — cria volume</li>
          <li><code>cryptsetup open /dev/sdb1 nome</code> — desbloqueia</li>
          <li><code>/etc/crypttab</code> + <code>/etc/fstab</code> — boot automático</li>
          <li><strong>Faça backup do header LUKS!</strong> Sem ele, senha não adianta.</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}
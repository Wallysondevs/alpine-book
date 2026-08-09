import { PageContainer } from "@/components/layout/PageContainer";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { AlertBox } from "@/components/ui/AlertBox";
import { Terminal } from "@/components/ui/Terminal";

export default function Git() {
  return (
    <PageContainer
      title="Git no Alpine"
      subtitle="Instale, configure, fluxo básico, SSH, hooks e boas práticas no Alpine."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <AlertBox type="info" title="Pré-requisitos">
        Nenhum. Git está no repositório main do Alpine.
      </AlertBox>

      <p>
        Git é essencial em qualquer servidor de desenvolvimento. No Alpine a
        instalação é trivial e a configuração é idêntica a qualquer Linux.
      </p>

      <h2>1. Instalação e configuração</h2>
      <CodeBlock
        code={`apk add git

# Configuração mínima (obrigatória para commits)
git config --global user.name "Wallyson"
git config --global user.email "wallyson@email.com"

# Configurações recomendadas
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global core.editor nvim

# Ver configuração
git config --list`}
      />

      <h2>2. Fluxo básico</h2>
      <Terminal
        title="Do clone ao push"
        lines={[
          { type: "cmd", text: "git clone https://github.com/usuario/repo.git" },
          { type: "out", text: "Cloning into 'repo'..." },
          { type: "cmd", text: "cd repo" },
          { type: "cmd", text: "git status" },
          { type: "cmd", text: "git add ." },
          { type: "cmd", text: "git commit -m 'Initial commit'" },
          { type: "cmd", text: "git push origin main" },
        ]}
      />

      <h2>3. Branches e merge</h2>
      <CodeBlock
        code={`# Criar e trocar de branch
git checkout -b feature/nova-func

# Listar branches
git branch -a

# Voltar para main
git checkout main

# Merge
git merge feature/nova-func

# Deletar branch
git branch -d feature/nova-func

# Stash (guardar mudanças temporariamente)
git stash
git stash pop`}
      />

      <h2>4. Git + SSH (sem senha)</h2>
      <CodeBlock
        code={`# Gerar chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "git@email.com"

# Adicionar ao agente SSH
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copiar chave pública
cat ~/.ssh/id_ed25519.pub
# Cole em: GitHub → Settings → SSH Keys

# Testar
ssh -T git@github.com
# Hi usuario! You've successfully authenticated.

# Usar URL SSH em vez de HTTPS
git clone git@github.com:usuario/repo.git`}
      />

      <h2>5. Hooks e automação</h2>
      <CodeBlock
        code={`# Hooks ficam em .git/hooks/
ls .git/hooks/

# Exemplo: pre-commit que roda linter
cat > .git/hooks/pre-commit << 'SCRIPT'
#!/bin/sh
echo "Rodando linter..."
pnpm lint
SCRIPT
chmod +x .git/hooks/pre-commit

# Hook global (todos os repositórios)
git config --global core.hooksPath ~/.git-hooks
mkdir -p ~/.git-hooks`}
      />

      <h2>6. Dicas rápidas</h2>
      <CodeBlock
        code={`# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer TUDO (cuidado!)
git reset --hard HEAD~1

# Ver log bonito
git log --oneline --graph --all

# Ver quem mexeu em cada linha
git blame arquivo.ts

# Ignorar arquivo sem commitar
echo "*.log" >> .git/info/exclude`}
      />

      <AlertBox type="success" title="Resumo">
        <ol>
          <li><code>apk add git</code> — instalação</li>
          <li><code>git config --global user.name/email</code> — obrigatório</li>
          <li><code>clone → add → commit → push</code> — fluxo diário</li>
          <li><code>git checkout -b</code> — branches; <code>git merge</code> — unir</li>
          <li>SSH keys para GitHub/GitLab sem senha</li>
        </ol>
      </AlertBox>
    </PageContainer>
  );
}
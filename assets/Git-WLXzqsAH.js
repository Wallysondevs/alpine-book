import{j as e,T as t}from"./index-YFyZeUD9.js";import{P as a,A as o,C as i}from"./AlertBox-C2CyWd7R.js";function n(){return e.jsxs(a,{title:"Git no Alpine",subtitle:"Instale, configure, fluxo básico, SSH, hooks e boas práticas no Alpine.",difficulty:"iniciante",timeToRead:"12 min",children:[e.jsx(o,{type:"info",title:"Pré-requisitos",children:"Nenhum. Git está no repositório main do Alpine."}),e.jsx("p",{children:"Git é essencial em qualquer servidor de desenvolvimento. No Alpine a instalação é trivial e a configuração é idêntica a qualquer Linux."}),e.jsx("h2",{children:"1. Instalação e configuração"}),e.jsx(i,{code:`apk add git

# Configuração mínima (obrigatória para commits)
git config --global user.name "Wallyson"
git config --global user.email "wallyson@email.com"

# Configurações recomendadas
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global core.editor nvim

# Ver configuração
git config --list`}),e.jsx("h2",{children:"2. Fluxo básico"}),e.jsx(t,{title:"Do clone ao push",lines:[{type:"cmd",text:"git clone https://github.com/usuario/repo.git"},{type:"out",text:"Cloning into 'repo'..."},{type:"cmd",text:"cd repo"},{type:"cmd",text:"git status"},{type:"cmd",text:"git add ."},{type:"cmd",text:"git commit -m 'Initial commit'"},{type:"cmd",text:"git push origin main"}]}),e.jsx("h2",{children:"3. Branches e merge"}),e.jsx(i,{code:`# Criar e trocar de branch
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
git stash pop`}),e.jsx("h2",{children:"4. Git + SSH (sem senha)"}),e.jsx(i,{code:`# Gerar chave SSH (se não tiver)
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
git clone git@github.com:usuario/repo.git`}),e.jsx("h2",{children:"5. Hooks e automação"}),e.jsx(i,{code:`# Hooks ficam em .git/hooks/
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
mkdir -p ~/.git-hooks`}),e.jsx("h2",{children:"6. Dicas rápidas"}),e.jsx(i,{code:`# Desfazer último commit (mantém mudanças)
git reset --soft HEAD~1

# Desfazer TUDO (cuidado!)
git reset --hard HEAD~1

# Ver log bonito
git log --oneline --graph --all

# Ver quem mexeu em cada linha
git blame arquivo.ts

# Ignorar arquivo sem commitar
echo "*.log" >> .git/info/exclude`}),e.jsx(o,{type:"success",title:"Resumo",children:e.jsxs("ol",{children:[e.jsxs("li",{children:[e.jsx("code",{children:"apk add git"})," — instalação"]}),e.jsxs("li",{children:[e.jsx("code",{children:"git config --global user.name/email"})," — obrigatório"]}),e.jsxs("li",{children:[e.jsx("code",{children:"clone → add → commit → push"})," — fluxo diário"]}),e.jsxs("li",{children:[e.jsx("code",{children:"git checkout -b"})," — branches; ",e.jsx("code",{children:"git merge"})," — unir"]}),e.jsx("li",{children:"SSH keys para GitHub/GitLab sem senha"})]})})]})}export{n as default};

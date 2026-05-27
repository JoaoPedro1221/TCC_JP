# Projeto JP - Conexão Carreira

TCC: DESENVOLVIMENTO DE UMA PLATAFORMA PARA GESTÃO UNIFICADA DE CADASTRO E AUTOMATIZAÇÃO DE COMPARTILHAMENTO DE DADOS

## Orientações para executar o projeto

1. Node.js
Instalar a versão 18.17.1 do Node.js
```bash
nvm install 18.17.1
nvm use 18.17.1
```

2. JSON-Server
Instalar a versão 0.17.4 do json-server globally no computador
```bash
npm install -g json-server
```

3. Projeto no vscode
Abra a pasta projeto-jp no vscode e rode no terminal "npm i"
Abra a pasta json-server no vscode e rode no terminal "json-server --watch server.json"
Rode no terminal do projeto-jp "npm run dev"

4. Projeto no navegador
- Link: http://localhost:5173/
- Página pública de inscrição do evento, em `/`.
- Dashboard analítico de inscrições, em `/dashboard`.
- Painel administrativo com tabelas por rota e exportação de mailing em XLSX, em `/admin`.

A aplicação consome uma API HTTP local em `http://localhost:3000`. 
O arquivo [server.json](src/assets/js/server.json) contém uma base fake compatível com o formato esperado pela API.


## Visão Geral

Aplicação web em Vue 3 para inscrição de participantes no evento Conexão Carreira, visualização de indicadores em dashboard e administração/exportação das inscrições por rota/evento.


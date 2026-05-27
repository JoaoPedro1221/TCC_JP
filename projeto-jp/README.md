# Projeto JP - Conexão Carreira

TCC: DESENVOLVIMENTO DE UMA PLATAFORMA PARA GESTÃO UNIFICADA DE CADASTRO E AUTOMATIZAÇÃO DE COMPARTILHAMENTO DE DADOS
Aplicação web em Vue 3 para inscrição de participantes no evento Conexão Carreira, visualização de indicadores em dashboard e administração/exportação das inscrições por rota/evento.

## Visão Geral

O projeto possui três áreas principais:

- Página pública de inscrição do evento, em `/`.
- Dashboard analítico de inscrições, em `/dashboard`.
- Painel administrativo com tabelas por rota e exportação de mailing em XLSX, em `/admin`.

A aplicação consome uma API HTTP local em `http://localhost:3000`. 
O arquivo [server.json](src/assets/js/server.json) contém uma base fake compatível com o formato esperado pela API.
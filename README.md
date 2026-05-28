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

## Stack Técnica

- Vue `3.3.4`
- Vite `4.4.5`
- Vue Router `4.1.6`
- Pinia `3.0.1`
- PrimeVue `4.5.5`
- PrimeIcons `7.0.0`
- Aura theme de `@primeuix/themes`
- Axios `1.3.5`
- Chart.js `4.4.0`
- Maska `2.1.11`
- XLSX `0.18.5`
- Sass e Tailwind CSS

## Estrutura Principal

```text
src/
  assets/
    base.css
    img/
    js/
      server.json
      brazil_geo.json
      states-name-to-abbreviation.js
  components/
    commom/
      MessageAlert.vue
    conexao-carreira/
      FormPanel.vue
      form-steps/
        PersonalInformation.vue
        AcademicInformation.vue
        TalentBank.vue
        Sales.vue
        data-field/
          Courses.js
          RegistrationFields.js
          University.js
    dashboard/
      DashboardHeader.vue
      DataBox.vue
      DistribuicaoEstado.vue
      TopCursos.vue
      DataFormatura.vue
      DataTable.vue
  router/
    index.js
  stores/
    conexao.js
    dashboard.js
    error.js
  views/
    ConexaoCarreira.vue
    DashboardView.vue
    AdminView.vue
  App.vue
  main.js
```


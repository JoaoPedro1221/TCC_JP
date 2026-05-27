import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
  // Define o estado reativo inicial do modal global de mensagens.
  state: () => ({
    isErrorModalOpen: false,
    message: "",
    title: "Atenção!",
    // theme: 'danger',
    // theme: "success",
    theme: "warning",
  }),

  actions: {
    // Exibe o modal de erro com uma mensagem traduzida quando houver código conhecido.
    alertError(message) {
      this.title = "Ops... Algo deu errado.";
      this.message = this.translateError(message);
      this.theme = "danger";
      this.isErrorModalOpen = true;
    },

    // Exibe o modal de sucesso com a mensagem recebida.
    alertSuccess(message) {
      this.title = "Sucesso!";
      this.message = message;
      this.theme = "success";
      this.isErrorModalOpen = true;
    },

    // Exibe o modal de alerta para situações que exigem atenção do usuário.
    alertWarning(message) {
      this.title = "Atenção!";
      this.message = message;
      this.theme = "warning";
      this.isErrorModalOpen = true;
    },

    // Traduz códigos de erro da API para mensagens em português.
    translateError(message) {
      const translations = {
        // check access error
        PERSONAL_ID_ALREADY_REGISTERED: "Este CPF já está registrado",
        CELLPHONE_ALREADY_REGISTERED:
          "Este telefone celular já está registrado",
        INVALID_DDD: "DDD inválido",
        INVALID_CELLPHONE: "Telefone celular inválido",
        INVALID_PERSONAL_ID: "CPF inválido",
        INVALID_EMAIL: "E-mail inválido",
        INVALID_NAME: "Nome inválido",
        INVALID_SURNAME: "Sobrenome inválido",
        EMAIL_ALREADY_REGISTERED: "Este e-mail já está registrado",
        INVALID_TOKEN: "Token inválido",
      };
      return translations[message] || "Por favor, tente novamente mais tarde..";
    },
  }
})

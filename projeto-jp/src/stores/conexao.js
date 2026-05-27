import { defineStore } from "pinia";
import axios from "axios";
import { useErrorStore } from "./error";

const API_URL = "http://localhost:3000";

// Remove qualquer caractere que não seja número de um valor informado.
function onlyNumbers(value) {
  return String(value || "").replace(/\D/g, "");
}

// Padroniza e-mails para comparação sem espaços e sem diferença de caixa.
function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

// Verifica se uma inscrição pertence ao mesmo candidato por e-mail e CPF.
function hasSameApplicant(registry, email, personalId) {
  return (
    normalizeEmail(registry.email) === normalizeEmail(email) &&
    onlyNumbers(registry.personalId) === onlyNumbers(personalId)
  );
}

// Cria o objeto inicial de inscrição usado para abrir ou resetar o formulário.
function createInitialRegistry() {
  return {
    // Informações Pessoais
    name: "",
    surname: "",
    email: "",
    areaCode: "",
    cellphone: "",
    personalId: "",
    birthDate: null,
    state: "",
    city: "",
    gender: "",
    lgbt: "",
    race: "",
    pcd: "",
    // Informações Acadêmicas
    education: "",
    progress: "Cursando",
    university: "",
    course: "",
    graduationDate: "",
    // Banco de Talentos
    talents: {
      english: "",
      spanish: "",
      excel: "",
      powerBI: "",
    },
    linkedin: "",
    origin: "",
    hasAcceptedTermsAndConditions: false,
    createdAt: null,
  };
}

// Copia dados de uma inscrição anterior para uma nova inscrição, removendo id e data antiga.
function createRegistryFromPreviousRegistration(registration) {
  const { id, createdAt, ...registrationData } = registration;
  const registry = {
    ...createInitialRegistry(),
    ...registrationData,
    talents: {
      ...createInitialRegistry().talents,
      ...registrationData.talents,
    },
    createdAt: null,
  };

  if (registry.birthDate) {
    registry.birthDate = new Date(registry.birthDate);
  }

  return registry;
}

export const useConexaoStore = defineStore("conexao", {
  // Define o estado reativo inicial do formulário de inscrição.
  state: () => ({
    openModal: false,
    event: "ConexaoCarreira-2026.1",
    registry: createInitialRegistry(),
  }),

  actions: {
    // Busca todas as inscrições da API e retorna apenas as chaves que representam eventos.
    async fetchRegistrationsByEvent() {
      let data;

      try {
        const response = await axios.get(`${API_URL}/db`);
        data = response.data;
      } catch {
        const response = await axios.get(API_URL);
        data = response.data;
      }

      return Object.entries(data).reduce((events, [event, registrations]) => {
        if (Array.isArray(registrations)) {
          events[event] = registrations;
        }

        return events;
      }, {});
    },

    // Procura uma inscrição anterior pelo e-mail e CPF preenchidos no formulário.
    async searchPreviousRegistration() {
      const errorStore = useErrorStore();
      const { email, personalId } = this.registry;

      if (!email || !personalId) {
        errorStore.alertWarning(
          "Informe o e-mail e o CPF para buscar uma inscrição anterior."
        );
        return;
      }

      try {
        const registrationsByEvent = await this.fetchRegistrationsByEvent();
        const currentEventRegistrations = registrationsByEvent[this.event] || [];
        const alreadyRegistered = currentEventRegistrations.find((registration) =>
          hasSameApplicant(registration, email, personalId)
        );

        if (alreadyRegistered) {
          errorStore.alertWarning(
            "Você já está inscrito neste evento e não precisa se inscrever novamente."
          );
          return;
        }

        const previousRegistration = Object.entries(registrationsByEvent)
          .filter(([event]) => event !== this.event)
          .flatMap(([, registrations]) => registrations)
          .find((registration) => hasSameApplicant(registration, email, personalId));

        if (previousRegistration) {
          this.registry = createRegistryFromPreviousRegistration(previousRegistration);
          errorStore.alertSuccess(
            "Encontramos uma inscrição anterior. Revise todos os dados e finalize sua inscrição neste evento."
          );
          return;
        }

        errorStore.alertWarning(
          "Não encontramos nenhuma inscrição anterior com esses dados. Você pode continuar sua inscrição normalmente."
        );
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;

        errorStore.alertError(message);
      }
    },

    // Envia a inscrição atual para a API e reseta o formulário após sucesso.
    async register() {
      const errorStore = useErrorStore();
      const registry = {
        ...this.registry,
        talents: {
          ...this.registry.talents,
        },
        createdAt: new Date().toISOString(),
      };

      try {
        await axios.post(`${API_URL}/${this.event}`, registry);

        this.registry = createInitialRegistry();
        errorStore.alertSuccess("Inscrição realizada com sucesso!");
        this.openModal = false;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message;

        errorStore.alertError(message);
      }
    },
  },
});

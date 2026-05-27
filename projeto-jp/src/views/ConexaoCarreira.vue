<script setup>
import Button from "primevue/button";
import backgroundImage from "@/assets/img/conexao-carreira/background-image.png";
import backgroundMobile from "@/assets/img/conexao-carreira/background-mobile.png";
import logoConexao from "@/assets/img/conexao-carreira/logo-conexao.png";
import logoEmpower from "@/assets/img/conexao-carreira/logo-empower.png";
import FormPanel from "../components/conexao-carreira/FormPanel.vue";
import MessageAlert from "../components/commom/MessageAlert.vue";

import { useConexaoStore } from "../stores/conexao";

const conexaoStore = useConexaoStore();
</script>

<template>
  <section class="career-hero" aria-label="Conexão Carreira">
    <picture class="career-hero__picture" aria-hidden="true">
      <source :srcset="backgroundMobile" media="(max-width: 499px)" />
      <img class="career-hero__background" :src="backgroundImage" alt="" />
    </picture>

    <div class="career-hero__content">
      <div class="career-hero__brand">
        <span>Realização:</span>
        <img :src="logoEmpower" alt="Empower" />
      </div>

      <img
        class="career-hero__logo"
        :src="logoConexao"
        alt="Conexão Carreira"
      />

      <p class="career-hero__date">27 A 30 DE ABRIL</p>
      <p class="career-hero__info">AO VIVO <span></span> 100% GRATUITO</p>

      <button
        type="button"
        class="career-hero__button"
        @click="conexaoStore.openModal = true"
      >
        INSCREVA-SE
      </button>
    </div>
    <FormPanel />
    <MessageAlert />
  </section>
</template>

<style scoped>
.career-hero {
  width: 100vw;
  height: 50.4167vw;
  overflow: hidden;
  background: #000;
  font-family: "Poppins", Arial, sans-serif;
}

.career-hero__picture,
.career-hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.career-hero__content {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 56.25vw;
  height: 100%;
}

.career-hero__brand {
  position: absolute;
  top: 4.375vw;
  left: 17.2222vw;
  display: flex;
  align-items: center;
  gap: 2.1528vw;
  color: #ffffff;
}

.career-hero__brand span {
  font-size: 1.7361vw;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0;
}

.career-hero__brand img {
  width: 8.75vw;
  height: auto;
  display: block;
}

.career-hero__logo {
  position: absolute;
  top: 9.5833vw;
  left: 8.1944vw;
  display: block;
  width: 40.6944vw;
  height: auto;
}

.career-hero__date {
  position: absolute;
  top: 25.9722vw;
  left: 19.0278vw;
  color: #00efc6;
  font-size: 2.3611vw;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: 0.2083vw;
}

.career-hero__info {
  position: absolute;
  top: 30vw;
  left: 13.6111vw;
  display: flex;
  align-items: center;
  gap: 1.0417vw;
  color: #ffffff;
  font-size: 2.4306vw;
  font-weight: 300;
  line-height: 1;
  letter-spacing: 0.0694vw;
  white-space: nowrap;
}

.career-hero__info span {
  width: 0.3472vw;
  height: 0.3472vw;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #00efc6;
}

.career-hero__button {
  position: absolute;
  top: 36.0417vw;
  left: 11.3889vw;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35.4167vw;
  height: 5.4861vw;
  padding: 0;
  border: 0;
  border-radius: 0.6944vw;
  background: #00efc6;
  box-shadow: 0 0 2.5vw rgba(0, 239, 198, 0.42);
  color: #00110f;
  cursor: pointer;
  font-size: 2.4306vw;
  font-weight: 800;
  font-family: inherit;
  line-height: 1;
  letter-spacing: 0.1389vw;
  text-decoration: none;
}

.career-hero__button:hover {
  background: #11ffda;
}

@media (max-width: 499px) {
  .career-hero {
    height: 164.5333vw;
  }

  .career-hero__content {
    width: 100%;
  }

  .career-hero__brand {
    top: 10.4vw;
    left: 32.5333vw;
    gap: 2.6667vw;
  }

  .career-hero__brand span {
    font-size: 3.4667vw;
  }

  .career-hero__brand img {
    width: 13.8667vw;
  }

  .career-hero__logo {
    top: 19.4667vw;
    left: 15.4667vw;
    width: 69.3333vw;
  }

  .career-hero__date {
    top: 45.6vw;
    left: 34.1333vw;
    font-size: 4.2667vw;
    line-height: 1.2;
    letter-spacing: 0.16vw;
  }

  .career-hero__info {
    top: 53.6vw;
    left: 24.8vw;
    gap: 2.6667vw;
    font-size: 3.7333vw;
    letter-spacing: 0.1067vw;
  }

  .career-hero__info span {
    width: 1.0667vw;
    height: 1.0667vw;
  }

  .career-hero__button {
    top: 63.4667vw;
    left: 20.2667vw;
    width: 59.4667vw;
    height: 9.0667vw;
    border-radius: 1.3333vw;
    box-shadow: 0 0 6.6667vw rgba(0, 239, 198, 0.48);
    font-size: 4vw;
    letter-spacing: 0.16vw;
  }
}
</style>

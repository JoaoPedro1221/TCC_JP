<script setup>
import EmpowerLogo from "../../assets/img/conexao-carreira/logo-empower.png";
import ConexaoLogo from "../../assets/img/dashboard/conexao-preto.png";
</script>

<template>
  <header class="dashboard-header" aria-label="Cabeçalho do dashboard">
    <div class="dashboard-header__brand dashboard-header__brand--empower">
      <img :src="EmpowerLogo" alt="Empower" />
    </div>

    <div class="dashboard-header__brand dashboard-header__brand--conexao">
      <img :src="ConexaoLogo" alt="Conexão Carreira" />
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: grid;
  grid-template-columns: minmax(13rem, 15.625rem) 1fr minmax(13rem, 15.625rem);
  align-items: center;
  width: 100%;
  min-height: 3.875rem;
  background: #ffffff;
  font-family: "Raleway", Arial, sans-serif;
}

.dashboard-header__brand {
  display: flex;
  align-items: center;
  min-height: 3.875rem;
}

.dashboard-header__brand--empower {
  justify-content: center;
  background: #3a3a3a;
}

.dashboard-header__brand--empower img {
  display: block;
  width: 10.5rem;
  height: auto;
}

.dashboard-header__brand--conexao {
  justify-content: flex-start;
  padding-left: 2.75rem;
}

.dashboard-header__brand--conexao img {
  display: block;
  width: 7.5rem;
  height: auto;
}

@media (max-width: 760px) {
  .dashboard-header {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding-bottom: 1rem;
  }

  .dashboard-header__brand--empower,
  .dashboard-header__brand--conexao {
    justify-content: center;
    padding-left: 0;
  }

  .dashboard-header__brand--empower img {
    width: 9.75rem;
  }

}

</style>

<script setup>
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import StepItem from "primevue/stepitem";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
import { Button } from "primevue";
import { useConexaoStore } from "../../stores/conexao";

import PersonalInformation from "./form-steps/PersonalInformation.vue";
import AcademicInformation from "./form-steps/AcademicInformation.vue";
import TalentBank from "./form-steps/TalentBank.vue";
import Sales from "./form-steps/Sales.vue";

const conexaoStore = useConexaoStore();
const personalInformationRef = ref(null);
const academicInformationRef = ref(null);
const talentBankRef = ref(null);
const salesRef = ref(null);

// Valida a etapa de informações pessoais antes de avançar para a etapa acadêmica.
function nextFromPersonalInformation(activateCallback) {
  if (personalInformationRef.value?.validate()) {
    activateCallback("2");
  }
}

// Valida a etapa acadêmica antes de avançar para o banco de talentos.
function nextFromAcademicInformation(activateCallback) {
  if (academicInformationRef.value?.validate()) {
    activateCallback("3");
  }
}

// Valida o banco de talentos antes de avançar para a etapa final.
function nextFromTalentBank(activateCallback) {
  if (talentBankRef.value?.validate()) {
    activateCallback("4");
  }
}

// Valida a etapa final e dispara o envio da inscrição.
function submitRegistration() {
  if (salesRef.value?.validate()) {
    conexaoStore.register();
  }
}
</script>

<template>
  <section>
    <Dialog
      v-model:visible="conexaoStore.openModal"
      modal
      class="career-form-dialog"
      :style="{ width: '60rem' }"
    >
      <div class="formulario">
        <Stepper value="1">
          <StepList>
            <Step value="1"></Step>
            <Step value="2"></Step>
            <Step value="3"></Step>
            <Step value="4"></Step>
          </StepList>
          <StepPanels>
            <StepPanel v-slot="{ activateCallback }" value="1">
              <div class="flex flex-col">
                <PersonalInformation ref="personalInformationRef" />
              </div>
              <div class="flex pt-6 justify-around">
                <Button
                  class="form-panel__next"
                  label="Próximo"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  @click="nextFromPersonalInformation(activateCallback)"
                />
              </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="2">
              <div class="flex flex-col">
                <AcademicInformation ref="academicInformationRef" />
              </div>
              <div class="flex pt-6 justify-around">
                <Button
                  label="Voltar"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  @click="activateCallback('1')"
                />
                <Button
                  class="form-panel__next"
                  label="Próximo"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  @click="nextFromAcademicInformation(activateCallback)"
                />
              </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="3">
              <div class="flex flex-col">
                <TalentBank ref="talentBankRef" />
              </div>
              <div class="flex pt-6 justify-around">
                <Button
                  label="Voltar"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  @click="activateCallback('2')"
                />
                <Button
                  class="form-panel__next"
                  label="Próximo"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  @click="nextFromTalentBank(activateCallback)"
                />
              </div>
            </StepPanel>
            <StepPanel v-slot="{ activateCallback }" value="4">
              <div class="flex flex-col">
                <Sales ref="salesRef" />
              </div>
              <div class="flex pt-6 justify-around">
                <Button
                  label="Voltar"
                  severity="secondary"
                  icon="pi pi-arrow-left"
                  @click="activateCallback('3')"
                />
                <Button
                  class="form-panel__submit"
                  label="Inscreva-se Gratuitamente"
                  @click="submitRegistration"
                />
              </div>
            </StepPanel>
          </StepPanels>
        </Stepper>
      </div>
    </Dialog>
  </section>
</template>

<style scoped>
.formulario {
  --p-primary-color: #06255c;
  --p-primary-hover-color: #06255c;
  --p-primary-active-color: #06255c;
  --p-stepper-step-number-active-border-color: #06255c;
  --p-stepper-step-number-active-color: #06255c;
  --p-stepper-separator-active-background: #06255c;
  padding: 0 5rem;
}

:deep(.p-dialog) {
  border-radius: 0.5rem;
}

:deep(.p-dialog-header) {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 1.75rem 1.75rem 1rem;
}

:deep(.p-dialog-title) {
  position: absolute;
  left: 50%;
  width: max-content;
  max-width: calc(100% - 7rem);
  transform: translateX(-50%);
  color: #000000;
  font-family: "Raleway", Arial, sans-serif;
  font-size: 1.875rem;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

:deep(.p-dialog-header-actions) {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
}

:deep(.p-dialog-close-button) {
  color: #000000;
}

:deep(.p-dialog-content) {
  padding-top: 0.25rem;
}

:deep(.p-steplist) {
  align-items: center;
  max-width: 42rem;
  margin: 0 auto 2.25rem;
  padding: 0;
}

:deep(.p-step) {
  display: flex;
  align-items: center;
  min-width: 0;
}

:deep(.p-step:not(:last-child)) {
  flex: 1 1 auto;
}

:deep(.p-step-header) {
  display: flex;
  align-items: center;
  gap: 0;
  background: transparent;
  border: 0;
  padding: 0;
}

:deep(.p-step-number) {
  width: 1.5rem;
  min-width: 1.5rem;
  height: 1.5rem;
  border: 2px solid #d8d8d8;
  border-radius: 999px;
  background: #d8d8d8;
  color: #ffffff;
  font-family: "Raleway", Arial, sans-serif;
  font-size: 0.875rem;
  font-weight: 800;
  line-height: 1;
}

:deep(.p-step.p-step-active .p-step-number),
:deep(.p-step[data-p-active="true"] .p-step-number),
:deep(.p-step[data-p-highlight="true"] .p-step-number),
:deep(.p-step[data-p-complete="true"] .p-step-number) {
  border-color: #06255c;
  background: #ffffff;
  color: #06255c;
}

:deep(.p-stepper-separator) {
  flex: 1 1 auto;
  height: 1px;
  margin: 0 1.5rem;
  background: #dedede;
}

:deep(.p-stepper-separator[data-p-highlight="true"]),
:deep(.p-stepper-separator[data-p-active="true"]),
:deep(.p-step.p-step-active + .p-stepper-separator),
:deep(.p-step[data-p-active="true"] + .p-stepper-separator),
:deep(.p-step[data-p-complete="true"] + .p-stepper-separator) {
  background: #06255c;
}

:deep(.p-step-title) {
  display: none;
}

:deep(.form-panel__next) {
  min-height: 2.375rem;
  padding: 0.5rem 1rem;
  border: 1px solid #06255c;
  border-radius: 0.5rem;
  background: #06255c;
  color: #ffffff;
  font-family: "Raleway", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

:deep(.form-panel__next:hover),
:deep(.form-panel__next:focus),
:deep(.form-panel__next:focus-visible),
:deep(.form-panel__next:active) {
  border-color: #06255c;
  background: #06255c;
  color: #ffffff;
  box-shadow: none;
}

:deep(.form-panel__submit) {
  min-height: 2.375rem;
  min-width: 19.5rem;
  padding: 0.5rem 1.5rem;
  border: 1px solid #06255c;
  border-radius: 0.5rem;
  background: #06255c;
  color: #ffffff;
  font-family: "Raleway", Arial, sans-serif;
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.02em;
}

:deep(.form-panel__submit:hover),
:deep(.form-panel__submit:focus),
:deep(.form-panel__submit:focus-visible),
:deep(.form-panel__submit:active) {
  border-color: #06255c;
  background: #06255c;
  color: #ffffff;
  box-shadow: none;
}

@media (max-width: 760px) {
  .formulario {
    padding: 0 1rem;
  }

  :deep(.p-dialog-title) {
    font-size: 1.5rem;
  }

  :deep(.p-steplist) {
    max-width: 100%;
    margin-bottom: 1.75rem;
  }

  :deep(.p-stepper-separator) {
    margin: 0 0.75rem;
  }
}
</style>

<style>
.career-form-dialog .p-dialog-header {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 1.75rem 1.75rem 1rem;
}

.career-form-dialog .form-panel__dialog-title {
  position: absolute;
  left: 50%;
  width: max-content;
  max-width: calc(100% - 7rem);
  margin: 0;
  transform: translateX(-50%);
  color: #000000;
  font-family: "Raleway", Arial, sans-serif;
  font-size: 1.875rem;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
}

.career-form-dialog .p-dialog-header-actions {
  position: absolute;
  top: 1.25rem;
  right: 1.5rem;
}

@media (max-width: 760px) {
  .career-form-dialog .form-panel__dialog-title {
    font-size: 1.5rem;
  }
}
</style>

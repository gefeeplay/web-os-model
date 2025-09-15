<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const osSpeed = ref(100)
const osMemory = ref(1000)
const osCost = ref(2)

const router = useRouter()

function startOS() {
  router.push({
    name: 'OS',
    query: {
      speed: osSpeed.value,
      memory: osMemory.value,
      cost: osCost.value
    }
  })
}
</script>

<template>
  <div class="panel">
    <h2>Модель ОС</h2>
    <h3>Параметры:</h3>
    <div class="params">

      <!-- Скорость -->
      <div class="param">
        <div class="param-row small">
          <div class="param-label">Диапазон, такт./сек</div>
          <div class="param-range">10 – 1000</div>
        </div>
        <div class="param-row big">
          <div class="param-title">
            <span class="material-symbols-outlined" style="font-size: 1rem;">speed</span>
            Скорость
          </div>
          <input v-model="osSpeed" type="number" placeholder="100" class="param-input"/>
        </div>
      </div>

      <!-- Память -->
      <div class="param">
        <div class="param-row small">
          <div class="param-label">Диапазон, МБ</div>
          <div class="param-range">500 – 5000</div>
        </div>
        <div class="param-row big">
          <div class="param-title">
            <span class="material-symbols-outlined" style="font-size: 1rem;">memory</span>
            Память
          </div>
          <input v-model="osMemory" type="number" placeholder="1000" class="param-input"/>
        </div>
      </div>

      <!-- Затраты -->
      <div class="param">
        <div class="param-row small">
          <div class="param-label">Диапазон, усл.ед.</div>
          <div class="param-range">1 – 10</div>
        </div>
        <div class="param-row big">
          <div class="param-title">
            <span class="material-symbols-outlined" style="font-size: 1rem;">paid</span>
            Затраты ОС
          </div>
          <input v-model="osCost" type="number" placeholder="2" class="param-input"/>
        </div>
      </div>
    </div>

    <div class="start-btn" @click="startOS">
      Запустить ОС
    </div>
  </div>
</template>

<style scoped>
.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  width: 480px;
  padding: 20px;
  background-color: rgba(23, 23, 23, 0.6);
  color: rgb(200, 200, 200);
  box-shadow: 5px 5px 10px rgba(97, 97, 97, 0.2);
}

.params {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  width: 100%;
}

.param {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 12px 15px;
  border: 1px solid rgba(97, 97, 97, 0.3);
  border-radius: 15px;
  background: rgba(40, 40, 40, 0.5);
}

/* Строки */
.param-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Первая строка */
.param-row.small {
  font-size: 0.8rem;
  color: #aaa;
}

/* Вторая строка */
.param-row.big {
  font-size: 1rem;
  font-weight: 500;
}

.param-title {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 6px 10px;
  border: 1px solid rgba(97, 97, 97, 0.3);
  border-radius: 8px;
}

.param-title {
  font-weight: 600;
}
.param-label {
  padding: 6px 10px;
}
.param-range {
  width: 5rem;
  text-align: end;
  padding: 6px 4px;
}


.param-input {
  padding: 8px 4px;
  border-radius: 10px;
  border: 1px solid rgba(97, 97, 97, 0.3);
  background: rgba(60, 60, 60, 0.6);
  color: white;
  font-family: "Comfortaa", "Open Sans", sans-serif;
  font-weight: bold;
  width: 5rem;
  text-align: end;
}

.param-input::-webkit-inner-spin-button,
.param-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Кнопка */
.start-btn {
  margin-top: 1.5rem;
  border: 1px solid rgba(97, 97, 97, 0.3);
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  background: rgba(60, 60, 60, 0.6);
  transition: 0.2s;
}
.start-btn:hover {
  background: rgba(100, 100, 100, 0.6);
}
</style>

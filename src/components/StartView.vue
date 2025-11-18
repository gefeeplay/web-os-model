<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const osSpeed = ref(100)
const osMemory = ref(1000)
const osMaxOfRange = ref(300)
const osMinOfRange = ref(100)

const minSpeed = 10
const maxSpeed = 1000
const minMemory = 500
const maxMemory = 5000
const minOfRange = 100
const maxOfRange = 1000

const router = useRouter()

function startOS() {
  // Проверим все диапазоны перед запуском
  if (
    !checkRange(osSpeed.value, minSpeed, maxSpeed) ||
    !checkRange(osMemory.value, minMemory, maxMemory) ||
    !checkMax(osMaxOfRange.value, maxOfRange) ||
    !checkMin(osMinOfRange.value, minOfRange)
  ) {
    alert('Проверьте введённые значения — они должны быть в диапазонах!')
    return
  }

  router.push({
    name: 'OS',
    query: {
      speed: osSpeed.value,
      memory: osMemory.value,
      minOfRange: osMinOfRange.value,
      maxOfRange: osMaxOfRange.value
    }
  })
}

// --- Функция проверки диапазона ---
function checkRange(value, min, max) {
  return value >= min && value <= max
}

function checkMax(value, max) {
  return value <= max
}

function checkMin(value, min) {
  return value >= min
}

// --- Для применения стилей создадим вычисляемые классы ---
const speedClass = computed(() => checkRange(osSpeed.value, minSpeed, maxSpeed) ? '' : 'out-of-range')
const memoryClass = computed(() => checkRange(osMemory.value, minMemory, maxMemory) ? '' : 'out-of-range')
const minClass = computed(() => checkMin(osMinOfRange.value, minOfRange) ? '' : 'out-of-range')
const maxClass = computed(() => checkMax(osMaxOfRange.value, maxOfRange) ? '' : 'out-of-range')
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
          <input v-model="osSpeed" type="number" class="param-input" :class="speedClass" />
        </div>
      </div>

      <!-- Память -->
      <div class="param">
        <div class="param-row small">
          <div class="param-label">Диапазон, усл.ед.</div>
          <div class="param-range">500 – 5000</div>
        </div>
        <div class="param-row big">
          <div class="param-title">
            <span class="material-symbols-outlined" style="font-size: 1rem;">memory</span>
            Память
          </div>
          <input v-model="osMemory" type="number" class="param-input" :class="memoryClass" />
        </div>
      </div>

      <!-- Затраты -->
      <div class="param">
        <div class="param-row small">
          <div class="param-label">Диапазон, усл.ед.</div>
          <div class="param-range">100 - 1000</div>
        </div>
        <div class="param-row big">
          <div class="param-title">
            <span class="material-symbols-outlined" style="font-size: 1rem;">height</span>
            Размер процесса
          </div>
          <input v-model="osMinOfRange" type="number" class="param-input" :class="minClass" />
          <input v-model="osMaxOfRange" type="number" class="param-input" :class="maxClass" />
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.param:hover {
  transform: translateY(-5px);
  box-shadow: 2px 4px 5px rgba(97, 97, 97, 0.2);
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

.param-input.out-of-range {
  color: red;
  border: 1px solid rgb(167, 67, 67);
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
  color: white;
}
</style>

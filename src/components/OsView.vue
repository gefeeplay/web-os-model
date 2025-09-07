<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// --- Параметры из query ---
const initSpeed = Number(route.query.speed || 1)   // тактов в секунду
const initMemory = Number(route.query.memory || 1000)
const initCost = Number(route.query.cost || 1)

// --- Состояние модели ---
const commandCounter = ref(0)
const currentSpeed = ref(initSpeed)
const totalMemory = ref(initMemory)
const usedMemory = ref(0)
const processTable = ref([])
const isRunning = ref(false)
const intervalId = ref(null)
const log = ref([])

// --- Инициализация ---
function initModel() {
    commandCounter.value = 0
    usedMemory.value = 0
    processTable.value = []
    log.value.push('Модель ОС инициализирована')
}

// --- Генерация нового задания ---
function generateTask() {
    const task = {
        id: Date.now(),
        memory: Math.floor(Math.random() * 200) + 50,  // 50–250
        pc: 0,
        ticksRequired: Math.floor(Math.random() * 500) + 250 ///250-750
    }
    if (hasMemory(task.memory) && processTable.value.length < 10) {
        processTable.value.push(task)
        usedMemory.value += task.memory
        log.value.push(`Задание id=${task.id} загружено (mem=${task.memory}, ticks=${task.ticksRequired})`)
    } else {
        log.value.push(`Нет ресурсов(памяти) для задания id=${task.id}`)
    }
}

// --- Проверка памяти ---
function hasMemory(size) {
    return usedMemory.value + size <= totalMemory.value

}

// --- Такт ОС (последовательно) ---
function tick() {
  if (processTable.value.length === 0) return

  const active = processTable.value[0] // всегда первый
  active.pc++
  active.ticksRequired--
  commandCounter.value++

  if (active.ticksRequired === 0) {
    // Завершение
    usedMemory.value -= active.memory
    processTable.value.shift()
    log.value.push(`Процесс ${active.id} завершён, память освобождена`)
  }
}

// --- Управление моделированием ---
function startSimulation() {
    if (isRunning.value) return
    isRunning.value = true
    intervalId.value = setInterval(tick, 1000 / currentSpeed.value)
    log.value.push('Моделирование запущено')
}

function stopSimulation() {
    if (intervalId.value) clearInterval(intervalId.value)
    isRunning.value = false
    log.value.push('Моделирование остановлено')
}

function adjustSpeed(factor) {
    currentSpeed.value = Math.max(0.1, currentSpeed.value * factor)
    if (isRunning.value) {
        clearInterval(intervalId.value)
        intervalId.value = setInterval(tick, 1000 / currentSpeed.value)
    }
    log.value.push(`Скорость изменена: ${currentSpeed.value.toFixed(2)} такт/с`)
}

// --- Жизненный цикл ---
onMounted(() => {
    initModel()
    startSimulation()
})

onUnmounted(() => {
    stopSimulation()
})
</script>

<template>
    <div class="panel os-panel">
        <h2>Модель ОС</h2>
        <p>Скорость: {{ currentSpeed.toFixed(2) }} такт/с</p>
        <p>Память: {{ usedMemory }} / {{ totalMemory }}</p>
        <p>Затраты ОС: {{ initCost }}</p>
        <p>Счётчик команд: {{ commandCounter }}</p>

        <h3>Управление</h3>
        <div class="controls">
            <button @click="stopSimulation">Остановить ОС</button>
            <button @click="startSimulation">Запустить ОС</button>
            <button @click="adjustSpeed(1.1)">Увеличить скорость</button>
            <button @click="adjustSpeed(0.9)">Уменьшить скорость</button>
            <button @click="generateTask">Сгенерировать задание</button>
        </div>

        <h3>Таблица процессов</h3>
        <ul>
            <li v-for="task in processTable" :key="task.id">
                id={{ task.id }}, mem={{ task.memory }}, pc={{ task.pc }}, осталось={{ task.ticksRequired }}
            </li>
        </ul>

        <h3>Лог</h3>
        <div class="log">
            <div v-for="(entry, i) in log" :key="i">{{ entry }}</div>
        </div>
    </div>
</template>

<style scoped>
.os-panel {
    height: 80vh;
    width: 80ch;
    padding: 1rem;
}

.controls button {
    margin: 0.25rem;
}

.log {
    border: 1px solid #ccc;
    padding: 0.5rem;
    height: 200px;
    overflow-y: auto;
    background: #fafafa;
    font-size: 0.9em;
}
</style>

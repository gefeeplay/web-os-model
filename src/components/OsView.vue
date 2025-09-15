<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

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

// --- Навигация ---
function goToMainMenu() {
  router.push('/')  // переход на уровень выше
}

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
        
        <div class="menu-btn" @click="goToMainMenu">
            <span class="material-symbols-outlined" style="font-size: 1rem;">mode_off_on</span>
        </div>
        
        <h2>Модель ОС</h2>

        <h3>Параметры:</h3>
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

        <h3>Лог:</h3>
        <div class="log">
            <div v-for="(entry, i) in log" :key="i">{{ entry }}</div>
        </div>
    </div>
</template>

<style scoped>
h2, h3 {
    padding: 0.5rem 0;
}
.os-panel {
    position: relative;
    height: 80vh;
    width: 80ch;
    padding: 1rem;
    background-color: rgba(23, 23, 23, 0.6);
    color: rgb(200, 200, 200);
    box-shadow: 5px 5px 10px rgba(97, 97, 97, 0.2);
}

.controls button {
    padding: 8px 12px;
    border-radius: 5px;
    border: 1px solid rgba(97, 97, 97, 0.3);
    background: rgba(60, 60, 60, 0.6);
    color: rgb(200, 200, 200);
    cursor: pointer;
    font-family: "Comfortaa", "Open Sans", sans-serif;
    margin: 0.25rem;
}

.controls button:hover {
    color: white;
}   

.menu-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 10px 10px;
    border-radius: 10px;
    border: 1px solid rgba(97, 97, 97, 0.3);
    background: rgba(60, 60, 60, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(200, 200, 200);
    cursor: pointer;
}

.menu-btn:hover {
    color: white;
}

.log {
    border: 1px solid rgba(97, 97, 97, 0.3);
    border-radius: 10px;
    padding: 0.5rem;
    height: 200px;
    overflow-y: auto;
    background: rgba(40, 40, 40, 0.5);
    font-size: 0.9em;
}
</style>

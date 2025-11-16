<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import HelpView from './HelpView.vue'

const route = useRoute()
const router = useRouter()

// --- Параметры из query ---
const initSpeed = Number(route.query.speed || 1)
const initMemory = Number(route.query.memory || 1000)

// --- Состояние модели ---
const taktCounter = ref(0)
const idleTicks = ref(0) // простои ЦП
const currentSpeed = ref(initSpeed)
const totalMemory = ref(initMemory)
const usedMemory = ref(0)
const processTable = ref([])
const completedTable = ref([]) // таблица завершенных процессов
const isRunning = ref(false)
const intervalId = ref(null)
const log = ref([])
const taskCounter = ref(0) // счетчик заданий процессора ввода/вывода

const quantum = 50
const currentQuantum = ref(0)
let currentProcess = null

// --- Команды процессора ---
const commandList = [
    { name: "Арифметическая операция", code: 0 },
    { name: "Вывод строки в консоль", code: 1 },
]

// --- Навигация ---
function goToMainMenu() {
    router.push('/')
}

// --- Инициализация ---
function initModel() {
    taktCounter.value = 0
    usedMemory.value = 0
    processTable.value = []
    completedTable.value = []
    log.value.push('Модель ОС инициализирована')
    currentProcess = null
    currentQuantum.value = 0
}

// --- Генерация нового задания ---
function generateTask() {
    const task = {
        id: Date.now(),
        memory: Math.floor(Math.random() * 200) + 50,
        pc: 0,
        ticksRequired: Math.floor(Math.random() * 500) + 250,
        ticksTotal: 0,
        priority: Math.floor(Math.random() * 5) + 1,
        state: 'Ожидание',
        currentCommand: null,
    }

    task.ticksTotal = task.ticksRequired

    if (hasMemory(task.memory) && processTable.value.length < 10) {
        processTable.value.push(task)
        usedMemory.value += task.memory
        log.value.push(`Задание id=${task.id} загружено (mem=${task.memory}, ticks=${task.ticksRequired}, prio=${task.priority})`)
    } else {
        log.value.push(`Нет ресурсов(памяти) для задания id=${task.id}`)
    }
}

// Подсчет средних значений
const avgTicks = computed(() => {
    if (completedTable.value.length === 0) return 0
    const sum = completedTable.value.reduce((acc, p) => acc + p.ticksTotal, 0)
    return Math.round(sum / completedTable.value.length)
})
// Процент производительности системы
const cpuUtilization = computed(() => {
    const total = taktCounter.value + idleTicks.value
    if (total === 0) return 0
    return ((taktCounter.value / total) * 100).toFixed(2)
})

function hasMemory(size) {
    return usedMemory.value + size <= totalMemory.value
}

// --- Командные функции ---
function generateCommand(process) {
    const randomCommand = commandList[Math.floor(Math.random() * commandList.length)]
    process.currentCommand = randomCommand
    log.value.push(`Процесс ${process.id}: сгенерирована команда "${randomCommand.name}" (код ${randomCommand.code})`)
}

//Разбор кода задачи
function decodeCommand(process) {
    if (!process.currentCommand) return null
    const command = process.currentCommand
    log.value.push(`Процесс ${process.id}: разбор команды "${command.name}", код ${command.code}`)
    return command.code
}

//Выполнение задачи
function executeCommand(process) {
    const code = decodeCommand(process)
    if (code === 0) {
        const a = Math.floor(Math.random() * 10)
        const b = Math.floor(Math.random() * 10)
        const result = a + b
        log.value.push(`Процесс ${process.id}: выполнена арифметическая операция ${a} + ${b} = ${result}`)
    } else if (code === 1) {
        IOProccesor(process);
    }
    writeResultToMemory(process)
}

//Процессор ввода/вывода
function IOProccesor(process){
    taskCounter.value +=1;
    executeIOCommand(process);
    currentQuantum.value--
}

// выполнение задачи ввода/вывода
function executeIOCommand(process) {
    const text = ["Привет, мир!", "Процесс работает", "Операция завершена", "Итерация цикла"].sort(() => 0.5 - Math.random())[0]
    log.value.push(`Процесс ${process.id}: вывод в консоль — "${text}"`)
}

function writeResultToMemory(process) {
    log.value.push(`Процесс ${process.id}: результат операции записан в память`)
}

//Инициализация процессора ввода/вывода
function initIOProcessor() {
    log.value.push("Инициализация процессора ввода/вывода завершена")
    taskCounter.value = 0;
}

//Завершить процесс
function finishTask(process) {
    process.state = "Выполнен"
    completedTable.value.push(process)
    usedMemory.value -= process.memory
    log.value.push(`Процесс ${process.id} завершён, память освобождена`)
    currentProcess = null
}

// --- Планировщик ---
function scheduleNext() {
    if (processTable.value.length === 0) {
        currentProcess = null
        return
    }

    const readyProcesses = processTable.value.filter(p => p.state !== 'Приостановлен')
    if (readyProcesses.length === 0) {
        currentProcess = null
        return
    }

    readyProcesses.sort((a, b) => b.priority - a.priority)
    const nextProcess = readyProcesses.shift()
    processTable.value = processTable.value.filter(p => p.id !== nextProcess.id)

    nextProcess.state = 'Выполняется'
    currentProcess = nextProcess
    currentQuantum.value = quantum

    processTable.value.forEach(p => {
        if (p.state === 'Выполняется') p.state = 'Ожидание'
    })
}

// --- Такт ---
function tick() {
    
    //Если нет процесса — ЦП простаивает
    if (!currentProcess) {
        idleTicks.value++
        scheduleNext()
        return
    }

    currentProcess.pc++
    currentProcess.ticksRequired--
    currentQuantum.value--
    taktCounter.value++

    //  Если квант завершился — выполнить команду процесса
    if (currentQuantum.value <= 0) {
        generateCommand(currentProcess)
        executeCommand(currentProcess)
        currentQuantum.value = quantum // новый квант
    }

    // Проверяем завершение
    if (currentProcess.ticksRequired <= 0) {
        finishTask(currentProcess)
    }

    if (!currentProcess) scheduleNext()
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

// --- функции действий (кнопок)---
function pauseProcess(task) {
    if (task.state === 'Выполняется') {
        currentProcess = null
    }
    task.state = 'Приостановлен'
    log.value.push(`Процесс ${task.id} приостановлен`)
}

function terminateProcess(task) {
    usedMemory.value -= task.memory
    task.state = 'Удален'
    completedTable.value.push(task)
    processTable.value = processTable.value.filter(p => p.id !== task.id)
    log.value.push(`Процесс ${task.id} завершён вручную`)
    if (currentProcess && currentProcess.id === task.id) currentProcess = null
}

//Удаление выполненого процесса
function deleteCompleted(task) {
    completedTable.value = completedTable.value.filter(p => p.id !== task.id)
    log.value.push(`Процесс ${task.id} удалён из списка завершённых`)
}

// --- Жизненный цикл ---
onMounted(() => {
    initModel()
    initIOProcessor()
    startSimulation()
})

onUnmounted(() => {
    stopSimulation()
})

const showHelp = ref(false)
</script>


<template>
    <div class="panel os-panel">

        <div class="btn help" @click="showHelp = true">
            <span class="material-symbols-outlined" style="font-size: 1rem;">question_mark</span>
            <HelpView :showHelp="showHelp" @closeHelp="showHelp = false" />
        </div>

        <div class="btn menu" @click="goToMainMenu">
            <span class="material-symbols-outlined" style="font-size: 1rem;">mode_off_on</span>
        </div>

        <h2>Модель ОС</h2>

        <h3>Параметры:</h3>
        <p>Скорость: {{ currentSpeed.toFixed(2) }} такт/с</p>
        <p>Память: {{ usedMemory }} / {{ totalMemory }}</p>
        <p>Счётчик тактов: {{ taktCounter }}</p>
        <p>Счётчик задач процессора IO: {{ taskCounter }}</p>

        <h3></h3>
        <p>Производительность: {{ cpuUtilization }} %</p>
        <p>Среднее значение необходимых тактов: {{ avgTicks }}</p>

        <h3>Управление</h3>
        <div class="controls">
            <button @click="stopSimulation">Остановить ОС</button>
            <button @click="startSimulation">Запустить ОС</button>
            <button @click="adjustSpeed(1.1)">Увеличить скорость</button>
            <button @click="adjustSpeed(0.9)">Уменьшить скорость</button>
            <button @click="generateTask">Сгенерировать задание</button>
            <button @click="clearLog">Очистить лог</button>
        </div>

        <h3>Таблица активных процессов:</h3>
        <table class="process-table">
            <thead>
                <tr>
                    <th>Имя (id)</th>
                    <th>Память</th>
                    <th>Выполнено тактов</th>
                    <th>Осталось тактов</th>
                    <th>Приоритет</th>
                    <th>Состояние</th>
                    <th>Текущая операция</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <!-- Текущий процесс -->
                <tr v-if="currentProcess" class="current-process">
                    <td>{{ currentProcess.id }}</td>
                    <td>{{ currentProcess.memory }}</td>
                    <td>{{ currentProcess.pc }}</td>
                    <td>{{ currentProcess.ticksRequired }}</td>
                    <td>{{ currentProcess.priority }}</td>
                    <td>{{ currentProcess.state }}</td>
                    <td>
                        {{ currentProcess.currentCommand?.name || '-' }} 
                        ({{ currentProcess.currentCommand?.code ?? '-' }})
                    </td>
                    <td>
                        <button @click="pauseProcess(currentProcess)">
                            <span class="material-symbols-outlined">pause</span>
                        </button>
                        <button @click="terminateProcess(currentProcess)">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </td>
                </tr>

                <!-- Остальные процессы -->
                <tr v-for="task in processTable" :key="task.id">
                    <td>{{ task.id }}</td>
                    <td>{{ task.memory }}</td>
                    <td>{{ task.pc }}</td>
                    <td>{{ task.ticksRequired }}</td>
                    <td>{{ task.priority }}</td>
                    <td>{{ task.state }}</td>
                    <td>
                        {{ task.currentCommand?.name || '-' }}
                        ({{ task.currentCommand?.code ?? '-' }})
                    </td>
                    <td>
                        <button @click="pauseProcess(task)">
                            <span class="material-symbols-outlined">pause</span>
                        </button>
                        <button @click="terminateProcess(task)">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <h3>Таблица завершённых процессов:</h3>
        <table class="process-table">
            <thead>
                <tr>
                    <th>Имя (id)</th>
                    <th>Память</th>
                    <th>Выполнено тактов</th>
                    <th>Приоритет</th>
                    <th>Состояние</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in completedTable" :key="task.id">
                    <td>{{ task.id }}</td>
                    <td>{{ task.memory }}</td>
                    <td>{{ task.pc }}</td>
                    <td>{{ task.priority }}</td>
                    <td>{{ task.state }}</td>
                    <td>
                        <button @click="deleteCompleted(task)">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <h3>Лог:</h3>
        <div class="log">
            <div v-for="(entry, i) in log" :key="i">{{ entry }}</div>
        </div>
    </div>
</template>


<style scoped>
h2,
h3 {
    padding: 0.5rem 0;
}

.os-panel {
    position: relative;
    width: 70rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: rgba(23, 23, 23, 0.6);
    color: rgb(200, 200, 200);
    box-shadow: 5px 5px 10px rgba(97, 97, 97, 0.2);
    max-height: 90vh;
    overflow-y: auto;
}

.os-panel::-webkit-scrollbar {
    display: none;
    width: 8px;
}

.os-panel::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.4);
    border-radius: 4px;
}

.os-panel::-webkit-scrollbar-thumb:hover {
    background: rgba(150, 150, 150, 0.6);
}


.controls {
    display: grid;
    grid-template-columns: repeat(2, 250px);

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

.process-table {
    padding: 8px 8px;
}

.process-table li {
    padding-left: 1rem;
}

.process-table button {
    background: none;
    border: none;
    cursor: pointer;
    color: rgb(200, 200, 200);
}

.process-table button:hover {
    color: #fff;
}

li::marker {
    margin-left: 1rem;
}

.btn {
    position: absolute;
    top: 10px;
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

.btn:hover {
    color: white;
}

.btn.help {
    right: 60px;
}

.btn.menu {
    right: 10px;
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

.process-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    background: rgba(40, 40, 40, 0.5);
    border: 1px solid rgba(97, 97, 97, 0.3);
    border-radius: 8px;
    overflow: hidden;
}

.process-table thead {
    background: rgba(60, 60, 60, 0.7);
}

.process-table th,
.process-table td {
    border: 1px solid rgba(97, 97, 97, 0.3);
    padding: 6px 10px;
    text-align: center;
    color: rgb(200, 200, 200);
}

.process-table th {
    font-weight: bold;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgb(220, 220, 220);
}

.process-table tbody tr:nth-child(even) {
    background: rgba(30, 30, 30, 0.4);
}

.process-table tbody tr:hover {
    background: rgba(80, 80, 80, 0.4);
}

.process-table .current-process {
    background: rgba(100, 150, 250, 0.2);
    font-weight: bold;
    color: rgb(230, 230, 255);
}
</style>

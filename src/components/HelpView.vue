<script setup>
import { watch, ref } from 'vue'

// Принимаем флаг отображения окна
const props = defineProps({
    showHelp: {
        type: Boolean,
        required: true
    }
})

// Эмитим событие для закрытия
const emit = defineEmits(['closeHelp'])

// Ссылка на сам диалог
const dialogRef = ref(null)

// Следим за пропсом showHelp и показываем/закрываем окно
watch(
    () => props.showHelp,
    (newVal) => {
        if (newVal) {
            dialogRef.value?.showModal()
        } else {
            dialogRef.value?.close()
        }
    }
)

// При клике вне окна — закрываем
function handleBackdropClick(e) {
    if (e.target === dialogRef.value) {
        emit('closeHelp')
    }
}
</script>

<template>
    <dialog ref="dialogRef" class="help-dialog" @click="handleBackdropClick" @close="emit('closeHelp')">
        <div class="help-content">
            <h2>Помощь</h2>
            
            <h3>Вариант обработчика</h3>
            <p>18. RR + относительные приоритеты, одна очередь готовых процессов</p>
            
            <h3>Выполнение операций</h3>
            <ul>
                <li><strong>Запустить/Остановить ОС</strong> — управление симуляцией.</li>
                <li><strong>Увеличить/Уменьшить скорость</strong> — регулировка количества тактов в секунду.</li>
                <li><strong>Сгенерировать задание</strong> — добавить новый процесс в очередь.</li>
                <li><strong>Очистить лог</strong> — удаление всех сообщений в блоке лог</li>
            </ul>
            <div class="help-footer">
                <button @click="emit('closeHelp')">Закрыть</button>
            </div>
        </div>
    </dialog>
</template>

<style scoped>
h2 {
    text-align: center;
    padding-bottom: 0.5rem;    
}

p {
    padding: 0.5rem 0rem;
}

.help-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(30, 30, 30, 0.9);
    color: rgb(220, 220, 220);
    border: 1px solid rgba(97, 97, 97, 0.4);
    border-radius: 12px;
    padding: 1.5rem;
    max-width: 500px;
    width: 80%;
    box-shadow: 0 0 25px rgba(0, 0, 0, 0.8);
    font-family: "Comfortaa", "Open Sans", sans-serif;
    cursor: default;
}

.help-dialog::backdrop {
    background: rgba(0, 0, 0, 0.6);
    cursor: pointer;
}

.help-content h2, h3 {
    margin-top: 0;
    color: rgb(255, 255, 255);
}

.help-content ul {
    list-style: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0 1rem;
}

.help-footer {
    display: flex;
    justify-content: flex-end;
}

.help-footer button {
    padding: 8px 16px;
    border-radius: 8px;
    border: 1px solid rgba(97, 97, 97, 0.4);
    background: rgba(60, 60, 60, 0.6);
    color: rgb(220, 220, 220);
    cursor: pointer;
    transition: background 0.2s;
}

.help-footer button:hover {
    background: rgba(90, 90, 90, 0.8);
    color: white;
}
</style>

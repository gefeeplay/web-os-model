<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
    modelValue: Boolean,   // управление открытием/закрытием
    currentMemory: Number  // текущее значение памяти
});

const emit = defineEmits(["update:modelValue", "changeMemory"]);

const newMemory = ref(props.currentMemory);

//Для проверки входимости в диапазон
const minMemory = 500
const maxMemory = 5000
const memoryClass = computed(() => checkRange(newMemory.value, minMemory, maxMemory) ? '' : 'out-of-range')
function checkRange(value, min, max) {
  return value >= min && value <= max
}

// Обновлять input при открытии диалога
watch(
    () => props.modelValue,
    (v) => {
        if (v) newMemory.value = props.currentMemory;
    }
);

function apply() {
    if (!checkRange(newMemory.value, minMemory, maxMemory)){
        alert('Проверьте введённые значения — они должны быть в диапазонах!')
        return 
    }
    emit("changeMemory", newMemory.value);
    emit("update:modelValue", false);
    
}

function close() {
    emit("update:modelValue", false);
}


</script>

<template>
    <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-window">
            <h3>Изменить размер памяти ОС</h3>

            <input type="number" min="1" class="param-input" v-model.number="newMemory" :class="memoryClass"/>

            <div class="modal-actions">
                <button class="ok-btn" @click="apply">Сохранить</button>
                <button class="cancel-btn" @click="close">Отмена</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.modal-window {
    background: rgba(23, 23, 23);
    color: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

h3 {
    text-align: center;
}

.param-input {
  display: flex;
  justify-self: end;
  margin: 10px 0px;  
  padding: 8px 4px;
  border-radius: 10px;
  border: 1px solid rgba(97, 97, 97, 0.3);
  background: rgba(60, 60, 60, 0.6);
  color: white;
  font-family: "Comfortaa", "Open Sans", sans-serif;
  font-weight: bold;
  width: 8rem;
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

.modal-actions {
    display: flex;
    justify-content: space-between;
}

.ok-btn {
    background: #327535;
    color: white;
    font-family: "Comfortaa", "Open Sans", sans-serif;
    padding: 8px 14px;
    border-radius: 6px;
}

.cancel-btn {
    background: #ad3830;
    color: white;
    font-family: "Comfortaa", "Open Sans", sans-serif;
    padding: 8px 14px;
    border-radius: 6px;
}

.cancel-btn:hover {
    cursor: pointer;  
    background-color: #ad4f48;
}

.ok-btn:hover{
    cursor: pointer;
    background-color: #48754a;
}
</style>
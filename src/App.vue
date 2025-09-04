<script setup>
  import { ref } from 'vue'
  const osSpeed = ref(100)
  const osMemory = ref(1000)
  const osCost = ref(2)
</script>

<template>
  <div class="start-panel">
    <h2>Модель ОС</h2>
    <h3>Параметры:</h3>
    <div class="params">
      <div class="param">
        Скорость
        <input v-model="osSpeed" type="number" placeholder="100"/>
      </div>
      <div class="param">
        Память
        <input v-model="osMemory" type="number" placeholder="1000"/>
      </div> 
      <div class="param">
        Затраты ОС
        <input v-model="osCost" type="number" placeholder="2"/>
      </div>  
    </div>
    <div class="start-btn">
      Запустить ОС
    </div>
  </div>
</template>

<style scoped>

.start-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  border: 1px solid black;
  width: 400px;
  padding: 20px;
  height: 20rem;
}

.params {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.param {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 10px;
  border: 1px solid black;
  border-radius: 5px;
}

.start-btn {
  margin-top: 1.5rem;
  border: 1px solid black;
  border-radius: 5px;
  padding: 15px;
  cursor: pointer;
}


</style>

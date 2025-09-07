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
    <div class="start-btn" @click="startOS">
      Запустить ОС
    </div>
  </div>
</template>

<style scoped>
</style>

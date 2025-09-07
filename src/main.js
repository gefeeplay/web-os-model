import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './style.css'
import App from './App.vue'
import StartView from './components/StartView.vue'
import OsView from './components/OsView.vue'

const app = createApp(App)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'Start',
      path: '/',
      component: StartView
    },
    {
      name: 'OS',
      path: '/os',
      component: OsView
    }
  ]
})

app.use(router)
app.mount('#app')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import './assets/animations.css'
import { aplicarAnimaciones } from './utils/preferencias'

// UI-05: si el alumno apagó las animaciones (Ajustes, UI-08), se marca <html data-animaciones="off">
aplicarAnimaciones()

createApp(App).use(router).mount('#app')

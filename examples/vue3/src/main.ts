import { createApp } from 'vue'
import './style.css'
import { createTemplatePlugin } from 'vue-use-template'
import App from './App.vue'

const app = createApp(App)
app.use(createTemplatePlugin())
app.mount('#app')

import { createApp } from 'vue'
import './assets/style/base.scss'
import App from './App.vue'
import axios from 'axios'
import router from './router'

axios.defaults.baseURL = 'http://localhost:8000/api/'


createApp(App).use(router).mount('#app')

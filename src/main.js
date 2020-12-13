import { createApp } from 'vue'
import App from './App.vue'
import basecard from './components/basecard.vue'

const app = createApp(App);

app.component('base-card', basecard);
app.mount('#app')

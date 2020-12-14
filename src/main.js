import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue'
import basecard from './components/basecard.vue'
import samples from './components/samples.vue';
import summary from './components/summary.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '', component: samples }, 
        { path: '/', component: samples }, 
        { path: '/samples', component: samples }, 
        { path: '/summary', component: summary }, 
    ]
  });

const app = createApp(App);

app.component('base-card', basecard);
app.use(router);
app.mount('#app')

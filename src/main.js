import { createApp } from 'vue';
import App from './App.vue'

//common components
import basecard from './components/basecard.vue'

//router
import { createRouter, createWebHistory } from 'vue-router';
import samples from './components/samples.vue';
import summary from './components/summary.vue';

//store
import { createStore } from 'vuex';


const app = createApp(App);
app.component('base-card', basecard);


//router setup
const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '', component: samples }, 
        { path: '/', component: samples }, 
        { path: '/index.html', component: samples }, 
        { path: '/samples', component: samples }, 
        { path: '/summary', component: summary }, 
    ]
  });
app.use(router);

//vuex setup
const store = createStore({
  state() {
    return {
      adds: 0, 
      updates: 0, 
      deletes: 0,
      errors: 0
    };
  },
  mutations: {
    increment(state) {
      state.errors = state.errors + 1;
    },
    incrementByType(state, payload) {
      if(payload.type =='error'){
        state.errors = state.errors + 1;
      }else if(payload.type == 'adds'){
        state.adds = state.adds + 1;
      }else if(payload.type == 'updates'){
        state.updates = state.updates + 1;
      }else if(payload.type == 'deletes'){
        state.deletes = state.deletes + 1;
      }
    }
  },
  getters: {
    finalHappinessFactor(state) {
      var happiness =  (state.adds + state.updates + state.deletes) - state.errors;
      if (happiness == 0 || state.happiness > state.errors){
        return 'happy';
      }else{
        return 'thinking';
      }
    },
    finalAdds(state){
      return state.adds;
    },
    finalUpdates(state){
      return state.updates;
    },
    finalDeletes(state){
      return state.deletes;
    },
    finalErrors(state){
      return state.errors;
    }
  }
});
app.use(store);




app.mount('#app')

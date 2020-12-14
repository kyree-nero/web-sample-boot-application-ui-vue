<template>
  <banner :csrfToken="csrfToken"/>
  <main>
    <router-view @csrf-token-event="csrfTokenEvent"></router-view>
  </main>
  
</template>

<script>
import banner from './components/banner.vue'

export default {
  name: 'App',
  components: {
    banner,
  }, 
  data(){
    return {
      csrfToken: null
    }
  },
  methods: {
    csrfTokenEvent(csrfToken){
      console.log('in main ' + csrfToken);
      this.csrfToken = csrfToken;
    }

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>


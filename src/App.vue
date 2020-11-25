<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
  <banner :csrfToken="csrfToken"/>
  <samples msg="Welcome to Your Vue.js App" @csrf-token-event="csrfTokenEvent"/>
  
  
</template>

<script>
import banner from './components/banner.vue'
import samples from './components/samples.vue'

export default {
  name: 'App',
  components: {
    banner,
    samples
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


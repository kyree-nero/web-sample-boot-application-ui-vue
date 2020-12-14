<template>
    <div align="right">
        <form id="logoutFormId" action="logout" method="POST">
            <input id="csrfId" name="_csrf" type="hidden" :value="csrfToken" />
            <button onclick="javascript:submit()">sign off</button>
        </form>		
    </div>
    
      <nav >
      <div class="w3-bar w3-black">
        <span class="w3-bar-item w3-button">
            <router-link to="/samples">samples</router-link>
        </span>
        <span class="w3-bar-item w3-button">
          <router-link to="/summary">summary</router-link>
        </span>
      </div>
      </nav>

</template>
<script>
export default {
  name: 'banner',
  props: ['csrfToken'],
  data(){
    return {
      
    }
  }, 
  
}
</script>

<style scoped>
  @import "https://www.w3schools.com/w3css/4/w3.css";
nav {
  
  
}

div {
 
}

span {
  
}


</style>
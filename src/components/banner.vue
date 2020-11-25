<template>
    <div align="right">
        <form id="logoutFormId" action="logout" method="POST">
            <input id="csrfId" name="_csrf" type="hidden" :value="csrfToken" />
            <button onclick="javascript:submit()">sign off</button>
        </form>		
    </div>
</template>
<script>
export default {
  name: 'banner',
  props: ['csrfToken'],
  data(){
	return {
		
	}
  }
}
</script>
<template>
	<div align="left">
		<form @submit.prevent="submitForm">
			<p>contents:</p>
			<p v-if="loading">Loading</p>
			<p v-else-if="!loading && error"> {{ this.error }} </p>
			<p v-else-if="!loading && (!samples || samples.length === 0)"> There is no data </p>
			
			<div v-for="sample in samples" :key="sample.id" v-else align="left"> 	
			
				<ul 
					v-show="errors && getErrorsByTypeAndId('update', sample.id).length != 0"  
					:key="error.id" 
					v-for="error in getErrorsByTypeAndId('update', sample.id)"><li>{{error.message}}</li></ul>
			
				<button type="button" id="delete{{ sample.id }}" 
						@click="editing = null; remove(sample.id)">Delete</button>
				<button type="button" id="edit{{ sample.id }}" 
						@click="openForEdit(sample.id)" 
						v-show="editing === null" >Edit</button>
				<button type="button" id="save{{ sample.id }}" 	
						@click="update(sample)" 
						v-show="editing != null && editing == sample.id">Save</button>
				<button type="button" id="cancel{{ sample.id }}" 
						@click="editing = null; cancelEdit(sample.id)" 
						v-show="editing != null && editing == sample.id">Cancel</button>
				<span v-show="editing !=  sample.id">{{ sample.content }}</span> 
				<input type="text" id="update{{ sample.id }}" 
					v-model="sample.content" 
					v-show="editing ==  sample.id"
					:disabled="editing != sample.id"/>
				
			</div>
			<ul v-show="errors && getErrorsByType('add').length != 0"  :key="addError.id" v-for="addError in getErrorsByType('add')"><li>{{addError.message}}</li></ul>
			<button type="button" id="add" @click="add()" align="left">Add</button>
			<input type="text" id="addContent" v-model="newSampleContent" align="left" />
			
		</form>
	</div>
</template>

<script>
export default {
  name: 'samples',
  props: {
    msg: String
  }, 
  data(){
	return {
		editing: null, 
		oldValue: null,
		newSampleContent: null,
		samples: [],
		csrfToken: null,
		csrfTokenHeaderName: 'x-csrf-token', 
		loading: false, 
		error: null, 
		errors: [], 
	}
  },
  methods: {
	
	//errors
	clearErrorsByType(type){
		var errors = this.errors.filter(
			function(elem){
				if(elem.type != type){ 
					return elem;
				}
			}
		);
		this.errors = errors;
	},
	getErrorsByType(type){
		var errors = this.errors.filter(
			function(elem){
				if(elem.type == type){ 
					return elem;
				}
			}
		);
		return errors;
	},
	getErrorsByTypeAndId(type, id){
		var errors = this.errors.filter(
			function(elem){
				if(elem.type == type && elem.affectedId && elem.affectedId == id){ 
					return elem;
				}
			}
		);
		return errors;
	},

	//external load handlers
	handleOkResponseWithReload(response){
		setTimeout(() => { console.log("timer done"); }, 2000);
		this.loadSamples();
		return response.json();
	},
	handleBadUpdateRequest(data){
		for (const dataerror in data.errors) {
			
			
			var error = {
				message: data.errors[dataerror].defaultMessage,
				type: 'update',
				field: data.errors[dataerror].field, 
				affectedId: this.editing
			};
			console.log('---');
			console.log(error);
			this.errors.push(error);
		} 
		
	},
	handleBadAddRequest(data){
		for (const dataerror in data.errors) {
			
			
			var error = {
				message: data.errors[dataerror].defaultMessage,
				type: 'add',
				field: data.errors[dataerror].field
			};
			console.log('---');
			console.log(error);
			this.errors.push(error);
		} 
	},
	handleResponse(response, type){
			console.log(type);
			if (response.ok && type == 'add') {
				this.handleOkResponseWithReload(response);
			}
			else if (response.ok && type == 'update') {
				this.editing = null;
				this.handleOkResponseWithReload(response);
			}
			else if(response.status == 400 && type == 'add'){
				response.json().then(this.handleBadAddRequest);
			}
			else if(response.status == 400 && type == 'update'){
				
				response.json().then(this.handleBadUpdateRequest);
			}
			else{
				throw new Error("server side error, please retry")
			}
	},
	handleErrorResponse(error){
		this.error = 'There was an error processing the request, please reload the page and try again';
		console.log(error);
	},

	
	//buttons
	openForEdit(sampleId){
		this.editing = sampleId;
		var valObj = this.samples.filter(
			function(elem){
				if(elem.id == sampleId){ 
					return elem;
				}
			}
		);
		
		if(valObj.length > 0){
			this.oldValue = valObj[0].content;
		}
		
		return;
	},
	cancelEdit(sampleId){
		this.clearErrorsByType('update');
		var valObj = this.samples.filter(
			function(elem){
				if(elem.id == sampleId){ 
					return elem;
				}
			}
		);
		
		if(valObj.length > 0){
			valObj[0].content = this.oldValue;
		}
		return;
	},
	add(){
		this.error = null;
		
		this.clearErrorsByType('add');
		
		
		fetch('/sample', 
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': this.csrfToken
				},
				body: JSON.stringify({
					content: this.newSampleContent
				}),
			}
		)
		.then((response) => {
            this.handleResponse(response, 'add');
        })
        .catch((error)=>{
			this.handleErrorResponse(error)
        });
        
		//this.samples.push(newObj)
		this.newSampleContent = null;
		return;
	}, 
	update(sample){
		
		
		this.error = null;
		this.clearErrorsByType('update');
		fetch('/sample/'+sample.id, 
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': this.csrfToken
				},
				body: JSON.stringify(sample),
			}
		)
		.then((response) => {
            this.handleResponse(response, 'update');
        })
        .catch((error)=>{
			this.handleErrorResponse(error)
        });
        
	},
	remove(sampleId){
		this.error = null;
		console.log('remove item');
		
		fetch('/sample/'+sampleId, 
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRF-TOKEN': this.csrfToken
				}
			}
		)
		.then((response) => {
            if (response.ok) {
				setTimeout(() => { console.log("timer done"); }, 2000);
				this.loadSamples();
				return response;
			}else{
				throw new Error("server side error, please retry")
			}
        })
        .catch((error)=>{
			this.handleErrorResponse(error)
        });
		//this.samples = newSamples;
		return;
	},
	submitForm() {
		console.log('submit form');
	}, 
	
	loadSamples() {
		this.error = null;
		
		
		
      fetch('/sample')
		
        .then((response) => {
            if (response.ok) {
				for (var pair of response.headers.entries()) {
					//console.log(pair[0]+ ': '+ pair[1]);
					if(pair[0] === this.csrfTokenHeaderName){
						this.csrfToken = pair[1];
						this.$emit("csrf-token-event", this.csrfToken);
					}
				}
				return response.json();
			}else{
				throw new Error("server side error, please retry")
			}
        })
        .then((data) => {
          const results = [];
          for (const id in data) {
			results.push({
              id: data[id].id,
              content: data[id].content,
              version: data[id].version,
            });
          }
          this.samples = results;
        })
        .catch((error)=>{
			this.handleErrorResponse(error)
        });
    },	
    
  },
  mounted(){
		console.log('start form');
		this.loadSamples();
  },
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

p {
  font-size: 1.25rem;
  font-weight: bold;
  border: 1px solid #4fc08d;
  background-color: #4fc08d;
  color: white;
  padding: 0.5rem;
  border-radius: 25px;
}

#input {
  font: inherit;
  border: 1px solid #ccc;
}

#input:focus {
  outline: none;
  border-color: #1b995e;
  background-color: #d7fdeb;
}

#button {
  font: inherit;
  cursor: pointer;
  border: 1px solid #ff0077;
  background-color: #ff0077;
  color: white;
  padding: 0.05rem 1rem;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.26);
}

button:hover,
button:active {
  background-color: #ec3169;
  border-color: #ec3169;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.26);
}
</style>
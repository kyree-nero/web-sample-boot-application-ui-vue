<template>
	<div align="center">
		<form @submit.prevent="submitForm">
			<p>samples:</p>
			<p v-if="loading">Loading</p>
			<p v-else-if="!loading && error"> {{ this.error }} </p>
			<p v-else-if="!loading && (!samples || samples.length === 0)"> There is no data </p>
			
			<div v-for="sample in samples" :key="sample.id" v-else align="left"> 	
				
				<existingSample 
					:csrfToken="csrfToken"
					:sample="sample" 
					:errors="errors"
					:editing="editing"
					@update-editing-event="updateEditingEvent"
					@clear-errors-by-type-event="clearErrorsByTypeEvent"
					@handle-error-response-event="handleErrorResponseEvent"
					@handle-response-event="handleResponseEvent"
					@update-sample-content-event="updateSampleContentEvent"
					@load-samples-event="loadSamplesEvent"
				/>
				
			</div>
			<newSample 
				:csrfToken="csrfToken"
				:errors="errors"
				@clear-errors-by-type-event="clearErrorsByTypeEvent"
				@handle-error-response-event="handleErrorResponseEvent"
				@handle-response-event="handleResponseEvent"
			/>
		</form>
	</div>
</template>

<script>
import existingSample from './existingsample.vue'
import newSample from './newsample.vue'

export default {
  name: 'samples',
  components: {
	newSample,
    existingSample
  }, 
  props: {
    msg: String
  }, 
  data(){
	return {
		editing: null, 
		samples: [],
		csrfToken: null,
		csrfTokenHeaderName: 'x-csrf-token', 
		loading: false, 
		errors: [], 
	}
  },
  methods: {
	//event handlers
	updateSampleContentEvent(id, newContent){
		this.samples.filter(
			function(elem){
				
				if(elem.id == id){ 
					console.log(".yyyy " + elem.id);
					console.log(".yyyy " + elem.content);
					elem.content = newContent;
					return elem;
				}
			}
		);
		
	},
	updateEditingEvent(editing){
		this.editing = editing;
	},
	clearErrorsByTypeEvent(type){
		this.clearErrorsByType(type);
	},
	handleErrorResponseEvent(error){
		this.handleErrorResponse(error);
	},
	handleResponseEvent(response, type){
		this.handleResponse(response, type);
	},
	loadSamplesEvent(){
		console.log('trigger load');
		this.loadSamples();
	},
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
			
			this.errors.push(error);
		} 
	},
	handleResponse(response, type){
			console.log(type);
			if (response.ok && type == 'add') {

				this.handleOkResponseWithReload(response);
				this.$store.commit('incrementByType', {type: 'adds'});
			}
			else if (response.ok && type == 'update') {
				this.editing = null;
				this.handleOkResponseWithReload(response);
				this.$store.commit('incrementByType', {type: 'updates'});
			}
			else if(response.status == 400 && type == 'add'){
				response.json().then(this.handleBadAddRequest);
				this.$store.commit('increment');
			}
			else if(response.status == 400 && type == 'update'){
				response.json().then(this.handleBadUpdateRequest);
				this.$store.commit('increment');
			}
			else{
				this.$store.commit('increment');
				throw new Error("server side error, please retry")
			}
	},
	handleErrorResponse(error){
		this.error = 'There was an error processing the request, please reload the page and try again';
		console.log(error);
	},

	
	//buttons
	
	update(sample){
		
		console.log("sample before update " + sample)
		this.error = null;
		//this.clearErrorsByType('update');
		this.$emit("clear-errors-by-type-event", 'update');
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
			//this.handleResponse(response, 'update');
			this.$emit("handle-response-event", response, 'update');
		})
		.catch((error)=>{
			//this.handleErrorResponse(error)
			this.$emit("handle-error-response-event", error);
			
		});
		
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

  max-width: 40rem;
  text-align: left;
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

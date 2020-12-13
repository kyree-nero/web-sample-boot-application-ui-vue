<template>
    <span>
        <ul 
			v-show="errors && getErrorsByTypeAndId('update', sample.id).length != 0"  
			:key="error.id" 
			v-for="error in getErrorsByTypeAndId('update', sample.id)">
			<li>{{error.message}}</li>
		</ul>
        <button type="button" id="delete{{ sample.id }}" 
						@click="remove(sample.id)">Delete</button>
        <button type="button" id="edit{{ sample.id }}" 
						@click="openForEdit(sample)" 
						v-show="editing === null" >Edit</button>
        <button type="button" id="save{{ sample.id }}" 	
						@click="update(sample)" 
						v-show="editing != null && editing == sample.id">Save</button>
        <button type="button" id="cancel{{ sample.id }}" 
                        @click="cancelEdit(sample)" 
                        v-show="editing != null && editing == sample.id">Cancel</button>
        <span v-show="editing !=  sample.id">{{ sample.content }}</span> 
        <input type="text" id="update{{ sample.id }}" 
                        :value="sample.content" 
                        @input="updateSampleContent"
                        v-show="editing ==  sample.id"
                        :disabled="editing != sample.id"/>
    </span>
</template>
<script>
    export default {
        props: [
            'sample', 
            'errors', 
            'editing', 
            'csrfToken'
        ], 
        emits: [
            'update-editing-event', 
            'clear-errors-by-type-event', 
            'handle-error-response-event',
            'handle-response-event', 
            'update-sample-content-event',
            'load-samples-event'
        ],
        data(){
            return {
                oldValue: null,
            }
        },
        computed: {
            localSample: function () {
                return this.sample;
            } 
        },
        methods: {
            updateSampleContent(event){
                console.log(event);
                console.log("updateSampleContent");
                console.log(event.target.value);
                console.log(this.sample);
                console.log(this.localSample)
                this.$emit("update-sample-content-event", this.localSample.id, event.target.value);
                //this.sample.content = event.target.value;
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
            openForEdit(sample){
                this.$emit("update-editing-event", sample.id);
                
                
                
                    this.oldValue = sample.content;
               
                
                return;
            },
            cancelEdit(sample){
                this.$emit("update-editing-event", null);
                this.$emit("clear-errors-by-type-event", 'update');
                //this.clearErrorsByType('update');
                
               
                    sample.content = this.oldValue;
                
                return;
            },
            update(sample){
		
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
            remove(sampleId){
                this.$emit("update-editing-event", null);
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
                        this.$emit("load-samples-event");
                        console.log("emit...");
                        //this.loadSamples();
                        return response;
                    }else{
                        throw new Error("server side error, please retry")
                    }
                })
                .catch((error)=>{
                     this.$emit("handle-error-response-event", error);
                });
                //this.samples = newSamples;
                return;
            },
            
    
        }
    }
</script>
<template>
    <base-card>
        <span>
            <ul 
                v-show="errors && getErrorsByType('add').length != 0"  
                :key="addError.id" v-for="addError in getErrorsByType('add')">
                <li>{{addError.message}}</li>
            </ul>
			<button type="button" id="add" @click="add()" align="left">Add</button>
			<input type="text" id="addContent" v-model="newSampleContent" align="left" />
        </span>
    </base-card>
</template>

<script>
    export default {
        props: [
            'errors', 
            'csrfToken'
        ], 
    
        emits: [
                'clear-errors-by-type-event', 
                'handle-error-response-event',
                'handle-response-event', 
            ],
        data(){
            return {
                newSampleContent: null,
                error: null, 
            }
        },
        methods: {
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
            add(){
                this.error = null;
                
                //this.clearErrorsByType('add');
                this.$emit("clear-errors-by-type-event", 'add');
                
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
                    //this.handleResponse(response, 'add');
                    this.$emit("handle-response-event", response, 'add');
                })
                .catch((error)=>{
                    //this.handleErrorResponse(error)
                    this.$emit("handle-error-response-event", error);
                        
                });
                
                //this.samples.push(newObj)
                this.newSampleContent = null;
                return;
            }, 
        }
    }
</script>
<template>
    <span @dblclick="editor=true">
        <Input v-if="editor" :value="name" @on-blur="rename" @on-enter="rename"/>
        <span v-else>{{ name }}</span>
    </span>
</template>

<script>
export default {
    data(){
        return{
            editor: false
        }
    },
    props:["name"],
    methods:{
        rename(e){
            let newname = e.srcElement.value;
            if(newname != this.name)
                this.$emit("rename", newname);
            this.editor = false;
        }
    }
}
</script>
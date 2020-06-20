<template>
    <div style="height:500px;">
    </div>
</template>

<script>
import * as monaco from "monaco-editor";
import { debounce } from "lodash";

function monacoInit(element, sourceCode) {
    return monaco.editor.create(element, {
        value: sourceCode,
        language: "Solidity",

        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: true,
        readOnly: false,
        theme: "vs-dark"
    });
}

export default {
    name: "Editor",
    data() {
        return {
            editor: null,
            needSave: false,
        };
    },
    props: {
        content: String,
    },
    mounted() {
        console.log("editor init");
       this.editor = monacoInit(this.$el, this.content);
       const debounceChange = debounce(this.emitContentChange,1000,{ leading: false });
       this.editor.onDidChangeModelContent(()=>{
           this.needSave = true;
           debounceChange();
       });
    },
    destroyed(){
        this.emitContentChange();
    },
    methods: {
        emitContentChange(){
            if(this.needSave){
                this.$emit("content-change", this.editor.getValue());
                this.needSave = false;
            }
        }
    }
};
</script>

<style>
.font-light {
  color: azure;
}
</style>>
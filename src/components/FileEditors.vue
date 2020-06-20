<template>
    <Tabs type="card" :animated="false" closable class="nomargin" v-model="activeTab" @on-tab-remove="closeTab">
        <TabPane v-for="id in opendTab" :name="String(id)" :key="id" :label="files[id].name" :index="id">
            <Editor v-once :content="files[id].content" @content-change="content=>$emit('content-change', id, content)"/>
        </TabPane>
    </Tabs>
</template>
<script>
import Editor from "./Editor";
export default {
    data() {
        let opendTab = {};
        this.files.map(file=>{
            if (file.id==this.activeFile) opendTab[file.id]=file.id;
        })
        return {
            opendTab,
        };
    },
    model: {
        prop: "activeFile",
        event: "change"
    },
    props: ["files", "activeFile"],
    components: { Editor },
    computed:{
        activeTab:{
            get(){
                return this.activeFile;
            },
            set(v){
                this.$emit("change", v);
            }
        }
    },
    watch:{
        activeFile(){
            if(this.activeFile >= 0)
                this.$set(this.opendTab, this.activeFile, Number(this.activeFile));
        }
    },
    methods:{
        closeTab(id){
            this.$delete(this.opendTab, id);
        }
    }
};
</script>

<style>
.nomargin .ivu-tabs-bar {
    margin: 0;
}
</style>
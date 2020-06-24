<template>
    <Layout class='font-light'>
        <Header>
            <h1>{{ msg }}</h1>
        </Header>
        <Layout>
            <Sider hide-trigger :width="250">
              <FileTree :files="files" v-model="activeFile" @new-file="newfile" @rename="rename"/>
              <CompilerCard :files="files" :activeFile="activeFile" @compiled="compilerOutput"/>
            </Sider>
            <Content>
                <FileEditors :files="files" v-model="activeFile" @content-change="fileChange"/>
            </Content>
        </Layout>
        <Footer></Footer>
    </Layout>
</template>

<script>
import FileTree from "./FileTree"
import FileEditors from "./FileEditors"
import CompilerCard from "./CompilerCard"
import sfs from '../js/sfs.js'
//const ResolverEngine = require('solc-resolver').resolverEngine;
const sourceCode = `
pragma solidity >0.4.99 <0.6.0;

contract NewContract {
  function f(uint8 a) public returns (bool) {
    return a>0;
  }
}
contract Hello {
  uint256 x;
  constructor(uint256 a)public {x=a;}
  function f(uint8 a) public returns (bool) {
    return a<10;
  }
}`;

function fileObj(id, name) {
    return {
            id,
            name,
            get content(){return sfs.getFile(this.name)},
            set content(n){ sfs.saveFile(this.name, n)},
        };
}

function filesInit(files){
    if(!sfs.hasFS()){
        files.map(file=>{
            sfs.newFile(file.name);
            sfs.saveFile(file.name, file.content);
        });
    }
    let dirs = sfs.getDirs();
    let retFiles = [];
    for(let id = 0; id < dirs.length; id++){
        const name = dirs[id];
        retFiles.push(fileObj(id, name));
    }
    return retFiles;
}
function fileNew(files, name) {
    sfs.newFile(name);
    const file = fileObj(files.length, name);
    files.push(file);
    return file;
}
let files = filesInit([
    {
        id: 0,
        name:"example.sol",
        get content(){return sourceCode;}
    }
]);

export default {
    name: "HelloWorld",
    data() {
        return {
            activeFile:0,
            files
        };
    },
    components:{FileTree,FileEditors,CompilerCard},
    props: {
        msg: String
    },
    methods: {
        fileChange(id, content){
            const file = this.files[id];
            file.content = content;
            //this.files[id].content = content;
            //this.$set(this.files, id, file);
            console.log("file changed");
        },
        fileByName(name) {
            for(let i in this.files){
                const file = this.files[i];
                if(file.name == name)
                    return file;
            }
            return null;
        },
        rename(id, newname){
            let file = this.files[id];
            console.log("rename:",file.name,newname);
            sfs.moveFile(file.name, newname);
            file.name = newname;
            this.$set(this.files, id, file);
        },
        newfile(prefix, name){
            let fullname = '';
            if(name) fullname = prefix + name;
            else fullname = prefix + `new${this.files.length}.sol`;
            return fileNew(this.files, fullname); 
        },
        newFileWithContent(prefix, name, content){
            const file = this.newfile(prefix, name);
            this.fileChange(file.id, content);
        },
        compilerOutput(file, outputs){
            let outfile;
            try{
                outfile = this.newfile('build/', `${file.name}.json`);
            }catch{
                outfile = this.fileByName(`build/${file.name}.json`);
            }finally{
                this.fileChange(outfile.id, outputs);
            }
        }
    },
    watch:{
        activeFile(){
            console.log(this.activeFile, this.activeFile>=0?this.files[this.activeFile].name:this.activeFile);
        }
    }
};
</script>

<style scoped>
.font-light {
    color: azure;
}
</style>
<template>
    <div>
        <h1>{{ msg }}</h1>
        <button @click="ok">hello</button>
        <div id="container" style="height:500px;"></div>
    </div>
</template>

<script>
//import "browser-solc"
import * as monaco from 'monaco-editor'
const solcjs = require("solc-js");
//const ResolverEngine = require('solc-resolver').resolverEngine;
const sourceCode = `
pragma solidity >0.4.99 <0.6.0;

library OldLibrary {
  function someFunction(uint8 a) public returns(bool);
}

contract NewContract {
  function f(uint8 a) public returns (bool) {
      return OldLibrary.someFunction(a);
  }
}`;

let editor;
function monacoInit(){
  window.monaco = monaco;
    editor = monaco.editor.create(document.getElementById("container"), {
    value: sourceCode,
    language: "Solidity",

    lineNumbers: "on",
    roundedSelection: false,
    scrollBeyondLastLine: true,
    readOnly: false,
    theme: "vs-dark",
  });
  window.editor = editor;
}
let compiler;
export default {
    name: "HelloWorld",
    data(){
      console.log("data");
      return {};
    },
    props: {
        msg: String
    },
    async mounted(){
      const version = "v0.5.1-stable-2018.12.03";
      compiler = await solcjs(version);
      monacoInit();
    },
    methods: {
        async ok() {

            //console.log(solcjs);
            //console.log(ResolverEngine);

            // or

            // const compiler = await solcjs()

            const output = await compiler(editor.getValue(), e=>e?"":"");

            //var wrapper = require('solc-wrapper');
            //var solc = wrapper(window.Module);
            //console.log(wrapper);
            console.log(output);
        }
    }
};
</script>


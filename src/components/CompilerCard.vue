<template>
    <div>
        <Divider orientation="left" class="font-light">Compiler</Divider>
        <Card>
            <Select
                v-model="solcVersion"
                prefix="ios-pulse"
                style="width:16em"
                :disabled="downloading"
            >
                <Option v-for="solcv in solcValid" :value="solcv" :key="solcv">{{ solcv }}</Option>
            </Select>
            <p></p>
            <Button
                type="primary"
                long
                @click="compile"
                :loading="downloading"
            >Compile {{ activeFile >= 0 ? files[activeFile].name : "[no file]" }}</Button>
            <Select v-model="selectOutput">
                <Option v-for="(item,index) in outputList" :value="index" :key="index">{{ item.contract + ' - ' + item.file }}</Option>
            </Select>
            <Deploy :contractInfo="outputList.length?outputs.contracts[outputList[selectOutput].file][outputList[selectOutput].contract]:undefined" />
        </Card>
    </div>
</template>

<script>
import Deploy from "./Deploy";
import solc from "../js/solc";

export default {
    data() {
        return {
            compiler: null,
            downloading: false,
            versions: null,
            solcVersion: "0.5.17+commit.d19bba13",
            outputs: null,
            selectOutput: 0
        };
    },
    components: { Deploy },
    props: ["activeFile", "files"],
    async mounted() {
        console.log("mounted");
        this.versions = [];
    },
    computed: {
        outputList(){
            if(!this.outputs) return [];
            let outputs = [];
            for(let file in this.outputs.contracts){
                for(let contract in this.outputs.contracts[file])
                    outputs.push({file, contract});
            }
            return outputs;
        },
        solcValid() {
            const soljsonReleases = window.soljsonReleases;
            let verList = [];
            for (let ver in soljsonReleases) {
                if (ver.startsWith("0.5.") || ver.startsWith("0.6."))
                    verList.push(soljsonReleases[ver].slice(9, -3));
            }
            return verList;
        }
    },
    methods: {
        compilerIntput(file) {
            let sources = {};
            sources[file.name] = { content: file.content };
            return {
                language: "Solidity",
                sources,
                settings: {
                    outputSelection: {
                        "*": {
                            "*": ["*"]
                        }
                    }
                }
            };
        },
        async deploy() {},
        async compile() {
            this.downloading = true;
            if (
                !this.compiler ||
                !this.compiler.version().startsWith(this.solcVersion)
            ) {
                try {
                    window.solc = this.compiler = await solc.compiler(
                        this.solcVersion
                    );
                } catch (e) {
                    console.log("err:", e);
                    // ...
                }
            }
            if (this.compiler.version().startsWith(this.solcVersion)) {
                this.outputs = [];
                try {
                    const compileFile = this.files[this.activeFile];
                    const input = this.compilerIntput(compileFile);
                    const outputs = await this.compiler.compile(
                        JSON.stringify(input),
                        {
                            import: find => {
                                console.log("find:", find);
                                for (let id in this.files) {
                                    let file = this.files[id];
                                    console.log("do find:", file.name, find);
                                    if (file.name == find){
                                        console.log("found!");
                                        return { contents: file.content };
                                    }
                                }
                                //console.log("not find:", find);
                                return { error: "File not found" };
                            }
                        }
                    );
                    this.outputs = JSON.parse(outputs);
                    this.$emit("compiled", compileFile, outputs);
                    window.outputs = this.outputs;
                } catch (e) {
                    this.outputs = e;
                    console.log("compile error:", e);
                }
                console.log("outputs", this.outputs);
            }
            this.downloading = false;
        }
    }
};
</script>

<style>
.font-light .ivu-divider-inner-text {
    color: azure;
}
</style>
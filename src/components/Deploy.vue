<template>
    <div>
        <Form ref="formCustom" :label-width="15">
            <FormItem
                v-for="(abiItem,index) in contractDeployABI"
                :label="abiItem.name"
                :key="index"
            >
                <Input v-model="arguements[index]" :placeholder="abiItem.type" />
            </FormItem>
            <Button
                type="primary"
                long
                @click="deploy"
                :disabled="!contractInfo"
                :loading="loading"
            >deploy {{ contractInfo ? contractInfo.name : "[NONE]" }}</Button>
        </Form>
        <p v-for="(c,index) in contracts" :key="index" style="color:black">{{ c.contract.address }}</p>
    </div>
</template>

<script>
import hmy from "../js/hmy.js";
export default {
    data() {
        return {
            arguements: [],
            loading: false,
            contracts: [],
        };
    },
    props: ["contractInfo"],
    watch:{
        contractInfo(){
            this.arguements = [];
        }
    },
    computed: {
        contractDeployABI() {
            if (this.contractImpl)
                return this.contractImpl.abiModel.abi.methods
                    .contractConstructor.inputs;
            return [];
        },
        contractImpl() {
            if (this.contractInfo) {
                //await hmy.login();
                let abi = this.contractInfo.abi;
                //let code = this.contractInfo.binary.bytecodes.bytecode;
                return hmy.contract(abi);
            }
            return null;
        }
    },
    methods: {
        async deploy() {
            this.loading = true;
            try {
                let acc = await hmy.login();
                console.log(acc, this.arguements);
                let abi = this.contractInfo.abi;
                let code = this.contractInfo.evm.bytecode.object;
                let c = hmy.contractDeploy(abi, '0x'+code, this.arguements);
                window.tx = c;
                await c.send();
                this.contracts.push(c);
            } catch(e) {
                console.log("err", e);
            }
            this.loading = false;
        }
    }
};
</script>
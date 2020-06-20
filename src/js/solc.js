import axios from "axios"
if (!process.version) process.version = ""; // must set version before import 'solc/wrapper'! It's very importand!
const wrapper = require('solc/wrapper');
window.wrapper = wrapper;

// "https://solc-bin.ethereum.org/bin/soljson-v0.5.7+commit.6da8b019.js"
function fetchSolcBin(solcVerison) {
    return axios
        .get(`https://solc-bin.ethereum.org/bin/soljson-v${solcVerison}.js`)
        .then(rez => {
            return rez.data;
        })
}

function safeEval(solcSrcCode) {
    //window.srcCode = solcSrcCode;
    //window.Module = null;
    let execCode = solcSrcCode;
    if(execCode.startsWith('"use strict";'))
        execCode = execCode.slice(13);
    window.eval(execCode);
    return window.Module;
}

async function compiler(solcVersion) {
    console.log(solcVersion);
    const srcCode = await fetchSolcBin(solcVersion);
    const solcModule = safeEval(srcCode);
    return wrapper(solcModule);
}

export default {
    compiler
}
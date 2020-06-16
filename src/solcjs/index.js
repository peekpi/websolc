var solc = require('solc');

var input = {
    language: 'Solidity',
    sources: {
        'test.sol': {
            content: 'contract C { function f() public { } }'
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};

function compile(input) {
    return JSON.parse(solc.compile(JSON.stringify(input)));
}

function example() {
    let output = compile(input)
    // `output` here contains the JSON output as specified in the documentation
    for (var contractName in output.contracts['test.sol']) {
        console.log(
            contractName +
            ': ' +
            output.contracts['test.sol'][contractName].evm.bytecode.object
        );
    }
    return output;
}

export default {
    input,
    compile,
    example
}

const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  publicPath: isProduction
    ? '/websolc/dist/'
    : '/',
  productionSourceMap: isProduction
    ? false : true,
}
/*
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
module.exports = {
    configureWebpack: {
        plugins: [new MonacoWebpackPlugin(['Solidity'])]  
    },
}*/
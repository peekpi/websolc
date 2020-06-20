const isProduction = process.env.NODE_ENV === 'production';
module.exports = {
  publicPath: isProduction
    ? '/solc/dist/'
    : '/',
  productionSourceMap: isProduction
    ? false : true,
}
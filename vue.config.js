// Configure the webpack dev server behavior.
// module.exports = {
//  dev: {
//    proxy: {
//      '/sample': {
//        target: 'http://localhost:8080',
//        ws: true,
//        changeOrigin: true
//      }
//    }
//  }
//}
module.exports = {
  devServer: {
    proxy: 'http://localhost:8080'
  }
}
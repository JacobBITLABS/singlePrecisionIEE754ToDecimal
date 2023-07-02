const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

// module.exports = {
//   publicPath: process.env.NODE_ENV === 'production'
//   ? '/singlePrecisionIEE754ToDecimal/'
//   : '/'
// }


module.exports = {
  publicPath: '/singlePrecisionIEE754ToDecimal'
}


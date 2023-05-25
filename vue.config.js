const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './'
  // ,
  // module: {
  //   rules: [
  //     {
  //       test: /\.(glb|gltf|obj)$/,
  //       use: [
  //         {
  //           loader: 'file-loader',
  //           options: {
  //             name: '[name].[ext]',
  //             outputPath: 'models/',
  //             publicPath: 'models/'
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // }
  // pluginOptions: {
  //   'style-resources-loader': {
  //       preProcessor: 'scss',
  //       patterns: []
  //   }
  // }
})


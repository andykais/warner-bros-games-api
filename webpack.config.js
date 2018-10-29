const { resolve } = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: {
          loader: 'graphql-tag/loader'
        }
      }
    ]
  },
  plugins: [
    function() {
      this.plugin('afterEmit', () => console.clear())
    }
  ],
  externals: [nodeExternals()]
}

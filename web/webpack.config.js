/* @noflow */
const { resolve, } = require('path');
const webpack = require('webpack');

module.exports = {
  context: resolve(__dirname, 'src'),

  entry: [
    'react-hot-loader/patch',
    // activate HMR for React

    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates

    './index',
    // the entry point of our app
  ],
  output: {
    filename: 'bundle.js',
    // the output bundle

    path: resolve(__dirname, 'dist'),

    publicPath: '/',
    // necessary for HMR to know where to load the hot update chunks
  },

  devtool: 'source-map',

  devServer: {
    hot: true,
    // enable HMR on the server

    contentBase: resolve(__dirname, 'dist'),
    // match the output path

    publicPath: '/',
    // match the output `publicPath`
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['awesome-typescript-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: [
          /node_modules\/apollo-client/
        ]
      },
    ],
  },

  resolve: {
    mainFields: ['module', 'js:next', 'browser', 'main'],
    extensions: ['.ts', '.tsx', '.jsx', '.js'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // enable HMR globally

    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
  ],
};

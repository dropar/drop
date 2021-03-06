const webpack = require('webpack');

// let PLUGINS = [];
// if (process.env.NODE_ENV === 'production') {
//   PLUGINS.push(new webpack.optimize.UglifyJsPlugin());
// }

module.exports = {
  entry: [
    '@babel/polyfill', //enables async-await
    './node_modules/regenerator-runtime/runtime.js',
    './node_modules/axios',
    './src/index.js'
  ],
  output: {
    path: __dirname,
    filename: './public/build.js'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        // options: {
        //   presets: ['env']
        // }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  // plugins: PLUGINS,
  devServer: {
    disableHostCheck: true
  }
};

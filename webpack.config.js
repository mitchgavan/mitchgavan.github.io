const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './js/index.js',
  mode: process.env.NODE_ENV,
  devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, './webpack/'),
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          emitFile: false,
          name: '/images/[name].[ext]',
        },
      },
    ],
  },
};

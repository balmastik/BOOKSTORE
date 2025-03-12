const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  target: 'web',
  resolve: {
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      "http": require.resolve("stream-http"),
      "crypto": require.resolve("crypto-browserify"),
      "path": require.resolve("path-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "fs": false,
      "querystring": require.resolve("querystring-es3"),
      "util": require.resolve("util/"),
      "url": require.resolve("url/"),
      "assert": require.resolve("assert/"),
      "net": false,
      "async_hooks": false,
      "vm": require.resolve("vm-browserify"),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './public/customer.html',
      filename: 'customer.html',
      inject: 'body',
      chunks: ['index'],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/img', to: 'img' },
        { from: 'public/video', to: 'video' },
        { from: 'public/icon', to: 'icon' },
        { from: 'public/css', to: 'css' },
        { from: 'public/favicon.ico', to: 'favicon.ico' },
        { from: 'public/robots.txt', to: 'robots.txt' },
        { from: 'public/icon.png', to: 'icon.png' },
        { from: 'public/404.html', to: '404.html' },
        { from: 'public/site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});

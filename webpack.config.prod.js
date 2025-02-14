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
      template: './index.html',
      filename: 'index.html',
      inject: 'body',
    }),

    new HtmlWebpackPlugin({
      template: './client.html',
      filename: 'client.html',
      inject: 'body',
    }),

    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'video', to: 'video' },
        { from: 'icon', to: 'icon' },
        { from: 'css', to: 'css' },
        { from: 'icon.svg', to: 'icon.svg' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'icon.png', to: 'icon.png' },
        { from: '404.html', to: '404.html' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});

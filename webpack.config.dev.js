const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const fs = require('fs');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./dist'],
    proxy: {
      '/api': 'http://localhost:3000',
    },
    https: {
      key: fs.readFileSync(path.join(__dirname, 'localhost.key')),
      cert: fs.readFileSync(path.join(__dirname, 'localhost.crt')),
      ca: fs.readFileSync(path.join(__dirname, 'localhost.pem')),
    },
    port: 63342,
  },
});


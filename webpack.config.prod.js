const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  target: 'web',
  entry: {
    index: './src/pages/CataloguePage.tsx',
    customer: './src/pages/CustomerPage.tsx',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    splitChunks: common.optimization.splitChunks,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      filename: 'index.html',
      inject: 'body',
      chunks: ['index'],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/img', to: 'img' },
        { from: 'public/video', to: 'video' },
        { from: 'public/icon', to: 'icon' },
        { from: 'public/favicon.ico', to: 'favicon.ico' },
        { from: 'public/robots.txt', to: 'robots.txt' },
        { from: 'public/icon.png', to: 'icon.png' },
        { from: 'public/404.html', to: '404.html' },
        { from: 'public/site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});

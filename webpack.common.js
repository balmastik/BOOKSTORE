const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
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
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.mp4$/,
        type: 'asset/resource',
        generator: {
          filename: '[name].[ext]',
          outputPath: 'video/',
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img/',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
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
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  },
}

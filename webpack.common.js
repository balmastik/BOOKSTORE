const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'index.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.mp4$/,
        type: 'asset/resource',
        generator: {
          filename: 'video/casino-royale.mp4',
        },
      }
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};


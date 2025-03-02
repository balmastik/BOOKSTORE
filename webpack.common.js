const path = require('path');

module.exports = {
  entry: {
    index: './src/frontend/index.ts',
    globals: './src/frontend/globals.ts',
    book: './src/backend/storebook/book.ts',
    storeBook: './src/backend/storebook/storeBook.ts',
    storeBooksData: './src/backend/storebook/storeBooksData.ts',
    store: './src/backend/store/store.ts',
    customer: './src/backend/customer/customer.ts',
    customerData: './src/backend/customer/customerData.ts',
    emails: './src/backend/mail/emails.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
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
  optimization: {
    splitChunks: {
      chunks: 'all',
    }
  }
}


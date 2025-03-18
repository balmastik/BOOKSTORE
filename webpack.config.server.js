const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
  server: './server/server.ts',
  book: './server/storeBook/book.ts',
  storeBook: './server/storeBook/storeBook.ts',
  storeBooksData: './server/storeBook/storeBooksData.ts',
  store: './server/store/store.ts',
  customer: './server/customer/customer.ts',
  customerData: './server/customer/customerData.ts',
  emails: './server/mail/emails.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  externals: [
    nodeExternals(),
    {
      react: 'commonjs react',
      'react-dom': 'commonjs react-dom',
    }
  ],
  node: {
    __dirname: false,
    __filename: false,
  },
  stats: {
    errorDetails: true,
  },
};

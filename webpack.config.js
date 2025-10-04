const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: './server.js',
  target: 'node',
  externals: [nodeExternals({
    allowlist: ['pg-native']
  })],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  mode: 'production',
  node: {
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.js']
  }
};
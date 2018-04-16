var path = require('path');

module.exports = {
  entry: './src/gigapaxos_client.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'gpClient.js',
    library: 'gpClient'
  }
};
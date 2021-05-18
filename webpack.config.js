const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    mainEJS6: "./public/src/mainEJS6.js"
  },
  watch: true,
  output: {
    path: __dirname + "/public/dist/js",
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx']
  },
  devtool: 'source-map',
};
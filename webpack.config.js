module.exports = {
  entry: './src/js/index.js',
  output: {
    path: './app/js',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /src\/.+.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}

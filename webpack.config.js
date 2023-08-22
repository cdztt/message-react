/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = (env) => ({
  mode: env.production ? 'production' : 'development',
  devtool: env.production ? false : 'inline-source-map',
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'umd',
    },
    globalObject: 'this',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          // transpileOnly: env.production ? true : false,
          configFile: '../tsconfig.json',
          onlyCompileBundledFiles: true,
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
});

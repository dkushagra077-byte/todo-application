const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env
const env = dotenv.config({ path: path.resolve(__dirname, '.env') }).parsed || {};

// Format env variables for DefinePlugin (prefix with REACT_APP_)
const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {
  'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL || env.REACT_APP_API_URL || 'http://localhost:5000/api')
});

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    publicPath: '/',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      title: 'Full-Stack Todo Application'
    }),
    new webpack.DefinePlugin(envKeys)
  ],
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    open: false,
    client: {
      overlay: true
    }
  }
};

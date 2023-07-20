const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const Dotenv = require('dotenv-webpack');
require('dotenv').config({path: __dirname + '/.env'});

const webpack = require('webpack');
console.log('NETWORK', process.env.NETWORK);
module.exports = {
  entry: './src/main.tsx',
  target: 'web',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_fnames: true,
          keep_classnames: true,
        },
      }),
    ],
    splitChunks: {
      chunks: 'async',
      name: false,
    },
  },
  resolve: {
    alias: {
      process: 'process/browser',
      stream: 'stream-browserify',
      zlib: 'browserify-zlib'
    },
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    fallback: {
      'browser': require.resolve('os-browserify/browser'),
      'http': require.resolve('stream-http'),
      'https': require.resolve('https-browserify'),
      'url': require.resolve('url/'),
      'os': require.resolve('os-browserify/browser'),
      'buffer': require.resolve('buffer/'),
      'crypto': require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx|ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options:{
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-syntax-dynamic-import',
              ],
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [

          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets',
          publicPath: 'assets',

        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]'
        }
      }
    ],
  },
  plugins: [
    new Dotenv({
      path: path.resolve(__dirname, './.env'),
      safe: true,
      systemvars: true,
      defaults: true
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: './src/assets', to: 'assets'}
      ]
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  devServer: {
    client: {
      webSocketURL: 'ws://localhost/ws',
    },
    allowedHosts: 'all',
    static: path.join(__dirname, 'build'),
    host: '0.0.0.0',
    port: 3000,
    hot: false,
    historyApiFallback: true,
  }
};

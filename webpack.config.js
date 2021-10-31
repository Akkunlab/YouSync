require('dotenv').config();
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const enabledSourceMap = process.env.MODE === "development";

module.exports = {
    
  entry: {
    "index": "./src/client/index/index.js",
    "index_m": "./src/client/index/index_m.js",
    "room": "./src/client/room/index.js",
  },
  
  output: {
    path: `${__dirname}/public/js`,
    filename: "[name].js"
  },

  mode: process.env.MODE,

  module: {
    rules: [

      /* JS */
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
              ],
            },
          }
        ],
      },

      /* CSS */
      {
        test: /\.css/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: enabledSourceMap
            }
          }
        ]
      },

      /* Sass */
      {
        test: /\.scss/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
            options: {
              url: false,
              sourceMap: enabledSourceMap,
              importLoaders: 2
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: enabledSourceMap
            },
          },
        ],
      }

    ]
  },

  target: ["web", "es5"],
  
  plugins: [
    new Dotenv(),
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
    })
  ]
};

require('dotenv').config();
const JavaScriptObfuscator = require('webpack-obfuscator');
const Dotenv = require('dotenv-webpack');
const enabledSourceMap = process.env.MODE === "development";

module.exports = {
    
  entry: {
    "room": "./src/client/room/index.js",
  },
  
  output: {
    path: `${__dirname}/public/js`,
    filename: "[name].js"
  },

  mode: process.env.MODE,

  module: {
    rules: [
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
      }, {
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
      }
    ]
  },

  target: ["web", "es5"],
  
  plugins: [
    new Dotenv(),
    // new JavaScriptObfuscator({rotateUnicodeArray: true}, [])
  ]
};
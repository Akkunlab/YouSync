require('dotenv').config();
const JavaScriptObfuscator = require('webpack-obfuscator');
const Dotenv = require('dotenv-webpack');

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
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/preset-env",
          ],
        },
      }],
    }]
  },

  target: ["web", "es5"],
  
  plugins: [
    new Dotenv(),
    // new JavaScriptObfuscator({rotateUnicodeArray: true}, [])
  ]
};
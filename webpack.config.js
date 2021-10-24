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
      }, {
        test: /\.scss/, // 対象となるファイルの拡張子
        use: [
          // linkタグに出力する機能
          "style-loader",
          // CSSをバンドルするための機能
          {
            loader: "css-loader",
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップの利用有無
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          {
            loader: "sass-loader",
            options: {
              // ソースマップの利用有無
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
    // new JavaScriptObfuscator({rotateUnicodeArray: true}, [])
  ]
};
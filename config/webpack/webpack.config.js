const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry: path.resolve(__dirname, '../../src/index.js'), //指定入口文件，程序从这里开始编译,__dirname当前所在目录, ../表示上一级目录, ./同级目录
    output: {
        path: path.resolve(__dirname, '../../dist'), // 输出的路径
        filename: 'bundle.js'  // 打包后文件
    },
    module:{
        rules:[

            {//ES6、JSX处理
                test:/(\.jsx|\.js)$/,
                exclude: /node_modules/,
                loader:'babel-loader',
                query:
                    {
                        presets:["es2015",'stage-0', "react"],
                        plugins: [
                            [  "import",{libraryName: "antd", style: 'css'}] // antd按需加载
                        ]
                    },
            },

            {//CSS处理
                test: /\.css$/,
                loader: "style-loader!css-loader?modules",
                exclude: /node_modules/,
            },

            {//antd样式处理
              test:/\.css$/,
              exclude:/src/,
              use:[
                  { loader: "style-loader",},
                  {
                      loader: "css-loader",
                      options:{
                          importLoaders:1
                      }
                  }
              ]
            },
        ]
    },
    mode: 'development'
}
// 自带的库
const path = require('path');
const webpack = require('webpack');
module.exports = {
    entry:  ['babel-polyfill', './app/webaudiospeechrecognizer.js'], // 入口文件
    output: {
        path: path.resolve(__dirname, 'dist'), // 必须使用绝对地址，输出文件夹
        filename: "speechrecognizer.js", // 打包后输出文件的文件名
        // ecmaVersion: 5
    },
    // optimization:{
    //     minimize: false, // <---- 禁用 uglify.
    //     // minimizer: [new UglifyJsPlugin()] 使用自定义压缩工具
    // },
    module: {
        rules: [
            {
                // js 文件才使用 babel
                test: /\.js$/,
                // 使用哪个 loader
                use: {
                    loader: 'babel-loader',
                    options: {
                        // Here you should change 'env' to '@babel/preset-env'
                        presets: [['@babel/preset-env', {
                          useBuiltIns:'usage'
                        }]],
                    },
                },
                // 不包括路径
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            CryptoJSTest: "cryptojs"
        }),
    ]
};

const HTMLWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
    output: {path: path.resolve(__dirname, "build"), filename: "main.js"},
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.html")
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",

                ]
            }
        ]
    }
};
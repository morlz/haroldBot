var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: {
        background: './background.js',
        content: './content.js',
        inject: './inject.js',
        injectVk: './injectVk.js'
    },
    watch: true,
    output: {
        path: path.join(__dirname, 'assets'),
        filename: '[name].js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            ecma: 6,
            minimize: true
        })
    ],
    target: 'web',
    module: {
        loaders: [{
                test: /\.js$/,
                exclude: /(jquery|socket|vue|less)/,
                loader: 'babel-loader'
            }
        ]
    },
    devtool: "source-map",
    stats: {
        colors: true,
        modules: true,
        reasons: true,
        errorDetails: true
    }
}

var webpack = require('webpack');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

//const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports =  {
	context: path.join(__dirname, 'src'),
	entry: './main.js',
	output: {
		path: path.join(__dirname, 'assets')
	},
	plugins: [
		new webpack.DefinePlugin({ "global.GENTLY": false }),
		new webpack.optimize.UglifyJsPlugin({
			ecma: 6,
			minimize: true
		})
	],
	target: 'async-node',
	externals: [nodeExternals({
		modulesDir: 'src/node_modules'
	})],
	node: {
		__dirname: false,
		__filename: false,
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /\/node_modules\//,
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

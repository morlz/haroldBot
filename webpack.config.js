const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var plugins = [
	new webpack.DefinePlugin({ "global.GENTLY": false }),
	new UglifyJSPlugin({
		ecma: 6,
		minimize: true
	})
]

module.exports =  {
	context: path.join(__dirname, 'src'),
	entry: './main.js',
	output: {
		path: path.join(__dirname, 'assets')
	},
	plugins: plugins,
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

const process = require('process')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
// Webpack Plugins
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event

const BUILD_DIR = path.join(__dirname, 'build')

const common = {
	resolve: {
		extensions: ['.js', '.jsx', '.scss']
	},
	entry: {
		app: './timeit/main',
		vendor: ['react', 'react-dom']
	},
	output: {
		path: BUILD_DIR,
	},
	module: {
		rules: [
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract({
					fallbackLoader: 'style-loader',
					loader: [
						{
							loader: 'css-loader',
						},
						{
							loader: 'postcss-loader'
						},
						{
							loader: 'sass-loader'
						}

					]
				})
			},
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				options: {
					cacheDirectory: true
				}
			}
		]
	},
	plugins: [
		new webpack.BannerPlugin("Timeit webapplication by Flonka"),
		new HtmlWebpackPlugin({
			template: './index.html'
		}),
		new ExtractTextPlugin({
			filename:'styles.[contenthash].css',
			allChunks: true
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest'],
			filename: '[name].[chunkhash].js'
		}),
		new CleanWebpackPlugin([BUILD_DIR]),
		new webpack.NoEmitOnErrorsPlugin()
	]
}

function isVendor(module, count) {
	const userRequest = module.userRequest
	return userRequest && userRequest.indexOf('node_modules') >= 0
}


const dev = {
	output: {
		filename: '[name].js',
	},
	devtool: 'eval-source-map',
	plugins: [
		new webpack.NamedModulesPlugin()
	]
}

const prod = {
	output: {
		filename: 'app.[chunkhash].js',
		chunkFilename: '[chunkhash].js',
	},
	devtool: 'source-map',
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			mangle: {
				except: ['webpackJsonp']
			}
		}),
		new webpack.HashedModuleIdsPlugin(),
	]
}

var buildConfig
switch (TARGET) {
	case 'build-prod':
		buildConfig = merge.smart(
			common,
			prod)
		break
	case 'build-dev':
		buildConfig = merge.smart(
			common,
			dev)
		break
	case 'start':
		buildConfig = merge.smart(
			common,
			dev,
			{devServer: {
				inline: true,
				contentBase: BUILD_DIR,
				compress: true,
				port: 9999,
				proxy: {
					'/api': {
						target: 'http://localhost:8080'
					}
				}
			}}
		)
		break
}

module.exports = buildConfig

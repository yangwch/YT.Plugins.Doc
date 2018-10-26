const webpack = require.main.require('webpack')
const {
	name,
	version
} = require('./package.json')
const path = require('path')

function resolve (dir) {
  console.log(path.join(__dirname, dir))
  return path.join(__dirname, dir)
}

module.exports = {
		webpack: {
			devtool: false, // disable source-map
			plugins: [
				new webpack.DefinePlugin({
					'proccess.env.VERSION': JSON.stringify(version) // adds MyComponent.version
				})
			],
			resolve: {
				extensions: ['.js', '.vue', '.json'],
				alias: {
					'vue$': 'vue/dist/vue.esm.js',
					'@': resolve('src')
				}
			}
		}
	}
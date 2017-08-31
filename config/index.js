// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
	build: {
		env: require('./prod.env'),
		index: path.resolve(__dirname, '../dist/cas-admin/src/main/webapp/index.html'),
		assetsRoot: path.resolve(__dirname, '../dist/cas-admin/src/main/webapp'),
		assetsSubDirectory: 'static',
		assetsPublicPath: './',
		productionSourceMap: false,
		// Gzip off by default as many popular static hosts such as
		// Surge or Netlify already gzip all static assets for you.
		// Before setting to `true`, make sure to:
		// npm install --save-dev compression-webpack-plugin
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		// Run the build command with an extra argument to
		// View the bundle analyzer report after build finishes:
		// `npm run build --report`
		// Set to `true` or `false` to always turn it on or off
		bundleAnalyzerReport: process.env.npm_config_report
	},
	dev: {
		env: require('./dev.env'),
		port: 8082,
		autoOpenBrowser: true,
		assetsSubDirectory: 'static',
		assetsPublicPath: '/',
		proxyTable: {
			'/proxyapi': {
				// target: 'http://10.0.26.61:8075/cas-admin/', //朱雄敏电脑IP
				target: 'http://10.8.3.48:7010/cas-admin/', //链接51调试内网
				// target: 'http://122.224.131.235:9096/cas-admin', //链接51外网
				// target: "http://10.0.26.30:8080/", //杨毅的电脑
				// target: 'http://10.0.26.45:8090/', //徐洛克
				// target: 'http://10.0.26.156:8080/admin', //徐念冲
				changeOrigin: true,
				pathRewrite: {
					'/proxyapi': ''
				}
			}
		},
		// CSS Sourcemaps off by default because relative paths are "buggy"
		// with this option, according to the CSS-Loader README
		// (https://github.com/webpack/css-loader#sourcemaps)
		// In our experience, they generally work as expected,
		// just be aware of this issue when enabling this option.
		cssSourceMap: false
	}
}
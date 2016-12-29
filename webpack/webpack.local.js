'use strict';

const env = require('gulp-env');
const HtmlWebpack = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const ChunkWebpack = webpack.optimize.CommonsChunkPlugin;


/**
 * Load environment variables from JSON File.
 */

env({
    file: 'env.json'
});


/**
 * Initialize webpack LOCAL config.
 */

const rootDir = path.resolve(__dirname, '..');
module.exports = {
    debug: true,
    devServer: {
        contentBase: path.resolve(rootDir, 'src'),
        historyApiFallback: true,
        open: true
    },
    devtool: 'source-map',
    entry: {
        foundation: ["foundation-sites"],
        app: [path.resolve(rootDir, 'src/app/index')],
        vendor: [path.resolve(rootDir, 'src/app/vendor')],
    },
    module: {
        loaders: [
            {
                loader: 'raw!sass',
                test: /.sass$/
            },
            {
                loader: 'to-string-loader!css-loader',
                test: /.css$/
            },
            {
                test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url"
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                loader: 'file'
            },
            {
                loader: 'raw',
                test: /.html$/
            },
            {
                exclude: /node_modules/,
                loader: 'ts',
                test: /.ts$/
            }
        ]
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(rootDir, 'build')
    },
    plugins: [
        new ChunkWebpack({
            filename: 'vendor.bundle.js',
            minChunks: Infinity,
            name: 'vendor'
        }),
        new HtmlWebpack({
            filename: 'index.html',
            inject: 'body',
            template: path.resolve(rootDir, 'src/index.html')
        }),
        new webpack.ProvidePlugin({
            '$':          'jquery',
            'jQuery':     'jquery',
            '_':          'lodash'
        }),
        new webpack.DefinePlugin({
            NSFO_API_SERVER_URL: JSON.stringify(process.env.NSFO_API_SERVER_URL_LOCAL),
            NSFO_USER_ENV_URL: JSON.stringify(process.env.NSFO_USER_ENV_URL_LOCAL)
        })
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.ts']
    }
};
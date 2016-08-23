'use strict';

const HtmlWebpack = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ChunkWebpack = webpack.optimize.CommonsChunkPlugin;
const UglifyWebpack = webpack.optimize.UglifyJsPlugin;

const rootDir = path.resolve(__dirname, '..');

module.exports = {
    debug: false,
    devtool: 'source-map',
    entry: {
        foundation: ["foundation-sites"],
        custom: [path.resolve(rootDir, 'src/assets/js/newRelic.js')],
        app: [path.resolve(rootDir, 'src/app/index')],
        vendor: [path.resolve(rootDir, 'src/app/vendor')]
    },
    htmlLoader: {
        caseSensitive: true,
        customAttributeAssign: [/\)?\]?=/],
        customAttributeSurround: [
            [/#/, /(?:)/],
            [/\*/, /(?:)/],
            [/\[?\(?/, /(?:)/]
        ],
        minimize: true,
        removeAttributeQuotes: false
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
                test: /\.(ttf|eot|svg|json|png)(\?[\s\S]+)?$/,
                loader: 'file'
            },
            {
                test: /.html$/,
                loader: 'raw'
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
        new UglifyWebpack({
            beautify: false,
            comments: false,
            sourceMap: false,
            compress: {
                screw_ie8: true
            },
            mangle: {
                screw_i8: false,
                keep_fnames: false
            }
        }),
        new CopyWebpackPlugin([
            {
                context: 'src/assets',
                from: 'i18n/*',
                to: 'assets'
            },
            {
                context: 'src/assets',
                from: 'images/*',
                to: 'assets'
            },
            {
                context: 'src/assets',
                from: 'js/*',
                to: 'assets'
            },
            {
                context: 'src',
                from: '.htaccess',
                dot: true
            }
        ]),
        new webpack.ProvidePlugin({
            '$':          'jquery',
            'jQuery':     'jquery',
            '_':          'lodash'
        }),
        new CleanWebpackPlugin(['dist', 'build'], {
            root: rootDir,
            verbose: true,
            dry: false
        })
    ],
    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.ts']
    }
};
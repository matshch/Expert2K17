const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new ExtractTextPlugin('vendor.css');

    const fileExt = /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)(\?|$)/;

    const sharedConfig = {
        stats: { modules: false },
        resolve: { extensions: [ '.js' ] },
        entry: {
            vendor: [
                '@devexpress/dx-react-grid-material-ui',
                'bootstrap/dist/css/bootstrap.css',
                'domain-task',
                'event-source-polyfill',
                'font-awesome/css/font-awesome.css',
                'history',
                'react',
                'react-data-grid',
                'react-dom',
                'react-router-dom',
                'react-redux',
                'react-selectize',
                'react-selectize/dist/index.css',
                'react-slick',
                'redux',
                'redux-thunk',
                'react-router-redux',
                'slick-carousel/slick/slick.css',
                'slick-carousel/slick/slick-theme.css'
            ],
        },
        output: {
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        plugins: [
            new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: { path: path.join(__dirname, 'wwwroot', 'dist') },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: extractCSS.extract({ use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }) },
                { test: fileExt, use: 
                    {
                        loader: "url-loader",
                        options: {
                            limit: 100000,
                            publicPath: ''
                        }
                    }
                }
            ]
        },
        plugins: [
            extractCSS,
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative('./wwwroot/dist', '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    const serverBundleConfig = merge(sharedConfig, {
        target: 'node',
        resolve: { mainFields: ['main'] },
        output: {
            path: path.join(__dirname, 'ClientApp', 'dist'),
            libraryTarget: 'commonjs2',
        },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: isDevBuild ? 'css-loader' : 'css-loader?minimize' },
                { test: fileExt, use: 
                    {
                        loader: "file-loader",
                        options: {
                            emitFile: false
                        }
                    }
                }
            ]
        },
        entry: { vendor: ['aspnet-prerendering', 'react-dom/server'] },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    });

    return [clientBundleConfig, serverBundleConfig];
};

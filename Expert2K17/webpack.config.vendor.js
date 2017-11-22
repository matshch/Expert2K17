const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new ExtractTextPlugin('vendor.css');

    const fileExt = /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)(\?|$)/;

    const sharedConfig = {
        entry: {
            vendor: [
                'deep-equal',
                'domain-task',
                'history',
                're-reselect',
                'react',
                'react-document-title',
                'react-router-dom',
                'react-redux',
                'react-selectize',
                'react-slick',
                'react-spinkit',
                'reactstrap',
                'reselect',
                'redux',
                'redux-thunk',
                'react-router-redux'
            ],
        },
        output: {
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        stats: {
            modules: false
        },
        plugins: [
            // Workaround for https://github.com/andris9/encoding/issues/16
            new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        entry: {
            vendor: [
                'bootstrap/dist/css/bootstrap.css',
                'font-awesome/css/font-awesome.css',
                'react-dom',
                'react-hot-loader',
                'react-selectize/dist/index.css',
                'slick-carousel/slick/slick.css',
                'slick-carousel/slick/slick-theme.css'
            ].concat(isDevBuild ? ['event-source-polyfill'] : [])
        },
        module: {
            rules: [
                {
                    test: /\.css(\?|$)/,
                    use: extractCSS.extract({
                        use: [isDevBuild ? 'css-loader?sourceMap' : 'css-loader?minimize', 'postcss-loader']
                    })
                },
                {
                    test: fileExt,
                    use: {
                        loader: "url-loader",
                        options: {
                            limit: 100000,
                            publicPath: ''
                        }
                    }
                }
            ]
        },
        output: {
            path: path.join(__dirname, 'wwwroot', 'dist')
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
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    const serverBundleConfig = merge(sharedConfig, {
        entry: {
            vendor: [
                'aspnet-prerendering',
                'react-dom/server'
            ]
        },
        module: {
            rules: [
                {
                    test: /\.css(\?|$)/,
                    use: 'css-loader'
                },
                {
                    test: fileExt,
                    use: "file-loader?emitFile=false"
                }
            ]
        },
        output: {
            path: path.join(__dirname, 'ClientApp', 'dist'),
            libraryTarget: 'commonjs2',
        },
        target: 'node',
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    });

    return [clientBundleConfig, serverBundleConfig];
};

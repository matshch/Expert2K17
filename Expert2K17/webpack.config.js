const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new ExtractTextPlugin('site.css');

    const fileExt = /\.(png|jpg|jpeg|gif|woff|woff2|eot|ttf|svg)(\?|$)/;

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: /ClientApp/,
                    use: 'awesome-typescript-loader?silent=true'
                }
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        stats: {
            modules: false
        },
        plugins: [
            new CheckerPlugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ]
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: {
            'main-client': './ClientApp/boot-client.tsx'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: extractCSS.extract({
                        use: [isDevBuild ? 'css-loader?sourceMap' : 'css-loader?minimize', 'postcss-loader']
                    })
                },
                {
                    test: fileExt,
                    use: "url-loader?limit=25000"
                }
            ]
        },
        output: {
            path: path.join(__dirname, clientBundleOutputDir)
        },
        plugins: [
            extractCSS,
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/datagrid-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new webpack.optimize.UglifyJsPlugin()
        ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig(), {
        entry: {
            'main-server': './ClientApp/boot-server.tsx'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: 'css-loader'
                },
                {
                    test: fileExt,
                    use: "file-loader?emitFile=false"
                }
            ]
        },
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node',
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                name: './vendor',
                sourceType: 'commonjs2'
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/datagrid-manifest.json'),
                name: './datagrid',
                sourceType: 'commonjs2'
            })
        ]
    });

    return [clientBundleConfig, serverBundleConfig];
};

import path from 'path'
import {
    Configuration as WebpackConfiguration
} from 'webpack'
import Dotenv from 'dotenv-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const config: WebpackConfiguration = {
    mode: 'production',

    entry: path.resolve(__dirname, '../src/index.tsx'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'main.js',
        publicPath: '/',
        pathinfo: false
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        enforceExtension: false,
        symlinks: false,
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, '../tsconfig.json')
            })
        ]
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: path.resolve(__dirname, '../src'),
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: false
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'static/media/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    },

    optimization: {
        splitChunks: {
            // chunks: 'all',
            // minChunks: 2
            cacheGroups: {
                vendor: {
                    // chunks: 'initial',
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'initial'
                },
                // auth: {
                //     // chunks: 'initial',
                //     name: 'auth',
                //     test: /[\\/]pages\/auth[\\/]/,
                //     chunks: 'all'
                //     // enforce: true
                // },
                pages: {
                    // chunks: 'initial',
                    name: 'pages',
                    test: /[\\/]pages[\\/]/,
                    chunks: 'all'
                    // enforce: true
                }
            }
        },
        runtimeChunk: true
    },


    plugins: [
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
        })
    ]
}

export default config

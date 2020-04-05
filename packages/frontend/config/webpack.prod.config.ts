import path from 'path'
import {
    Configuration as WebpackConfiguration
    // DllPlugin
} from 'webpack'
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'
import Dotenv from 'dotenv-webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
// import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration
}

const config: Configuration = {
    mode: 'production',

    entry: path.resolve(__dirname, '../src/index.tsx'),
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'main.js',
        publicPath: '/',
        pathinfo: false
    },

    // externals: {
    //     scrippy: 'scrippy'
    // },

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
                            transpileOnly: true,
                            experimentalWatchApi: true
                        }
                    }
                ]
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: /node_modules/
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
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all'
        //         }
        //     }
        // },
        // removeAvailableModules: false,
        // removeEmptyChunks: false,
        // splitChunks: false
    },

    plugins: [
        // new ForkTsCheckerWebpackPlugin(),
        new Dotenv(),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html')
        })
        // new DllPlugin({
        //     context: __dirname,
        //     name: '[name]_[hash]',
        //     path: path.join(__dirname, '../statics/manifest.json')
        // })
    ]

    // externals: {
    //     react: 'React',
    //     'react-dom': 'ReactDOM'
    // }
}

export default config

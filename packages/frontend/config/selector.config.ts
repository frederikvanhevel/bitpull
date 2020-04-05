import path from 'path'
import { Configuration } from 'webpack'

const config: Configuration = {
    mode: 'development',
    bail: true,
    devtool: 'source-map',

    entry: path.resolve(__dirname, '../selectorgadget/selector.ts'),

    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'selector.js'
    },

    resolve: {
        extensions: ['.ts', '.js'],
        enforceExtension: false,
        symlinks: false
    },

    // optimization: {
    //     minimizer: [
    //         new UglifyJSPlugin({
    //             cache: true,
    //             parallel: true,
    //             uglifyOptions: {
    //                 compress: {
    //                     inline: false
    //                 }
    //             }
    //         })
    //     ]
    // },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                include: path.resolve(__dirname, '../selectorgadget'),
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
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
}

export default config

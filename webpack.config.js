const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

module.exports = {
    mode: process.env.NODE_ENV !== 'production' ? 'production' : 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([
            /** core.js
                sprite.js
                gameLoop.js
                pointer.js
                keyboard.js
             */
            { from: './node_modules/kontra/kontra.min.js', to: 'kontra.min.js' },
            { from: './src/assets', to: 'assets' }
        ]),
        new HtmlWebpackIncludeAssetsPlugin({ assets: [
            'kontra.min.js'
        ], append: false })
    ]
};
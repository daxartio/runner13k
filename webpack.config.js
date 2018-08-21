const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');

const KONTRA = [
    'core.js',
    'assets.js',
    'sprite.js',
    'gameLoop.js',
    // 'pointer.js',
    'keyboard.js',
    // 'pool.js',
    // 'quadtree.js',
    'spriteSheet.js',
    // 'store.js',
    // 'tileEngine.js',
];

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
            ...KONTRA.map(v => {return { from: './node_modules/kontra/dist/' + v, to: v };}),
            { from: './src/assets', to: 'assets' }
        ]),
        new HtmlWebpackIncludeAssetsPlugin({ assets: [
            ...KONTRA
        ], append: false })
    ]
};
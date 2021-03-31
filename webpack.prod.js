// @ts-check
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** github repo-name for gh-pages deployment */
const publicPath = '/snake-game-js/';

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'production',
  output: { publicPath },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(publicPath),
    }),
  ],
};

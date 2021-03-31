// @ts-check
const { DefinePlugin } = require('webpack');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
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
    new DefinePlugin({
      'process.env.PUBLIC_PATH': JSON.stringify(''),
    }),
  ],
};

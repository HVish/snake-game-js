const { merge } = require('webpack-merge');

const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const commonConfig = require('./webpack.common');

module.exports = (env) => {
  if (env.development) {
    return merge(commonConfig, devConfig);
  }

  if (env.production) {
    return merge(commonConfig, prodConfig);
  }

  throw new Error('No matching configuration was found!');
};

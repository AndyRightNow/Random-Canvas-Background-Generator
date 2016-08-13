var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./src/RandomBackgroundGenerator.js",
  output: {
    path: __dirname + "/dist",
    filename: "RandomBackgroundGenerator.min.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),    //  Stripe out duplicate codes
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};

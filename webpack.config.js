const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");


module.exports = function webpackConfig() {
  const isDev = process.env.NODE_ENV === "development";
  const srcDir = path.join(__dirname, "web/src");
  const distDir = path.join(__dirname, "web/dist");

  const config = {
    entry: [
      path.join(srcDir, "/app.js"),
    ],
    output: {
      filename: "bundle.js",
      path: distDir,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          enforce: "pre",
          use: [
            "eslint-loader",
          ],
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            "babel-loader",
          ],
        },
      ],
    },
    resolve: {
      modules: ["node_modules", srcDir],
    },
    plugins: [
      new CleanWebpackPlugin(distDir),
    ],
    devServer: {
      contentBase: distDir,
      hotOnly: true,
      port: 8888,
    },
    devtool: isDev ? "eval-source-map" : false,
    stats: {
      assets: false,
      version: false,
    },
  };

  if (isDev) {
    config.plugins.push(
      new DashboardPlugin(),
      new webpack.NamedModulesPlugin(),
    );
  }

  return config;
};

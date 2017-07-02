const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");


module.exports = function webpackConfig() {
  const isDev = process.env.NODE_ENV === "development";
  const srcDir = path.join(__dirname, "web/src");
  const distDir = path.join(__dirname, "web/dist");

  const config = {
    target: "electron-renderer",
    entry: [
      "react-hot-loader/patch",
      path.join(srcDir, "/app.js"),
    ],
    output: {
      filename: "bundle.js",
      path: distDir,
      publicPath: "http://localhost:8888/",
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
        {
          test: /\.styl$/,
          exclude: /node_modules/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: isDev,
              },
            },
            "stylus-loader",
          ],
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: isDev,
              },
            },
          ],
        },
      ],
    },
    resolve: {
      modules: ["node_modules", srcDir],
    },
    plugins: [
      new CleanWebpackPlugin(distDir),
      new webpack.EnvironmentPlugin(["NODE_ENV"]),
    ],
    devServer: {
      publicPath: "http://localhost:8888/",
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

const path = require("path");
const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config.js");

const newConfigs = {
  ...webpackConfig,
  mode: "development",
};

try {
  newConfigs.entry.demo = "./example/demo.js"
  newConfigs.output.publicPath = "http://localhost:9000/dist";
} catch (e) {}

const compiler = Webpack(newConfigs);

const devServerOptions = {
  static: {
    directory: path.join(__dirname),
  },
  compress: true,
  port: 9000,
  open: ["/example/index.htm"],
};

const server = new WebpackDevServer(devServerOptions, compiler);

const runServer = async () => {
  console.log("Starting server...");
  await server.start();
};

runServer();

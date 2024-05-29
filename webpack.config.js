import path, { dirname } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import WorkboxPlugin from "workbox-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  mode: "development",
  context: path.join(__dirname, "./src/"),
  entry: "./client/index.tsx",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        exclude: ["/node_modules/", "/src/server/"],
        use: "ts-loader",
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "./src/client/"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|jpeg)$/,
        include: path.resolve(__dirname, "./src/client/"),
        use: ["file-loader"],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./src/client/index.html"),
      title: "Progressive Web Application",
    }),
    new WorkboxPlugin.GenerateSW({
      // these options encourage the ServiceWorkers to get in there fast
      // and not allow any straggling "old" SWs to hang around
      clientsClaim: true,
      skipWaiting: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './client/img/', to: './client/img/' },
        './manifest.webmanifest'],
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};
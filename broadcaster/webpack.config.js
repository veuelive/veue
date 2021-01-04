// webpack.config.js
module.exports = [
  {
    mode: "development",
    entry: "./src/main.ts",
    target: "electron-main",
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          loader: "ts-loader",
        },
      ],
    },
    output: {
      path: __dirname + "/",
      filename: "index.js",
    },
  },
];

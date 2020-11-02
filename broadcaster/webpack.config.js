// webpack.config.js
module.exports = [
  {
    mode: "development",
    entry: "./src/main.js",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }],
        },
      ],
    },
    output: {
      path: __dirname + "/",
      filename: "index.js",
    },
  },
];

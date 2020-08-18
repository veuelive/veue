const { environment } = require("@rails/webpacker");
const typescript = require("./loaders/typescript");
const jquery = require("./plugins/jquery");

environment.plugins.prepend("jquery", jquery);
environment.loaders.prepend("typescript", typescript);

environment.loaders.delete("nodeModules");

// Get the actual sass-loader config
const sassLoader = environment.loaders.get("sass");
const sassLoaderConfig = sassLoader.use.find(function (element) {
  return element.loader == "sass-loader";
});

// Use Dart-implementation of Sass (default is node-sass)
const options = sassLoaderConfig.options;
options.implementation = require("sass");

module.exports = environment;

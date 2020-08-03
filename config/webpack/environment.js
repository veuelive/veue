const { environment } = require('@rails/webpacker')
const typescript =  require('./loaders/typescript')
const jquery = require('./plugins/jquery')

environment.plugins.prepend('jquery', jquery)
environment.loaders.prepend('typescript', typescript)
module.exports = environment

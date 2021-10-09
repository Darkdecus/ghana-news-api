const { getFiles } = require("../utils/routes-extractor");

module.exports = require("express")
  .Router()
  .use("/news", [...getFiles(__dirname).map((file) => require(`./${file}`))]);

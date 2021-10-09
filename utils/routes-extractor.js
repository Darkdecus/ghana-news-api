const fs = require("fs");
const path = require("path");

const getFiles = (rPath) => {
  try {
    return fs
      .readdirSync(path.join(rPath))
      .map((file) => file.split(".js")[0])
      .filter((elem) => !elem.match("index"));
  } catch (error) {
    console.log(error);
  }
};

module.exports = { getFiles };

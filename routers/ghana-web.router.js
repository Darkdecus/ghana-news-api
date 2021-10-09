const router = require("express").Router();
const main = require("express").Router();

const {
  getMostReadNews,
  getLatestNews,
  getNewsByDate,
  getArticle,
} = require("../controllers/ghana-web.controller");
const constructURL = (category = null, date = Date.now()) =>
  `https://www.ghanaweb.com/GhanaHomePage/${category}/browse.archive.php?date=${formatDateString(
    date
  )}`;
const formatDateString = (date) => {
  const dateObj = new Date(date);
  return `${dateObj.getFullYear()}${
    dateObj.getMonth() + 1 > 9
      ? dateObj.getMonth() + 1
      : `0${dateObj.getMonth() + 1}`
  }${dateObj.getDate()}`;
};

router
  .get("/:category/most-read", async (req, res, next) => {
    try {
      res
        .status(200)
        .json(
          await getMostReadNews(
            `https://www.ghanaweb.com/GhanaHomePage/${req.params.category}`
          )
        );
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })
  .get("/:category/latest", async (req, res, next) => {
    try {
      res
        .status(200)
        .json(
          await getLatestNews(
            `https://www.ghanaweb.com/GhanaHomePage/${req.params.category}`
          )
        );
    } catch (error) {
      res.sendStatus(500);
      console.log(error);
    }
  })
  .get("/:category/archive", async (req, res, next) => {
    try {
      // console.log(req.query);
      res
        .status(200)
        .json(
          req.query.date
            ? await getNewsByDate(
                constructURL(req.params.category, req.query.date)
              )
            : await getNewsByDate(constructURL(req.params.category))
        );
    } catch (error) {
      res.sendStatus(500);
      console.trace(error);
    }
  })
  .get("/article", async (req, res, next) => {
    try {
      res.status(200).json(await getArticle(req.query.link));
    } catch (error) {
      res.sendStatus(500);
      console.trace(error);
    }
  });

main.use("/ghana-web", router);

module.exports = main;

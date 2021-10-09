const puppeteer = require("puppeteer");

const openBrowser = async (url = "", selector = "") => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.goto(url);
  page.waitForSelector(selector);

  const list = page.$$eval(selector, (elem) => {
    elem.nextSibling.map((li) => ({
      categoryTitle: elem.text,
      newsHeading: li.children[0].text,
      link: li.children[0].href,
    }));
  });
  page.close();
};

const getNewsHeadings = async (isSibling = true, selector = "") => {
  if (isSibling) {
  }
};

module.exports = {
  //   getMostReadNews,
  //   getLatestNews,
  getNewsByDate: async (url, date = null) =>
    date
      ? openBrowser(`${url}?date=${data}`, "#medsection1 h3")
      : openBrowser(url, "#medsection1 h3"),
};

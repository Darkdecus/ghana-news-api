const puppeteer = require("puppeteer");
const { minimal_args, blocked_domains } = require("../utils/puppeteer.utils");

const openBrowser = async (url = "", selector = "") => {
  const browser = await puppeteer.launch({
    headless: false,
    args: minimal_args,
  });
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    if (
      blocked_domains.some((domain) => url.includes(domain)) ||
      request.resourceType() === "image" ||
      request.resourceType() === "css"
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(selector);

    const list = await page.$$eval(selector, (nodes) =>
      nodes.map((h3) => {
        const array = [];
        console.log("\n", h3.nextElementSibling.children.length, "\n");
        for (li of h3.nextElementSibling.children) {
          array.push({
            categoryTitle: h3.innerText,
            newsHeading: li.children[0].innerText,
            link: li.children[0].href,
          });
        }
        return array;
      })
    );

    await page.close();
    await browser.close();
    return { count: list.length, list };
  } catch (error) {
    await page.close();
    await browser.close();
    if (error.name === "TimeoutError") return { count: null, list: null };
    throw error;
  }
};

module.exports = {
  getMostReadNews: async (url = "") => {
    const browser = await puppeteer.launch({
      headless: true,
      args: minimal_args,
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (
        blocked_domains.some((domain) => url.includes(domain)) ||
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font" ||
        request.resourceType() === "media"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".left_artl_list");

      const list1 = await page.$$eval(
        ".left_artl_list .upper ul li a",
        (nodes) =>
          nodes.map((a) => ({
            newsHeading: a.title,
            link: a.href,
            img: a.children[0].children[0].src,
            imgDescription: a.children[0].children[0].alt,
          }))
      );
      const list2 = await page.$$eval(
        ".left_artl_list .middle .left_list ul li a",
        (nodes) =>
          nodes.map((a) => ({
            newsHeading: a.title,
            link: a.href,
            img: a.children[0].children[0].src,
            imgDescription: a.children[0].children[0].alt,
          }))
      );
      const list3 = await page.$$eval(
        ".left_artl_list .lower ul li a",
        (nodes) =>
          nodes.map((a) => ({
            newsHeading: a.title,
            link: a.href,
            img: a.children[0].children[0].src,
            imgDescription: a.children[0].children[0].alt,
          }))
      );

      await page.close();
      await browser.close();
      Promise.all(list1, list2, list3);
      return {
        count: [...list1, ...list2, ...list3].length,
        list: [...list1, ...list2, ...list3],
      };
    } catch (error) {
      await page.close();
      await browser.close();
      if (error.name === "TimeoutError") return { count: null, list: null };
      throw error;
    }
  },
  getLatestNews: async (url = "") => {
    const browser = await puppeteer.launch({
      headless: true,
      args: minimal_args,
    });

    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (
        blocked_domains.some((domain) => url.includes(domain)) ||
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font" ||
        request.resourceType() === "media"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".right_artl_list");

      const list = await page.$$eval(".right_artl_list ul li a", (nodes) =>
        nodes.map((a) => ({
          newsHeading: a.children[1].innerText,
          link: a.href,
          time: a.children[0].innerText,
        }))
      );

      await page.close();
      await browser.close();
      return { count: list.length, list };
    } catch (error) {
      await page.close();
      await browser.close();
      if (error.name === "TimeoutError") return { count: null, list: null };
      throw error;
    }
  },
  getNewsByDate: async (url, date = null) =>
    openBrowser(url, "#medsection1 h3"),
  getArticle: async (url) => {
    const browser = await puppeteer.launch({
      headless: true,
      args: minimal_args,
    });

    // console.log("\n\n", url, "\n\n");
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on("request", (request) => {
      const url = request.url();
      if (
        blocked_domains.some((domain) => url.includes(domain)) ||
        request.resourceType() === "image" ||
        request.resourceType() === "stylesheet" ||
        request.resourceType() === "font" ||
        request.resourceType() === "media"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    try {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      await page.waitForSelector(".article-left-col");

      const article = await page.$eval(".article-left-col", (node) => ({
        title: node.querySelector("h1").innerText,
        image: node.querySelector(".article-left .article-image a img").src,
        text: node
          .querySelector(".article-left")
          .nextElementSibling.querySelector("p").innerText,
      }));

      await page.close();
      await browser.close();
      return { ...article };
    } catch (error) {
      await page.close();
      await browser.close();
      if (error.name === "TimeoutError") return { text: null };
      throw error;
    }
  },
};

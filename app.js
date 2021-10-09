const express = require("express");
const app = express();

app.use(require("cors")());
app.use(require("morgan")("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const router = require("./routers/index.router");
// app.use("/", router);
app.use("/", require("./routers/index.router"));

app.listen(process.env.PORT, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});

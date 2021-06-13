require("dotenv").config();
const express = require("express");
const { message } = require("statuses");
const path = require("path");
const ejs = require("ejs");

const app = express();

app.use(express.json({ extended: false })); // for parsing json data in body
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(require("./routers/user"));
app.use(require("./routers/url"));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.PORT);

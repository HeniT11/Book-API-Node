const express = require("express");
const courses = require("../routes/courses");
const customers = require("../routes/customers");
const books = require("../routes/books");
const users = require("../routes/users");
const auth = require("../routes/auth");
const returns = require("../routes/returns");
const error = require("../middleware/error");
module.exports = function (app) {
  app.use(express.json());
  app.use("/api/courses", courses);
  app.use("/api/customers", customers);
  app.use("/api/books", books);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
};

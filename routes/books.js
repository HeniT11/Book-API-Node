const { Book, validateBook } = require("../models/book");
const { Course } = require("../models/course");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const books = await Book.find();
  res.send(books);
});

router.get("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("book not found");
  else res.send(book);
});

router.post("/", async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send("Invalid course");

  let book = new Book({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    course: {
      _id: course._id,
      name: course.name,
    },
  });
  book = await book.save();
  res.send(book);
});

router.put("/:id", async (req, res) => {
  const { error } = validateBook(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findById(req.body.courseId);
  if (!course) return res.status(400).send("Invalid course");

  const book = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
      course: {
        _id: course._id,
        name: course.name,
      },
    },
    { new: true }
  );
  if (!book) return res.status(404).send("book not found");

  res.send(book);
});

router.delete("/:id", async (req, res) => {
  const book = await Book.findByIdAndRemove(req.params.id);
  if (!book) return res.status(404).send("book not found");

  res.send(book);
});

module.exports = router;

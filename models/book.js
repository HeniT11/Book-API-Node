const mongoose = require("mongoose");
const Joi = require("joi");
const { courseSchema } = require("./course");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 50,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  course: {
    type: courseSchema,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Book = mongoose.model("Book", bookSchema);

function validateBook(book) {
  const schema = {
    title: Joi.string().min(3).required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number(),
    courseId: Joi.string().required(),
  };
  const result = Joi.validate(book, schema);
  return result;
}

module.exports = { Book, validateBook };

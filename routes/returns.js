const validateObjectId = require("../middleware/validateObjectId");
const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const { Course, validateCourse } = require("../models/course");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const { Rental } = require("../models/rental");
const moment = require("moment");
const { Book } = require("../models/book");

router.post("/", auth, async (req, res) => {
  if (!req.body.customerId)
    return res.status(400).send("customerId not provided");
  if (!req.body.bookId) return res.status(400).send("bookId not provided");
  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "book._id": req.body.bookId,
  });
  if (!rental) return res.status(404).send("Rental not found");
  if (rental.dateReturned)
    return res.status(400).send("return already processed");
  rental.dateReturned = new Date();
  rental.rentalFee =
    moment().diff(rental.dateOut, "days") * rental.book.dailyRentalRate;
  await rental.save();
  await Book.update(
    { _id: rental.book._id },
    {
      $inc: { numberInStock: 1 },
    }
  );
  return res.status(200).send(rental);
});

module.exports = router;

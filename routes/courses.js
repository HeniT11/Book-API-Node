const validateObjectId = require("../middleware/validateObjectId");
const asyncMiddleware = require("../middleware/async");
const auth = require("../middleware/auth.js");
const admin = require("../middleware/admin.js");
const { Course, validateCourse } = require("../models/course");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const courses = await Course.find().sort("name");
    res.send(courses);
  })
);

router.get("/:id", validateObjectId, async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send("course not found");
  else res.send(course);
});

router.post("/", auth, async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let course = new Course({
    name: req.body.name,
  });
  course = await course.save();
  res.send(course);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!course) return res.status(404).send("course not found");

  res.send(course);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  const course = await Course.findByIdAndRemove(req.params.id);
  if (!course) return res.status(404).send("course not found");

  res.send(course);
});

module.exports = router;

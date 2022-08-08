const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  phone: {
    type: Number,
    required: true,
    length: 10,
    pattern: /^09/,
  },
  isGold: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(20).required(),
    phone: Joi.number().required(),
    isGold: Joi.boolean().required(),
  };
  const result = Joi.validate(customer, schema);
  return result;
}

module.exports = { Customer, validateCustomer };

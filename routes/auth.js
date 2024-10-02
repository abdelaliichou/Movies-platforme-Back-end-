const { User } = require("../models/user");
const Joi = require("joi");
const express = require("express");
const bcrypt = require("bcrypt");
// const _ = require("lodash");
const router = express.Router();

// LOG IN
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // we are checking if the email or password are existing

  let user = await User.findOne({ email: req.body.email }); // filter user by an attribute (email) because its a unique attribute

  if (!user) return res.status(400).send("No user with this email !");

  // now we are checking if the password is correct
  // compare the hashed password of this user email from the database (user.password) with the one entered by the user (req.body.password)

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) return res.status(400).send("Invalid password !");

  // now we send the JWT token
  const token = user.generateAuthToken();

  res.header("x-auth-token", token).send(token);
});

// this is for validating the login inputs ( email and password )

function validate(req) {
  let template = Joi.object().keys({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return template.validate(req);
}

module.exports = router;

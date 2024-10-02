const { User, validate } = require("../models/user");
const authorisation = require("../middleware/authorisation");
const express = require("express");
const bcrypt = require("bcrypt");
// const _ = require("lodash");
const router = express.Router();

// get the authentificated (LOGED IN USER) user info
router.get("/me", authorisation, async (req, res) => {
  // in the authorisation.js, we returned the paylod that contains the id of the user of the spisific token
  //so we will get that id (re.user._id)and use it to get all the info about the user who have this spisific token
  let user = await User.findById(req.user._id).select("-password"); // exclude password from the returned user
  res.send(user);
});

// SIGN-UP
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // check if this user is not already register

  let user = await User.findOne({ email: req.body.email }); // filter user by an attribute (email) because its a unique attribute

  if (user) return res.status(400).send("User aldready registered !");

  // user is Null
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  // we hach the password + the salt
  let salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  // saving the hashed user
  await user.save();

  // getting the token that we created in the user model
  const token = user.generateAuthToken();

  // we dont want to send the password back in the response
  let response_user = {
    id: user._id,
    name: user.name,
    email: user.email,
  };

  // sending the token in the header and the user object in the body
  res.header("x-auth-token", token).send(response_user);
});

module.exports = router;

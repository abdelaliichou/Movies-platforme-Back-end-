const { Genre, validate } = require("../models/genre");
const authorisation = require("../middleware/authorisation");
const admin = require("../middleware/admin");
const express = require("express");
const router = express.Router();

router.get("/", authorisation, async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

// the auth midlewar function will be executed firstly to check if the user who wants to post is authentificated

router.post("/", authorisation, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", authorisation, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

// will check firstly if the user is authentificated, after it will check if he is an admin, afer it will delete
router.delete("/:id", [authorisation, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

router.get("/:id", authorisation, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});

module.exports = router;

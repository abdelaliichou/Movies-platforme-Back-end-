const { Movie, validate } = require("../models/movie");
const authorisation = require("../middleware/authorisation");
const admin = require("../middleware/admin");
const express = require("express");
const Joi = require("joi");
const router = express.Router();

// we required the genre class so we can use it to query the genres that exists based on the id that we insert in the post man

const { Genre } = require("../models/genre");

router.get("/", authorisation, async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

// when we post or put a new movie, we need to spicify a valid genre, this is why we are cheking every time if it is a valid genre

router.post("/", authorisation, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // we are verifiying if the id of the genre is existing one so we can get its information from the genres collection, else return

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre ID !");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      // we override the genre id so that mongo don't put a new id, and it will remine the same as the one inserted by the user
      // also we didn't do genre : genre ( the one declared above ) because we don't want to ovveride the version atribute
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", authorisation, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // we are verifiying if the id of the genre is existing one, else return

  // we put jut a id if the genre and we will charge its name in the movie object

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", [authorisation, admin], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", authorisation, async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

module.exports = router;

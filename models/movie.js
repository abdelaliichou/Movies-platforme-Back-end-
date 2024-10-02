const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

// we required the genre schema because we are going to use embedding in the movie object, so we need this schema
// to define the type of that genre object inside the movie object

const { genreSchema } = require("./genre");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: genreSchema,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

const Movie = mongoose.model("Movies", movieSchema);

// when we insert the movie object in post man, in the genre we will insert just an id of a genre because
// we already have genres so we need to reference just one of the existing ones
function validateMovie(movie) {
  let template = Joi.object().keys({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(), // we are defining the type of the id to an objectId()
    // we want the client to enter just the genre id, and we will get all the genre from that id
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return template.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;

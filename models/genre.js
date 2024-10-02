const Joi = require("joi");
const mongoose = require("mongoose");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  let template = Joi.object().keys({
    name: Joi.string().min(3).required(),
  });

  return template.validate(genre);
}

exports.genreSchema = genreSchema; // we also exported the schema because we use it in the movie schema
exports.Genre = Genre;
exports.validate = validateGenre;

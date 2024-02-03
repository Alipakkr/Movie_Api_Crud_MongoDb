const mongoose = require("mongoose");

const movieSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    rating: { type: Number, min: 0, max: 10, default: 0.0 },
    duration: {
      hours: { type: Number, min: 0 },
      minutes: { type: Number, min: 0, max: 59 },
    },
    language: { type: String },
  },
  {
    versionKey: false,
  }
);

const MovieModel = mongoose.model("movie", movieSchema);

module.exports = { MovieModel };

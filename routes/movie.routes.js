// routes/movie.routes.js
const express = require("express");
const { MovieModel } = require("../model/movie.model");

const movieRouter = express.Router();

// Get all movies
movieRouter.get("/movies", async (req, res) => {
  try {
    const movies = await MovieModel.find();
    res.status(200).send({ msg: "List of Movies", movies });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Get request for filtering and sorting
movieRouter.get("/movies/query", async (req, res) => {
  try {
    const query = {};

    if (req.query.title) {
      query.title = new RegExp(req.query.title, "i");
    }

    if (req.query.rating) {
      query.rating = req.query.rating;
    }

    if (req.query.releaseYear) {
      query.releaseYear = req.query.releaseYear;
    }

    let sort = "name";
    if (req.query.sortBy) {
      const sortOrder = req.query.sortBy.endsWith("_desc") ? -1 : 1;
      const sortField = req.query.sortBy
        .replace(/_desc$/, "")
        .replace(/_asc$/, "");

      sort = { [sortField]: sortOrder };
    }

    let page = 1;
    let limit = 5;

    if (req.query.page) {
      page = +req.query.page;
    }
    if (req.query.limit) {
      limit = +req.query.limit;
    }

    const movies = await MovieModel.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).send({ msg: "List of Movies", movies });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Add a new movie
movieRouter.post("/movies", async (req, res) => {
  try {
    const existingMovie = await MovieModel.findOne({ title: req.body.title });
    if (existingMovie) {
      return res.status(400).json({ msg: "Movie already exists" });
    }
    const movie = new MovieModel(req.body);
    await movie.save();
    res.json({ msg: "The new movie has been added", new_movie: movie });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Update a new movie
movieRouter.put("/movies/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    await MovieModel.findByIdAndUpdate({ _id: movieId }, req.body);
    res.status(200).json({
      msg: `The movie with ID:${movieId} has been Updated`,
    });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

// Delete a new movie
movieRouter.delete("/movies/:movieId", async (req, res) => {
  const { movieId } = req.params;
  try {
    await MovieModel.findByIdAndDelete({ _id: movieId });
    res
      .status(200)
      .json({ msg: `The movie with ID:${movieId} has been deleted` });
  } catch (err) {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = { movieRouter };

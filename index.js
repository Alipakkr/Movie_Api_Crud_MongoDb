// index.js or your main server file
const express = require("express");
const app = express();
const { connection } = require("./db");
const { movieRouter } = require("./routes/movie.routes");

const PORT = 4500;

// Middleware to parse JSON requests
app.use(express.json());

// Routes
app.use("/", movieRouter);

// Start the server
app.listen(PORT, async () => {
  try {
    console.log("Connecting to the database...");
    await connection;
    console.log("Database connection established.");

    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (err) {
    console.error("Error:", err);
  }
});

const mongoose = require("mongoose");
const config = require("config");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

// we check if we entered the private key for the token

if (!config.get("jwtPrivateKey")) {
  console.log("JWT PRIVATE KEY NOT FOUND");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1:27017/movies_db")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

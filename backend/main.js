require("dotenv").config();
const express = require("express");
const port = process.env.port;
const app = express();
const connectToMongo = require("./db");
connectToMongo();
app.get("/", (_req, res) => {
  res.send("Hello World");
});
app.listen(port, () => console.log("App successfully listening"));

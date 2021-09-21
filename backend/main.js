require("dotenv").config();
const express = require("express");
const port = process.env.port;
const app = express();
const connectToMongo = require("./db");
app.use(express.json());
app.use("/auth", require("./routes/auth"));
app.use("/notes", require("./routes/notes"));
connectToMongo();
app.get("/", (_req, res) => {
  res.send("Hello World");
});
app.listen(port, () => console.log("App successfully listening"));

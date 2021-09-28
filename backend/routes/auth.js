//#region Global variables
require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const JWT_SIGN = process.env.sign;
//#endregion Global variables

//#region Signup
router.post(
  "/signup",
  // Checking for valid credentials
  [
    body("email", "Enter a valid email").isEmail(),
    body(
      "password",
      "Please enter a password with at least 8 characters"
    ).isLength({ min: 7 }),
    body("name", "Enter a name with at least 3 characters").isLength({
      min: 3,
    }),
  ],
  (req, res) => {
    // Checking for errors if any then stopping the execution
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    // Creating the user
    const createUser = async () => {
      try {
        // Checking if the email exists
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          res.status(400).json({
            error: "Sorry the email is used with another account",
            email: req.body.email,
          });
        }
        // Generating password hash
        const salt = await bcrypt.genSalt(15);
        const password = await bcrypt.hash(req.body.password, salt);
        // Creating the user
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: password,
        });
        // Saving the user to mongoDB
        user.save;
        // Generating auth token
        const data = {
          id: user.id,
        };
        const authToken = JWT.sign(data, JWT_SIGN);
        res.json({ authToken });
        // Giving errors if any
      } catch (err) {
        res.status(500).send("An error from our side occurred");
      }
    };
    createUser();
  }
);
//#endregion

//#region Login
router.post(
  "/login",
  // Checking wether the email and password are valid
  [body("email").isEmail(), body("password").exists()],

  async (req, res) => {
    // Checking if there are any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    // Running the login
    try {
      const { email, password } = req.body;
      // Checking if the email exists
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Sorry please try signing in with correct email" });
      }
      // Checking the password
      const passwordCompare = bcrypt.compare(password, user.password);
      if (!passwordCompare)
        if (!user) {
          return res
            .status(400)
            .json({ error: "Sorry please try signing in with correct email" });
        }
      // Giving auth token
      const data = {
        id: user.id,
      };
      const authToken = JWT.sign(data, JWT_SIGN);
      res.json({ authToken });
      // Giving error if any
    } catch (err) {
      console.error(err.message);
      res.send("Internal server error");
    }
  }
);
//#endregion

module.exports = router;

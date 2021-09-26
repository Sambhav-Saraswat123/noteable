require("dotenv").config();
const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const JWT_SIGN = process.env.sign;

router.post(
  "/signup",
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }
    const createUser = async () => {
      try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          res.status(400).json({
            error: "Sorry the email is used with another account",
            email: req.body.email,
          });
        }
        const salt = await bcrypt.genSalt(15);
        const password = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: password,
        });
        user.save;
        const data = {
          id: user.id,
        };
        const authToken = JWT.sign(data, JWT_SIGN);
        res.json({ authToken });
      } catch (err) {
        res.status(500).send("An error from our side occurred");
      }
    };
    createUser();
  }
);
module.exports = router;

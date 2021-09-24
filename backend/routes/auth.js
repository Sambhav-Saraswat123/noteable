const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

router.post(
  "/",
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
        const user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
        res.send(user);
        user.save;
      } catch (err) {
        res.json({
          message: "This email is already registered with an account",
          email: err.keyValue.email,
        });
      }
    };
    createUser();
  }
);
module.exports = router;

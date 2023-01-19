const express = require("express");
const { connection } = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { UserModel } = require("./models/User.model");
const jwt = require("jsonwebtoken");
const { authinticate } = require("./middleware/authintication");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("Welcome!");
});

// signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const userPresent = await UserModel.findOne({ email });

  if (userPresent?.email) {
    res.send({ masg: "Try to login" });
  } else {
    try {
      bcrypt.hash(password, 5, async function (err, hash) {
        const user = new UserModel({ email, password: hash });
        await user.save();
        res.send({ masg: "Signup Success" });
      });
    } catch (err) {
      console.log("Error Somthing went wrong");
      console.log(err);
      res.send({ msg: "Please try again" });
    }
  }
});

// login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await UserModel.find({ email });

    if (user.length >= 1) {
      const hash_password = user[0].password;
      const id = user[0]._id;
      bcrypt.compare(password, hash_password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userId: id }, "masai");
          res.send({ msg: "Login successful" });
          console.log(token);
        } else {
          res.send({ msg: "Login failed" });
        }
      });
    }
  } catch (err) {
    console.log("Invalid credentials");
    console.log(err);
  }
});
app.use(authinticate);

app.listen(process.env.PORT, async () => {
  console.log(`Listning on port ${process.env.PORT}`);
  try {
    await connection;
    console.log("Connected to DB Succesfull");
  } catch (err) {
    console.log("Err connecting to DB");
    console.log(err);
  }
});

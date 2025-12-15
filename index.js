const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const EmployeeModel = require("./models/Employee");

const app = express();
app.use(express.json());
app.use(cors());

/* MongoDB Connection */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB error:", err));

/* Login */
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await EmployeeModel.findOne({ email });

    if (!user) {
      return res.json("No record existed");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json("The password is incorrect");
    }

    res.json("Success");
  } catch (err) {
    res.status(500).json("Server error");
  }
});

/* Register */
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await EmployeeModel.create({
      name,
      email,
      password: hashedPassword
    });

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

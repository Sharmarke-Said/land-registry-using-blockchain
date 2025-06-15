const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs"); // ✅ Add bcrypt
const LandInspector = require("../models/landInspector");

// Create a new inspector (POST)
router.post("/", async (req, res) => {
  console.log("➡️ /landInspector POST hit"); // ✅ Check if route is hit

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    console.log("❌ Missing fields:", { username, email, password });
    return res.status(400).send({
      message: "Username, email and password are required",
    });
  }

  try {
    const exists = await LandInspector.findOne({ email });
    if (exists) {
      console.log("❌ Inspector already exists");
      return res.status(400).send({
        message: "Inspector already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("✅ Hashed Password:", hashedPassword); // 👈 Confirm it's working

    const inspector = new LandInspector({
      username,
      email,
      password: hashedPassword,
    });

    await inspector.save();

    res.status(201).send({
      message: "Land Inspector created successfully",
    });
  } catch (error) {
    console.error("🔥 Error in /landInspector:", error);
    res.status(500).send({
      message: "Error: " + error.message,
    });
  }
});

// Login route for inspector
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({
      message: "Username and password are required",
    });
  }

  try {
    const inspector = await LandInspector.findOne({ username });
    if (!inspector) {
      return res.status(400).send({
        message: "Inspector not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      inspector.password
    );
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid credentials",
      });
    }

    res.status(200).send({
      message: "Login successful",
      inspector: {
        username: inspector.username,
        email: inspector.email,
        id: inspector._id,
      },
    });
  } catch (error) {
    res.status(500).send({
      message: "Error: " + error.message,
    });
  }
});

module.exports = router;

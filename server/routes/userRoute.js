const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }
    const newUser = new User({ name, email, password });
    const user = await newUser.save();
    res.send("User Registered Successfully");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
      const temp = {
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        _id: user._id,
      };
      res.send(temp);
    } else {
      return res.status(400).json({ message: "Login Failed" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.post("/getallusers", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
});

router.post("/updateUser", async (req, res) => {
  try {
    const { _id, name } = req.body;
    const updatedUser = await User.findByIdAndUpdate(_id, { name }, { new: true });
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/removeFromQueue", async (req, res) => {
  try {
    const { userid, roomid } = req.body;
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Logic to remove room from user's queue
    // Example: user.queue.pull(roomid);
    await user.save();
    res.json({ message: "Room removed from queue successfully" });
  } catch (error) {
    console.error("Error removing room from queue:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

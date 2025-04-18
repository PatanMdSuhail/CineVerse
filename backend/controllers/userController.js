import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
  // Hardcoded user data for testing purposes
  const { username, email, password } = req.body;

  console.log("req.body user data:", `${username}-${email}-${password}`);

  // Check if the email already exists in the database
  const userExists = await User.findOne({ email });
  if (userExists) {
    console.log("User already exists");
    return res.status(400).json({ message: "User already exists" });
  }

  try {
    // Hash the hardcoded user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });

    console.log("New User Object before saving:", newUser);

    // Save the hardcoded user to the database
    await newUser.save();

    console.log("User saved successfully!");

    // Respond with the saved user's details
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
    });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ message: error.message || "Failed to save user" });
  }
});

export { createUser };

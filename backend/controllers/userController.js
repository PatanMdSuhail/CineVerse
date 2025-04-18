import User from "../models/User.js";
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

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

    // Creating a token for the user
    createToken(res, newUser._id);
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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);
      res.status(201).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } else {
    res.status(401).json({ message: "User Not Found" });
  }
});

const logOutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged Out Succesfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  res.json(users);
});

const getCurrentLoggedInProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found");
  }
});

const updateCurrentLoggedInProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    (user.username = req.body.username || user.username),
      (user.email = req.body.email || user.email);

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);
      const password = hashPassword;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});

export {
  createUser,
  loginUser,
  logOutCurrentUser,
  getAllUsers,
  getCurrentLoggedInProfile,
  updateCurrentLoggedInProfile,
};

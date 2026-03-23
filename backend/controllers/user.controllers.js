import { User } from "../models/user.model.js";
import validator from "validator";
const registerUser = async (req, res) => {
  // taking data from frontend
  const { name, email, password } = req.body;
  // validating data
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid email format",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters long",
    });
  }
  // checking if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email",
    });
  }
  // creating new user
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
  });

  // remove password and refresh token field from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken", // remove password and refresh token from response
  );

  // check for user creation
  if (!createdUser) {
    return res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }

  // return res
  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: createdUser,
  });
};
export { registerUser };

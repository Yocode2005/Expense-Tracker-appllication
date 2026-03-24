import { User } from "../models/user.model.js";
import validator from "validator";

const generateAccessTokenAndRefreshToken = async(userId) => {
    try {
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      user.refreshToken = refreshToken
      await user.save(validateBeforeSave = false) // we are not validating before save because we are only updating refresh token field and it is not required in user schema
      return { accessToken, refreshToken }
    } catch (error) {
      throw new Error("Failed to generate access token and refresh token");
    }
}

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
const loginUser = async(req,res) => {
   // taking data from frontend
   //find the user
    //password check
    //access and referesh token
    //send cookie
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required"
        })
    }
    const user = await User.findOne({
      $or : [{email},{password}]
    })
    if(!user){
        return res.status(400).json({
            success : false,
            message : "Invalid email or password"
        })
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        return res.status(400).json({
            success : false,
            message : "Invalid email or password"
        })
    }
   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    ) 

}


export { registerUser, loginUser };

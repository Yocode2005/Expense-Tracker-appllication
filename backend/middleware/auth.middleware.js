import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        //  console.log(token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token not found"
            })
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            
            return res.status(404).json({
                success: false,
                message: "User not found or token is invalid"
            })
        }
    
        req.user = user;
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: error?.message || "Invalid access token"
        })
    }
    
})
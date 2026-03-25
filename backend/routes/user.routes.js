import {Router} from "express";
import { registerUser, loginUser, getCurrentUser, updateUserDetails, changeCurrentUserPassword } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// protected routes
router.route("/me").get(verifyJWT, getCurrentUser)
router.route("/profile").put(verifyJWT, updateUserDetails)
router.route("/password").put(verifyJWT, changeCurrentUserPassword)

export default router
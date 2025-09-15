import express from "express"
import { signUp, login, logOut, sendOTP, verifyOTP, resetPassword, googleAuth } from "../controllers/auth.js"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/googleauth", googleAuth)
authRouter.post("/login", login)
authRouter.get("/logout", isAuthenticated, logOut)

authRouter.post("/sendotp", sendOTP)
authRouter.post("/verifyotp", verifyOTP)
authRouter.post("/resetpassword", resetPassword)

export default authRouter
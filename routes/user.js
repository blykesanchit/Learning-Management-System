import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { getCurrentUser, updateProfile } from "../controllers/user.js"
import upload from "../middlewares/multer.js"

const userRouter = express.Router()

// isAuth check the browser for token, decodes it, attached userId to req and does next(), so now getCurrentUser send responce with user attached
userRouter.get("/getcurrentuser", isAuthenticated, getCurrentUser)

// read info about upload.single() - processes single file and attaches info about file on req
userRouter.post("/updateprofile", isAuthenticated, upload.single("photoUrl"), updateProfile)

export default userRouter
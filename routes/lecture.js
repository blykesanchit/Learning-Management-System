import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { createLecture, editLecture, getCourseLectures, removeLecture } from "../controllers/lecture.js"
import upload from "../middlewares/multer.js"

const lectureRouter = express.Router()

lectureRouter.post("/createlecture/:courseId", isAuthenticated, createLecture)
lectureRouter.get("/getcourselectures/:courseId", isAuthenticated, getCourseLectures)
lectureRouter.post("/editlecture/:lectureId", isAuthenticated, upload.single("videoUrl"), editLecture)
lectureRouter.get("/removelecture/:lectureId", isAuthenticated, removeLecture)

export default lectureRouter
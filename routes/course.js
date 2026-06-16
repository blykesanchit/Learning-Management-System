import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { createCourse, deleteCourseById, editCourse, getCourseById, getCreatorCourses, getPublishedCourses } from "../controllers/course.js";
import upload from "../middlewares/multer.js"
import { searchWithAi } from "../controllers/search.js";

const courseRouter = express.Router()

courseRouter.post("/create", isAuthenticated, createCourse)
courseRouter.get("/getpublishedcourses", getPublishedCourses)
courseRouter.get("/getcreatorcourses", isAuthenticated, getCreatorCourses)

courseRouter.post("/edit/:courseId", isAuthenticated, upload.single("thumbnailUrl"), editCourse)
courseRouter.get("/getcoursebyid/:courseId", getCourseById)
courseRouter.get("/deletecoursebyid/:courseId", isAuthenticated, deleteCourseById)

courseRouter.post("/search", searchWithAi)

export default courseRouter;
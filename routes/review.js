import { addReview, getAllReviews, getCourseReviews } from "../controllers/review.js"
import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"

const reviewRouter = express.Router()

reviewRouter.post("/addreview", isAuthenticated, addReview)
reviewRouter.get("/getcoursereviews/:courseId", getCourseReviews)
reviewRouter.get("/getallreviews", getAllReviews)

export default reviewRouter
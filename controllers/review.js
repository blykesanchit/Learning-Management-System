import { asyncTryCatchErrorHandler } from "../middlewares/errorMiddleware.js";
import Course from "../models/Course.js";
import Review from "../models/Review.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const addReview = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { rating, comment, courseId } = req.body

        const userId = req.userId

        const course = await Course.findById(courseId)

        console.log("course");


        if (!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        const alreadyReviewed = await Review.findOne({ course: courseId, user: userId })

        console.log(alreadyReviewed);

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course"
            })
        }

        const review = new Review({
            course: courseId,
            user: userId,
            rating,
            comment
        })

        await review.save()

        course.reviews.push(review._id)
        await course.save()

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review
        })
    } catch (error) {
        next(new ErrorHandler(`Review not created - ${error}`, 500))
    }
})

export const getCourseReviews = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { courseId } = req.params

        const course = await Course.findById(courseId).populate("reviews")

        if (!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        return res.status(200).json({
            success: true,
            message: "Successfully fetched course reviews",
            reviews: course.reviews
        })
    } catch (error) {
        next(new ErrorHandler(`Fetch course reviews failed - ${error}`, 500))
    }
})

export const getAllReviews = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        // Get pagination parameters from query, default to first 100
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const reviews = await Review.find({})
            .populate("user", "name photoUrl role description")
            .populate("course") // populate the course fully
            .sort({ reviewedAt: -1 })
            .skip(skip)
            .limit(limit);

        if (!reviews) {
            return next(new ErrorHandler(`All reviews fetching failed.`, 400))
        }

        return res.status(200).json({
            success: true,
            message: "All reviews successfully fetched.",
            reviews
        })
    } catch (error) {
        next(new ErrorHandler(`Fetch reviews failed - ${error}`, 500))
    }
})
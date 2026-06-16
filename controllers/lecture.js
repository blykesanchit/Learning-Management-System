import { asyncTryCatchErrorHandler } from "../middlewares/errorMiddleware.js"
import ErrorHandler from "../utils/ErrorHandler.js";
import Lecture from "../models/Lecture.js"
import Course from "../models/Course.js";
import uploadOnCloudinary from "../config/cloudinary.js";

export const createLecture = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { lectureTitle } = req.body
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return next(new ErrorHandler("Lecture title required", 400))
        }

        const lecture = await Lecture.create({ lectureTitle })
        const course = await Course.findById(courseId)

        if (!course) {
            return next(new ErrorHandler("Couldn't fetch the course", 404))
        }
        course.lectures.push(lecture._id)
        await course.populate("lectures")
        await course.save()

        res.status(201).json({
            success: true,
            course,
            lecture,
            message: `Successfully created lecture.`
        })
    } catch (error) {
        next(new ErrorHandler(`Failed to create lecture. ${error}`))
    }
})

export const getCourseLectures = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)

        if (!course) {
            return next(new ErrorHandler("Couldn't fetch the course", 404))
        }

        await course.populate("lectures")
        await course.save()

        res.status(201).json({
            success: true,
            lectures: course.lectures,
            message: `Successfully fetched course lectures.`
        })
    } catch (error) {
        next(new ErrorHandler(`Failed to get course lectures. ${error}`))
    }
})

export const editLecture = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { lectureId } = req.params;
        const { lectureTitle, isPreviewFree } = req.body

        console.log(req);
        const lecture = await Lecture.findById(lectureId)

        if (!lecture) {
            return next(new ErrorHandler("Couldn't fetch the lecture", 404))
        }

        let videoUrl;

        if (req.file) {
            // we will get this req.file using the multer as middleware
            videoUrl = await uploadOnCloudinary(req.file.path)
            lecture.videoUrl = videoUrl
        }

        if (lectureTitle) {
            lecture.lectureTitle = lectureTitle
        }

        if (typeof isPreviewFree !== "undefined") {
            lecture.isPreviewFree = isPreviewFree
        }
        console.log(isPreviewFree);
        console.log(typeof isPreviewFree !== "undefined");


        await lecture.save()

        res.status(201).json({
            success: true,
            lecture: lecture,
            message: `Successfully edited lecture - ${lectureId}`
        })
    } catch (error) {
        next(new ErrorHandler(`Failed to edit lecture. ${error}`))
    }
})

export const removeLecture = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { lectureId } = req.params;

        const lecture = await Lecture.findByIdAndDelete(lectureId)

        if (!lecture) {
            return next(new ErrorHandler("Couldn't fetch the lecture", 404))
        }

        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        )

        res.status(201).json({
            success: true,
            message: `Successfully removed lecture`
        })
    } catch (error) {
        next(new ErrorHandler(`Failed to remove lecture. ${error}`))
    }
})
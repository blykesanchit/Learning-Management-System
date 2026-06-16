import uploadOnCloudinary from "../config/cloudinary.js";
import { asyncTryCatchErrorHandler } from "../middlewares/errorMiddleware.js"
import Course from "../models/Course.js"
import ErrorHandler from "../utils/ErrorHandler.js"

export const createCourse = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { title, category } = req.body;

		if (!title || !category) {
			return next(new ErrorHandler("Title and category required", 400))
		}

		const course = await Course.create({
			title,
			category,
			creator: req.userId,
		})

		res.status(201).json({
			success: true,
			course,
			message: "Course created successfully",
		})
	} catch (error) {
		next(new ErrorHandler(`create course error - ${error}`))
	}
})

export const getPublishedCourses = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const publishedCoursesData = await Course.find({
			isPublished: true
		})

		if (!publishedCoursesData) {
			return next(new ErrorHandler("Courses not found", 404))
		}

		res.status(200).json({
			success: true,
			publishedCoursesData,
			message: "Published Courses fetched successfully",
		})
	} catch (error) {
		next(new ErrorHandler(`fetch published course error - ${error}`))
	}
})

export const getCreatorCourses = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const userId = req.userId;

		const courses = await Course.find({
			creator: userId
		})

		if (!courses) {
			return next(new ErrorHandler("Courses not found", 404))
		}

		console.log(courses)

		res.status(200).json({
			success: true,
			courses,
			message: "Creator Courses fetched successfully",
		})
	} catch (error) {
		next(new ErrorHandler(`fetch creator course error - ${error}`))
	}
})

export const editCourse = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { courseId } = req.params;
		const { title, subtitle, description, category, level, isPublished, price } = req.body;

		// First, check if course exists
		const course = await Course.findById(courseId);

		if (!course) {
			return next(new ErrorHandler("Course not found", 404));
		}

		let thumbnailUrl;
		if (req.file) {
			// Only upload if course exists
			thumbnailUrl = await uploadOnCloudinary(req.file.path);
			course.thumbnailUrl = thumbnailUrl
		}

		if (title) course.title = title;
		if (subtitle) course.subtitle = subtitle;
		if (description) course.description = description;
		if (category) course.category = category;
		if (level) course.level = level;
		if (typeof isPublished !== "undefined") course.isPublished = isPublished;
		if (price) course.price = price;

		// const course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
		await course.save()

		res.status(200).json({
			success: true,
			course,
			message: "Course updated successfully",
		});
	} catch (error) {
		next(new ErrorHandler(`update course error - ${error}`))
	}
})

export const getCourseById = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findById(courseId)

		if (!course) {
			return next(new ErrorHandler("Course not found", 404))
		}

		return res.status(200).json({
			success: true,
			course,
			message: "Fetched Coures by ID successfully",
		})
	} catch (error) {
		next(new ErrorHandler(`fetch course by id error - ${error}`))
	}
})

export const deleteCourseById = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { courseId } = req.params;

		const course = await Course.findByIdAndDelete(courseId, { new: true })

		if (!course) {
			return next(new ErrorHandler("Course not found", 404))
		}

		res.status(200).json({
			success: true,
			message: "Deleted Coures by ID successfully",
		})
	} catch (error) {
		next(new ErrorHandler(`delete course by id error - ${error}`))
	}
})
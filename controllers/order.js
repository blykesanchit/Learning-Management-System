import { asyncTryCatchErrorHandler } from "../middlewares/errorMiddleware.js"
import getRpayInstance from "../utils/PaymentProvider.js"
import Course from "../models/Course.js"
import User from "../models/User.js"
import ErrorHandler from "../utils/ErrorHandler.js"

export const createOrder = asyncTryCatchErrorHandler(async (req, res, next) => {
    const rpay_instance = getRpayInstance();
    try {
        const { courseId } = req.body
        const course = await Course.findById(courseId)

        if (!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        const options = {
            amount: Number(course.price ? course.price : 0) * 100,
            currency: "INR",
            receipt: `${courseId}`
        }

        const order = await rpay_instance.orders.create(options);

        if (!order) {
            return next(new ErrorHandler("Payment unsuccessful"));
        }

        res.status(201).json({
            success: true,
            order: order,
            message: "Order created successfully"
        })
    } catch (error) {
        console.log(error);

        return next(new ErrorHandler("Order creation failed", 500))
    }
})

export const verifyPayment = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { courseId, userId, razorpayOrderId } = req.body

        const rpay_instance = getRpayInstance();

        const orderInfo = await rpay_instance.orders.fetch(razorpayOrderId)

        if (orderInfo.status !== "paid") {
            return res.status(400).json({
                success: true,
                message: "Payment not completed"
            })
        }

        const user = await User.findById(userId)
        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        const course = await Course.findById(courseId).populate("lectures")
        if (!course) {
            return next(new ErrorHandler("Course not found", 404))
        }

        if (!user.enrolledCourses.includes(courseId)) {
            user.enrolledCourses.push(courseId)
            await user.save()
        }

        if (!course.enrolledStudents.includes(userId)) {
            course.enrolledStudents.push(userId)
            await course.save()
        }

        res.status(200).json({
            success: true,
            message: "Payment verified successfully"
        })

    } catch (error) {
        next(new ErrorHandler(`Internal error - Payment not verified - ${error}`, 500))
    }
})
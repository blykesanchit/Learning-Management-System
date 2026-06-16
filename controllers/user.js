import { asyncTryCatchErrorHandler } from "../middlewares/errorMiddleware.js"
import User from "../models/User.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import uploadOnCloudinary from "../config/cloudinary.js"

export const getCurrentUser = asyncTryCatchErrorHandler(async (req, res, next) => {
    const userId = req.userId;
    // console.log(userId);

    const user = await User.findById(userId).select("-password");
    // sensitive info hence we wont give this info ahead

    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    res.status(200).json({
        success: true,
        user,
        message: "Got the current user",
    })
})

export const updateProfile = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const userId = req.userId;

        const { description, name } = req.body;

        let photoUrl;

        console.log(name, description, photoUrl);
        console.log(req.file);


        if (req.file) {
            // we will get this path using multer, 
            photoUrl = await uploadOnCloudinary(req.file.path)
        }

        console.log("updating now");


        const updateData = { name, description };
        if (photoUrl) updateData.photoUrl = photoUrl;
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
        // by default, it returns the old document (the document before the update). to get newer, u do this


        console.log("updated", updateData);


        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        res.status(200).json({
            success: true,
            user,
            message: "Updated the current user",
        })
    } catch (error) {
        return next(new ErrorHandler(`updateProfile error - ${error}`, 500))
    }
})

export const getUserById = asyncTryCatchErrorHandler(async (req, res, next) => {
    try {
        const { user_id } = req.params;

        const user = await User.findById(user_id).select("-password")

        if (!user) {
            return next(new ErrorHandler("User not found", 404))
        }

        res.status(200).json({
            success: true,
            user,
            message: "Fetched user successfully",
        })
    } catch (error) {
        next(new ErrorHandler(`fetch user by id error - ${error}`))
    }
})
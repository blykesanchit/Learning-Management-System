import mongoose, { mongo } from "mongoose";

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "educator", "admin"],
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String
    },
    description: {
        type: String
    },
    photoUrl: {
        type: String,
        default: ""
    },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Courses",
        }
    ],
    resetPassword: {
        resetOtp: {
            type: String
        },
        isOtpVerified: {
            type: Boolean,
            default: false
        },
        requestExpiresBy: {
            type: Date
        }
    },
    googleLogin: {
        status: {
            type: Boolean,
            default: false
        }
    },
}, { timestamps: true });

const User = mongoose.model("User", schema);

export default User;
import User from "../models/User.js"
import { asyncTryCatchErrorHandler } from "../middlewares/errorMiddleware.js"
import ErrorHandler from "../utils/ErrorHandler.js"
import validator from "validator"
import bcrypt from "bcryptjs"
import { genToken, tokenConfig } from "../config/token.js"
import sendMail from "../config/sendMail.js"

export const signUp = asyncTryCatchErrorHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;
	let existUser = await User.findOne({ email })

	if (existUser) {
		return next(new ErrorHandler("User already exist with this email"), 400)
	}
	if (!validator.isEmail(email)) {
		return next(new ErrorHandler("Enter valid email"), 400)
	}
	if (password.length < 8) {
		return next(new ErrorHandler("Password length should be greater than 8"), 400)
	}

	let hashedPassword = await bcrypt.hash(password, 10);

	const user = await User.create({
		name,
		email,
		password: hashedPassword,
		role
	})

	// as soon as user created token should be generator and parsed to cookie and we have to do it here
	// 	A JWT is a secure, self-contained token (basically a string) that contains encoded user data (like their id or email).

	// After login/signup, your backend creates a JWT and sends it to the frontend.

	// The frontend stores it (in localStorage or httpOnly cookies) and attaches it to future requests.

	// The backend verifies the JWT to allow/deny access.

	const token = await genToken(user._id);

	res.cookie("token", token, tokenConfig)

	res.status(201).json({
		success: true,
		message: "User created successfully",
		user
	})
})

export const login = asyncTryCatchErrorHandler(async (req, res, next) => {
	const { email, password } = req.body;

	let user = await User.findOne({
		email
	})

	if (!user) {
		return next(new ErrorHandler("User not found", 404))
	}

	let isMatch = await bcrypt.compare(password, user.password)

	if (!isMatch) {
		return next(new ErrorHandler("Incorrect password", 400))
	}

	const token = await genToken(user._id);

	res.cookie("token", token, tokenConfig)

	res.status(201).json({
		success: true,
		user,
		message: "Sent user token"
	})
})

export const googleAuth = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { gname, gemail, role, photoUrl } = req.body;

		const user = await User.findOne({ email: gemail })

		if (user) {
			// login
			user.googleLogin.status = true
			await user.save()

			const token = await genToken(user._id);
			res.cookie("token", token, tokenConfig)

			res.status(201).json({
				success: true,
				message: "Google auth login successful",
				user,
			})
		} else {
			// create
			console.log(gname, gemail, role, photoUrl);

			if (!role || role === "") {
				return next(new ErrorHandler("Specify your role", 400))
			}

			const guser = await User.create({
				name: gname, email: gemail, role, photoUrl: photoUrl, googleLogin: {
					status: true
				}
			});

			const token = await genToken(guser._id);
			res.cookie("token", token, tokenConfig)

			res.status(201).json({
				success: true,
				message: "Google auth signup successful",
				user: guser,
			})
		}
	} catch (error) {
		return next(new ErrorHandler(`Google auth error - ${error}`, 500))
	}
})

export const logOut = asyncTryCatchErrorHandler(async (req, res, next) => {
	await res.clearCookie("token")
	res.status(201).json({
		success: true,
		message: "cleared token"
	})
})

// RESET PASSWORD
export const sendOTP = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return next(new ErrorHandler("User not found", 404))
		}

		const randomOtp = Math.floor(1000 + Math.random() * 9000).toString()

		user.resetPassword.resetOtp = randomOtp

		user.resetPassword.requestExpiresBy = Date.now() + 5 * 60 * 1000 // millisecond
		// 5 minute expiry

		await user.save()
		console.log(user.resetPassword.requestExpiresBy);

		await sendMail(user.email, randomOtp)
		console.log(user.resetPassword.requestExpiresBy);

		res.status(200).json({
			success: true,
			message: "OTP sent successfully"
		})
	} catch (error) {
		console.log(error)
		return next(new ErrorHandler(`Failure to send OTP - ${error}`, 500))
	}
})

export const verifyOTP = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { email, otp } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return next(new ErrorHandler("User not found", 404))
		}

		const actualOtp = user.resetPassword?.resetOtp
		const otpExpiresBy = user.resetPassword?.requestExpiresBy;

		if (!(otp === actualOtp && Date.now() < otpExpiresBy)) {
			return next(new ErrorHandler("Invalid OTP", 400))
		}

		user.resetPassword.resetOtp = null
		user.resetPassword.requestExpiresBy = Date.now() + 10 * 60 * 1000 // 10 minutes to reset password
		user.resetPassword.isOtpVerified = true

		await user.save()

		res.status(200).json({
			success: true,
			message: "OTP verified successfully"
		})
	} catch (error) {
		return next(new ErrorHandler(`Verify OTP failure - ${error}`, 500))
	}
})

export const resetPassword = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return next(new ErrorHandler("User not found", 404))
		}

		if (!(user.resetPassword?.isOtpVerified === true && Date.now() < user.resetPassword?.requestExpiresBy)) {
			return next(new ErrorHandler("Invalid request to reset password", 400))
		}

		let hashedPassword = await bcrypt.hash(password, 10);

		user.password = hashedPassword

		await user.save()

		res.status(200).json({
			success: true,
			message: "Password reset successfully"
		})

	} catch (error) {
		return next(new ErrorHandler(`Reset password failed - ${error}`, 500))
	}
})
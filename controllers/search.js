import ErrorHandler from "../utils/ErrorHandler.js"
import { asyncTryCatchErrorHandler } from "../middlewares/errorMiddleware.js"
import Course from "../models/Course.js"
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

export const searchWithAi = asyncTryCatchErrorHandler(async (req, res, next) => {
	try {
		const { input } = req.body

		if (!input) {
			return next(new ErrorHandler("Input required", 400))
		}

		const courses = await Course.find({
			isPublished: true,
			$or: [ // if any of these queries match then fetch those
				{
					title: {
						$regex: input, // creates a regular expression search
						$options: 'i' // makes the regex case insensitive
					}
				},
				{
					subTitle: {
						$regex: input, // creates a regular expression search
						$options: 'i' // makes the regex case insensitive
					}
				},
				{
					description: {
						$regex: input, // creates a regular expression search
						$options: 'i' // makes the regex case insensitive
					}
				},
				{
					category: {
						$regex: input, // creates a regular expression search
						$options: 'i' // makes the regex case insensitive
					}
				},
				{
					level: {
						$regex: input, // creates a regular expression search
						$options: 'i' // makes the regex case insensitive
					}
				}
			]
		}).populate("creator")

		// if yes then show these if fetched nothing then find which category is the user talking about

		if (courses.length > 0) {
			return res.status(200).json({
				success: true,
				message: "Successfully searched courses",
				courses
			})
		} else {
			const ai = new GoogleGenAI({});
			const prompt = `You are an intelligent assistant for an LMS platform. A user will type any query about what they want to learn. Your task is to understand the intent and return one **most relevant keyword** from the following list of course categories and levels:

			- App Development  
			- AI/ML  
			- AI Tools  
			- Data Science  
			- Data Analytics  
			- Ethical Hacking  
			- UI UX Designing  
			- Web Development  
			- Others  
			- Beginner  
			- Intermediate  
			- Advanced  

			Only reply with one single keyword from the list above that best matches the query. Do not explain anything. No extra text.

			Query: ${input}
			`

			const response = await ai.models.generateContent({
				model: "gemini-2.5-flash",
				contents: prompt,
			});
			const keyword = response.text

			const courses = await Course.find({
				isPublished: true,
				$or: [
					{ title: { $regex: keyword, $options: 'i' } },
					{ subTitle: { $regex: keyword, $options: 'i' } },
					{ description: { $regex: keyword, $options: 'i' } },
					{ category: { $regex: keyword, $options: 'i' } },
					{ level: { $regex: keyword, $options: 'i' } }
				]
			}).populate("creator");

			return res.status(200).json({
				success: true,
				message: "Successfully searched courses with AI",
				courses
			})
		}
	} catch (error) {
		next(new ErrorHandler(`failed to search - ${error}`))
	}
})

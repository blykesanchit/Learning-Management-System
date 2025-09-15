import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

// upload this file to cloudinary
const uploadOnCloudinary = async (filePath) => {
	const config = cloudinary.config({
		cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
		api_key: process.env.CLOUDINARY_API_KEY,
		api_secret: process.env.CLOUDINARY_API_SECRET,
	});

	try {
		if (!filePath || filePath == "") {
			return null
		}

		// resource_type - 'auto' - can be photo, video anythign
		const uploadResult = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' })

		// delete those file
		fs.unlinkSync(filePath)

		return uploadResult.secure_url
	} catch (error) {
		// delete those file
		fs.unlinkSync(filePath)

		console.log(error);

	}
}

export default uploadOnCloudinary;
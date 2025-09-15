import jwt from "jsonwebtoken"
import ErrorHandler from "../utils/ErrorHandler.js"

export const isAuthenticated = async (req, res, next) => {
    let { token } = req.cookies
    if (!token) {
        return next(new ErrorHandler("No auth cookie found", 404))
        // not such a big deal that i need to raise error
        // return res.status(400).json({
        //     success: false,
        //     message: "No token found for auto-login"
        // })
    }

    let verifyToken = jwt.verify(token, process.env.JWT_SECRET); // return decoded token - userid

    if (!verifyToken) {
        return next(new ErrorHandler("Valid token not found", 400))
    }

    req.userId = verifyToken.userId // check the way we got the token in token.js
    // this will help us to know which user is there
    // its use can be anything now, we will take use later on to see user id in any request

    next()
}
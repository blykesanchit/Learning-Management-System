import jwt from "jsonwebtoken"

export const genToken = async (userId) => {
    try {
        // generate token
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        })

        // console.log(token);
        
        return token
    } catch (error) {
        console.log(error);
    }
}

export const tokenConfig = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "dev" ? false : true,
    sameSite: process.env.NODE_ENV === "dev" ? "Strict" : "none",
    maxAge: 24 * 60 * 60 * 1000 // 1 day
}
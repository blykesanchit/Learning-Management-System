import { configDotenv } from "dotenv";
import express from "express"
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import authRouter from "./routes/auth.js"
import userRouter from "./routes/user.js"
import courseRouter from "./routes/course.js"

configDotenv({ path: "./config/config.env" })

const app = express();

export default app;

// express.json returns a middleware hence we are using ()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)

// Using Error Middleware
// whenever a error occurs, express looks for middleware
// with 4 args and calls it.
// whenever you call next(err)
app.use(errorMiddleware)
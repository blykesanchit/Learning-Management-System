import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.js"
import { createOrder, verifyPayment } from "../controllers/order.js"

const orderRouter = express.Router()

orderRouter.post("/createorder", isAuthenticated, createOrder)
orderRouter.post("/verifypayment", isAuthenticated, verifyPayment)

export default orderRouter
import connectDb from "./config/database.js"
import app from "./app.js"

connectDb()

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "server working all fine buddy!"
    })
})

app.listen(process.env.PORT ? process.env.PORT : 4000, (err) => {
    console.log(`LISTENING ON PORT ${process.env.PORT}, IN ${process.env.NODE_ENV} MODE`);
})

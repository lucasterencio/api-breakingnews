import express from "express"
import connectDatabase from "./src/database/db.js"
import dotenv from "dotenv"
dotenv.config()


import userRoute from "./src/routes/user.route.js"
import authRoute from "./src/routes/auth.route.js"
import newsRoute from "./src/routes/news.route.js"
import swaggerRoute from "./src/routes/swagger.route.cjs"

const port = process.env.PORT || 3000
const app = express()
app.use(express.json())
connectDatabase()


app.use("/user", userRoute)
app.use("/auth", authRoute)
app.use("/news", newsRoute)
app.use("/doc", swaggerRoute)


app.listen(port, ()=> console.log(`Server is running in http://localhost:${port}`))
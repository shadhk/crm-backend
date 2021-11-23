require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const mongoose = require("mongoose")
const userRouter = require("./src/routers/user.router")
const ticketRouter = require("./src/routers/ticket.router")
const handleError = require("./src/utils/errorHandler")
const port = process.env.PORT || 8090

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
// app.use(helmet())
app.use(cors())
app.use(morgan("tiny"))

//Use Routers
app.use("/v1/user", userRouter)
app.use("/v1/ticket", ticketRouter)

app.use((req, res, next) => {
  const error = new Error("Resource not found")
  error.status = 404

  next(error)
})

app.use((error, req, res, next) => {
  handleError(error, res)
})

// mongodb connection setup
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

if (process.env.NODE_ENV !== "production") {
  const db = mongoose.connection
  db.on("open", () => console.log("**DB CONNECTED**"))
  db.on("error", error => console.log(error))
}

app.listen(port, () => {
  console.log(`PORT connected on ${port}`)
})

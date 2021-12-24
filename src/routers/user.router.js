const express = require("express")
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper")
const { insertUser, getUserByEmail, getUserById } = require("../model/user/User.model")
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper")
const { userAuthorization } = require("../middlewares/authorization.middleware")

const router = express.Router()

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" })

  next()
})

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  //this data coming from database
  const _id = req.user_id

  const userProf = await getUserById(_id)

  res.json({ user: userProf })
})

// Create new user route
router.post("/", async (req, res) => {
  try {
    const { name, company, address, phone, email, password } = req.body
    //validation
    if (!name) return res.status(400).send("Name is required")
    if (!password || password.length < 8) {
      return res.status(400).send("Password is required and should be min 8 characters long")
    }

    //hash password
    const hashedPassword = await hashPassword(password)

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPassword
    }

    const result = await insertUser(newUserObj)
    console.log(result)
    res.status(200).json({ message: "New user created successfully", result })
  } catch (error) {
    console.log(error)
    res.json({ status: "error", message: error.message })
  }
})

// User Sign in Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ status: "error", message: "Invalid Form Submission" })
  }

  const user = await getUserByEmail(email)

  const pwdDb = user && user._id ? user.password : null

  if (!pwdDb) return res.status(400).json({ status: "error", message: "Invalid email or password!" })

  const result = await comparePassword(password, pwdDb)

  if (!result) {
    return res.status(400).json({ status: "error", message: "Invalid email or password!" })
  }
  const accessJWT = await createAccessJWT(user.email, `${user._id}`)
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`)

  res.status(200).json({ status: "success", message: "Login Successfully", accessJWT, refreshJWT })
})

module.exports = router

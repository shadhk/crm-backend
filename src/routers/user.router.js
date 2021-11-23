const express = require("express")
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper")
const router = express.Router()

const { insertUser, getUserByEmail } = require("../model/user/User.model")

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" })

  next()
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
  console.log(result)

  res.status(200).json({ status: "success", message: "Login Successfully" })
})

module.exports = router

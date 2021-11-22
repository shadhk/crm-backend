const express = require("express")
const { hashPassword } = require("../helpers/bcrypt.helper")
const router = express.Router()

const { insertUser } = require("../model/user/User.model")

router.all("/", (req, res, next) => {
  // res.json({ message: "return from user router" })

  next()
})

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
    res.status(200).json({ success: "New user created successfully", result })
  } catch (error) {
    console.log(error)
    res.json({ status: "error", message: error.message })
  }
})

module.exports = router

const express = require("express")
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper")
const { insertUser, getUserByEmail, getUserById, updatePassword, storeUserRefreshJWT, verifyUser } = require("../model/user/User.model")
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper")
const { userAuthorization } = require("../middlewares/authorization.middleware")
const { setPasswordResetPin, getPinByEmailPin, deletePin } = require("../model/resetPin/ResetPin.model")
const { emailProcessor } = require("../helpers/email.helper")
const { resetPasswordReqValidation, updatePasswordReqValidation, newUserValidation } = require("../middlewares/formValidation.middleware")
const { deleteJWT } = require("../helpers/redis.helper")

const verificationURL = "http://localhost:3000/verification/"

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

  const { name, email } = userProf

  res.json({
    user: {
      _id,
      name,
      email
    }
  })
})

//verify user after user is signup
router.patch("/verify", async (req, res) => {
  //this data coming from database
  try {
    const { _id, email } = req.body

    //update our user database
    const result = await verifyUser(_id, email)

    if (result && result._id) {
      return res.json({ status: "success", message: "Your account has been activated, you may login now." })
    }

    return res.json({ status: "error", message: "Invalid request!" })
  } catch (error) {
    return res.json({ status: "error", message: "Invalid request!" })
  }
})

// Create new user router
router.post("/", newUserValidation, async (req, res) => {
  try {
    const { name, company, address, phone, email, password } = req.body

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

    await emailProcessor({
      email,
      type: "new-user-confirmation-required",
      verificationLink: verificationURL + result._id + "/" + email
    })
    res.json({ status: "success", message: "New user registration has been created successfully", result })
  } catch (error) {
    console.log(error)
    let message = "Unable to create new user at the moment, Please try again or contact administration"
    if (error.message.includes("duplicate key error collection")) {
      message = "this email already has an account"
    }
    res.json({ status: "error", message })
  }
})

// User Sign in Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid Form Submission" })
  }

  const user = await getUserByEmail(email)

  if (!user) {
    return res.json({ status: "error", message: "Account does not exist." })
  }

  if (!user.isVerified) {
    return res.json({ status: "error", message: "Your account has not been verified. Please check your email to verify your account" })
  }

  const pwdDb = user && user._id ? user.password : null

  if (!pwdDb) return res.json({ status: "error", message: "Invalid email or password!" })

  const result = await comparePassword(password, pwdDb)

  if (!result) {
    return res.json({ status: "error", message: "Invalid email or password!" })
  }
  const accessJWT = await createAccessJWT(user.email, `${user._id}`)
  const refreshJWT = await createRefreshJWT(user.email, `${user._id}`)

  res.json({ status: "success", message: "Login Successfully", accessJWT, refreshJWT })
})

// Password reset pin route
router.post("/reset-password", resetPasswordReqValidation, async (req, res) => {
  const { email } = req.body

  const user = await getUserByEmail(email)

  if (user && user._id) {
    /// create// 2. create unique 6 digit pin
    const setPin = await setPasswordResetPin(email)
    await emailProcessor({
      email,
      pin: setPin.pin,
      type: "request-new-password"
    })
  }

  res.json({
    status: "success",
    message: "If the email is exist in our database, the password reset pin will be sent shortly."
  })
})

// update new password
router.patch("/reset-password", updatePasswordReqValidation, async (req, res) => {
  const { email, pin, newPassword } = req.body

  const getPin = await getPinByEmailPin(email, pin)
  if (getPin?._id) {
    const dbDate = getPin.addedAt
    const expiresIn = 1

    let expDate = dbDate.setDate(dbDate.getDate()) + expiresIn

    const today = new Date()

    if (today < expDate) {
      return res.json({ status: "error", message: "Invalid or required pin" })
    }

    // encrypt password
    const hashedPass = await hashPassword(newPassword)

    const user = await updatePassword(email, hashedPass)

    if (user._id) {
      //send email notification
      await emailProcessor({ email, type: "password-update-success" })

      deletePin(email, pin)

      return res.json({ status: "success", message: "Your password has been updated" })
    }
  }
  res.json({ status: "error", message: "Unable to update your password. Please try again later." })
})

// User Logout and invalidate jwt
router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers
  //this data coming from database
  const _id = req.user_id

  // delete accessJWT from redis database
  deleteJWT(authorization)

  // delete refreshJWT from mongodb
  const result = await storeUserRefreshJWT(_id, "")

  if (result._id) {
    return res.json({ status: "success", message: "loged out successfully" })
  }
  res.json({ status: "error", message: "unable to log you out, please try agin later." })
})

module.exports = router

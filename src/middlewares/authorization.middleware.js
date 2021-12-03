const { verifyAccessJWT } = require("../helpers/jwt.helper")

const userAuthorization = (req, res, next) => {
  const { authorization } = req.headers
  console.log(authorization)

  //1. verify if jwt is valid
  const decoded = verifyAccessJWT(authorization)
  console.log(decoded)
  if (decoded.email) {
  }

  res.status(403).json({ message: "Forbidden" })

  next()
}

module.exports = {
  userAuthorization
}

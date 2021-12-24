const { verifyAccessJWT } = require("../helpers/jwt.helper")
const { getJWT, deleteJWT } = require("../helpers/redis.helper")

const userAuthorization = async (req, res, next) => {
  const { authorization } = req.headers

  //1. verify if jwt is valid
  const decoded = await verifyAccessJWT(authorization)

  if (decoded.email) {
    const user_id = await getJWT(authorization)

    if (!user_id) {
      return res.status(403).json({ message: "Forbidden" })
    }

    req.user_id = user_id
    return next()
  }

  deleteJWT(authorization)
  return res.status(403).json({ message: "Forbidden" })
}

module.exports = {
  userAuthorization
}

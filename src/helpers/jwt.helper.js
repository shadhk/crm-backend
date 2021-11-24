const jwt = require("jsonwebtoken")

const createAccessJWT = payload => {
  const accessJWT = jwt.sign({ payload }, process.env.JWT_ACCESS_KEY, { expiresIn: "15m" })

  return Promise.resolve(accessJWT)
}

const createRefreshJWT = payload => {
  const refreshJWT = jwt.sign({ payload }, process.env.JWT_REFRESH_ACCESS_KEY, { expiresIn: "30d" })

  return Promise.resolve(refreshJWT)
}

module.exports = {
  createAccessJWT,
  createRefreshJWT
}

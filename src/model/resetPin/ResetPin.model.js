const { token } = require("morgan")
const { ResetPinSchema } = require("./ResetPin.Schema")
const { randomPinNumber } = require("../../utils/randomGenerator")

const setPasswordResetPin = async email => {
  //reset 6 digit pin
  const pinLength = 6
  const randPin = await randomPinNumber(pinLength)

  const resetobj = {
    email,
    pin: randPin
  }
  return new Promise((resolve, reject) => {
    ResetPinSchema(resetobj)
      .save()
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

module.exports = {
  setPasswordResetPin
}

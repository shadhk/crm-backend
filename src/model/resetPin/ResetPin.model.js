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

const getPinByEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOne({ email, pin }, (error, data) => {
        if (error) {
          console.log(error)
          resolve(false)
        }
        resolve(data)
      })
    } catch (error) {
      reject(error)
      console.log(error)
    }
  })
}

const deletePin = (email, pin) => {
  try {
    ResetPinSchema.findOneAndDelete({ email, pin }, (error, data) => {
      if (error) {
        console.log(error)
      }
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePin
}

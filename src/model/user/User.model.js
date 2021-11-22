const { UserSchema } = require("./User.Schema")

const insertUser = userObj => {
  return new Promise((resolve, reject) => {
    UserSchema(userObj)
      .save()
      .then(data => resolve(data))
      .catch(error => reject(error))
  })
}

module.exports = {
  insertUser
}

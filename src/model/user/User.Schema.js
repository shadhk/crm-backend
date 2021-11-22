const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    max: 50,
    require: true
  },
  company: {
    type: String,
    max: 50,
    require: true
  },
  address: {
    type: String,
    max: 100
  },
  phone: {
    type: Number,
    maxlength: 11
  },
  email: {
    type: String,
    trim: true,
    max: 50,
    require: true,
    unique: true
  },
  password: {
    type: String,
    min: 8,
    max: 50,
    require: true
  }
})

module.exports = {
  UserSchema: mongoose.model("User", UserSchema)
}

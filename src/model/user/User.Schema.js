const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    max: 50,
    required: true
  },
  company: {
    type: String,
    max: 50,
    required: true
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
    required: true,
    index: true,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    min: 8,
    max: 50,
    required: true
  },
  refreshJWT: {
    token: {
      type: String,
      max: 500,
      default: ""
    },
    addedAt: {
      type: Date,
      required: true,
      default: Date.now()
    }
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false
  }
})

module.exports = {
  UserSchema: mongoose.model("User", UserSchema)
}

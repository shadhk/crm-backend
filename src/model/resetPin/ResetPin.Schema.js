const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ResetPinSchema = new Schema({
  pin: {
    type: String,
    maxlength: 6,
    minlength: 6
  },
  email: {
    type: String,
    trim: true,
    max: 50,
    required: true,
    index: true,
    sparse: true
  },
  addedAt: {
    type: Date,
    required: true,
    default: Date.now()
  }
})

module.exports = {
  ResetPinSchema: mongoose.model("Reset_Pin", ResetPinSchema)
}

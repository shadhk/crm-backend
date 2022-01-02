const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TicketSchema = new Schema({
  clientId: {
    type: Schema.Types.ObjectId
  },
  subject: {
    type: String,
    max: 100,
    required: true,
    default: ""
  },
  openAt: {
    type: Date,
    required: true,
    default: Date.now()
  },
  status: {
    type: String,
    max: 30,
    required: true,
    default: "Pending operator response"
  },
  conversation: [
    {
      sender: {
        type: String,
        max: 50,
        required: true,
        default: ""
      },
      message: {
        type: String,
        max: 100,
        required: true,
        default: ""
      },
      msgAt: {
        type: Date,
        required: true,
        default: Date.now()
      }
    }
  ]
})

module.exports = {
  TicketSchema: mongoose.model("Ticket", TicketSchema)
}

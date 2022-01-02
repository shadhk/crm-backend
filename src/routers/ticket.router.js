const express = require("express")
const router = express.Router()
const { insertTicket } = require("../model/ticket/Ticket.Model")

router.all("/", (req, res, next) => {
  // res.json({ message: "return from ticket router" })

  next()
})

//create url endpoint
router.post("/", async (req, res) => {
  try {
    const { subject, sender, message } = req.body

    const ticketobj = {
      clientId: "61cf2430fc5ce295e5f3a4ae",
      subject,
      conversation: [
        {
          sender,
          message
        }
      ]
    }

    const result = await insertTicket(ticketobj)
    if (result._id) {
      return res.json({ status: "success", message: "New ticket has been created" })
    }
    //insert into mongodb
    res.json({ status: "error", message: "unable to create the ticket, please try again later." })
  } catch (error) {
    res.json({ status: "error", message: error.message })
  }
})

module.exports = router

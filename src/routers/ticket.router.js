const express = require("express")
const router = express.Router()
const { insertTicket, getTickets, getTicketById } = require("../model/ticket/Ticket.Model")
const { userAuthorization } = require("../middlewares/authorization.middleware")

router.all("/", (req, res, next) => {
  // res.json({ message: "return from ticket router" })

  next()
})

//create new ticket
router.post("/", userAuthorization, async (req, res) => {
  try {
    const { subject, sender, message } = req.body
    const user_id = req.user_id

    const ticketobj = {
      clientId: user_id,
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

//get all tickets for a specific user only
router.get("/", userAuthorization, async (req, res) => {
  try {
    const user_id = req.user_id
    const result = await getTickets(user_id)
    return res.json({ status: "success", result })
  } catch (error) {
    res.json({ status: "error", message: error.message })
  }
})

//get specific tickets for a specific user only
router.get("/:ticket_id", userAuthorization, async (req, res) => {
  try {
    const { ticket_id } = req.params
    const client_id = req.user_id
    const result = await getTicketById(ticket_id, client_id)
    return res.json({ status: "success", result })
  } catch (error) {
    res.json({ status: "error", message: error.message })
  }
})

module.exports = router

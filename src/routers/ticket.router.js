const express = require("express")
const router = express.Router()
const { insertTicket, getTickets, getTicketById, updateClientReply, updateStatusClose, deleteTicket } = require("../model/ticket/Ticket.Model")
const { userAuthorization } = require("../middlewares/authorization.middleware")
const { createNewTicketValidation, replyTicketMessageValidation } = require("../middlewares/formValidation.middleware")

router.all("/", (req, res, next) => {
  // res.json({ message: "return from ticket router" })

  next()
})

//create new ticket
router.post("/", createNewTicketValidation, userAuthorization, async (req, res) => {
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
router.get("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params
    const clientId = req.user_id
    const result = await getTicketById(_id, clientId)
    return res.json({ status: "success", result })
  } catch (error) {
    res.json({ status: "error", message: error.message })
  }
})

//update reply message from client
router.put("/:_id", replyTicketMessageValidation, userAuthorization, async (req, res) => {
  try {
    const { message, sender } = req.body
    const { _id } = req.params
    const clientId = req.user_id

    const result = await updateClientReply({ _id, clientId, message, sender })

    if (result._id) {
      return res.json({
        status: "success",
        message: "Your message updated"
      })
    }
    res.json({ status: "error", message: "unable to update your message, please try again later." })
  } catch (error) {
    res.json({ status: "error", message: error.message })
  }
})

//update ticket status to close
router.patch("/close-ticket/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params
    const clientId = req.user_id

    const result = await updateStatusClose({ _id, clientId })
    if (result._id) {
      return res.json({
        status: "success",
        message: "The ticket has been closed."
      })
    }
    res.json({ status: "error", message: "unable to update the ticket." })
  } catch (error) {
    res.json({ status: "error", message: error.message })
  }
})

//delete a ticket
router.delete("/:_id", userAuthorization, async (req, res) => {
  try {
    const { _id } = req.params
    const clientId = req.user_id

    const result = await deleteTicket({ _id, clientId })

    return res.json({
      status: "success",
      message: "The ticket has been deleted."
    })
  } catch (error) {
    res.json({ status: "error", message: error.message })
  }
})

module.exports = router

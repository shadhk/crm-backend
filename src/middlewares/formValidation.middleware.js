const Joi = require("joi")

const email = Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })

const pin = Joi.number().integer().min(000000).max(999999).required()
const phone = Joi.number().min(6000000001).max(9000000009).required()

const newPassword = Joi.string().alphanum().min(3).max(30).required()

const shortStr = Joi.string().min(3).max(50)
const longStr = Joi.string().min(3).max(50)
const dt = Joi.date()

const resetPasswordReqValidation = (req, res, next) => {
  const schema = Joi.object({ email })

  const value = schema.validate(req.body)

  if (value.error) {
    return res.json({ status: "error", message: value.error.message })
  }
  next()
}

const updatePasswordReqValidation = (req, res, next) => {
  const schema = Joi.object({ email, pin, newPassword })

  const value = schema.validate(req.body)

  if (value.error) {
    return res.json({ status: "error", message: value.error.message })
  }
  next()
}

const createNewTicketValidation = (req, res, next) => {
  const schema = Joi.object({
    subject: shortStr.required(),
    sender: shortStr.required(),
    message: longStr.required(),
    issueDate: dt.required()
  })

  const value = schema.validate(req.body)

  if (value.error) {
    return res.json({ status: "error", message: value.error.message })
  }
  next()
}

const replyTicketMessageValidation = (req, res, next) => {
  const schema = Joi.object({
    sender: shortStr.required(),
    message: longStr.required()
  })

  const value = schema.validate(req.body)

  if (value.error) {
    return res.json({ status: "error", message: value.error.message })
  }
  next()
}

const newUserValidation = (req, res, next) => {
  const schema = Joi.object({
    name: shortStr.required(),
    company: shortStr.required(),
    address: shortStr.required(),
    phone: phone,
    email: email.required(),
    password: shortStr.required()
  })

  const value = schema.validate(req.body)

  if (value.error) {
    return res.json({ status: "error", message: value.error.message })
  }

  next()
}

module.exports = {
  resetPasswordReqValidation,
  updatePasswordReqValidation,
  createNewTicketValidation,
  replyTicketMessageValidation,
  newUserValidation
}

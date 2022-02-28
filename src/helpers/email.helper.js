const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: "ramiro.durgan11@ethereal.email",
    pass: "RxqPjAMtBAB8kJTWjN"
  }
})

const send = info => {
  return new Promise(async (resolve, reject) => {
    try {
      // send mail with defined transport object
      let result = await transporter.sendMail(info)

      console.log("Message sent: %s", result.messageId)
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result))
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}

const emailProcessor = ({ email, pin, type, verificationLink = "" }) => {
  let info = ""
  switch (type) {
    case "request-new-password":
      info = {
        from: '"Ramiro Durgan" <ramiro.durgan11@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password Reset Pin", // Subject line
        text: "Here is your password reset pin" + pin + "This pin will expire in 1 day.", // plain text body
        html: `<p>
        <b>Hello </b>
        Here is your pin 
        <b>${pin}. </b>
        This pin will expire in 1 day.
        </p>` // html body
      }
      send(info)
      break
    case "password-update-success":
      info = {
        from: '"Ramiro Durgan" <ramiro.durgan11@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Password updated successfully.", // Subject line
        text: "Your new password has been updated.", // plain text body
        html: `<p>
      <b>Hello </b>
      Your new Password has been updated.
      </p>` // html body
      }
      send(info)
      break
    case "new-user-confirmation-required":
      info = {
        from: '"Ramiro Durgan" <ramiro.durgan11@ethereal.email>', // sender address
        to: email, // list of receivers
        subject: "Verification required before login to new account.", // Subject line
        text: "Please follow the link to very your account before you can login.", // plain text body
        html: `<p>
      <b>Hello </b>
      Please follow the link to very your account before you can login.
      </p>
      <p>${verificationLink}</p> 
      ` // html body
      }
      send(info)
      break
    default:
      break
  }
}

module.exports = { emailProcessor }

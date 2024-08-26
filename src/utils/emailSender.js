const nodemailer = require("nodemailer");

const tranporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async ({ receiver, subject, content }) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: receiver,
    subject,
    html: content,
  };

  const response = await tranporter.sendMail(mailOptions);
  return response;
};

module.exports = { sendEmail };
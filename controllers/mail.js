"use strict";
const nodemailer = require("nodemailer");

const enviarEmail = async (emailData) => {
  // console.log(emailData);
  const { emailPara, nombreDe, msg } = emailData;
  const transporter = nodemailer.createTransport({
    host: "mail.server272.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "aneappcr@sacipcr.com", // generated ethereal user
      pass: "MaFeLiCa.2326", // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: '"AppANE EMM Costa Rica" <aneappcr@sacipcr.com>',
    to: emailPara,
    subject: "Mensaje desde el APPAne",
    text: msg,
    html: `<b>${msg}</b>`,
  });
  // console.log("Message sent: %s", info.messageId);
  // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = { enviarEmail };

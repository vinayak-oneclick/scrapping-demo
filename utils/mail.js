const nodemailer = require("nodemailer");

const sendmail = (subject, html) => {

  const transporter = nodemailer.createTransport({
    port: 465, 
    host: "smtp.gmail.com",
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
    secure: true,
    requireTLS: true,
  });

  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: "chavan.vinayak017@gmail.com, pratikp@itoneclick.com, manishj@itoneclick.com",
    subject,
    html,
  };

  transporter.sendMail(mailOptions);
};

module.exports = {sendmail};
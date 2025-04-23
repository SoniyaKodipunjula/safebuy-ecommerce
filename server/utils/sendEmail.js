require('dotenv').config({ path: __dirname + '/.env' });
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  console.log(`Attempting to send email to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Text: ${text}`);

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"safebuy-ecommerce" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log('Email sent successfully!');
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "********" : "MISSING");

};

module.exports = sendEmail;

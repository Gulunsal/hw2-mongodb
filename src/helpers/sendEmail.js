const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  const email = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  };

  await transporter.sendMail(email);
};

module.exports = sendEmail; 
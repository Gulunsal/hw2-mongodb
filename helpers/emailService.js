const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Şifre Sıfırlama',
    html: `
      <h1>Şifre Sıfırlama İsteği</h1>
      <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
      <a href="${resetLink}">Şifremi Sıfırla</a>
      <p>Bu bağlantı 5 dakika süreyle geçerlidir.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Email gönderilemedi');
  }
};

module.exports = {
  sendResetPasswordEmail
}; 
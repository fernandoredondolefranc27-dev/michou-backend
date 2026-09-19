const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  family: 4, // Force la connexion en IPv4 pour contourner le blocage IPv6 de Render
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"MICHOU STUDIO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`✉️ E-mail envoyé avec succès à : ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi de l’e-mail :', error.message);
    return false;
  }
};
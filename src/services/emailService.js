const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: 'MICHOU STUDIO <onboarding@resend.dev>',
      to: [to],
      subject,
      html
    });

    console.log('✉️ E-mail envoyé avec succès via Resend API :', data);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi de l’e-mail :', error.message);
    return false;
  }
};
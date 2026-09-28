const { Resend } = require('resend');

// 🔍 Ligne de vérification temporaire pour le terminal :
console.log("Clé API détectée dans le backend :", process.env.RESEND_API_KEY);

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Clé API Resend manquante dans les variables d'environnement.");
  }
  return new Resend(apiKey);
};

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    const resend = getResendClient();
    const data = await resend.emails.send({
      from: 'MICHOU STUDIO <onboarding@resend.dev>',
      to,
      subject,
      html
    });
    console.log("✉️ E-mail envoyé avec succès via Resend API :", data);
    return data;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'e-mail via Resend :", error.message);
    throw error;
  }
};
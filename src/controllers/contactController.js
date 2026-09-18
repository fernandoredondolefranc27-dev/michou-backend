const { sendEmail } = require('../services/emailService');

exports.sendComplaint = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Le message est obligatoire.' });
    }

    // Envoi de l'e-mail de réclamation à la direction du studio
    await sendEmail({
      to: process.env.STUDIO_EMAIL,
      subject: `🚨 RÉCLAMATION CONFIDENTIELLE : ${subject || 'Sans sujet'}`,
      html: `
        <div style="font-family: Arial, sans-serif; border: 2px solid #D4A72C; padding: 20px; background-color: #fcfcfc;">
          <h2 style="color: #D4A72C; margin-top: 0;">MICHOU STUDIO — MESSAGE DIRECTION</h2>
          <p><strong>Nom du client :</strong> ${name || 'Anonyme'}</p>
          <p><strong>Email de contact :</strong> ${email || 'Non renseigné'}</p>
          <p><strong>Objet :</strong> ${subject || 'Réclamation'}</p>
          <hr style="border: 0; border-top: 1px solid #ccc; margin: 15px 0;" />
          <p><strong>Contenu du message :</strong></p>
          <div style="background: #ffffff; padding: 15px; border-left: 4px solid #D4A72C; border: 1px solid #e0e0e0;">
            ${message}
          </div>
        </div>
      `
    });

    res.status(200).json({
      success: true,
      message: 'Votre réclamation a été transmise en toute confidentialité à la direction.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du traitement de la réclamation.' });
  }
};
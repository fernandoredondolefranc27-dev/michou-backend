const { sendEmail } = require('../services/emailService');

let bookings = [];

exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, service, duration, date, time, notes } = req.body;

    if (!name || !phone || !service || !date || !time) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires.' });
    }

    const passId = `MICHOU-${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingDate = new Date(`${date}T23:59:59`);
    const creationTime = new Date().toLocaleString('fr-FR', { timeZone: 'America/Port-au-Prince' });

    const newBooking = {
      id: Date.now(),
      passId,
      name,
      email: email || 'Non renseigné',
      phone,
      service,
      duration: duration || 'Non spécifiée',
      date,
      time,
      notes: notes || 'Aucune',
      status: 'VALIDE',
      validUntil: bookingDate,
      createdAt: creationTime
    };

    bookings.push(newBooking);

    // 1. Envoi de l'e-mail au client
    if (email) {
      await sendEmail({
        to: email,
        subject: `🎟️ Votre Pass Studio Michou [${passId}]`,
        html: `
          <div style="font-family: Arial, sans-serif; border: 2px solid #D4A72C; padding: 20px; background-color: #0d0d0d; color: #ffffff;">
            <h2 style="color: #D4A72C; text-align: center;">MICHOU STUDIO — PASS DE RÉSERVATION</h2>
            <p>Bonjour <strong>${name}</strong>,</p>
            <p>Votre rendez-vous a bien été enregistré. Voici vos détails de réservation :</p>
            
            <div style="background: #1a1a1a; padding: 15px; border: 1px solid #333; margin: 15px 0;">
              <h1 style="color: #D4A72C; text-align: center; margin: 0 0 10px 0;">${passId}</h1>
              <p><strong>Service :</strong> ${service} (${duration || ''})</p>
              <p><strong>Date demandée :</strong> ${date}</p>
              <p><strong>Heure demandée :</strong> ${time}</p>
              <p><strong>Téléphone :</strong> ${phone}</p>
              <p><strong>Email :</strong> ${email}</p>
              <p><strong>Demande particulière :</strong> ${notes || 'Aucune'}</p>
            </div>
            
            <p style="color: #D4A72C; font-size: 0.85em;">
              ⚠️ Pass valable uniquement le <strong>${date}</strong> jusqu'à 23h59. Passé cette limite, ce pass est expiré.
            </p>
          </div>
        `
      });
    }

    // 2. Notification complète envoyée au Studio
    await sendEmail({
      to: process.env.STUDIO_EMAIL,
      subject: `🔔 NOUVELLE RÉSERVATION : ${name} [${passId}]`,
      html: `
        <div style="font-family: Arial, sans-serif; border: 2px solid #D4A72C; padding: 20px; background-color: #0d0d0d; color: #ffffff;">
          <h2 style="color: #D4A72C;">RÉSERVATION REÇUE DU SITE WEB</h2>
          <p><strong>Date & Heure d'envoi de la réservation :</strong> ${creationTime}</p>
          <hr style="border-color: #333;" />
          
          <h3 style="color: #D4A72C;">1. INFORMATIONS CLIENT</h3>
          <p><strong>Nom complet :</strong> ${name}</p>
          <p><strong>Téléphone :</strong> ${phone}</p>
          <p><strong>Email :</strong> ${email || 'Non renseigné'}</p>
          <p><strong>Demande particulière :</strong> ${notes || 'Aucune'}</p>
          
          <hr style="border-color: #333;" />
          
          <h3 style="color: #D4A72C;">2. DÉTAILS DE LA PRESTATION</h3>
          <p><strong>Service choisi :</strong> ${service}</p>
          <p><strong>Durée estimée :</strong> ${duration || 'Non spécifiée'}</p>
          <p><strong>Date du rendez-vous :</strong> ${date}</p>
          <p><strong>Heure du rendez-vous :</strong> ${time}</p>
          <p><strong>Code Pass unique :</strong> <span style="color: #D4A72C; font-size: 1.2em; font-weight: bold;">${passId}</span></p>
        </div>
      `
    });

    res.status(201).json({
      success: true,
      message: 'Réservation confirmée avec succès !',
      pass: newBooking
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la réservation.' });
  }
};

exports.getBookingByPass = async (req, res) => {
  try {
    const { passId } = req.params;
    const booking = bookings.find(b => b.passId === passId);

    if (!booking) {
      return res.status(404).json({ message: 'Carte de réservation introuvable.' });
    }

    const now = new Date();
    const isExpired = now > new Date(booking.validUntil);

    res.status(200).json({
      ...booking,
      status: isExpired ? 'EXPIRÉ' : 'VALIDE'
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification du Pass.' });
  }
};
// import nodemailer from "nodemailer";

// export const sendRegistrationEmail = async (to: string, name: string) => {
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST!,
//     port: Number(process.env.SMTP_PORT),
//     auth: {
//       user: process.env.SMTP_USER!,
//       pass: process.env.SMTP_PASS!,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"Jsr-emploi" <no-reply@jsr-emploi.com>',
//     to: to,
//     subject: "Bienvenue sur Jsr-emploi ! 🎉",
//     html: `<h2>Bonjour ${name},</h2>
//            <p>Votre compte a été créé avec succès !</p>
//            <p>Merci de rejoindre notre plateforme.</p>`,
//   });

//   console.log("Email envoyé : %s", info.messageId);
// };


import nodemailer from "nodemailer";

export const sendRegistrationEmail = async (to: string, name: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Utilisation de Gmail
    auth: {
      user: process.env.EMAIL_USER!, 
      pass: process.env.EMAIL_PASS!, 
    },
  });

  const info = await transporter.sendMail({
    from: '"Jsr-emploi" <no-reply@jsr-emploi.com>',
    to: to,
    subject: "Bienvenue sur Jsr-emploi ! 🎉",
    html: `<h2>Bonjour ${name},</h2>
           <p>Votre compte a été créé avec succès !</p>
            <p>1 mois gratuit des cet instant </p>
           <p>Merci de rejoindre notre plateforme.</p>`,
  });

  console.log("Email envoyé : %s", info.messageId);
};

export async function sendExpirationEmail(email: string, role: string, endDate: Date) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const tariffUrl = process.env.TARIFF_PAGE_URL!;

  let planSuggestion = '';
  let subject = 'Rappel : Votre abonnement a expiré';
  if (role === 'employeur') {
    planSuggestion = `Nous vous recommandons le plan Payant Recruteur (100€/an).`;
    subject = 'Rappel : Votre essai employeur a expiré';
  } else if (role === 'candidat') {
    planSuggestion = `Nous vous recommandons le plan Payant Candidat (10€/an).`;
    subject = 'Rappel : Votre essai candidat a expiré';
  }

  const mailOptions = {
    from: '"Jsr-emploi" <no-reply@jsr-emploi.com>',
    to: email,
    subject: subject,
    html: `
      <h1>${subject}</h1>
      <p>Bonjour,</p>
      <p>Votre abonnement gratuit s'est terminé le ${endDate.toLocaleDateString()}. ${planSuggestion}</p>
      <p>Pour continuer à bénéficier de nos services :</p>
      <ul>
        <li><a href="${tariffUrl}">Consultez nos tarifs</a> pour plus d'options.</li>
      </ul>
      <p>Cordialement,<br>L'équipe Jsr-emploi</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email d'expiration envoyé à ${email} : ${info.messageId}`);
  } catch (error) {
    console.error(`Erreur lors de l'envoi de l'email à ${email}:`, error);
    throw error;
  }
}
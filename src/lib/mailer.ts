

// import nodemailer from "nodemailer";

// export const sendRegistrationEmail = async (to: string, name: string) => {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail', // Utilisation de Gmail
//     auth: {
//       user: process.env.EMAIL_USER!, 
//       pass: process.env.EMAIL_PASS!, 
//     },
//   });

//   const info = await transporter.sendMail({
//     from: '"Jsr-alternance" <no-reply@jsr-alternance.com>',
//     to: to,
//     subject: "Bienvenue sur Jsr-alternance ! 🎉",
//     html: `<h2>Bonjour ${name},</h2>
//            <p>Votre compte a été créé avec succès !</p>
//            <p>Merci de rejoindre notre plateforme.</p> `,
//   });

//   console.log("Email envoyé : %s", info.messageId);
// };

// export async function sendExpirationEmail(email: string, role: string, endDate: Date) {
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER!,
//       pass: process.env.EMAIL_PASS!,
//     },
//   });

//   const tariffUrl = process.env.TARIFF_PAGE_URL!;

//   let planSuggestion = '';
//   const subject = 'Rappel : Votre abonnement a expiré';
//   if (role === 'employeur') {
//     planSuggestion = `Nous vous recommandons le plan Payant Recruteur (100€/an).`;
//   } else if (role === 'candidat') {
//     planSuggestion = `Nous vous recommandons le plan Payant Candidat (10€/an).`;
//   }

//   const mailOptions = {
//     from: '"Jsr-alternance" <no-reply@jsr-alternance.com>',
//     to: email,
//     subject: subject,
//     html: `
//       <h1>${subject}</h1>
//       <p>Bonjour,</p>
//       <p>Votre abonnement s'est terminé le ${endDate.toLocaleDateString()}. ${planSuggestion}</p>
//       <p>Pour continuer à bénéficier de nos services :</p>
//       <ul>
//         <li><a href="${tariffUrl}">Consultez nos tarifs</a> pour plus d'options.</li>
//       </ul>
//       <p>Cordialement,<br>L'équipe Jsr-alternance</p>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`Email d'expiration envoyé à ${email} : ${info.messageId}`);
//   } catch (error) {
//     console.error(`Erreur lors de l'envoi de l'email à ${email}:`, error);
//     throw error;
//   }
// }

import { Resend } from 'resend';
import { render } from '@react-email/render';
import VerificationEmail from '@/emails/VerificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (to: string, name: string, verificationLink: string) => {
  try {
    // On transforme notre composant React en HTML
    const emailHtml =  await render(VerificationEmail({ userName: name, verificationLink }));

    await resend.emails.send({
      from: 'Jsr-alternance <contact@jsr-alternance.fr>', 
      to: to,
      subject: "Validez votre adresse e-mail pour Jsr-alternance",
      html: emailHtml, // On envoie le HTML généré par React Email
    });

    console.log(`Email de vérification envoyé à ${to}`);
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de vérification:", error);
    throw new Error("L'e-mail n'a pas pu être envoyé.");
  }
};

export const sendContactFormEmail = async (formData: { senderName: string, senderEmail: string, message: string }) => {
  const { senderName, senderEmail, message } = formData;
  
  try {
    await resend.emails.send({
      from: 'Contact Jsr-Alternance <contact@jsr-alternance.fr>', // Une adresse de votre domaine vérifié
      to: 'Contact@jsr-alternance.fr', // 👈 L'email où VOUS recevez les messages
      subject: `Nouveau message de ${senderName} via le site`,
      replyTo: senderEmail, 
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Nouveau message depuis le formulaire de contact</h2>
          <p><strong>Nom :</strong> ${senderName}</p>
          <p><strong>Email :</strong> ${senderEmail}</p>
          <hr>
          <p><strong>Message :</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    });
    console.log(`Message de contact de ${senderEmail} envoyé avec succès.`);
  } catch (error) {
    console.error("Erreur lors de l'envoi du message de contact:", error);
    throw new Error("Le message n'a pas pu être envoyé.");
  }
};

import nodemailer from "nodemailer";

export const sendRegistrationEmail = async (to: string, name: string) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port: Number(process.env.SMTP_PORT),
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASS!,
    },
  });

  const info = await transporter.sendMail({
    from: '"Jsr-emploi" <no-reply@jsr-emploi.com>',
    to: to,
    subject: "Bienvenue sur Jsr-emploi ! 🎉",
    html: `<h2>Bonjour ${name},</h2>
           <p>Votre compte a été créé avec succès !</p>
           <p>Merci de rejoindre notre plateforme.</p>`,
  });

  console.log("Email envoyé : %s", info.messageId);
};

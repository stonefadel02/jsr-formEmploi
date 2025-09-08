// create-user.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

// Assurez-vous que le chemin vers votre modèle est correct
const EmployerModelPromise = require('./src/models/Employer').default; 

// 👇 Mettez ici les informations de l'utilisateur à créer/mettre à jour
const USER_EMAIL = 'kaladlyon@gmail.com';
const USER_PASSWORD = 'LeMotDePasseQueVousVoulez'; // Mettez un mot de passe temporaire
const USER_COMPANY_NAME = "Nom de l'entreprise de Kaladlyon";
const USER_SIRET = "12345678901234";

const run = async () => {
  if (!process.env.MONGODB_EMPLOYERS_URI) {
    console.error("Erreur : MONGODB_EMPLOYERS_URI n'est pas défini.");
    process.exit(1);
  }

  let connection;
  try {
    console.log('Connexion à la base de données...');
    connection = await mongoose.connect(process.env.MONGODB_EMPLOYERS_URI);
    console.log('Connexion réussie.');

    const EmployerModel = await EmployerModelPromise;

    console.log('Hachage du mot de passe...');
    const hashedPassword = await bcrypt.hash(USER_PASSWORD, 10);

    console.log('Mise à jour du compte...');
    await EmployerModel.findOneAndUpdate(
      { email: USER_EMAIL.toLowerCase() },
      {
        $set: {
          companyName: USER_COMPANY_NAME,
          email: USER_EMAIL.toLowerCase(),
          password: hashedPassword,
          role: "employeur",
          status: "Validé",
          isActive: true,
          isEmailVerified: true,
          siret: USER_SIRET,
          acceptTerms: true,
          subscription: {
              plan: "Payant Annuel",
              isActive: true,
              startDate: new Date(),
              endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
          },
        },
      },
      { upsert: true } // Crée l'utilisateur s'il n'existe pas
    );

    console.log(`✅ Compte pour ${USER_EMAIL} créé/mis à jour avec succès !`);

  } catch (error) {
    console.error('❌ Erreur :', error);
  } finally {
    if (connection) {
      await connection.disconnect();
      console.log('Déconnexion.');
    }
    process.exit();
  }
};

run();
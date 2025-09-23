import { Schema, Model } from "mongoose";
import { connectCandidatsDb } from "../lib/mongodb";
import { ICandidat } from "@/lib/types";

// Schéma Mongoose
const candidateSchema = new Schema<ICandidat>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    formation: { type: String }, // Formation
    password: {
      type: String,
      required: function (this: ICandidat) {
        return this.authProvider === "local";
      },
    },
    role: {
      type: String,
      default: "candidat",
      index: true,
    },
    authProvider: { type: String, default: "local" },
    phone: { type: String },
    alternanceSearch: {
      sector: { type: String },
      location: { type: String },
      date: { type: Date }, // Date de naissance
      level: { type: String },
      contracttype: { type: String },
      posteSouhaite: { type: String }, // ✅ NOUVEAU
      dateDebut: { type: Date }, // ✅ NOUVEAU
      dateFin: { type: Date },
    },
    cvUrl: { type: String },
    videoUrl: { type: String },
    photoUrl: { type: String },
    isActive: { type: Boolean, default: false }, // Ajout de l'état actif
    rgpdConsent: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["En attente", "Validé", "Refusé"],
      default: "En attente",
      index: true,
    },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
    subscription: { type: Schema.Types.ObjectId, ref: "CandidatSubscription" }, // Ajout de la référence
  },
  {
    timestamps: true,
  }
);

// Fonction pour obtenir le modèle
const getCandidatModel = async (): Promise<Model<ICandidat>> => {
  const db = await connectCandidatsDb();

  // Vérifier si le modèle existe déjà pour cette connexion
  if (db.models.Candidat) {
    return db.models.Candidat as Model<ICandidat>;
  }

  // Sinon, définir le modèle
  return db.model<ICandidat>("Candidat", candidateSchema);
};

// Exporter une instance unique du modèle
const CandidatModelPromise = getCandidatModel();

export default CandidatModelPromise;


// import { Schema, Model, Connection } from "mongoose";
// import { connectCandidatsDb } from "../lib/mongodb";
// import { ICandidat } from "@/lib/types";

// // Schéma Mongoose
// const candidateSchema = new Schema<ICandidat>(
//   {
//     firstName: { type: String },
//     lastName: { type: String },
//     email: { type: String, required: true, unique: true },
//     formation: { type: String }, // Formation
//     password: {
//       type: String,
//       required: function (this: ICandidat) {
//         return this.authProvider === "local";
//       },
//     },
//     role: {
//       type: String,
//       default: "candidat",
//       index: true,
//     },
//     authProvider: { type: String, default: "local" },
//     phone: { type: String },
//     alternanceSearch: {
//       sector: { type: String },
//       location: { type: String },
//       date: { type: Date }, // Date de naissance
//       level: { type: String },
//       contracttype: { type: String },
//       posteSouhaite: { type: String }, // ✅ NOUVEAU
//       dateDebut: { type: Date }, // ✅ NOUVEAU
//       dateFin: { type: Date },
//     },
//     cvUrl: { type: String },
//     videoUrl: { type: String },
//     photoUrl: { type: String },
//     isActive: { type: Boolean, default: false }, // Ajout de l'état actif
//     rgpdConsent: { type: Boolean, default: false },
//     status: {
//       type: String,
//       enum: ["En attente", "Validé", "Refusé"],
//       default: "En attente",
//       index: true,
//     },
//   isEmailVerified: { type: Boolean, default: false },
//   emailVerificationToken: { type: String },
//   emailVerificationExpires: { type: Date },
//     subscription: { type: Schema.Types.ObjectId, ref: "CandidatSubscription" }, // Ajout de la référence
//   },
//   {
//     timestamps: true,
//   }
// );

// // Fonction pour obtenir le modèle
// // const getCandidatModel = async (): Promise<Model<ICandidat>> => {
// //   const db = await connectCandidatsDb();

// //   // Vérifier si le modèle existe déjà pour cette connexion
// //   if (db.models.Candidat) {
// //     return db.models.Candidat as Model<ICandidat>;
// //   }

// //   // Sinon, définir le modèle
// //   return db.model<ICandidat>("Candidat", candidateSchema);
// // };

// // Exporter une instance unique du modèle

// // function getCandidatModel(connection: Connection): Model<ICandidat> {
// //   try {
// //     // Vérifie si le modèle existe déjà sur cette connexion pour éviter Re-compilation error
// //     return connection.model<ICandidat>('Candidat');
// //   } catch (e) {
// //     return connection.model<ICandidat>('Candidat', candidatSchema);
// //   }
// // }

// function getCandidatModel(connection: Connection): Model<ICandidat> {
//   // Utilisez connection.models pour vérifier si le modèle existe sur cette connexion
//   if (connection.models.Candidat) {
//     return connection.models.Candidat as Model<ICandidat>;
//   }
//   // Si non, créez et retournez le modèle pour cette connexion
//   return connection.model<ICandidat>('Candidat', candidateSchema);
// }

// export default getCandidatModel;
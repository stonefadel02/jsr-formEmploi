import { Schema, Model } from 'mongoose';
import { connectCandidatsDb } from '../lib/mongodb';
import { ICandidat } from '@/lib/types';

// Schéma Mongoose
const candidateSchema = new Schema<ICandidat>(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function (this: ICandidat) {
        return this.authProvider === 'local';
      },
    },
    role: {
      type: String,
      default: 'candidat',
      index: true,
    },
    authProvider: { type: String, default: 'local' },
    emailpro: { type: String, unique: true },
    phone: { type: String },
    alternanceSearch: {
      sector: { type: String },
      location: { type: String },
      level: { type: String },
      contracttype: { type: String },
    },
    cvUrl: { type: String },
    videoUrl: { type: String },
    // status: { type: String, enum: ['En attente', 'Validé', 'Refusé'], default: 'En attente', index: true },
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
  return db.model<ICandidat>('Candidat', candidateSchema);
};

// Exporter une instance unique du modèle
const CandidatModelPromise = getCandidatModel();

export default CandidatModelPromise;
import  { Schema, Model } from 'mongoose';
import { ICandidat, IPersonalInfo, IAlternanceSearch } from '@/lib/types';
import { connectCandidatsDb } from '@/lib/mongodb';

// Définir les schémas
const personalInfoSchema: Schema<IPersonalInfo> = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
});

const alternanceSearchSchema: Schema<IAlternanceSearch> = new Schema({
  sector: { type: String },
  location: { type: String },
  level: { type: String },
  contracttype: { type: String },
});

const candidatSchema: Schema<ICandidat> = new Schema({
  personalInfo: { type: personalInfoSchema, required: true },
  alternanceSearch: { type: alternanceSearchSchema, default: {} },
  cvUrl: { type: String },
  videoUrl: { type: String },
  status: { 
    type: String, 
    enum: ['En attente', 'Validé', 'Refusé'], 
    default: 'En attente',
    index: true 
  },
}, {
  timestamps: true,
});

// Fonction pour obtenir le modèle
const getCandidatModel = async (): Promise<Model<ICandidat>> => {
  const db = await connectCandidatsDb();
  
  // Vérifier si le modèle existe déjà pour cette connexion
  if (db.models.Candidat) {
    return db.models.Candidat as Model<ICandidat>;
  }

  // Sinon, définir le modèle
  return db.model<ICandidat>('Candidat', candidatSchema);
};

// Exporter une instance unique du modèle
const CandidatModelPromise = getCandidatModel();

export default CandidatModelPromise;
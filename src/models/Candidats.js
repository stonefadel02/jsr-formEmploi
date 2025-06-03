// models/Candidats.js
import mongoose from 'mongoose';
import { connectCandidatsDb } from '../lib/mongodb';

const candidatsSchema = new mongoose.Schema({
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
  },
  alternanceSearch: {
    sector: { type: String, required: true },
    location: { type: String, required: true },
    desiredPosition: { type: String, required: true },
  },
  educationLevel: { type: String, enum: ['Bac', 'Bac+2', 'Bac+3', 'Bac+5', 'Autre'], required: true },
  cvUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  status: { type: String, enum: ['En attente', 'Validé', 'Refusé'], default: 'En attente' },
}, { timestamps: true });

async function getCandidatsModel() {
  console.log('Connecting to Candidates Database for Candidats model...');
  const candidatsDb = await connectCandidatsDb();
  console.log('Candidats model connected to Candidates Database');
  return candidatsDb.models.Candidats || candidatsDb.model('Candidats', candidatsSchema);
}

export default getCandidatsModel();
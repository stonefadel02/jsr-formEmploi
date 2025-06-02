// models/Candidat.js
import mongoose from 'mongoose';
import { connectCandidatsDb } from '../lib/mongodb';

const candidatSchema = new mongoose.Schema({
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
  passwordHash: { type: String, required: true },
  cvUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  status: { type: String, enum: ['En attente', 'Validé', 'Refusé'], default: 'En attente', index: true },
}, {
  timestamps: true // crée et met à jour automatiquement createdAt / updatedAt
});

const candidatsDb = await connectCandidatsDb();
export default candidatsDb.models.Candidat || candidatsDb.model('Candidat', candidatSchema);


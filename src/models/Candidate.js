// models/Candidat.js
import mongoose from 'mongoose';
import { connectCandidatsDb } from '../lib/mongodb';

const candidatSchema = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: function() { return this.authProvider === 'local'; } },
    authProvider: { type: String, default: 'local' },
    phone: { type: String },
    alternanceSearch: {
      sector: { type: String },
      location: { type: String },
      level: { type: String },
      contracttype: { type: String }
    },
  cvUrl: { type: String },
  videoUrl: { type: String },
  // status: { type: String, enum: ['En attente', 'Validé', 'Refusé'], default: 'En attente', index: true },
  
}, {
  timestamps: true // crée et met à jour automatiquement createdAt / updatedAt
});

export default mongoose.models.Candidat || mongoose.model('Candidat', candidatSchema);


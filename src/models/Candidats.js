// models/Candidats.js
import mongoose from 'mongoose';

const candidatSchema = new mongoose.Schema({
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
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
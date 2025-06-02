import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  alternanceType: { type: String, required: true }, // Type de recherche d'alternance
  video: { type: String }, // URL ou chemin de la vidéo
  cv: { type: String }, // URL ou chemin du CV
  status: { type: String, default: 'En attente' }, // "En attente", "Validé", "Refusé"
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);
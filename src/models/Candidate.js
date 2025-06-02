// models/Candidate.js
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
  cvUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  status: { type: String, enum: ['En attente', 'Validé', 'Refusé'], default: 'En attente' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const candidatsDb = await connectCandidatsDb();
export default candidatsDb.models.Candidat || candidatsDb.model('Candidat', candidatSchema);
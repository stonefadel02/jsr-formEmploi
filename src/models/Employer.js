// models/Employer.js
import { connectEmployersDb } from '../lib/mongodb';

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sector: { type: String },
  status: { type: String, enum: ['En attente', 'Validé', 'Suspendu', 'Refusé'], default: 'En attente' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const employersDb = await connectEmployersDb();
export default employersDb.models.Employer || employersDb.model('Employer', employerSchema);
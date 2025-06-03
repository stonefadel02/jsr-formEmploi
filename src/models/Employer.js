import { connectEmployersDb } from '../lib/mongodb';
import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['En attente', 'Validé', 'Suspendu', 'Refusé'], 
    default: 'En attente',
    index: true 
  },

  role: {
    type: String,
    enum: ['employeur', 'admin'],
    default: 'employeur',
    index: true
  },

  subscription: {
    plan: { type: String, enum: ['Gratuit', 'Standard', 'Premium'], default: 'Gratuit' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false }
  }
}, { timestamps: true });
employerSchema.index({ status: 1, role: 1 });

export default mongoose.models.Employer || mongoose.model('Employer', employerSchema);
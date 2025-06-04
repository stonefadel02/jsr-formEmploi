// models/Offer.js
import mongoose from 'mongoose';
import { connectEmployersDb } from '../lib/mongodb';

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  sector: { type: String, required: true },
  location: { type: String, required: true },

  salaryRange: {
    min: { type: Number },
    max: { type: Number }
  },

  startDate: { type: Date, required: true },
  endDate: { type: Date },

  workMode: {
    type: String,
    enum: ['Présentiel', 'Remote', 'Hybride'],
    default: 'Présentiel'
  },

  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employer',
    required: true
  },

  status: { 
    type: String, 
    enum: ['Ouvert', 'Fermé', 'Suspendu'], 
    default: 'Ouvert',
    index: true
  },

  applications: [
    {
      candidat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidat',
        required: true
      },
      message: { type: String },
      status: {
        type: String,
        enum: ['En attente', 'Accepté', 'Refusé'],
        default: 'En attente'
      },
      appliedAt: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

// Index pour les recherches rapides
offerSchema.index({ sector: 1 });
offerSchema.index({ location: 1 });
offerSchema.index({ status: 1 });

const employersDb = await connectEmployersDb();
export default employersDb.models.Offer || employersDb.model('Offer', offerSchema);

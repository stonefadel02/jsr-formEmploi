import  { Schema, Model } from 'mongoose';
import { IEmployer, ISubscription } from '@/lib/types';
import { connectEmployersDb } from '@/lib/mongodb';

const subscriptionSchema: Schema<ISubscription> = new Schema({
  plan: { type: String, enum: ['Gratuit', 'Standard', 'Premium'], default: 'Gratuit' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isActive: { type: Boolean, default: false },
});

const employerSchema: Schema<IEmployer> = new Schema({
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
  subscription: { type: subscriptionSchema, required: true },
}, { timestamps: true });

employerSchema.index({ status: 1, role: 1 });

// Fonction pour obtenir le modèle
const getEmployerModel = async (): Promise<Model<IEmployer>> => {
  const db = await connectEmployersDb();
  
  if (db.models.Employer) {
    return db.models.Employer as Model<IEmployer>;
  }

  return db.model<IEmployer>('Employer', employerSchema);
};

// Exporter une instance unique du modèle
const EmployerModelPromise = getEmployerModel();

export default EmployerModelPromise;
import { Schema, Model, Connection, models } from 'mongoose';
import { IEmployer } from '@/lib/types'; // définis ton interface ici
import { connectEmployersDb } from '@/lib/mongodb';

const employerSchema = new Schema<IEmployer>(
  {
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String, required: function (this: IEmployer) {
        return this.authProvider === 'local';
      },
    },
    authProvider: { type: String, default: 'local' },
    status: {
      type: String,
      enum: ['En attente', 'Validé', 'Suspendu', 'Refusé'],
      default: 'En attente',
      index: true,
    },
    role: {
      type: String,
      enum: ['employeur', 'admin'],
      default: 'employeur',
      index: true,
    },
    subscription: {
      plan: { type: String, enum: ['Gratuit', 'Standard', 'Premium'], default: 'Gratuit' },
      startDate: { type: Date, default: Date.now },
      endDate: { type: Date },
      isActive: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

employerSchema.index({ status: 1, role: 1 });
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

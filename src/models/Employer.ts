import { Schema, Model } from 'mongoose';
import { IEmployer } from '@/lib/types'; // définis ton interface ici
import { connectEmployersDb } from '@/lib/mongodb';

const employerSchema = new Schema<IEmployer>(
  {
    acceptTerms: { type: Boolean, default: false },
    companyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
        isActive: { type: Boolean, default: false }, // Ajout de l'état actif

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
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String },
  emailVerificationExpires: { type: Date },
    subscription: {
      plan: { type: String, enum: ['Gratuit', 'Standard', 'Payant Annuel'], default: 'Gratuit' },
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


// import { Schema, Model, Connection } from 'mongoose';
// import { IEmployer } from '@/lib/types'; // définis ton interface ici
// import { connectEmployersDb } from '@/lib/mongodb';

// const employerSchema = new Schema<IEmployer>(
//   {
//     acceptTerms: { type: Boolean, default: false },
//     companyName: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//         isActive: { type: Boolean, default: false }, // Ajout de l'état actif

//     password: {
//       type: String, required: function (this: IEmployer) {
//         return this.authProvider === 'local';
//       },
//     },
//     authProvider: { type: String, default: 'local' },
//     status: {
//       type: String,
//       enum: ['En attente', 'Validé', 'Suspendu', 'Refusé'],
//       default: 'En attente',
//       index: true,
//     },
//     role: {
//       type: String,
//       enum: ['employeur', 'admin'],
//       default: 'employeur',
//       index: true,
//     },
//   isEmailVerified: { type: Boolean, default: false },
//   emailVerificationToken: { type: String },
//   emailVerificationExpires: { type: Date },
//     subscription: {
//       plan: { type: String, enum: ['Gratuit', 'Standard', 'Payant Annuel'], default: 'Gratuit' },
//       startDate: { type: Date, default: Date.now },
//       endDate: { type: Date },
//       isActive: { type: Boolean, default: false },
//     },
//   },
//   { timestamps: true }
// );
// employerSchema.index({ status: 1, role: 1 });
// // employerSchema.index({ status: 1, role: 1 });
// // const getEmployerModel = async (): Promise<Model<IEmployer>> => {
// //   const db = await connectEmployersDb();

// //   if (db.models.Employer) {
// //     return db.models.Employer as Model<IEmployer>;
// //   }

// //   return db.model<IEmployer>('Employer', employerSchema);
// // };
// function getEmployeurModel(connection: Connection): Model<IEmployer> {
//   // Utilisez connection.models pour vérifier si le modèle existe sur cette connexion
//   if (connection.models.Employer) {
//     return connection.models.Employer as Model<IEmployer>;
//   }
//   // Si non, créez et retournez le modèle pour cette connexion
//   return connection.model<IEmployer>('Employer', employerSchema);
// }

// export default getEmployeurModel; // <-- EXPORTE LA FONCTION DIRECTEMENT

import { Schema, Model } from 'mongoose';
import { connectCandidatsDb } from '@/lib/mongodb';
import { ICandidatSubscription } from '@/lib/types';

// Schéma Mongoose
const candidatSubscriptionSchema = new Schema<ICandidatSubscription>(
  {
    candidatId: { type: Schema.Types.ObjectId, ref: 'Candidat', required: true },
    plan: { type: String, enum: ['Gratuit', 'Standard', 'Premium'], required: true },
    // email: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    isTrial: { type: Boolean, default: true },
    isActive: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    paymentId: { type: String },
  },
  { timestamps: true }
);

candidatSubscriptionSchema.index({ candidatId: 1, isActive: 1 });

const getCandidatSubscriptionModel = async (): Promise<Model<ICandidatSubscription>> => {
  const db = await connectCandidatsDb();

  if (db.models.CandidatSubscription) {
    return db.models.CandidatSubscription as Model<ICandidatSubscription>;
  }

  return db.model<ICandidatSubscription>('CandidatSubscription', candidatSubscriptionSchema);
};

const CandidatSubscriptionModelPromise = getCandidatSubscriptionModel();

export default CandidatSubscriptionModelPromise;


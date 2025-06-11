import { Schema, Model } from 'mongoose';
import { connectEmployersDb } from '@/lib/mongodb';
import { ISubscription } from '@/lib/types';

const subscriptionSchema = new Schema<ISubscription>({
  employerId: { type: Schema.Types.ObjectId, ref: 'Employer', required: true },
  plan: { type: String, enum: ['Gratuit', 'Standard', 'Premium'], required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  isTrial: { type: Boolean, default: true },
  isActive: { type: Boolean, default: false },
  price: { type: Number, default: 0 }, 
  paymentId: { type: String }, 
}, { timestamps: true });

subscriptionSchema.index({ status: 1, role: 1 });
const getSubscriptionModel = async (): Promise<Model<ISubscription>> => {
  const db = await connectEmployersDb();

  if (db.models.Subscription) {
    return db.models.Subscription as Model<ISubscription>;
  }

  return db.model<ISubscription>('Subscription', subscriptionSchema);
};
// Exporter une instance unique du modèle
const SubscriptionModelPromise = getSubscriptionModel();

export default SubscriptionModelPromise;


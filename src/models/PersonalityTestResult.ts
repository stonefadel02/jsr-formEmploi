import { Schema, Model } from 'mongoose';
import { connectCandidatsDb } from '@/lib/mongodb';
import { IPersonalityTestResult } from '@/lib/types';

const personalityTestSchema = new Schema<IPersonalityTestResult>({
  candidateId: {
    type: Schema.Types.ObjectId, ref: 'Candidat', required: true
  },
  answers: {type: [ String]},
  resultType: { type: String, required: true },
  summary: { 
    emoji: { type: String },
    description: { type: String },
   },
}, { timestamps: true });

const getPersonalityTestModel = async (): Promise<Model<IPersonalityTestResult>> => {
  const db = await connectCandidatsDb();

  if (db.models.PersonalityTestResult) {
    return db.models.PersonalityTestResult as Model<IPersonalityTestResult>;
  }

  return db.model<IPersonalityTestResult>('PersonalityTestResult', personalityTestSchema);
};

const PersonalityTestResultModelPromise = getPersonalityTestModel();

export default PersonalityTestResultModelPromise;

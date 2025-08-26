import { Schema, Document, Model } from 'mongoose';
import { connectCandidatsDb } from '@/lib/mongodb'; // Important: on se connecte à la BDD des candidats

// Interface pour typer nos documents
export interface IEmployerCandidateInteraction extends Document {
  employerId: Schema.Types.ObjectId;
  candidateId: Schema.Types.ObjectId;
  status: 'favorited' | 'shortlisted' | 'rejected' | 'viewed'; // Statuts possibles
}

const interactionSchema = new Schema<IEmployerCandidateInteraction>({
  employerId: { type: Schema.Types.ObjectId, required: true }, // ID de l'employeur (de la BDD employeur)
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidat', required: true },
  status: {
    type: String,
    enum: ['favorited', 'shortlisted', 'rejected', 'viewed'],
    required: true,
  },
}, { timestamps: true });

// Index pour des recherches ultra-rapides et pour garantir une seule interaction par duo employeur/candidat
interactionSchema.index({ employerId: 1, candidateId: 1 }, { unique: true });

// Fonction pour obtenir le modèle et s'assurer qu'il est lié à la bonne connexion
const getInteractionModel = async (): Promise<Model<IEmployerCandidateInteraction>> => {
  const db = await connectCandidatsDb();
  if (db.models.EmployerCandidateInteraction) {
    return db.models.EmployerCandidateInteraction as Model<IEmployerCandidateInteraction>;
  }
  return db.model<IEmployerCandidateInteraction>('EmployerCandidateInteraction', interactionSchema);
};

const EmployerCandidateInteractionModelPromise = getInteractionModel();

export default EmployerCandidateInteractionModelPromise;
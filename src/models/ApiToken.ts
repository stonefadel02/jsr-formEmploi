import { Schema, models, model } from 'mongoose';
import { IApiToken } from '@/lib/types'; // Vous devrez peut-être créer ce type

const apiTokenSchema = new Schema<IApiToken>(
  {
    name: { type: String, required: true, unique: true }, // ex: "insee_api_token"
    accessToken: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// Pour éviter de recompiler le modèle à chaque appel en développement
const ApiTokenModel = models.ApiToken || model<IApiToken>('ApiToken', apiTokenSchema);

export default ApiTokenModel;
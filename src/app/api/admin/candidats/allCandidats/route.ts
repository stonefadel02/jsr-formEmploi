import { NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatModelPromise from '@/models/Candidats'; // Vérifie ton chemin
// 1. IMPORT DU MODÈLE SUBSCRIPTION (Adapte le chemin si nécessaire)
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription'; 
import { adminMiddleware } from '../../middleware';
import { ApiResponse, ICandidat } from '@/lib/types';

export const GET = adminMiddleware(async (): Promise<NextResponse<ApiResponse<ICandidat[]>>> => {
  try {
    await connectCandidatsDb();

    // 2. LIGNE MAGIQUE : On force l'initialisation du modèle Subscription AVANT tout le reste
    await CandidatSubscriptionModelPromise; 
    
    // Ensuite on charge le modèle Candidat
    const CandidatModel = await CandidatModelPromise;

    // Maintenant le populate va marcher car le schéma est enregistré en mémoire
    const candidats = await CandidatModel.find()
      .populate('subscription') 
      .select('-password')
      .lean(); 

    return NextResponse.json({ success: true, data: candidats as ICandidat[] }, { status: 200 });

  } catch (error) {
    console.error('Erreur récupération candidats :', error);
    // Petite astuce : on renvoie le vrai message d'erreur pour t'aider si ça replante
    const message = error instanceof Error ? error.message : 'Erreur serveur';
    return NextResponse.json({ success: false, message: message }, { status: 500 });
  }
});
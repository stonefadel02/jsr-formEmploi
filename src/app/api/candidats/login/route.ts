// /api/candidats/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import CandidatModelPromise from '@/models/Candidats';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ICandidat } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email et mot de passe requis.' }, { status: 400 });
    }

    const CandidatModel = await CandidatModelPromise;
    const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;

    const candidat = await CandidatModel.findOne({ email }) as ICandidat;
    if (!candidat) {
      return NextResponse.json({ message: 'Email ou mot de passe invalide.' }, { status: 401 });
    }

    const isValidPassword = candidat.password 
      ? await bcrypt.compare(password, candidat.password) 
      : false;
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Email ou mot de passe invalide.' }, { status: 401 });
    }

    // --- NOUVELLE VÉRIFICATION D'ABONNEMENT (SIMPLIFIÉE) ---
    const subscription = await CandidatSubscriptionModel.findOne({ candidatId: candidat._id });
    
    if (!subscription || !subscription.isActive) {
      return NextResponse.json({ message: 'Votre compte n\'est pas actif. Veuillez souscrire à un abonnement.' }, { status: 403 });
    }

    const now = new Date();
    if (subscription.endDate! < now) {
      return NextResponse.json({ message: 'Votre abonnement a expiré. Veuillez le renouveler.' }, { status: 403 });
    }
    // --- FIN DE LA VÉRIFICATION ---


    const token = jwt.sign(
      { 
        id: candidat._id, 
        email: candidat.email, 
        role: candidat.role,
        isActive: subscription.isActive, // On garde cette info utile
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      candidat: {
        id: candidat._id,
        email: candidat.email,
        isActive: subscription.isActive,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur connexion candidat :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
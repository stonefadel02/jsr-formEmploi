import { NextRequest, NextResponse } from 'next/server';
import CandidatModelPromise from '@/models/Candidats';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription'; // Nouveau modèle
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
      return NextResponse.json({ message: 'Email invalide.' }, { status: 401 });
    }

    const isValidPassword = candidat.password 
      ? await bcrypt.compare(password, candidat.password) 
      : false;
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Mot de passe invalide.' }, { status: 401 });
    }

    // Vérification de l'abonnement
    const subscription = await CandidatSubscriptionModel.findOne({ candidatId: candidat._id });
    if (!subscription) {
      return NextResponse.json({ message: 'Aucun abonnement trouvé.' }, { status: 403 });
    }

    const now = new Date();
    if (!subscription.isActive && (!subscription.isTrial || subscription.endDate! < now)) {
      return NextResponse.json({ message: 'Abonnement invalide ou expiré.' }, { status: 403 });
    }

    const token = jwt.sign(
      { 
        id: candidat._id, 
        email: candidat.email, 
        role: candidat.role,
        isActive: subscription.isActive,
        isTrial: subscription.isTrial,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      candidat: {
        id: candidat._id,
        firstName: candidat.firstName,
        lastName: candidat.lastName,
        email: candidat.email,
        isActive: subscription.isActive,
        isTrial: subscription.isTrial,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur connexion :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
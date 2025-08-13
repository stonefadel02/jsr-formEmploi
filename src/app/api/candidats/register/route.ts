import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import CandidatModelPromise from '@/models/Candidats';
// On n'a plus besoin du modèle d'abonnement ici

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    const CandidatModel = await CandidatModelPromise;

    const existingCandidat = await CandidatModel.findOne({ email: email.toLowerCase() });
    if (existingCandidat) {
      // Si le compte existe mais n'est pas actif, on peut permettre de relancer le paiement
      if (!existingCandidat.isActive) {
         return NextResponse.json({ message: 'Compte en attente de paiement.', needsPayment: true }, { status: 409 });
         
      }
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // On crée le candidat avec le statut inactif
    const candidat = await CandidatModel.create({
      email: email.toLowerCase(),
      password: passwordHash,
      isActive: false, // 🛑 IMPORTANT : Le compte est inactif
    });

    // Pas d'envoi de token ni d'abonnement ici !
    return NextResponse.json(
      { message: 'Pré-inscription réussie. Veuillez procéder au paiement pour activer votre compte.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription candidat :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
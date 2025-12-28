import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatModelPromise from '@/models/Candidats';
import EmployerModelPromise from '@/models/Employer';

export async function POST(req: NextRequest) {
  try {
    await connectCandidatsDb();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: 'Token manquant.' }, { status: 400 });
    }

    // Hasher le token reçu pour le comparer à celui en BDD
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const CandidatModel = await CandidatModelPromise;
    const EmployerModel = await EmployerModelPromise;

    let user: any = null;
    let role: string = '';

    // On cherche d'abord dans les candidats
    user = await CandidatModel.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() }, // Vérifie que le token n'est pas expiré
    });
    if(user) role = 'candidat';

    // Si ce n'est pas un candidat, on cherche dans les employeurs
    if (!user) {
      user = await EmployerModel.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
      });
      if(user) role = 'employeur';
    }

    if (!user) {
      return NextResponse.json({ success: false, message: 'Le lien de vérification est invalide ou a expiré.' }, { status: 400 });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    if (role === 'candidat') {
      user.isActive = true; 
      user.status = 'Validé'; // Assurez-vous que ce status correspond à votre logique
    }
    await user.save();

    // On renvoie l'email et le rôle pour que le front-end puisse rediriger vers le paiement
    const responseMessage = role === 'candidat' 
      ? 'Email validé avec succès !' 
      : 'Email validé avec succès ! Préparation du paiement...';
    return NextResponse.json({ 
      success: true, 
      message: responseMessage,
      email: user.email,
      role: role
    });

  } catch (error) {
    console.error('Erreur vérification email :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
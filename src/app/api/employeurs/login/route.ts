export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import EmployerModelPromise from '@/models/Employer';
import SubscriptionModelPromise from '@/models/Subscription';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IEmployer } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email et mot de passe requis.' }, { status: 400 });
    }

    const EmployerModel = await EmployerModelPromise;
    const SubscriptionModel = await SubscriptionModelPromise;

    const employer = await EmployerModel.findOne({ email: email.toLowerCase() }) as IEmployer;
    if (!employer) {
      return NextResponse.json({ message: 'Email ou mot de passe invalide.' }, { status: 401 });
    }

    const isValidPassword = employer.password 
      ? await bcrypt.compare(password, employer.password) 
      : false;
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Email ou mot de passe invalide.' }, { status: 401 });
    }
    
    // --- NOUVEAU : Gérer le cas spécial de l'administrateur ---
    // (Utilisez une variable d'environnement pour plus de sécurité)
    if (employer.email === process.env.ADMIN_EMAIL) {
      // Si c'est l'admin, on saute la vérification d'abonnement et on crée son token
      const token = jwt.sign(
        {
          id: employer._id,
          email: employer.email,
          role: 'admin', // On force le rôle 'admin'
          isActive: true,
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      return NextResponse.json({
        message: 'Connexion admin réussie',
        token,
        employer: { id: employer._id, email: employer.email },
        role: 'admin' // On renvoie le rôle pour la redirection
      }, { status: 200 });
    }
    // --- Fin de la gestion de l'admin ---


    // --- La vérification normale de l'abonnement continue ici pour les employeurs classiques ---
    const subscription = await SubscriptionModel.findOne({ employerId: employer._id });

    if (!subscription || !subscription.isActive) {
      return NextResponse.json({ message: 'Votre compte n\'est pas actif. Veuillez souscrire à un abonnement.' }, { status: 403 });
    }

    const now = new Date();
    if (subscription.endDate! < now) {
      return NextResponse.json({ message: 'Votre abonnement a expiré. Veuillez le renouveler.' }, { status: 403 });
    }
    
    // Si c'est un employeur normal, on crée son token
    const token = jwt.sign(
      {
        id: employer._id,
        email: employer.email,
        role: employer.role, // Le rôle sera 'employeur'
        isActive: subscription.isActive,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      employer: {
        id: employer._id,
        companyName: employer.companyName,
        email: employer.email,
        isActive: subscription.isActive,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Erreur connexion employeur :', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
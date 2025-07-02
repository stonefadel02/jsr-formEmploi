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

    const employer = await EmployerModel.findOne({ email }) as IEmployer;
    if (!employer) {
      return NextResponse.json({ message: 'Email invalide.' }, { status: 401 });
    }

    const isValidPassword = employer.password 
      ? await bcrypt.compare(password, employer.password) 
      : false;
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Mot de passe invalide.' }, { status: 401 });
    }

    // 🔍 Récupération de l'abonnement
    const subscription = await SubscriptionModel.findOne({ employerId: employer._id });

    // 🔐 Création du token avec isActive & isTrial
    const token = jwt.sign(
      {
        id: employer._id,
        email: employer.email,
        role: employer.role,
        isActive: subscription?.isActive,
        isTrial: subscription?.isTrial,
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
        isActive: subscription?.isActive,
        isTrial: subscription?.isTrial,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur connexion :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

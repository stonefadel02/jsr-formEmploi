import { NextRequest, NextResponse } from 'next/server';
import CandidatModelPromise from '@/models/Candidats';
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

    const token = jwt.sign(
      { id: candidat._id, email: candidat.email, role: candidat.role },
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
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur connexion :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
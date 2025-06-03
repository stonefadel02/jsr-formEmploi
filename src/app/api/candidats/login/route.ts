import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatPromise from '../../../../models/Candidats';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '@/lib/types';

interface LoginResponse {
  message: string;
  token: string;
  candidat: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<LoginResponse>>> {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email et mot de passe requis.' }, { status: 400 });
    }

    await connectCandidatsDb();
    const Candidat = await CandidatPromise; // Résoudre la Promise

    const candidat = await Candidat.findOne({ 'personalInfo.email': email });
    if (!candidat) {
      return NextResponse.json({ success: false, message: 'Email invalide.' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, candidat.personalInfo.password);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: 'Mot de passe invalide.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: candidat._id, email: candidat.personalInfo.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      data: {
        message: 'Connexion réussie',
        token,
        candidat: {
          id: candidat._id.toString(),
          firstName: candidat.personalInfo.firstName,
          lastName: candidat.personalInfo.lastName,
          email: candidat.personalInfo.email,
        },
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur connexion :', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
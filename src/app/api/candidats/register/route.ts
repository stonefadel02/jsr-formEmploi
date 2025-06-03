import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import CandidatPromise from '../../../../models/Candidats';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '@/lib/types';

interface RegisterResponse {
  message: string;
  token: string;
  candidat: {
    email: string;
    _id: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<RegisterResponse>>> {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Champs requis manquants.' }, { status: 400 });
    }

    await connectCandidatsDb();
    const Candidat = await CandidatPromise; // Résoudre la Promise

    const existing = await Candidat.findOne({ 'personalInfo.email': email });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const candidat = await Candidat.create({
      personalInfo: {
        email,
        password: passwordHash,
        firstName: '',
        lastName: '',
        phone: '',
      },
      alternanceSearch: {},
    });

    const token = jwt.sign(
      { id: candidat._id, email: candidat.personalInfo.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Candidat inscrit avec succès');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Candidat inscrit avec succès',
        token,
        candidat: {
          email: candidat.personalInfo.email,
          _id: candidat._id.toString(),
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import EmployerPromise from '@/models/Employer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '@/lib/types';

interface LoginResponse {
  message: string;
  token: string;
  employer: {
    id: string;
    companyName: string;
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

    await connectEmployersDb();
    const Employer = await EmployerPromise; // Résoudre la Promise

    const employer = await Employer.findOne({ email });
    if (!employer) {
      return NextResponse.json({ success: false, message: 'Email invalide.' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, employer.password);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, message: 'Mot de passe invalide.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: employer._id, email: employer.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      success: true,
      data: {
        message: 'Connexion réussie',
        token,
        employer: {
          id: employer._id.toString(),
          companyName: employer.companyName,
          email: employer.email,
        },
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur connexion :', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
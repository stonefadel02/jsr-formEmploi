import { NextRequest, NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import EmployerPromise from '@/models/Employer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '@/lib/types';

interface RegisterResponse {
  message: string;
  token: string;
  employer: {
    companyName: string;
    email: string;
    _id: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<RegisterResponse>>> {
  try {
    const body = await req.json();
    console.log('Requête reçue :', body);

    const { companyName, email, password } = body;

    if (!companyName || !email || !password) {
      return NextResponse.json({ success: false, message: 'Champs requis manquants.' }, { status: 400 });
    }

    await connectEmployersDb();
    const Employer = await EmployerPromise; // Résoudre la Promise

    const existing = await Employer.findOne({ email });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec un abonnement par défaut
    const employer = await Employer.create({
      companyName,
      email,
      password: passwordHash,
      subscription: {
        plan: 'Gratuit',
        startDate: new Date(),
        isActive: false,
      },
    });

    const token = jwt.sign(
      { id: employer._id, email: employer.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Employeur inscrit avec succès');

    return NextResponse.json({
      success: true,
      data: {
        message: 'Employeur inscrit avec succès',
        token,
        employer: {
          companyName: employer.companyName,
          email: employer.email,
          _id: employer._id.toString(),
        },
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
}
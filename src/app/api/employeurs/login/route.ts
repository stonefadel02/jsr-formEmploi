import { NextRequest, NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import Employer from '@/models/Employer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Email et mot de passe requis.' }, { status: 400 });
    }

    await connectEmployersDb();

    const employer = await Employer.findOne({ email });
    if (!employer) {
      return NextResponse.json({ message: 'Email invalide.' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, employer.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: 'Mot de passe invalide.' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: employer._id, email: employer.email },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Connexion réussie',
      token,
      employer: {
        id: employer._id,
        firstName: employer.firstName,
        lastName: employer.lastName,
        email: employer.email,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur connexion :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

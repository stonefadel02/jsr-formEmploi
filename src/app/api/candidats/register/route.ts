import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CandidatModelPromise from '@/models/Candidats';
import { sendRegistrationEmail } from "@/lib/mailer";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    const CandidatModel = await CandidatModelPromise; // ATTENTION à renommer si besoin

    const existing = await CandidatModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec password hashé
    const candidat = await CandidatModel.create({
      email,
      password: passwordHash, // nom de champ cohérent
      status: 'Validé'
    });
    await sendRegistrationEmail(candidat.email, candidat.firstName || "Mr/Mme");

    const token = jwt.sign(
      { id: candidat._id, email: candidat.email, role: candidat.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    console.log(candidat);
    

    console.log('Candidat inscrit avec succès');

    return NextResponse.json(
      { message: 'Candidat inscrit avec succès', token, candidat: { email: candidat.email, _id: candidat._id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
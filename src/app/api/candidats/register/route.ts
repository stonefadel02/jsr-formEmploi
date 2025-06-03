import { NextRequest, NextResponse } from 'next/server';
import { connectCandidatsDb } from '@/lib/mongodb';
import Candidat from '../../../../models/Candidats';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    await connectCandidatsDb(); // on attend la connexion

    // Vérifier si email existe déjà
    const existing = await Candidat.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec password hashé
    const candidat = await Candidat.create({
      email,
      password: passwordHash, // nom de champ cohérent
    });

     const token = jwt.sign(
          { id: candidat._id, email: candidat.email },
          process.env.JWT_SECRET!,
          { expiresIn: '7d' }
        );

    console.log('Candidat inscrit avec succès');

    return NextResponse.json(
      { message: 'Candidat inscrit avec succès',token, candidat: { email: candidat.email, _id: candidat._id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

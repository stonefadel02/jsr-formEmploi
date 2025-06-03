import { NextRequest, NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import Employer from '@/models/Employer';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Requête reçue :', body);

    const { companyName, email, password } = body;

    if (!companyName || !email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    await connectEmployersDb(); // on attend la connexion

    // Vérifier si email existe déjà
    const existing = await Employer.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec password hashé
    const employer = await Employer.create({
      companyName,
      email,
      password: passwordHash, // nom de champ cohérent
    });

    console.log('Employeur inscrit avec succès');

    return NextResponse.json(
      { message: 'Employeur inscrit avec succès', employer: { companyName: employer.companyName, email: employer.email, _id: employer._id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import EmployerModelPromise from '@/models/Employer';
import SubscriptionModelPromise from '@/models/Subscription';


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { companyName, email, password } = body;

    if (!companyName || !email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    const EmployerModel = await EmployerModelPromise; // ATTENTION à renommer si besoin

    const existing = await EmployerModel.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur avec password hashé
    const employer = await EmployerModel.create({
      companyName,
      email,
      password: passwordHash, // nom de champ cohérent
    });

    const SubscriptionModel = await SubscriptionModelPromise;
    await SubscriptionModel.create({
      employerId: employer._id,
      plan: 'Gratuit',
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      isTrial: false,
      isActive: false, 
      price: 0
    });
    

    const token = jwt.sign(
      { id: employer._id, email: employer.email, role: employer.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Employer inscrit avec succès');

    return NextResponse.json(
      { message: 'Employer inscrit avec succès', token, employer: { email: employer.email, _id: employer._id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

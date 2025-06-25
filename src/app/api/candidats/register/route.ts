import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import CandidatModelPromise from '@/models/Candidats';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription';
import { sendRegistrationEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    const CandidatModel = await CandidatModelPromise;
    const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;

    // Vérifier si l'email a déjà été utilisé pour un essai
    const existingSubscription = await CandidatSubscriptionModel.findOne({ 
      email: email.toLowerCase(), 
      isTrial: { $in: [true, false] } 
    }).populate('candidatId');
    if (existingSubscription) {
      return NextResponse.json({ message: 'Cet email a déjà été utilisé. Veuillez souscrire à un plan payant.' }, { status: 409 });
    }

    const existingCandidat = await CandidatModel.findOne({ email: email.toLowerCase() });
    if (existingCandidat) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const candidat = await CandidatModel.create({
      email: email.toLowerCase(),
      password: passwordHash,
      status: 'Validé',
    });
    await sendRegistrationEmail(candidat.email, candidat.firstName || 'Mr/Mme');

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    await CandidatSubscriptionModel.create({
      candidatId: candidat._id,
      plan: 'Gratuit',
      startDate: new Date(),
      endDate: oneMonthFromNow,
      isTrial: true,
      isActive: true, // Actif pendant l'essai
      price: 0,
    });

    const token = jwt.sign(
      { id: candidat._id, email: candidat.email, role: candidat.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

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
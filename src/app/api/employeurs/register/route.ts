import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import EmployerModelPromise from '@/models/Employer';
import SubscriptionModelPromise from '@/models/Subscription';
import { sendRegistrationEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { companyName, email, password } = body;

    if (!companyName || !email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    const EmployerModel = await EmployerModelPromise;
    const SubscriptionModel = await SubscriptionModelPromise;

    // Vérifier si l'email a déjà été utilisé pour un essai
    const existingSubscription = await SubscriptionModel.findOne({ 
      email: email.toLowerCase(), 
      isTrial: { $in: [true, false] } 
    }).populate('employerId');
    if (existingSubscription) {
      return NextResponse.json({ message: 'Cet email a déjà été utilisé. Veuillez souscrire à un plan payant.' }, { status: 409 });
    }

    const existingEmployer = await EmployerModel.findOne({ email: email.toLowerCase() });
    if (existingEmployer) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const employer = await EmployerModel.create({
      companyName,
      email: email.toLowerCase(),
      password: passwordHash,
    });

    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    await SubscriptionModel.create({
      employerId: employer._id,
      plan: 'Gratuit',
      startDate: new Date(),
      endDate: oneMonthFromNow,
      isTrial: true,
      isActive: true, // Actif pendant l'essai
      price: 0,
    });

    await sendRegistrationEmail(email, companyName); // Ajuste selon ton mailer

    const token = jwt.sign(
      { id: employer._id, email: employer.email, role: employer.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('Employeur inscrit avec succès');
    return NextResponse.json(
      { message: 'Employeur inscrit avec succès', token, employer: { email: employer.email, _id: employer._id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
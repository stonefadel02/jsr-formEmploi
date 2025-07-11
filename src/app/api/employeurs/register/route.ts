export const runtime = 'nodejs';

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
      console.log('[Erreur validation] Champs manquants :', { companyName, email, password });
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }

    const EmployerModel = await EmployerModelPromise;
    const SubscriptionModel = await SubscriptionModelPromise;

    const emailLC = email.toLowerCase();
    console.log('[Inscription] Email utilisé :', emailLC);

    // Vérification existence
    const existingEmployer = await EmployerModel.findOne({ email: emailLC });
    if (existingEmployer) {
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Création de l'employeur
    let employer;
    try {
      employer = await EmployerModel.create({
        companyName,
        email: emailLC,
        password: passwordHash,
      });

      console.log('[Création Employeur OK] ID:', employer._id);

      // Création de l’abonnement d’essai
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

      await SubscriptionModel.create({
        employerId: employer._id,
        email: emailLC,
        plan: 'Gratuit',
        startDate: new Date(),
        endDate: oneMonthFromNow,
        isTrial: true,
        isActive: true,
        price: 0,
      });

      console.log('[Abonnement Créé]');

      // Envoi de l'email
      await sendRegistrationEmail(emailLC, companyName);
      console.log('[Email envoyé]');

      // Génération du token
      const token = jwt.sign(
        { id: employer._id, email: employer.email, role: employer.role },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      console.log('Employeur inscrit avec succès');

      return NextResponse.json(
        {
          message: 'Employeur inscrit avec succès',
          token,
          employer: {
            email: employer.email,
            _id: employer._id,
          },
        },
        { status: 201 }
      );
    } catch (error) {
      console.error('[Erreur après création] :', error);

      // Rollback si l'employeur a été créé
      if (employer?._id) {
        await EmployerModel.findByIdAndDelete(employer._id);
        console.log(`[Rollback] Employeur supprimé : ${employer._id}`);
      }

      return NextResponse.json({ message: 'Une erreur est survenue pendant l’inscription.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur inscription (générale) :', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}

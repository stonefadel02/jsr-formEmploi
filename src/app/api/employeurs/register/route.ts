import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendVerificationEmail } from '@/lib/mailer';
import EmployerModelPromise from '@/models/Employer';
// On n'a plus besoin du modèle d'abonnement ici

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
   const { companyName, email, password, acceptTerms } = body;


    if (!companyName || !email || !password) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }
    
    const EmployerModel = await EmployerModelPromise;
    const emailLC = email.toLowerCase();

  
    const existingEmployer = await EmployerModel.findOne({ email: emailLC });
  if (existingEmployer) {
      // Si le compte existe mais n'est pas encore validé, on renvoie l'e-mail
      if (!existingEmployer.isEmailVerified) {
        
        const verificationToken = crypto.randomBytes(32).toString('hex');
        existingEmployer.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
        existingEmployer.emailVerificationExpires = new Date(Date.now() + 3600000); // 1 heure
        await existingEmployer.save();

        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${verificationToken}`;
        await sendVerificationEmail(existingEmployer.email, existingEmployer.companyName, verificationLink);
        
        return NextResponse.json(
          { message: 'Cet e-mail est déjà en attente. Nous venons de vous renvoyer un nouveau lien de validation.' },
          { status: 200 } // On utilise 200 OK
        );
      }
      // Si le compte est déjà validé et actif, c'est une erreur.
      return NextResponse.json({ message: 'Cet email est déjà utilisé et actif.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // On crée l'employeur avec le statut inactif
    const employer = await EmployerModel.create({
      companyName,
      email: emailLC,
      termsAccepted: acceptTerms,
      password: passwordHash,
      isActive: false, // 🛑 IMPORTANT : Le compte est inactif
      isEmailVerified: false,
    });

   const verificationToken = crypto.randomBytes(32).toString('hex');
    employer.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    employer.emailVerificationExpires = new Date(Date.now() + 3600000); // 1 heure
    await employer.save();

    const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email?token=${verificationToken}`;
    await sendVerificationEmail(employer.email, employer.companyName, verificationLink);
    // --- FIN DE L'INTÉGRATION ---

    return NextResponse.json(
      { message: 'Inscription presque terminée ! Veuillez consulter votre boîte de réception ou vos spams pour valider votre e-mail.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription employeur :', error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}
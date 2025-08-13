import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import EmployerModelPromise from '@/models/Employer';
// On n'a plus besoin du modèle d'abonnement ici

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
   const { companyName, email, password, siret, acceptTerms } = body;


    if (!companyName || !email || !password || !siret) {
      return NextResponse.json({ message: 'Champs requis manquants.' }, { status: 400 });
    }
    
    const EmployerModel = await EmployerModelPromise;
    const emailLC = email.toLowerCase();

    const existingEmployerBySiret = await EmployerModel.findOne({ siret });
    if (existingEmployerBySiret) {
        return NextResponse.json({ message: 'Ce numéro de SIRET est déjà utilisé.' }, { status: 409 });
    }

    const existingEmployer = await EmployerModel.findOne({ email: emailLC });
    if (existingEmployer) {
       if (!existingEmployer.isActive) {
         return NextResponse.json({ message: 'Compte en attente de paiement.', needsPayment: true }, { status: 409 });
      }
      return NextResponse.json({ message: 'Cet email est déjà utilisé.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // On crée l'employeur avec le statut inactif
    const employer = await EmployerModel.create({
      companyName,
      email: emailLC,
      siret: siret,
      termsAccepted: acceptTerms,
      password: passwordHash,
      isActive: false, // 🛑 IMPORTANT : Le compte est inactif
    });

    return NextResponse.json(
      { message: 'Pré-inscription réussie. Veuillez procéder au paiement pour activer votre compte.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur inscription employeur :', error);
    return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
  }
}
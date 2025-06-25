import { NextResponse } from 'next/server';
import SubscriptionModelPromise from '@/models/Subscription';
import EmployerModelPromise from '@/models/Employer';
import CandidatSubscriptionModelPromise from '@/models/CandidatSubscription'; // Nouveau modèle
import CandidatModelPromise from '@/models/Candidats'; // Nouveau modèle
import { sendExpirationEmail } from '@/lib/mailer'; // Utilise ton mailer existant

export async function GET() {
  try {
    const SubscriptionModel = await SubscriptionModelPromise;
    const EmployerModel = await EmployerModelPromise;
    const CandidatSubscriptionModel = await CandidatSubscriptionModelPromise;
    const CandidatModel = await CandidatModelPromise;
    const now = new Date();

    // 🔁 Fin de la période d’essai après 1 mois pour les employeurs
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const expiredEmployerTrials = await SubscriptionModel.find({
      isTrial: true,
      startDate: { $lte: oneMonthAgo },
    });
    for (const sub of expiredEmployerTrials) {
      const employer = await EmployerModel.findById(sub.employerId);
      if (employer) {
        await SubscriptionModel.updateOne({ _id: sub._id }, { $set: { isTrial: false } });
        await sendExpirationEmail(sub.email, employer.role, sub.endDate || now);
      }
    }

    // 🔁 Fin de l'abonnement annuel pour les employeurs
    const expiredEmployerSubscriptions = await SubscriptionModel.find({
      isActive: true,
      endDate: { $lte: now },
    });
    for (const sub of expiredEmployerSubscriptions) {
      const employer = await EmployerModel.findById(sub.employerId);
      if (employer) {
        await SubscriptionModel.updateOne({ _id: sub._id }, { $set: { isActive: false } });
        await sendExpirationEmail(sub.email, employer.role, sub.endDate || now);
      }
    }

    // 🔁 Fin de la période d’essai après 1 mois pour les candidats
    const expiredCandidatTrials = await CandidatSubscriptionModel.find({
      isTrial: true,
      startDate: { $lte: oneMonthAgo },
    });
    for (const sub of expiredCandidatTrials) {
      const candidat = await CandidatModel.findById(sub.candidatId);
      if (candidat) {
        await CandidatSubscriptionModel.updateOne({ _id: sub._id }, { $set: { isTrial: false } });
        await sendExpirationEmail(sub.email, candidat.role || 'candidat', sub.endDate || now);
      }
    }

    // 🔁 Fin de l'abonnement annuel pour les candidats
    const expiredCandidatSubscriptions = await CandidatSubscriptionModel.find({
      isActive: true,
      endDate: { $lte: now },
    });
    for (const sub of expiredCandidatSubscriptions) {
      const candidat = await CandidatModel.findById(sub.candidatId);
      if (candidat) {
        await CandidatSubscriptionModel.updateOne({ _id: sub._id }, { $set: { isActive: false } });
        await sendExpirationEmail(sub.email, candidat.role || 'candidat', sub.endDate || now);
      }
    }

    return NextResponse.json({ message: 'Mise à jour des abonnements réussie' });
  } catch (error: any) {
    console.error('[CRON] Erreur:', error.message);
    return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 });
  }
}
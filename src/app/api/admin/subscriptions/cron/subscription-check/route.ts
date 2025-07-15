// api/admin/subscriptions/route.ts
import { NextResponse } from 'next/server';
import SubscriptionModelPromise from '@/models/Subscription';
import { sendExpirationEmail } from '@/lib/mailer';

export async function GET() {
  try {
    const SubscriptionModel = await SubscriptionModelPromise;
    const now = new Date();

    // Vérification des essais expirés (1 mois)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const expiredTrials = await SubscriptionModel.find({
      isTrial: true,
      startDate: { $lte: oneMonthAgo },
    }).populate('employerId');
    for (const sub of expiredTrials) {
      const employer = sub.employerId as any;
      if (employer && employer.email) {
        await SubscriptionModel.updateOne(
          { _id: sub._id },
          { $set: { isTrial: false, isActive: false } }
        );
        await sendExpirationEmail(employer.email, employer.role, sub.endDate || now);
      }
    }

    // Vérification des abonnements annuels expirés
    const expiredSubscriptions = await SubscriptionModel.find({
      isActive: true,
      endDate: { $lte: now },
    }).populate('employerId');
    for (const sub of expiredSubscriptions) {
      const employer = sub.employerId as any;
      if (employer && employer.email) {
        await SubscriptionModel.updateOne(
          { _id: sub._id },
          { $set: { isActive: false } }
        );
        await sendExpirationEmail(employer.email, employer.role, sub.endDate || now);
      }
    }

    return NextResponse.json({ message: 'Mise à jour des abonnements réussie' });
  } catch (error: any) {
    console.error('[CRON] Erreur:', error.message);
    return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import SubscriptionModelPromise from '@/models/Subscription';

export async function GET() {
  try {
    const SubscriptionModel = await SubscriptionModelPromise;

    const now = new Date();

    // 🔁 Fin de la période d’essai après 2 mois
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    await SubscriptionModel.updateMany(
      { isTrial: true, createdAt: { $lte: twoMonthsAgo } },
      { $set: { isTrial: false } }
    );

    // 🔁 Fin de l'abonnement annuel
    await SubscriptionModel.updateMany(
      { isActive: true, subscriptionEndDate: { $lte: now } },
      { $set: { isActive: false } }
    );

    return NextResponse.json({ message: 'Mise à jour des abonnements réussie' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Erreur serveur', details: error.message }, { status: 500 });
  }
}

import cron from 'node-cron';
import SubscriptionPromiseModel from '@/models/Subscription';
import { connectEmployersDb } from './mongodb';

async function checkExpiredTrials() {
  if (process.env.NODE_ENV === 'production') {
    console.log('[CRON] Désactivé en production, géré par Vercel.');
    return;
  }

  await connectEmployersDb();
  const SubscriptionModel = await SubscriptionPromiseModel;

  const now = new Date();

  // 🔁 Fin de la période d’essai après 1 mois
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const expiredTrials = await SubscriptionModel.updateMany(
    { isTrial: true, createdAt: { $lte: oneMonthAgo } },
    { $set: { isTrial: false } }
  );

  // 🔁 Fin de l'abonnement annuel
  const expiredSubscriptions = await SubscriptionModel.updateMany(
    { isActive: true, endDate: { $lte: now } },
    { $set: { isActive: false } }
  );

  console.log(`[CRON] ${expiredTrials.modifiedCount} essais expirés mis à jour`);
  console.log(`[CRON] ${expiredSubscriptions.modifiedCount} abonnements annuels expirés mis à jour`);
}

// Lance la tâche tous les jours à 00:00 (localement, pour tests)
cron.schedule('0 0 * * *', () => {
  console.log('[CRON] Vérification des abonnements (local)...');
  checkExpiredTrials().catch((err) => console.error('[CRON] Erreur:', err));
}, {
  timezone: 'Africa/Lagos', // WAT
});
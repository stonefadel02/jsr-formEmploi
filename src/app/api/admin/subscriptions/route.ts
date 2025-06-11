// /app/api/employeurs/subscriptions/route.ts

import { NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import SubscriptionModel from '@/models/Subscription';

export async function GET() {
  try {
    await connectEmployersDb();

    const SubscriptionModelResolved = await SubscriptionModel;
    const subscriptions = await SubscriptionModelResolved.find()
      .populate({
        path: 'employerId',
        select: 'companyName email',
      })
      .lean();

    const formatted = subscriptions.map((sub) => ({
      
      companyName: typeof sub.employerId === 'object' && 'companyName' in sub.employerId
        ? sub.employerId.companyName
        : 'Inconnu',
      email: typeof sub.employerId === 'object' && 'email' in sub.employerId
        ? sub.employerId.email
        : 'N/A',
      plan: sub.plan,
      startDate: sub.startDate,
      endDate: sub.endDate,
      isActive: sub.isActive,
      isTrial: sub.isTrial,
      price: sub.price ?? 0,
    }));

    return NextResponse.json(formatted);
  } catch (err: unknown) {
    let message = 'Unknown error';
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json(
      { error: 'Erreur serveur', message },
      { status: 500 }
    );
  }
}

// app/api/admin/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import Employer from '@/models/Employer';
import { adminMiddleware } from '../middleware';
import { ApiResponse, ISubscription } from '@/lib/types';

export const GET = adminMiddleware(async (req: NextRequest): Promise<NextResponse<ApiResponse<{ companyName: string; email: string; subscription: ISubscription }[]>>> => {
  try {
    await connectEmployersDb();
    const subscriptions = await Employer.find()
      .select('companyName email subscription')
      .lean();
    return NextResponse.json({ success: true, data: subscriptions }, { status: 200 });
  } catch (error) {
    console.error('Erreur récupération abonnements :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
});
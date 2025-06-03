// app/api/admin/employers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectEmployersDb } from '@/lib/mongodb';
import Employer from '@/models/Employer';
import { adminMiddleware } from '../../middleware';
import { ApiResponse, IEmployer } from '@/lib/types';

export const GET = adminMiddleware(async (req: NextRequest): Promise<NextResponse<ApiResponse<IEmployer[]>>> => {
  try {
    await connectEmployersDb();
    const employers = await Employer.find().select('-password');
    return NextResponse.json({ success: true, data: employers }, { status: 200 });
  } catch (error) {
    console.error('Erreur récupération employeurs :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur' }, { status: 500 });
  }
});
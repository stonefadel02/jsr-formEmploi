import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { senderName, senderEmail, message } = body;

    if (!senderName || !senderEmail || !message) {
      return NextResponse.json({ success: false, message: 'Tous les champs sont requis.' }, { status: 400 });
    }

    await sendContactFormEmail({ senderName, senderEmail, message });

    return NextResponse.json({ success: true, message: 'Message envoyé avec succès !' });

  } catch (error) {
    console.error('Erreur API contact :', error);
    return NextResponse.json({ success: false, message: 'Erreur serveur.' }, { status: 500 });
  }
}
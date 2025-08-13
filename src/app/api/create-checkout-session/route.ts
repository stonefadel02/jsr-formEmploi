import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: "2025-05-28.basil", // Version stable, ajustez si nécessaire
});

export async function POST(req: Request) {
  try {
    const { priceId, customer_email } = await req.json(); // <-- On reçoit l'email
    if (!priceId) {
      return NextResponse.json({ error: "priceId est requis" }, { status: 400 });
    }

    // Obtenir l'origine avec un schéma par défaut
    const origin = req.headers.get("origin");
    const baseUrl = origin ? (origin.startsWith("http") ? origin : `https://${origin}`) : "https://yourdomain.com"; // Remplacez "yourdomain.com" par votre domaine réel en production

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: customer_email, 
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/paiement/echec`,
    });

    if (!session.url) {
      throw new Error("Aucune URL de session retournée par Stripe");
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Erreur lors de la création de la session Checkout:", error);
    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}
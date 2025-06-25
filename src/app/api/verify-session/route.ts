import { NextRequest, NextResponse } from "next/server";
   import Stripe from "stripe";

   const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
     apiVersion: "2025-05-28.basil",
   });

   export async function GET(req: NextRequest) {
     const { searchParams } = new URL(req.url);
     const sessionId = searchParams.get("session_id");

     if (!sessionId) {
       return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
     }

     try {
       const session = await stripe.checkout.sessions.retrieve(sessionId, {
         expand: ["payment_intent"], // Inclut les détails du paiement
       });

       if (session.payment_status === "paid") {
         return NextResponse.json({ success: true, message: "Paiement réussi" });
       } else {
         return NextResponse.json({ success: false, message: "Paiement non complété" }, { status: 400 });
       }
     } catch (error) {
       console.error("Error verifying session:", error);
       return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
     }
   }
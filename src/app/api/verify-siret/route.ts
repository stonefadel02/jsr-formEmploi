// /api/verify-siret/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siret = searchParams.get('siret');

  if (!siret || !/^\d{14}$/.test(siret)) {
    return NextResponse.json({ isValid: false, message: 'Le format du SIRET est invalide (14 chiffres attendus).' }, { status: 400 });
  }

  try {
    // NOTE : Vous devez vous inscrire sur api.insee.fr pour obtenir un token
    const apiToken = 'cf9d748d-088e-31ec-94a0-c69642e8119c';
    const response = await fetch(`https://api.insee.fr/api-sirene/3.11/siret/${siret}`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("L'entreprise n'a pas pu être vérifiée.");
    }
    
    const data = await response.json();
    
    // Vous pouvez ajouter plus de vérifications ici (ex: si l'entreprise est active)
    if (data.etablissement) {
      return NextResponse.json({ isValid: true, message: 'SIRET valide.', companyName: data.etablissement.uniteLegale.denominationUniteLegale });
    } else {
      throw new Error("Aucun établissement trouvé pour ce SIRET.");
    }

  } catch (error: any) {
    console.error("Erreur API SIRET:", error);
    return NextResponse.json({ isValid: false, message: error.message || 'Erreur lors de la vérification du SIRET.' }, { status: 500 });
  }
}
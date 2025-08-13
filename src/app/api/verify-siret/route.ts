import { NextRequest, NextResponse } from 'next/server';
import { getINSEEToken } from '@/lib/insee'; // ✅ Importer notre nouvelle fonction

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const siret = searchParams.get('siret');

  if (!siret || !/^\d{14}$/.test(siret)) {
    return NextResponse.json({ isValid: false, message: 'Le format du SIRET est invalide.' }, { status: 400 });
  }

  try {
    // ✅ On récupère le token de manière dynamique et automatique
    const apiToken = await getINSEEToken();
    
    const response = await fetch(`https://api.insee.fr/api-sirene/3.11/siret/${siret}`, { // J'ai corrigé l'URL de l'API SIRENE
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Aucun établissement trouvé pour ce SIRET.");
      }
      throw new Error("L'entreprise n'a pas pu être vérifiée.");
    }
    
    const data = await response.json();
    
    if (data.etablissement) {
      return NextResponse.json({ isValid: true, message: 'SIRET valide.', companyName: data.etablissement.uniteLegale.denominationUniteLegale });
    } else {
      throw new Error("Réponse de l'API invalide.");
    }

  } catch (error: any) {
    console.error("Erreur API SIRET:", error);
    return NextResponse.json({ isValid: false, message: error.message || 'Erreur lors de la vérification.' }, { status: 500 });
  }
}
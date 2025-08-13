import ApiTokenModel from '@/models/ApiToken';
import { connectCandidatsDb } from '@/lib/mongodb'; // Assurez-vous que le chemin est bon

export async function getINSEEToken(): Promise<string> {
    
  await connectCandidatsDb();
  const tokenName = 'insee_api_token';
  const bufferTime = 5 * 60 * 1000; // 5 minutes de marge de sécurité

  const storedToken = await ApiTokenModel.findOne({ name: tokenName });

  // Si un token existe et qu'il est encore valide (avec la marge de sécurité), on le renvoie
  if (storedToken && storedToken.expiresAt.getTime() > Date.now() + bufferTime) {
    console.log("Utilisation du token INSEE depuis la BDD.");
    return storedToken.accessToken;
  }

  // Sinon, on en demande un nouveau
  console.log("Génération d'un nouveau token INSEE...");
  const consumerKey = process.env.INSEE_CONSUMER_KEY;
  const consumerSecret = process.env.INSEE_CONSUMER_SECRET;
  
  if (!consumerKey || !consumerSecret) {
    throw new Error("Clés INSEE manquantes dans les variables d'environnement.");
  }
  
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  const response = await fetch('https://api.insee.fr/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Échec de la récupération du token INSEE.');
  }

  const data = await response.json();
  const accessToken = data.access_token;
  const expiresIn = data.expires_in; // Durée en secondes (ex: 604800 pour 7 jours)

  const expiresAt = new Date(Date.now() + (expiresIn * 1000));

  // On sauvegarde le nouveau token et sa date d'expiration dans la BDD
  await ApiTokenModel.findOneAndUpdate(
    { name: tokenName },
    { accessToken, expiresAt },
    { upsert: true, new: true } // Crée le document s'il n'existe pas
  );

  return accessToken;
}
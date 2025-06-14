export const runtime = "edge";

export async function GET() {
  // Logique de la fonction ici
  return new Response("Subscription check executed", { status: 200 });
}
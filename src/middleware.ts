import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = [
  "/",
  "/auth/login",
  "/auth/candidats/register",
  "/auth/employeurs/register",
  "/auth/google",
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const token = req.cookies.get("token")?.value;

  // ✅ Autoriser l'accès aux routes publiques
  if (publicRoutes.includes(url)) {
    return NextResponse.next();
  }

  // ❌ Rediriger les non-connectés vers la page de connexion appropriée
  if (!token) {
    console.log("Token non trouvé");
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  let role: string | null = null;
  let decoded: any = null;
  try {
    decoded = jwt.decode(token);
    if (decoded && typeof decoded === "object" && "role" in decoded) {
      role = decoded.role as string;
    }
  } catch (error) {
    console.log("Erreur décodage token :", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  console.log(`Token trouvé : ${token}`);
  console.log("Decoded token :", decoded);

  // ✅ Interdire l’accès aux pages d’auth si déjà connecté → rediriger vers le bon dashboard
  if (publicRoutes.includes(url) && decoded) {
    let dashboardRoute = "/dashboard";

    switch (role) {
      case "admin":
        dashboardRoute = "/dashboard/admin";
        break;
      case "employeur":
        dashboardRoute = "/dashboard/employeur";
        break;
      case "candidat":
        dashboardRoute = "/candidat/profile";
        break;
    }

    return NextResponse.redirect(new URL(dashboardRoute, req.url));
  }

  // ✅ Protection des routes par rôle
  if (url.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/employeur") && role !== "employeur") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Modifier la condition pour /candidat : autoriser employeur et candidat
  if (url.startsWith("/candidat") && role !== "candidat" && role !== "employeur") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|api/).*)"],
};
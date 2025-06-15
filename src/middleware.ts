import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const publicRoutes = [
  "/",
  "/pages/paiement",
  "/pages/inscription",
  "/pages/contact",
  "/pages/acceuil",
  "/pages/acceuil_recruteur",
  "/pages/tarifs",
  "/auth/login",
  "/auth/candidats/register",
  "/auth/employeur/register",
  "/auth/google",
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;

  // ✅ Exclure explicitement les routes d'images avant toute vérification
  if (url.startsWith("/_next/image")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // ✅ Autoriser l'accès aux routes publiques
  if (publicRoutes.includes(url)) {
    return NextResponse.next();
  }

  // ❌ Rediriger les non-connectés vers la page de connexion appropriée
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  let role: string | null = null;
  interface JwtPayload {
    role?: string;
    [key: string]: unknown;
  }
  let decoded: JwtPayload | null = null;
  try {
    decoded = jwt.decode(token) as JwtPayload | null;
    if (decoded && typeof decoded === "object" && "role" in decoded) {
      role = decoded.role as string;
    }
  } catch (error) {
    console.log("Erreur décodage token :", error);
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
  const isActive = decoded?.isActive;
  const isTrial = decoded?.isTrial;


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
  if (url.startsWith("/employeur") && role !== "employeur" && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/candidats") && role !== "employeur" && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/candidat") && role !== "candidat") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (url === "/employeur/candidats" && (isActive===false && isTrial===false)) {
    return NextResponse.redirect(new URL("/pages/tarifs", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/image|_next/static|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif)$|api/).*)"],
};
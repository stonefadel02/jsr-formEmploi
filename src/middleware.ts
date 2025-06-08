import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import jwt from "jsonwebtoken";

const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/candidats/register',
  '/auth/employeurs/register',
  '/auth/google',
];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const token = req.cookies.get('token')?.value;

  // ✅ Autoriser l'accès aux routes publiques
  if (publicRoutes.includes(url)) {
    return NextResponse.next();
  }

  // ❌ Rediriger les non-connectés vers la page de connexion appropriée
  if (!token) {
    console.log(token, 'Token non trouvé');
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  let role : string | null = null
  const decoded = jwt.decode(token);
  if (decoded && typeof decoded === 'object' && 'role' in decoded){
    role = decoded.role as string
   }
  console.log(`Token trouvé : ${token}`); 
  console.log(decoded);
  
  

  try {
    
    // Routes publiques
    const isPublicRoute = publicRoutes.includes(url);

    // ✅ Interdire l’accès aux pages d’auth si déjà connecté → rediriger vers le bon dashboard
    if (isPublicRoute && decoded) {
      console.log(decoded);

      let dashboardRoute = '/dashboard';

      switch (role) {
        case 'admin':
          dashboardRoute = '/dashboard/admin';
          break;
        case 'employeur':
          dashboardRoute = '/dashboard/employeur';
          break;
        case 'candidat':
          dashboardRoute = '/candidat/profile';
          break;
      }

      return NextResponse.redirect(new URL(dashboardRoute, req.url));
    }

    // Si route privée et pas de token → redirection login
    if (!isPublicRoute && !decoded) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // ✅ Protection des routes par rôle
    if (url.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (url.startsWith('/employeur') && role !== 'employeur') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    if (url.startsWith('/candidat') && role !== 'candidat') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // ❌ Token invalide ou expiré
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|api/).*)'],
};

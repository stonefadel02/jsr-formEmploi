import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import EmployerPromise from '@/models/Employer';
import { AuthRequest, ApiResponse } from '@/lib/types';

// Interface pour les données décodées du token
interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function adminMiddleware(handler: (req: AuthRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
      const Employer = await EmployerPromise; // Résoudre la Promise

      const employer = await Employer.findById(decoded.id).select('role status'); // Optimisation : ne charger que les champs nécessaires
      if (!employer) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      if (employer.role !== 'admin') {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: 'Admin access required' },
          { status: 403 }
        );
      }

      // Ajouter les données de l'utilisateur à la requête
      (req as AuthRequest).user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };

      return handler(req as AuthRequest);
    } catch (error) {
      console.error('Middleware error:', error instanceof Error ? error.message : error);
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: 'Invalid token' },
          { status: 401 }
        );
      } else if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, message: 'Token expired' },
          { status: 401 }
        );
      }
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
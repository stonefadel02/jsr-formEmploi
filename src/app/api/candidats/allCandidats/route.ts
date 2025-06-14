import { NextRequest, NextResponse } from "next/server";
import { connectCandidatsDb } from "@/lib/mongodb";
import CandidatPromise from "../../../../models/Candidats";
import EmployerPromise from "@/models/Employer";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { ICandidat, ApiResponse } from "@/lib/types";

interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  role?: string;
}

interface QueryParams {
  keyword?: string;
  sector?: string;
  location?: string;
  level?: string;
  contracttype?: string;
  sortBy?: "date" | "relevance" | "location";
  page?: string;
  limit?: string;
}

interface MatchQuery {
  status: "Validé";
  firstName?: { $regex: string; $options: string };
  lastName?: { $regex: string; $options: string };
  email?: { $regex: string; $options: string };
  "alternanceSearch.sector"?: string;
  "alternanceSearch.location"?: string;
  "alternanceSearch.level"?: string;
  "alternanceSearch.contracttype"?: string;
  $or?: Array<
    | { firstName: { $regex: string; $options: string } }
    | { lastName: { $regex: string; $options: string } }
    | { email: { $regex: string; $options: string } }
  >;
}

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<{ candidats: ICandidat[]; total: number }>>> {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return NextResponse.json({ success: false, message: "Token expired" }, { status: 401 });
      }
      if (error instanceof JsonWebTokenError) {
        return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
      }
      throw error;
    }

    const Employer = await EmployerPromise;
    const employer = await Employer.findById(decoded.id).select("role");
    if (!employer || employer.role !== "employeur" && employer.role !== "admin") {
      return NextResponse.json({ success: false, message: "Employeur access required" }, { status: 403 });
    }

    await connectCandidatsDb();
    const Candidat = await CandidatPromise;

    const { searchParams } = new URL(req.url);
    const query: QueryParams = {
      keyword: searchParams.get("keyword") || undefined,
      sector: searchParams.get("sector") || undefined,
      location: searchParams.get("location") || undefined,
      level: searchParams.get("level") || undefined,
      contracttype: searchParams.get("contracttype") || undefined,
      sortBy: (searchParams.get("sortBy") as "date" | "relevance" | "location") || "date",
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    };

    const page = Math.max(parseInt(query.page ?? "1", 10), 1);
    const limit = Math.max(parseInt(query.limit ?? "10", 10), 1);
    const skip = (page - 1) * limit;

    const matchQuery: MatchQuery = { status: "Validé" };

    if (query.keyword) {
      const keyword = query.keyword.toLowerCase();
      matchQuery.$or = [
        { firstName: { $regex: keyword, $options: "i" } },
        { lastName: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ];
    }
    if (query.sector) matchQuery["alternanceSearch.sector"] = query.sector;
    if (query.location) matchQuery["alternanceSearch.location"] = query.location;
    if (query.level) matchQuery["alternanceSearch.level"] = query.level;
    if (query.contracttype) matchQuery["alternanceSearch.contracttype"] = query.contracttype;

    const sortOption: Record<string, 1 | -1> = {};
    switch (query.sortBy) {
      case "date":
        sortOption.createdAt = -1;
        break;
      case "relevance":
        sortOption.firstName = 1; // Tri par nom comme proxy pour la pertinence
        break;
      case "location":
        sortOption["alternanceSearch.location"] = 1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const candidats = await Candidat.find(matchQuery)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .select("-password"); // Exclure le mot de passe

    const total = await Candidat.countDocuments(matchQuery);

    return NextResponse.json(
      {
        success: true,
        data: { candidats, total },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur récupération candidats :", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}
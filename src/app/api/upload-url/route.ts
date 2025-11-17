// app/api/upload-url/route.ts

import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// 1. Configurer le client S3
if (!process.env.DO_SPACES_ENDPOINT || !process.env.DO_SPACES_KEY || !process.env.DO_SPACES_SECRET) {
  throw new Error("Missing required environment variables for S3 configuration");
}

const s3Client = new S3Client({
  endpoint: `https://${process.env.DO_SPACES_ENDPOINT}`,
  region: "us-east-1", // La "fausse" région (confirmé par la doc)
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

export async function POST(req: NextRequest) {
  try {
    // Différence App Router: on récupère le body avec req.json()
    const { name, type } = await req.json();

    if (!name || !type) {
      return NextResponse.json({ error: "Missing name or type" }, { status: 400 });
    }

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: name,
      ContentType: type,
      ACL: "public-read", // Rendre le fichier public
    });

    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 60, // L'URL est valide 1 minute
    });

    const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${name}`;

    return NextResponse.json({
      uploadUrl: signedUrl, // L'URL pour faire le PUT
      publicUrl: publicUrl,   // L'URL à sauvegarder
    });

  } catch (error) {
    console.error("Error generating signed URL", error);
    return NextResponse.json({ error: "Error generating upload URL" }, { status: 500 });
  }
}
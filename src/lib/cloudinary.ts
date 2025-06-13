import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const uploadToCloudinary = async (file: Buffer, folder: string): Promise<string> => {
  // Détection rapide basée sur l'en-tête PDF (premiers bytes)
  const isPdf = file.slice(0, 4).toString() === '%PDF';
  const isMp4 = file.slice(4, 8).toString() === 'ftyp'; // Simple check pour MP4

  const resourceType = isPdf ? 'raw' : isMp4 ? 'video' : 'auto';

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url || '');
      }
    ).end(file);
  });
};

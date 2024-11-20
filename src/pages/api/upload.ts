import type { APIRoute } from 'astro';
import { isAuthenticated } from '../../lib/auth';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

export const post: APIRoute = async ({ request }) => {
  if (!await isAuthenticated(request)) {
    return new Response(null, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll('images');
    const urls = [];

    for (const file of files) {
      if (file instanceof File) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name}`;
        const outputPath = path.join(process.cwd(), 'public', 'uploads', filename);

        await sharp(buffer)
          .jpeg({ quality: 85 })
          .resize(1200, 800, { fit: 'inside' })
          .withMetadata({ orientation: 1 })
          .toFile(outputPath);

        urls.push(`/uploads/${filename}`);
      }
    }

    return new Response(JSON.stringify({ urls }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to upload images' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
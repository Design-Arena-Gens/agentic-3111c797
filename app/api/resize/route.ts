import { NextRequest } from 'next/server';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as unknown as File | null;
    const widthStr = String(form.get('width') || '');
    const heightStr = String(form.get('height') || '');
    const keepAspect = String(form.get('keepAspect') || 'true') === 'true';

    if (!file) return new Response('No file provided', { status: 400 });

    const width = widthStr ? Number(widthStr) : undefined;
    const height = heightStr ? Number(heightStr) : undefined;

    if (!width && !height) return new Response('Provide width or height', { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    let pipeline = sharp(inputBuffer, { failOnError: false }).resize({ width, height, fit: 'inside' });

    if (!keepAspect && width && height) {
      pipeline = sharp(inputBuffer, { failOnError: false }).resize(width, height, { fit: 'fill' });
    }

    const output = await pipeline.png({ quality: 90 }).toBuffer();

    return new Response(output, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="resized.png"'
      }
    });
  } catch (e: any) {
    return new Response(e?.message || 'Server error', { status: 500 });
  }
}

import { NextRequest } from 'next/server';
import mammoth from 'mammoth';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get('file') as unknown as File | null;
    const inputFormat = String(form.get('inputFormat') || '').toLowerCase();
    const outputFormat = String(form.get('outputFormat') || '').toLowerCase();

    if (!file) return new Response('No file provided', { status: 400 });
    if (!inputFormat || !outputFormat) return new Response('Missing formats', { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Routing by requested formats
    if (inputFormat === 'docx' && outputFormat === 'txt') {
      const { value } = await mammoth.extractRawText({ buffer: inputBuffer });
      return new Response(value, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Content-Disposition': 'attachment; filename="output.txt"'
        }
      });
    }

    // Image conversions handled by sharp
    const supportedImages = new Set(['jpg', 'jpeg', 'png', 'webp']);
    if (!supportedImages.has(inputFormat) && inputFormat !== 'jpg' && inputFormat !== 'jpeg' && inputFormat !== 'png') {
      // Try to infer from content-type if possible
      // Fallback to attempting decode with sharp; if fails, reject
    }

    const image = sharp(inputBuffer, { failOnError: false });

    if (outputFormat === 'webp') {
      const out = await image.webp({ quality: 90 }).toBuffer();
      return new Response(out, {
        headers: {
          'Content-Type': 'image/webp',
          'Content-Disposition': 'attachment; filename="output.webp"'
        }
      });
    }

    if (outputFormat === 'pdf') {
      const out = await image.pdf().toBuffer();
      return new Response(out, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="output.pdf"'
        }
      });
    }

    return new Response('Unsupported conversion', { status: 400 });
  } catch (e: any) {
    return new Response(e?.message || 'Server error', { status: 500 });
  }
}

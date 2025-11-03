"use client";

import React from 'react';

interface PreviewPaneProps {
  file?: File | null;
  width: number | '';
  height: number | '';
  keepAspect: boolean;
}

export default function PreviewPane({ file, width, height, keepAspect }: PreviewPaneProps) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dataUrl, setDataUrl] = React.useState<string | null>(null);
  const [natural, setNatural] = React.useState<{ w: number; h: number } | null>(null);

  React.useEffect(() => {
    if (!file) {
      setDataUrl(null);
      setNatural(null);
      setError(null);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Preview available for images only');
      setDataUrl(null);
      setNatural(null);
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      const targetW = width === '' ? img.naturalWidth : Number(width);
      const targetH = height === '' ? img.naturalHeight : Number(height);
      const [finalW, finalH] = computeSize(img.naturalWidth, img.naturalHeight, targetW, targetH, keepAspect);
      const canvas = canvasRef.current!;
      canvas.width = finalW;
      canvas.height = finalH;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, finalW, finalH);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, finalW, finalH);
      setDataUrl(canvas.toDataURL('image/png'));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      setError('Failed to load image preview');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, [file, width, height, keepAspect]);

  if (!file) return (
    <div className="rounded-md border border-blueSoft bg-white/70 p-4 text-sm text-slate-600">No file selected</div>
  );

  return (
    <div className="rounded-md border border-blueSoft bg-white/70 p-4">
      {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
      <div className="flex items-start gap-4">
        <canvas ref={canvasRef} className="max-h-80 w-auto rounded shadow" aria-label="Preview canvas" />
        <div className="text-sm text-slate-700">
          {natural && (
            <>
              <p><strong>Original:</strong> {natural.w} ? {natural.h}</p>
              <p><strong>Preview:</strong> {width || natural.w} ? {height || natural.h}</p>
            </>
          )}
          {dataUrl && (
            <a
              href={dataUrl}
              download={file.name.replace(/\.[^.]+$/, '') + '-preview.png'}
              className="mt-3 inline-block rounded bg-bluePrimary px-4 py-2 font-semibold text-white hover:bg-bluePrimary/90 focus-visible:outline-2 focus-visible:outline-bluePrimary"
            >
              Download Preview PNG
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function computeSize(nw: number, nh: number, tw: number, th: number, keep: boolean): [number, number] {
  if (!keep) return [tw, th];
  const aspect = nw / nh;
  if (tw && !th) return [tw, Math.round(tw / aspect)];
  if (!tw && th) return [Math.round(th * aspect), th];
  if (tw && th) return [Math.round(th * aspect), th];
  return [nw, nh];
}

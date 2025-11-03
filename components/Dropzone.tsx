"use client";

import React from 'react';

interface DropzoneProps {
  onFiles: (files: File[]) => void;
}

export default function Dropzone({ onFiles }: DropzoneProps) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) onFiles(files);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
  };

  return (
    <div
      className={`rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${isDragging ? 'border-bluePrimary bg-white' : 'border-blueSoft bg-white/70'}`}
      role="region"
      aria-label="Upload files"
      onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
      onDrop={onDrop}
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
    >
      <p className="mx-auto max-w-prose text-slate-700">
        Drag and drop files here, or
      </p>
      <button
        type="button"
        className="mt-3 inline-flex items-center justify-center rounded-md bg-bluePrimary px-5 py-2 font-semibold text-white shadow-sm hover:bg-bluePrimary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bluePrimary"
        onClick={() => inputRef.current?.click()}
        aria-label="Browse files to upload"
      >
        Browse Files
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        multiple
        onChange={onSelect}
      />
    </div>
  );
}

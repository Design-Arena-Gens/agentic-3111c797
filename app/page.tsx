"use client";

import React from 'react';
import Dropzone from '@/components/Dropzone';
import FormatSelect from '@/components/FormatSelect';
import PreviewPane from '@/components/PreviewPane';
import ProgressBar from '@/components/ProgressBar';

export default function HomePage() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const [inputFormat, setInputFormat] = React.useState('jpg');
  const [outputFormat, setOutputFormat] = React.useState('pdf');

  const [width, setWidth] = React.useState<number | ''>('');
  const [height, setHeight] = React.useState<number | ''>('');
  const [keepAspect, setKeepAspect] = React.useState(true);

  const [uploadProgress, setUploadProgress] = React.useState<number | undefined>(undefined);
  const [processing, setProcessing] = React.useState(false);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [statusMsg, setStatusMsg] = React.useState<string | null>(null);

  const onFiles = (incoming: File[]) => {
    setFiles(incoming);
    setSelectedFile(incoming[0]);
    setStatusMsg(null);
    setDownloadUrl(null);
  };

  const convert = async () => {
    if (!selectedFile) return;
    setProcessing(true);
    setUploadProgress(0);
    setStatusMsg('Uploading...');
    setDownloadUrl(null);

    try {
      const form = new FormData();
      form.set('file', selectedFile);
      form.set('inputFormat', inputFormat);
      form.set('outputFormat', outputFormat);

      const res = await xhrUpload('/api/convert', form, (p) => setUploadProgress(p));
      setStatusMsg('Processing...');

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Conversion failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMsg('Done');
    } catch (e: any) {
      setStatusMsg(e.message || 'Failed');
    } finally {
      setProcessing(false);
      setUploadProgress(undefined);
    }
  };

  const resize = async () => {
    if (!selectedFile) return;
    if (width === '' && height === '') {
      setStatusMsg('Please set width or height');
      return;
    }
    setProcessing(true);
    setUploadProgress(0);
    setStatusMsg('Uploading...');
    setDownloadUrl(null);

    try {
      const form = new FormData();
      form.set('file', selectedFile);
      form.set('width', String(width || ''));
      form.set('height', String(height || ''));
      form.set('keepAspect', String(keepAspect));

      const res = await xhrUpload('/api/resize', form, (p) => setUploadProgress(p));
      setStatusMsg('Processing...');

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Resize failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatusMsg('Done');
    } catch (e: any) {
      setStatusMsg(e.message || 'Failed');
    } finally {
      setProcessing(false);
      setUploadProgress(undefined);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="mb-10">
        <h1 className="text-center text-3xl font-extrabold text-slate-900 sm:text-4xl">Convert Files & Resize Images</h1>
        <p className="mx-auto mt-2 max-w-3xl text-center text-slate-700">Fast, accessible, and private. Drag-and-drop to get started.</p>
      </section>

      <section className="mb-8" aria-labelledby="upload-zone">
        <h2 id="upload-zone" className="sr-only">Upload</h2>
        <Dropzone onFiles={onFiles} />
      </section>

      <section className="mb-12 rounded-xl bg-white/70 p-6 shadow-sm" aria-labelledby="conversion">
        <h2 id="conversion" className="mb-4 text-xl font-bold text-slate-900">File Conversion</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <FormatSelect
              inputFormat={inputFormat}
              outputFormat={outputFormat}
              onInputChange={setInputFormat}
              onOutputChange={setOutputFormat}
            />
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md bg-bluePrimary px-5 py-2 font-semibold text-white shadow-sm hover:bg-bluePrimary/90 focus-visible:outline-2 focus-visible:outline-bluePrimary disabled:opacity-50"
              onClick={convert}
              disabled={!selectedFile}
            >
              Convert
            </button>
            {(processing || uploadProgress !== undefined) && (
              <div className="mt-4">
                <ProgressBar value={uploadProgress} label={statusMsg || undefined} />
              </div>
            )}
            {downloadUrl && (
              <div className="mt-3">
                <a
                  className="inline-flex items-center justify-center rounded-md bg-blueSoft px-5 py-2 font-semibold text-slate-900 hover:bg-blueSoft/90 focus-visible:outline-2 focus-visible:outline-bluePrimary"
                  href={downloadUrl}
                  download
                >
                  Download Result
                </a>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-md border border-blueSoft bg-white p-4 text-sm text-slate-700">
              <p className="font-semibold">Supported conversions</p>
              <ul className="mt-2 list-disc pl-5">
                <li>JPG ? PDF, WEBP</li>
                <li>PNG ? WEBP, PDF</li>
                <li>DOCX ? TXT</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12 rounded-xl bg-white/70 p-6 shadow-sm" aria-labelledby="resize">
        <h2 id="resize" className="mb-4 text-xl font-bold text-slate-900">Image Resizer</h2>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <ResizeControls
              width={width}
              height={height}
              keepAspect={keepAspect}
              onWidthChange={(w) => {
                if (keepAspect && selectedFile) {
                  // Best-effort client adjustment happens in preview component already
                }
                setWidth(w);
              }}
              onHeightChange={(h) => {
                setHeight(h);
              }}
              onKeepAspectChange={setKeepAspect}
            />
            <div className="flex gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-bluePrimary px-5 py-2 font-semibold text-white shadow-sm hover:bg-bluePrimary/90 focus-visible:outline-2 focus-visible:outline-bluePrimary disabled:opacity-50"
                onClick={resize}
                disabled={!selectedFile}
              >
                Resize & Download
              </button>
            </div>
            {(processing || uploadProgress !== undefined) && (
              <div className="mt-4">
                <ProgressBar value={uploadProgress} label={statusMsg || undefined} />
              </div>
            )}
          </div>
          <div>
            <PreviewPane file={selectedFile || undefined} width={width} height={height} keepAspect={keepAspect} />
          </div>
        </div>
      </section>

      <footer className="mt-12 text-center text-sm text-slate-600">
        Built with privacy in mind. Files are processed in-session and not stored.
      </footer>
    </main>
  );
}

function xhrUpload(url: string, form: FormData, onProgress: (value: number) => void): Promise<Response> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.responseType = 'blob';

    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress(percent);
      } else {
        onProgress(NaN);
      }
    };

    xhr.onload = () => {
      const headers = parseHeaders(xhr.getAllResponseHeaders());
      const blob = new Blob([xhr.response], { type: headers['content-type'] || 'application/octet-stream' });
      // Recreate fetch Response-compatible object
      resolve(new Response(blob, { status: xhr.status, statusText: xhr.statusText, headers }));
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(form);
  });
}

function parseHeaders(raw: string): Record<string, string> {
  return raw.split('\n').reduce((acc, line) => {
    const idx = line.indexOf(':');
    if (idx > -1) acc[line.slice(0, idx).trim().toLowerCase()] = line.slice(idx + 1).trim();
    return acc;
  }, {} as Record<string, string>);
}

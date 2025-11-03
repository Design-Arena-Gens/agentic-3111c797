"use client";

import React from 'react';

export type ConversionPair = {
  input: string;
  output: string;
};

interface FormatSelectProps {
  inputFormat: string;
  outputFormat: string;
  onInputChange: (fmt: string) => void;
  onOutputChange: (fmt: string) => void;
}

const inputOptions = [
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
  { value: 'docx', label: 'DOCX' },
];

const outputOptions: Record<string, { value: string; label: string }[]> = {
  jpg: [
    { value: 'pdf', label: 'PDF' },
    { value: 'webp', label: 'WEBP' },
  ],
  png: [
    { value: 'webp', label: 'WEBP' },
    { value: 'pdf', label: 'PDF' },
  ],
  docx: [
    { value: 'txt', label: 'TXT' },
  ],
};

export default function FormatSelect({ inputFormat, outputFormat, onInputChange, onOutputChange }: FormatSelectProps) {
  const outputs = outputOptions[inputFormat] ?? [];
  const selectedOutputValid = outputs.some(o => o.value === outputFormat);
  const finalOutput = selectedOutputValid ? outputFormat : outputs[0]?.value ?? '';

  React.useEffect(() => {
    if (!selectedOutputValid && finalOutput) onOutputChange(finalOutput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputFormat]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex flex-col gap-1">
        <label htmlFor="input-format" className="text-sm font-semibold text-slate-800">From</label>
        <select
          id="input-format"
          className="h-11 rounded-md border border-blueSoft bg-white px-3 text-slate-800 focus-visible:outline-2 focus-visible:outline-bluePrimary"
          value={inputFormat}
          onChange={(e) => onInputChange(e.target.value)}
          aria-label="Select input format"
        >
          {inputOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="output-format" className="text-sm font-semibold text-slate-800">To</label>
        <select
          id="output-format"
          className="h-11 rounded-md border border-blueSoft bg-white px-3 text-slate-800 focus-visible:outline-2 focus-visible:outline-bluePrimary"
          value={finalOutput}
          onChange={(e) => onOutputChange(e.target.value)}
          aria-label="Select output format"
        >
          {outputs.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

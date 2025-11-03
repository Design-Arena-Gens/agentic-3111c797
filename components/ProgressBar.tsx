"use client";

import React from 'react';

interface ProgressBarProps {
  value?: number; // 0-100; undefined for indeterminate
  label?: string;
}

export default function ProgressBar({ value, label }: ProgressBarProps) {
  const isIndeterminate = value === undefined || Number.isNaN(value);
  const clamped = Math.min(100, Math.max(0, value ?? 0));

  return (
    <div className="w-full" aria-live="polite">
      {label && (
        <div className="mb-1 text-sm text-slate-700" id="progress-label">
          {label}
        </div>
      )}
      <div
        className={`h-3 rounded bg-slate-200 ${isIndeterminate ? 'progress-indeterminate' : ''}`}
        role="progressbar"
        aria-labelledby={label ? 'progress-label' : undefined}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={isIndeterminate ? undefined : clamped}
      >
        {!isIndeterminate && (
          <div
            className="h-3 rounded bg-bluePrimary transition-all"
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  );
}

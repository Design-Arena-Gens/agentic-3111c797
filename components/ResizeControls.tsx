"use client";

import React from 'react';

interface ResizeControlsProps {
  width: number | '';
  height: number | '';
  keepAspect: boolean;
  onWidthChange: (w: number | '') => void;
  onHeightChange: (h: number | '') => void;
  onKeepAspectChange: (k: boolean) => void;
}

export default function ResizeControls({ width, height, keepAspect, onWidthChange, onHeightChange, onKeepAspectChange }: ResizeControlsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="width" className="text-sm font-semibold text-slate-800">Width (px)</label>
        <input
          id="width"
          type="number"
          min={1}
          value={width}
          onChange={(e) => onWidthChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="h-11 rounded-md border border-blueSoft bg-white px-3 text-slate-800 focus-visible:outline-2 focus-visible:outline-bluePrimary"
          aria-describedby="aspect-help"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="height" className="text-sm font-semibold text-slate-800">Height (px)</label>
        <input
          id="height"
          type="number"
          min={1}
          value={height}
          onChange={(e) => onHeightChange(e.target.value === '' ? '' : Number(e.target.value))}
          className="h-11 rounded-md border border-blueSoft bg-white px-3 text-slate-800 focus-visible:outline-2 focus-visible:outline-bluePrimary"
        />
      </div>
      <div className="flex items-end">
        <label className="inline-flex items-center gap-3">
          <input
            type="checkbox"
            checked={keepAspect}
            onChange={(e) => onKeepAspectChange(e.target.checked)}
            className="h-5 w-5 rounded border-blueSoft text-bluePrimary focus-visible:outline-2 focus-visible:outline-bluePrimary"
          />
          <span className="text-sm font-semibold text-slate-800">Lock aspect ratio</span>
        </label>
      </div>
      <p id="aspect-help" className="sm:col-span-3 text-xs text-slate-600">If aspect ratio is locked, changing one dimension will adjust the other automatically.</p>
    </div>
  );
}

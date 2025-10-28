"use client";

import { useState } from 'react';
import { Loader2, Upload } from 'lucide-react';

interface Props {
  accept: string[];
  onUploaded: (jobId: number) => void;
}

export function ImportUploader({ accept, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setProgress(20);
    try {
      // TODO: replace with startImport once backend is available
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setProgress(90);
      onUploaded(Math.floor(Math.random() * 1000));
    } finally {
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 600);
    }
  };

  return (
    <label className="flex w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-muted/40 p-6 text-center transition hover:border-brand-600 hover:bg-brand-600/10">
      <input type="file" accept={accept.join(',')} className="sr-only" onChange={handleFileChange} />
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600/10 text-brand-600">
        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">拖拽或点击上传 CSV / Excel</p>
        <p className="text-xs text-muted-foreground">支持 {accept.join(', ')}</p>
      </div>
      {uploading ? (
        <div className="w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-brand-600 transition-all"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
          />
        </div>
      ) : null}
    </label>
  );
}

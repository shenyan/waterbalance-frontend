"use client";

import { useId } from 'react';

interface Props {
  start?: string;
  end?: string;
  onChange?: (value: { start?: string; end?: string }) => void;
}

export function DateRangePicker({ start, end, onChange }: Props) {
  const startId = useId();
  const endId = useId();

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={startId} className="text-sm text-muted-foreground">
        起始
      </label>
      <input
        id={startId}
        type="date"
        className="rounded-lg border border-border/60 bg-transparent px-3 py-1.5 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
        value={start ?? ''}
        onChange={(event) => onChange?.({ start: event.target.value, end })}
      />
      <span className="text-muted-foreground">至</span>
      <input
        id={endId}
        type="date"
        className="rounded-lg border border-border/60 bg-transparent px-3 py-1.5 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
        value={end ?? ''}
        onChange={(event) => onChange?.({ start, end: event.target.value })}
      />
    </div>
  );
}

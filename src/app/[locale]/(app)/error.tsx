"use client";

import { useEffect } from 'react';
import { ErrorBlock } from '@/components/feedback/ErrorBlock';

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <ErrorBlock
        title="页面出错"
        description={error.message}
        action={
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft"
          >
            重试
          </button>
        }
      />
    </div>
  );
}

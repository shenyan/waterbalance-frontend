import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import AuditsClient from './view';

export default function AuditsPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载审计日志..." />}>
      <AuditsClient />
    </Suspense>
  );
}

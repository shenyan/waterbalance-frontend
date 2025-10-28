import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import StandardsClient from './view';

export default function StandardsPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载标准阈值..." />}>
      <StandardsClient />
    </Suspense>
  );
}

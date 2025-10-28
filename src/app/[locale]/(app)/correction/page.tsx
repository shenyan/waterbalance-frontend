import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import CorrectionClient from './view';

export default function CorrectionPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载漏损率修正..." />}>
      <CorrectionClient />
    </Suspense>
  );
}

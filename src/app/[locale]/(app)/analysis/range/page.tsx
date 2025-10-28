import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import RangeAnalysisClient from './view';

export default function RangeAnalysisPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载区间分析..." />}>
      <RangeAnalysisClient />
    </Suspense>
  );
}

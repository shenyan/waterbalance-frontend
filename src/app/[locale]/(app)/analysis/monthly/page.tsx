import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import MonthlyAnalysisClient from './view';

export default function MonthlyAnalysisPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载月度计算..." />}>
      <MonthlyAnalysisClient />
    </Suspense>
  );
}

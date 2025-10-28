import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import MeasurementsClient from './view';

export default function MeasurementsPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载明细..." />}>
      <MeasurementsClient />
    </Suspense>
  );
}

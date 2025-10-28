import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import ImportsClient from './view';

export default function ImportsPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载导入任务..." />}>
      <ImportsClient />
    </Suspense>
  );
}

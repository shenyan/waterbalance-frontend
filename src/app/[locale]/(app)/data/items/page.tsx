import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import ItemsClient from './view';

export default function ItemsPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载子项..." />}>
      <ItemsClient />
    </Suspense>
  );
}

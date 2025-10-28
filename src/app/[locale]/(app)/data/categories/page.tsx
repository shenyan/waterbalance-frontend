import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import CategoriesClient from './view';

export default function CategoriesPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载类别..." />}>
      <CategoriesClient />
    </Suspense>
  );
}

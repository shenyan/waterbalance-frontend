import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import DictionaryClient from './view';

export default function DictionaryPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载字典维护..." />}>
      <DictionaryClient />
    </Suspense>
  );
}

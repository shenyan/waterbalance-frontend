import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import FormulasClient from './view';

export default function FormulasPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载公式参数..." />}>
      <FormulasClient />
    </Suspense>
  );
}

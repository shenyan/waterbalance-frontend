import { Suspense } from 'react';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import UsersClient from './view';

export default function UsersPage() {
  return (
    <Suspense fallback={<LoadingBlock label="加载用户列表..." />}>
      <UsersClient />
    </Suspense>
  );
}

import Link from 'next/link';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <EmptyState
        title="页面不存在"
        description="链接可能已失效或页面已被移除。"
        action={
          <Link href="/" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft">
            返回首页
          </Link>
        }
      />
    </div>
  );
}

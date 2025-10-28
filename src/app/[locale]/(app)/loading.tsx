import { LoadingBlock } from '@/components/feedback/LoadingBlock';

export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingBlock label="界面加载中…" />
    </div>
  );
}

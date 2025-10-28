"use client";

import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { getLeakageStandards, putLeakageStandards } from '@/lib/services';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function StandardsClient() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['settings', 'standards'],
    queryFn: async () => {
      const response = await getLeakageStandards();
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载失败');
      return response.data;
    }
  });

  const [level1, setLevel1] = useState(10);
  const [level2, setLevel2] = useState(20);

  useEffect(() => {
    if (data) {
      setLevel1(data.level1);
      setLevel2(data.level2);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await putLeakageStandards({ level1, level2 });
      if (response.status !== 'OK') throw new Error(response.message ?? '保存失败');
    }
  });

  if (isError) {
    return <EmptyState title="无法加载阈值" description="请稍后再试。" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-700">漏损率标准阈值</h1>
        <p className="text-sm text-muted-foreground">用于仪表与指标卡的等级判定。</p>
      </div>
      <div className="grid max-w-xl gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">一级阈值 (%)</span>
          <input
            type="number"
            step="0.1"
            className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
            value={level1}
            onChange={(event) => setLevel1(Number(event.target.value))}
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm text-muted-foreground">二级阈值 (%)</span>
          <input
            type="number"
            step="0.1"
            className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
            value={level2}
            onChange={(event) => setLevel2(Number(event.target.value))}
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || isLoading}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        <Save className="h-4 w-4" />
        保存阈值
      </button>
    </div>
  );
}

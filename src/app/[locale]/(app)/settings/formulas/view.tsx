"use client";

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { getLeakageFormula, putLeakageFormula } from '@/lib/services';
import { EmptyState } from '@/components/feedback/EmptyState';

export default function FormulasClient() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['settings', 'formulas'],
    queryFn: async () => {
      const response = await getLeakageFormula();
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载失败');
      return response.data;
    }
  });

  const defaultValue = useMemo(() => JSON.stringify(data ?? { a: 0.8, b: 0.12, c: 0.05 }, null, 2), [data]);
  const [json, setJson] = useState(defaultValue);

  useEffect(() => {
    setJson(defaultValue);
  }, [defaultValue]);

  const mutation = useMutation({
    mutationFn: async () => {
      const parsed = JSON.parse(json) as { a: number; b: number; c: number };
      const response = await putLeakageFormula(parsed);
      if (response.status !== 'OK') throw new Error(response.message ?? '保存失败');
    }
  });

  if (isError) {
    return <EmptyState title="无法加载公式参数" description="请联系管理员。" />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-brand-700">漏损率修正规则</h1>
        <p className="text-sm text-muted-foreground">维护 JSON 形式的公式参数，保存后立即生效。</p>
      </div>
      <textarea
        className="w-full rounded-2xl border border-border/60 bg-muted/30 p-4 font-mono text-sm"
        rows={16}
        value={json}
        onChange={(event) => setJson(event.target.value)}
      />
      <button
        type="button"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || isLoading}
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        <Save className="h-4 w-4" />
        保存参数
      </button>
    </div>
  );
}

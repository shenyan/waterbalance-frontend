"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, RefreshCcw } from 'lucide-react';
import { AuditTable } from '@/components/tables/AuditTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import { pageAudits } from '@/lib/services';
import { qk } from '@/lib/types';

const mockAudits = [
  {
    id: 1,
    userId: 5,
    action: 'UPDATE',
    entity: 'MEASUREMENT',
    entityId: '1001',
    at: '2025-07-18',
    beforeJson: { value: 12000 },
    afterJson: { value: 12345 }
  },
  {
    id: 2,
    userId: 8,
    action: 'IMPORT',
    entity: 'IMPORT_JOB',
    entityId: '102',
    at: '2025-07-18',
    beforeJson: null,
    afterJson: null
  }
];

export default function AuditsClient() {
  const [filters, setFilters] = useState<{ user?: string; entity?: string; action?: string }>({});

  const cleaned = {
    user: filters.user && filters.user.trim() ? Number(filters.user) : undefined,
    entity: filters.entity,
    action: filters.action
  };

  const { data, isFetching, isError } = useQuery({
    queryKey: qk.audits(cleaned),
    queryFn: async () => {
      const response = await pageAudits({ ...cleaned, page: 0, size: 20 });
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载失败');
      return response.data;
    },
    placeholderData: {
      content: mockAudits,
      total: mockAudits.length,
      page: 0,
      size: mockAudits.length
    }
  });

  const records = (data?.content ?? mockAudits).map((record) => ({
    ...record,
    beforeJson: record.beforeJson ?? undefined,
    afterJson: record.afterJson ?? undefined
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify之间 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">审计日志</h1>
          <p className="text-sm text-muted-foreground">跟踪重要操作，支持按用户、实体、动作筛选。</p>
        </div>
        <button
          type="button"
          onClick={() => setFilters({})}
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          <RefreshCcw className="h-4 w-4" />
          清除筛选
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="用户 ID"
            className="bg-transparent outline-none"
            value={filters.user ?? ''}
            onChange={(event) => setFilters((prev) => ({ ...prev, user: event.target.value }))}
          />
        </div>
        <select
          className="rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
          value={filters.entity ?? ''}
          onChange={(event) => setFilters((prev) => ({ ...prev, entity: event.target.value || undefined }))}
        >
          <option value="">全部实体</option>
          <option value="MEASUREMENT">数据明细</option>
          <option value="IMPORT_JOB">导入任务</option>
          <option value="USER">用户</option>
        </select>
        <select
          className="rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
          value={filters.action ?? ''}
          onChange={(event) => setFilters((prev) => ({ ...prev, action: event.target.value || undefined }))}
        >
          <option value="">全部动作</option>
          <option value="CREATE">创建</option>
          <option value="UPDATE">更新</option>
          <option value="DELETE">删除</option>
          <option value="IMPORT">导入</option>
        </select>
      </div>

      {isError ? <EmptyState title="无法加载日志" description="请稍后再试。" /> : null}
      {isFetching ? <LoadingBlock label="刷新中…" /> : null}

      <AuditTable records={records} total={records.length} page={0} size={records.length} />
    </div>
  );
}

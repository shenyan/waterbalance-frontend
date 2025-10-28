"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Clock, FileSpreadsheet, RefreshCcw } from 'lucide-react';
import { ImportUploader } from '@/components/forms/ImportUploader';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import { getImportJob } from '@/lib/services';
import { qk } from '@/lib/types';

interface ImportJob {
  id: number;
  filename: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  rowsTotal: number;
  rowsSuccess: number;
  rowsFailed: number;
  errorMsg?: string;
}

const mockJobs: ImportJob[] = [
  { id: 101, filename: 'july-measurements.csv', status: 'SUCCEEDED', rowsTotal: 1200, rowsSuccess: 1188, rowsFailed: 12 },
  { id: 102, filename: 'dma-update.xlsx', status: 'RUNNING', rowsTotal: 400, rowsSuccess: 220, rowsFailed: 0 }
];

export default function ImportsClient() {
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: currentJobId ? qk.importJob(currentJobId) : ['import', 'job-list'],
    queryFn: async () => {
      if (!currentJobId) {
        return mockJobs;
      }
      const response = await getImportJob(currentJobId);
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '查询失败');
      return [response.data] as ImportJob[];
    },
    refetchInterval: (query) => {
      const latest = query.state.data as ImportJob[] | undefined;
      if (!latest || latest.some((job) => job.status === 'PENDING' || job.status === 'RUNNING')) {
        return 3000;
      }
      return false;
    },
    placeholderData: mockJobs
  });

  const jobs = data ?? mockJobs;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">导入任务</h1>
          <p className="text-sm text-muted-foreground">上传 CSV / Excel 文件，系统将自动校验并生成任务队列。</p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentJobId(null)}
          className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
        >
          <RefreshCcw className="h-4 w-4" />
          刷新列表
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <div className="space-y-4">
          {jobs.length === 0 ? (
            <EmptyState title="暂无导入任务" description="上传文件即可自动创建任务。" />
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="card space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-foreground">{job.filename}</p>
                    <p className="text-sm text-muted-foreground">共 {job.rowsTotal} 条 · 成功 {job.rowsSuccess} · 失败 {job.rowsFailed}</p>
                  </div>
                  <StatusBadge status={job.status} />
                </div>
                {job.errorMsg ? (
                  <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{job.errorMsg}</p>
                ) : null}
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>最近更新：刚刚</span>
                  <button className="text-brand-600" type="button">
                    失败明细下载
                  </button>
                </div>
              </div>
            ))
          )}
          {isFetching ? <LoadingBlock label="同步任务状态…" /> : null}
        </div>
        <div className="card space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-brand-700">新增导入</h2>
            <p className="text-sm text-muted-foreground">支持 CSV / XLSX，模板请从字典管理中下载。</p>
          </div>
          <ImportUploader
            accept={['.csv', '.xlsx']}
            onUploaded={(jobId) => {
              setCurrentJobId(jobId);
            }}
          />
          <div className="rounded-xl border border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-brand-600">
              <FileSpreadsheet className="h-4 w-4" />
              <span>导入提示</span>
            </div>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              <li>时间格式需为 YYYY-MM-DD</li>
              <li>重复记录将按“组织 + 子项 + 日期”覆盖</li>
              <li>任务完成后系统自动刷新数据列表</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ImportJob['status'] }) {
  const map: Record<ImportJob['status'], { label: string; className: string }> = {
    PENDING: { label: '排队中', className: 'bg-amber-100 text-amber-700' },
    RUNNING: { label: '处理中', className: 'bg-blue-100 text-blue-700' },
    SUCCEEDED: { label: '已完成', className: 'bg-emerald-100 text-emerald-700' },
    FAILED: { label: '失败', className: 'bg-destructive/10 text-destructive' }
  };
  const meta = map[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${meta.className}`}>{meta.label}</span>;
}

"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { ChartCard } from '@/components/charts/ChartCard';
import { TrendLines } from '@/components/charts/TrendLines';
import { BalanceWaterfall } from '@/components/charts/BalanceWaterfall';
import { CompareDual } from '@/components/charts/CompareDual';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import { calcRange } from '@/lib/services';
import { qk, type Method } from '@/lib/types';

const fallback = {
  balanceTable: [
    { code: 'PROD', name: '供水总量', value: 700000, percent: 100 },
    { code: 'BILL', name: '计费用水', value: 580000, percent: 82.9 },
    { code: 'LOSS', name: '漏损', value: 90000, percent: 12.8 }
  ],
  indicators: {
    production: 700000,
    billed: 580000,
    nonBilled: 20000,
    loss: 90000,
    nonRevenue: 45000
  },
  rates: {
    gap: 15.7,
    basicLeakage: 13.0,
    correctedLeakage: 11.2
  },
  charts: {
    stacked: {
      labels: ['区间结构'],
      series: [
        { name: '计费用水', data: [580000] },
        { name: '未计费用水', data: [20000] },
        { name: '漏损', data: [90000] }
      ]
    },
    waterfall: {
      steps: [
        { name: '供水总量', value: 700000 },
        { name: '计费用水', value: -580000 },
        { name: '漏损', value: -90000 },
        { name: '未计费用水', value: -20000 }
      ]
    },
    trends: {
      months: ['01', '02', '03', '04', '05', '06'],
      rate: [16, 15.8, 15.4, 14.9, 15.1, 14.7]
    }
  }
};

export default function RangeAnalysisClient() {
  const today = new Date();
  const [range, setRange] = useState<{ start?: string; end?: string }>(() => ({
    start: '2025-01-01',
    end: today.toISOString().slice(0, 10)
  }));
  const [method, setMethod] = useState<Method>('TIME_SYNC');

  const { data, isFetching, isError } = useQuery({
    queryKey: qk.range({ startDate: range.start ?? '', endDate: range.end ?? '', method }, 1),
    queryFn: async () => {
      const response = await calcRange({
        startDate: range.start ?? '',
        endDate: range.end ?? '',
        method
      });
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '计算失败');
      return response.data;
    },
    staleTime: 60_000,
    placeholderData: fallback
  });

  const result = data ?? fallback;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">区间水量分析</h1>
          <p className="text-sm text-muted-foreground">时间段不超过 12 个月，支持趋势对比与导出。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangePicker
            start={range.start}
            end={range.end}
            onChange={({ start, end }) => setRange({ start, end })}
          />
          <select
            className="rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
            value={method}
            onChange={(event) => setMethod(event.target.value as Method)}
          >
            <option value="STATIC">静态法</option>
            <option value="TIME_SYNC">时间同步法</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted">
            <Download className="h-4 w-4" />
            导出结果
          </button>
        </div>
      </div>

      {isError ? <EmptyState title="计算失败" description="请检查参数后重试。" /> : null}
      {isFetching ? <LoadingBlock label="计算中…" /> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="漏损率趋势" subtitle="区间内每月修正漏损率">
          <TrendLines months={result.charts.trends?.months ?? []} rate={result.charts.trends?.rate ?? []} />
        </ChartCard>
        <ChartCard title="区间瀑布" subtitle="供水与消耗分解">
          <BalanceWaterfall steps={result.charts.waterfall.steps} />
        </ChartCard>
        <ChartCard title="指标对比" subtitle="计费用水 vs 漏损率">
          <CompareDual
            categories={result.charts.trends?.months ?? []}
            series={[
              { name: '计费用水', data: result.charts.trends ? result.charts.trends.months.map(() => 100000) : [] },
              { name: '漏损率', data: result.charts.trends?.rate ?? [] }
            ]}
          />
        </ChartCard>
        <ChartCard title="平衡表" subtitle="指标表格">
          <table className="min-w-full text-sm">
            <thead className="text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2">指标</th>
                <th className="px-3 py-2">数值</th>
                <th className="px-3 py-2">占比</th>
              </tr>
            </thead>
            <tbody>
              {result.balanceTable.map((row) => (
                <tr key={row.code} className="border-t border-border/40">
                  <td className="px-3 py-2">{row.name}</td>
                  <td className="px-3 py-2">{row.value.toLocaleString()}</td>
                  <td className="px-3 py-2">{row.percent.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </div>
    </div>
  );
}

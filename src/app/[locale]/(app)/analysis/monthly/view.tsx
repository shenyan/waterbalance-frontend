"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { ChartCard } from '@/components/charts/ChartCard';
import { GaugeLeakage } from '@/components/charts/GaugeLeakage';
import { StackedStructure } from '@/components/charts/StackedStructure';
import { BalanceWaterfall } from '@/components/charts/BalanceWaterfall';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import { calcMonthly } from '@/lib/services';
import { qk, type Method } from '@/lib/types';
import { formatNumber, formatPercent } from '@/lib/format';

const now = new Date();
const defaultYear = now.getFullYear();
const defaultMonth = now.getMonth() + 1;

const fallbackResult = {
  balanceTable: [
    { code: 'PROD', name: '供水总量', value: 123456, percent: 100 },
    { code: 'BILL', name: '计费用水量', value: 102345, percent: 82.9 },
    { code: 'LOSS', name: '产销差', value: 21000, percent: 17.1 }
  ],
  indicators: {
    production: 123456,
    billed: 102345,
    nonBilled: 3456,
    loss: 21000,
    nonRevenue: 12987
  },
  rates: {
    gap: 17.1,
    basicLeakage: 12.4,
    correctedLeakage: 9.8
  },
  charts: {
    stacked: {
      labels: ['供水结构'],
      series: [
        { name: '计费用水', data: [102345] },
        { name: '未计费用水', data: [3456] },
        { name: '漏损', data: [21000] }
      ]
    },
    waterfall: {
      steps: [
        { name: '供水总量', value: 123456 },
        { name: '计费用水', value: -102345 },
        { name: '漏损', value: -21000 },
        { name: '未计费用水', value: -3456 }
      ]
    }
  }
};

export default function MonthlyAnalysisClient() {
  const [year, setYear] = useState(defaultYear);
  const [month, setMonth] = useState(defaultMonth);
  const [method, setMethod] = useState<Method>('STATIC');

  const { data, isFetching, isError } = useQuery({
    queryKey: qk.monthly({ year, month, method }, 1),
    queryFn: async () => {
      const response = await calcMonthly({ year, month, method });
      if (response.status !== 'OK' || !response.data) {
        throw new Error(response.message ?? '计算失败');
      }
      return response.data;
    },
    staleTime: 60_000,
    placeholderData: fallbackResult
  });

  const result = data ?? fallbackResult;

  const indicators = useMemo(
    () => [
      { label: '供水总量', value: formatNumber(result.indicators.production), delta: '+3.2%' },
      { label: '计费用水', value: formatNumber(result.indicators.billed), delta: '+1.1%' },
      { label: '产销差率', value: `${result.rates.gap.toFixed(2)}%`, delta: '-0.5%' },
      { label: '修正漏损率', value: `${result.rates.correctedLeakage.toFixed(2)}%`, delta: '-0.9%' }
    ],
    [result]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">月度水量平衡</h1>
          <p className="text-sm text-muted-foreground">选择月份与计算方法，查看指标卡、图表与结构表。</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
          >
            {Array.from({ length: 5 }).map((_, index) => {
              const y = defaultYear - index;
              return (
                <option key={y} value={y}>
                  {y} 年
                </option>
              );
            })}
          </select>
          <select
            className="rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
          >
            {Array.from({ length: 12 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1} 月
              </option>
            ))}
          </select>
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
            导出 CSV
          </button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {indicators.map((indicator) => (
          <div key={indicator.label} className="card space-y-2">
            <p className="text-sm text-muted-foreground">{indicator.label}</p>
            <p className="text-2xl font-semibold text-foreground">{indicator.value}</p>
            <p className="text-xs text-emerald-600">{indicator.delta}</p>
          </div>
        ))}
      </div>

      {isError ? <EmptyState title="计算失败" description="请检查输入参数后重试。" /> : null}
      {isFetching ? <LoadingBlock label="计算中…" /> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="修正漏损率" subtitle="按标准阈值分段">
          <GaugeLeakage rate={result.rates.correctedLeakage} level1={10} level2={20} />
        </ChartCard>
        <ChartCard title="水量结构" subtitle="按类别堆叠合计">
          <StackedStructure labels={result.charts.stacked.labels} series={result.charts.stacked.series} />
        </ChartCard>
        <ChartCard title="水量平衡瀑布" subtitle="从供水到漏损的拆解" actions={<button className="text-sm text-brand-600">保存为 PNG</button>}>
          <BalanceWaterfall steps={result.charts.waterfall.steps} />
        </ChartCard>
        <ChartCard title="指标准备" subtitle="指标对照表">
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
                  <td className="px-3 py-2">{formatNumber(row.value)}</td>
                  <td className="px-3 py-2">{formatPercent(row.percent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ChartCard>
      </div>
    </div>
  );
}

import { useMemo } from 'react';
import { ChartCard } from '@/components/charts/ChartCard';
import { BalanceWaterfall } from '@/components/charts/BalanceWaterfall';
import { formatPercent } from '@/lib/format';

const mockWaterfall = [
  { name: '供水总量', value: 128_450 },
  { name: '计费用水', value: -106_320 },
  { name: '漏损', value: -18_960 },
  { name: '未计费用水', value: -3_170 }
];

export default function DashboardPage() {
  const currentMonth = useMemo(() => new Date().toISOString().slice(0, 7), []);
  const gap = 14.76;

  return (
    <div className="grid gap-6 xl:grid-cols-[360px,1fr]">
      <section className="card space-y-4">
        <header>
          <h1 className="text-2xl font-semibold text-brand-700">产销差概览</h1>
          <p className="text-muted-foreground text-sm">{currentMonth} 月度产销差率</p>
        </header>
        <div className="rounded-2xl bg-brand-600/10 p-6 text-center">
          <p className="text-sm text-muted-foreground">产销差率</p>
          <p className="mt-3 text-4xl font-semibold text-brand-700">{formatPercent(gap)}</p>
          <p className="mt-2 text-xs text-muted-foreground">较上月下降 0.8%</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <p className="text-muted-foreground">供水总量</p>
            <p className="text-xl font-semibold text-brand-700">128,450 m³</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
            <p className="text-muted-foreground">计费用水</p>
            <p className="text-xl font-semibold text-brand-700">106,320 m³</p>
          </div>
        </div>
      </section>
      <ChartCard title="水量平衡瀑布" subtitle="当月供水到漏损的构成">
        <BalanceWaterfall steps={mockWaterfall} />
      </ChartCard>
    </div>
  );
}

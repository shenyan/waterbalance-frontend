"use client";

import { useState } from 'react';
import { BadgeCheck, Save } from 'lucide-react';
import { CorrectionForm, type CorrectionFormValues } from '@/components/forms/CorrectionForm';
import { EmptyState } from '@/components/feedback/EmptyState';

interface CorrectionResult {
  basic: number;
  corrected: number;
  level: 'I' | 'II' | 'III';
  description: string;
}

const templates: Record<'I' | 'II' | 'III', string> = {
  I: '系统漏损控制良好，建议持续保持现有管网巡检频率。',
  II: '漏损率接近阈值，建议加强重点区域夜间监测。',
  III: '漏损率超标，请立即排查常压运行区并优化分区计量。'
};

export default function CorrectionClient() {
  const [result, setResult] = useState<CorrectionResult | null>(null);

  const handleSubmit = (values: CorrectionFormValues) => {
    const basic = Number((values.avgPressureMPa * 10).toFixed(2));
    const corrected = Number((basic - values.meterToHouseholdRatio * 5).toFixed(2));
    const level = corrected <= 10 ? 'I' : corrected <= 20 ? 'II' : 'III';
    setResult({
      basic,
      corrected,
      level,
      description: templates[level]
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,1.2fr]">
      <div className="card h-fit">
        <h1 className="text-xl font-semibold text-brand-700">漏损率修正参数</h1>
        <p className="mt-1 text-sm text-muted-foreground">输入压力、冻土深度等参数，计算基本与修正漏损率。</p>
        <div className="mt-4">
          <CorrectionForm onSubmit={handleSubmit} />
        </div>
      </div>
      <div className="card min-h-[280px]">
        {result ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <BadgeCheck className="h-10 w-10 text-brand-600" />
              <div>
                <p className="text-sm text-muted-foreground">修正结果</p>
                <p className="text-2xl font-semibold text-foreground">{result.corrected}%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="text-muted-foreground">基本漏损率</p>
                <p className="text-xl font-semibold text-brand-700">{result.basic}%</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                <p className="text-muted-foreground">等级评估</p>
                <p className="text-xl font-semibold text-brand-700">{result.level} 级</p>
              </div>
            </div>
            <p className="rounded-xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground">{result.description}</p>
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700">
              <Save className="h-4 w-4" />
              保存为快照
            </button>
          </div>
        ) : (
          <EmptyState title="尚未计算" description="填写参数并点击计算获取结果。" />
        )}
      </div>
    </div>
  );
}

"use client";

import { useMemo } from 'react';
import type { EChartsOption } from '@/lib/echarts';
import { EChart } from './EChart';
import { formatNumber } from '@/lib/format';

interface Series {
  name: string;
  data: number[];
}

interface Props {
  categories: string[];
  series: Series[];
}

export function CompareDual({ categories, series }: Props) {
  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 0,
        type: 'scroll'
      },
      xAxis: {
        type: 'category',
        data: categories
      },
      yAxis: [
        {
          type: 'value',
          axisLabel: { formatter: (value: number) => formatNumber(value) }
        },
        {
          type: 'value',
          axisLabel: { formatter: '{value}%' }
        }
      ],
      series: series.map((s, index) => ({
        ...s,
        type: index === series.length - 1 ? 'line' : 'bar',
        yAxisIndex: index === series.length - 1 ? 1 : 0,
        smooth: index === series.length - 1,
        barGap: '0%',
        emphasis: { focus: 'series' }
      }))
    }),
    [categories, series]
  );

  return <EChart option={option} ariaLabel="指标对比图" height={320} />;
}

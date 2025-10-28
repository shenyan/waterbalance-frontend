"use client";

import { useMemo } from 'react';
import type { EChartsOption } from '@/lib/echarts';
import { EChart } from './EChart';
import { formatNumber } from '@/lib/format';

interface SeriesItem {
  name: string;
  data: number[];
}

interface Props {
  labels: string[];
  series: SeriesItem[];
}

export function StackedStructure({ labels, series }: Props) {
  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        top: 0,
        type: 'scroll'
      },
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: labels
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (v: number) => formatNumber(v)
        }
      },
      series: series.map((item) => ({
        type: 'bar',
        stack: 'total',
        name: item.name,
        data: item.data,
        emphasis: { focus: 'series' }
      }))
    }),
    [labels, series]
  );

  return <EChart option={option} ariaLabel="水量结构堆叠图" height={360} />;
}

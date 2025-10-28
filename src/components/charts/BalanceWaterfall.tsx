"use client";

import { useMemo } from 'react';
import type { EChartsOption } from '@/lib/echarts';
import { EChart } from './EChart';
import { formatNumber } from '@/lib/format';

interface Props {
  steps: Array<{ name: string; value: number }>;
}

export function BalanceWaterfall({ steps }: Props) {
  const { categories, data } = useMemo(() => {
    let cumulative = 0;
    const categories: string[] = [];
    const data: Array<{ value: number; itemStyle?: { color: string } }> = [];

    steps.forEach((step, index) => {
      categories.push(step.name);
      const value = step.value;
      cumulative += value;
      data.push({
        value,
        itemStyle: {
          color: index === steps.length - 1 ? '#4f46e5' : value >= 0 ? '#06b6d4' : '#dc2626'
        }
      });
    });

    return { categories, data };
  }, [steps]);

  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const item = params?.[0];
          if (!item) return '';
          return `${item.name}<br/>${formatNumber(item.value)}`;
        }
      },
      xAxis: {
        type: 'category',
        data: categories
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => formatNumber(value as number)
        }
      },
      series: [
        {
          type: 'bar',
          stack: 'total',
          data,
          label: {
            show: true,
            position: 'top',
            formatter: ({ value }: { value: number }) => formatNumber(value)
          },
          emphasis: {
            focus: 'series'
          }
        }
      ]
    }),
    [categories, data]
  );

  return <EChart option={option} ariaLabel="水量平衡瀑布图" height={360} />;
}

"use client";

import { useMemo } from 'react';
import type { EChartsOption } from '@/lib/echarts';
import { EChart } from './EChart';

interface Props {
  months: string[];
  rate: number[];
}

export function TrendLines({ months, rate }: Props) {
  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: months
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}%'
        }
      },
      series: [
        {
          type: 'line',
          smooth: true,
          areaStyle: {
            opacity: 0.2
          },
          data: rate
        }
      ]
    }),
    [months, rate]
  );

  return <EChart option={option} ariaLabel="漏损率趋势折线图" height={360} />;
}

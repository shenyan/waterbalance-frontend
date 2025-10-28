"use client";

import { useMemo } from 'react';
import type { EChartsOption } from '@/lib/echarts';
import { EChart } from './EChart';

interface Props {
  rate: number;
  level1?: number;
  level2?: number;
}

export function GaugeLeakage({ rate, level1 = 10, level2 = 20 }: Props) {
  const option = useMemo<EChartsOption>(
    () => ({
      tooltip: {
        formatter: '{b}: {c}%'
      },
      series: [
        {
          type: 'gauge',
          min: 0,
          max: 30,
          splitNumber: 6,
          axisLine: {
            lineStyle: {
              width: 12,
              color: [
                [level1 / 30, '#16a34a'],
                [level2 / 30, '#f59e0b'],
                [1, '#dc2626']
              ]
            }
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            fontSize: 18
          },
          anchor: {
            show: true,
            size: 6,
            itemStyle: {
              color: '#4f46e5'
            }
          },
          pointer: {
            width: 6,
            itemStyle: { color: '#4f46e5' }
          },
          data: [
            {
              value: rate,
              name: '修正漏损率'
            }
          ]
        }
      ]
    }),
    [level1, level2, rate]
  );

  return <EChart option={option} ariaLabel="修正漏损率仪表盘" height={320} />;
}

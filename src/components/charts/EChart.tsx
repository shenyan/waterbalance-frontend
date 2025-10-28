"use client";

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import type { EChartsOption, EChartsType } from '@/lib/echarts';
import { initChart } from '@/lib/echarts';

interface Props {
  option: EChartsOption;
  height?: number;
  ariaLabel: string;
  onReady?: (chart: EChartsType) => void;
}

export function EChart({ option, height = 320, ariaLabel, onReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<EChartsType | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;

    const render = async () => {
      if (disposed) return;
      const chart = await initChart(el, option, (resolvedTheme ?? 'light') as 'light' | 'dark');
      chartRef.current = chart;
      onReady?.(chart);
    };

    render();

    const handleResize = () => {
      chartRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      disposed = true;
      window.removeEventListener('resize', handleResize);
      chartRef.current?.dispose();
      chartRef.current = null;
    };
  }, [option, onReady, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel}
      data-theme={resolvedTheme}
      style={{ height }}
      className="w-full"
    />
  );
}

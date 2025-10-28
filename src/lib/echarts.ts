import type { EChartsOption, EChartsType } from 'echarts';

let cached: typeof import('echarts') | null = null;

export async function getEcharts() {
  if (cached) {
    return cached;
  }
  cached = await import('echarts');
  return cached;
}

export async function initChart(
  element: HTMLDivElement,
  option: EChartsOption,
  theme: 'light' | 'dark' = 'light'
): Promise<EChartsType> {
  const echarts = await getEcharts();
  const chart = echarts.init(element, theme);
  chart.setOption(option, true);
  return chart;
}

export async function exportAsPng(chart: EChartsType, filename: string) {
  const dataUrl = chart.getDataURL({
    pixelRatio: 2,
    backgroundColor: themeBackground(chart)
  });
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
  link.click();
}

function themeBackground(chart: EChartsType) {
  const canvas = chart.getDom() as HTMLElement;
  const dark = canvas.getAttribute('data-theme') === 'dark';
  return dark ? '#0f172a' : '#ffffff';
}

export type { EChartsOption, EChartsType } from 'echarts';

export type Method = 'STATIC' | 'TIME_SYNC';

export interface CorrectionParams {
  avgPressureMPa?: number;
  maxFrostDepthM?: number;
  meterToHouseholdRatio?: number;
}

export interface MonthlyReq {
  year: number;
  month: number;
  method: Method;
  params?: CorrectionParams;
}

export interface RangeReq {
  startDate: string;
  endDate: string;
  method: Method;
  params?: CorrectionParams;
}

export interface ApiResponse<T> {
  status: 'OK' | 'ERROR';
  data?: T;
  message?: string;
  errorCode?: string;
  errors?: Record<string, string>;
}

export interface MeasurementDto {
  id: number;
  itemId: number;
  itemCode?: string;
  itemName?: string;
  unit?: string;
  orgId: number;
  bizDate?: string;
  date?: string;
  value: number;
  source: string;
  remarks?: string;
}

export interface PageDto<T> {
  content: T[];
  total: number;
  page: number;
  size: number;
}

export interface CalcIndicators {
  production: number;
  billed: number;
  nonBilled: number;
  loss: number;
  nonRevenue: number;
}

export interface CalcRates {
  gap: number;
  basicLeakage: number;
  correctedLeakage: number;
}

export interface CalcResult {
  balanceTable: Array<{ code: string; name: string; value: number; percent: number }>;
  indicators: CalcIndicators;
  rates: CalcRates;
  charts: {
    stacked: { labels: string[]; series: Array<{ name: string; data: number[] }> };
    waterfall: { steps: Array<{ name: string; value: number }> };
    trends?: { months: string[]; rate: number[] };
  };
}

export interface AuthUser {
  id: number;
  username: string;
  orgId: number;
  orgName?: string;
  roles: string[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export type QueryParams = Record<string, unknown>;

export const qk = {
  categories: ['categories'] as const,
  items: (categoryId?: number) => ['items', categoryId] as const,
  measurements: (params: QueryParams) => ['measurements', params] as const,
  monthly: (req: MonthlyReq, orgId: number) => ['calc', 'monthly', orgId, req] as const,
  range: (req: RangeReq, orgId: number) => ['calc', 'range', orgId, req] as const,
  importJob: (id: number) => ['import', 'job', id] as const,
  audits: (params: QueryParams) => ['audits', params] as const
};

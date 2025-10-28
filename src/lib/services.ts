import { api } from './api';
import type {
  ApiResponse,
  CalcResult,
  CorrectionParams,
  LoginResponse,
  MeasurementDto,
  Method,
  MonthlyReq,
  PageDto,
  RangeReq
} from './types';

// Auth
export const loginApi = (username: string, password: string) =>
  api.post<ApiResponse<LoginResponse>>('/api/auth/login', { username, password }).then((r) => r.data);

export const refreshApi = (refreshToken: string) =>
  api.post<ApiResponse<{ token: string }>>('/api/auth/refresh', { refreshToken }).then((r) => r.data);

// Dictionary
export const listCategories = () =>
  api
    .get<ApiResponse<Array<{ id: number; code: string; name: string; orderNo: number }>>>('/api/categories')
    .then((r) => r.data);

export const listItems = (categoryId?: number) =>
  api
    .get<
      ApiResponse<Array<{ id: number; categoryId: number; code: string; name: string; unit: string; orderNo: number }>>
    >('/api/items', {
      params: { categoryId }
    })
    .then((r) => r.data);

// Measurements
export const pageMeasurements = (params: {
  orgId: number;
  itemId?: number;
  categoryId?: number;
  dateFrom?: string;
  dateTo?: string;
  keyword?: string;
  page?: number;
  size?: number;
  sort?: string;
}) =>
  api
    .get<ApiResponse<PageDto<MeasurementDto>>>('/api/measurements', { params })
    .then((r) => r.data);

export const upsertMeasurement = (body: {
  itemId: number;
  bizDate: string;
  value: number;
  source: string;
  remarks?: string;
}) =>
  api.post<ApiResponse<MeasurementDto>>('/api/measurements', body).then((r) => r.data);

export const deleteMeasurements = (ids: number[]) =>
  api.delete<ApiResponse<{ deleted: number }>>('/api/measurements', { data: { ids } }).then((r) => r.data);

export const exportMeasurementsCSV = (params: Record<string, unknown>) =>
  api
    .get('/api/export/measurements', {
      params,
      responseType: 'blob',
      headers: { Accept: 'text/csv' }
    })
    .then((r) => r.data as Blob);

// Calc
export const calcMonthly = (req: MonthlyReq) =>
  api.post<ApiResponse<CalcResult>>('/api/calc/monthly', req).then((r) => r.data);

export const calcRange = (req: RangeReq) =>
  api.post<ApiResponse<CalcResult>>('/api/calc/range', req).then((r) => r.data);

// Import
export const startImport = (file: File, orgId?: number) => {
  const fd = new FormData();
  fd.append('file', file);
  if (orgId) fd.append('orgId', String(orgId));
  return api
    .post<ApiResponse<{ jobId: number }>>('/api/import', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then((r) => r.data);
};

export const getImportJob = (jobId: number) =>
  api
    .get<
      ApiResponse<{
        id: number;
        filename: string;
        status: string;
        rowsTotal: number;
        rowsSuccess: number;
        rowsFailed: number;
        errorMsg?: string;
      }>
    >(`/api/import/${jobId}`)
    .then((r) => r.data);

// Audits
export const pageAudits = (params: {
  user?: number;
  entity?: string;
  action?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}) =>
  api
    .get<
      ApiResponse<
        PageDto<{
          id: number;
          userId: number;
          action: string;
          entity: string;
          entityId?: string;
          beforeJson?: any;
          afterJson?: any;
          ip?: string;
          at: string;
        }>
      >
    >('/api/audits', { params })
    .then((r) => r.data);

// Users
export const pageUsers = (params: { orgId?: number; page?: number; size?: number }) =>
  api
    .get<ApiResponse<PageDto<{ id: number; username: string; roles: string[]; enabled: boolean }>>>(
      '/api/settings/users',
      {
        params
      }
    )
    .then((r) => r.data);

export const createUser = (body: { username: string; password: string; orgId: number; roles: string[] }) =>
  api.post<ApiResponse<{ id: number; username: string; roles: string[]; enabled: boolean }>>(
    '/api/settings/users',
    body
  ).then((r) => r.data);

export const updateUser = (id: number, body: { enabled?: boolean; roles?: string[] }) =>
  api
    .put<ApiResponse<{ id: number; username: string; roles: string[]; enabled: boolean }>>(
      `/api/settings/users/${id}`,
      body
    )
    .then((r) => r.data);

export const resetPassword = (id: number, password: string) =>
  api.post<ApiResponse<{ id: number }>>(`/api/settings/users/${id}/reset-password`, { password }).then((r) => r.data);

// Settings
export const getLeakageFormula = () =>
  api
    .get<ApiResponse<{ a: number; b: number; c: number }>>('/api/settings/formulas/leakage-correction')
    .then((r) => r.data);

export const putLeakageFormula = (body: { a: number; b: number; c: number }) =>
  api.put<ApiResponse<void>>('/api/settings/formulas/leakage-correction', body).then((r) => r.data);

export const getLeakageStandards = () =>
  api.get<ApiResponse<{ level1: number; level2: number }>>('/api/settings/standards/leakage').then((r) => r.data);

export const putLeakageStandards = (body: { level1: number; level2: number }) =>
  api.put<ApiResponse<void>>('/api/settings/standards/leakage', body).then((r) => r.data);

export const createCategory = (body: { code: string; name: string; orderNo?: number }) =>
  api.post<ApiResponse<any>>('/api/settings/categories', body).then((r) => r.data);

export const updateCategory = (id: number, body: { name?: string; orderNo?: number }) =>
  api.put<ApiResponse<any>>(`/api/settings/categories/${id}`, body).then((r) => r.data);

export const deleteCategory = (id: number) =>
  api.delete<ApiResponse<void>>(`/api/settings/categories/${id}`).then((r) => r.data);

export const createItem = (body: { categoryId: number; code: string; name: string; unit?: string; orderNo?: number }) =>
  api.post<ApiResponse<any>>('/api/settings/items', body).then((r) => r.data);

export const updateItem = (id: number, body: { name?: string; unit?: string; orderNo?: number }) =>
  api.put<ApiResponse<any>>(`/api/settings/items/${id}`, body).then((r) => r.data);

export const deleteItem = (id: number) =>
  api.delete<ApiResponse<void>>(`/api/settings/items/${id}`).then((r) => r.data);

// Snapshots & Exports
export const pageSnapshots = (params: {
  orgId?: number;
  periodType?: 'MONTH' | 'RANGE';
  method?: Method;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
}) =>
  api.get<ApiResponse<PageDto<any>>>('/api/calc/snapshots', { params }).then((r) => r.data);

export const getSnapshot = (id: number) =>
  api.get<ApiResponse<CalcResult>>(`/api/calc/snapshots/${id}`).then((r) => r.data);

export const createSnapshot = (body: {
  periodType: 'MONTH' | 'RANGE';
  startDate: string;
  endDate: string;
  method: Method;
  params?: CorrectionParams;
  result: CalcResult;
}) => api.post<ApiResponse<{ id: number }>>('/api/calc/snapshots', body).then((r) => r.data);

export const deleteSnapshot = (id: number) =>
  api.delete<ApiResponse<void>>(`/api/calc/snapshots/${id}`).then((r) => r.data);

export const exportCalcCSV = (req: MonthlyReq | RangeReq) =>
  api.post('/api/export/calc', req, { responseType: 'blob', headers: { Accept: 'text/csv' } });

"use client";

import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SortingState } from '@tanstack/react-table';
import { Filter, Import, Plus, Trash2 } from 'lucide-react';
import { MeasurementTable } from '@/components/tables/MeasurementTable';
import { DateRangePicker } from '@/components/forms/DateRangePicker';
import { ImportUploader } from '@/components/forms/ImportUploader';
import { MeasurementForm, type MeasurementFormValues } from '@/components/forms/MeasurementForm';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingBlock } from '@/components/feedback/LoadingBlock';
import {
  exportMeasurementsCSV,
  listCategories,
  listItems,
  pageMeasurements,
  upsertMeasurement,
  deleteMeasurements
} from '@/lib/services';
import { qk } from '@/lib/types';
import { usePagination } from '@/hooks/usePagination';

const mockRecords = [
  {
    id: 1001,
    itemId: 11,
    orgId: 1,
    bizDate: '2025-07-01',
    value: 12345.678,
    source: 'MANUAL',
    remarks: '月初校准'
  },
  {
    id: 1002,
    itemId: 12,
    orgId: 1,
    bizDate: '2025-07-01',
    value: 9800.0,
    source: 'SCADA',
    remarks: '自动采集'
  }
];

const sortFieldMap: Record<string, string> = {
  date: 'bizDate',
  value: 'value',
  createdAt: 'createdAt'
};

export default function MeasurementsClient() {
  const queryClient = useQueryClient();
  const pagination = usePagination({ page: 0, pageSize: 20, total: 0 });

  const [filters, setFilters] = useState<{
    orgId: number;
    categoryId?: number;
    itemId?: number;
    keyword?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({
    orgId: 1
  });
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [exporting, setExporting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());
  const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);

  const { data: categories } = useQuery({
    queryKey: qk.categories,
    queryFn: async () => {
      const response = await listCategories();
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载类别失败');
      return response.data;
    },
    staleTime: 600_000
  });

  const { data: items } = useQuery({
    queryKey: qk.items(filters.categoryId),
    queryFn: async () => {
      const response = await listItems(filters.categoryId);
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载子项失败');
      return response.data;
    },
    staleTime: 600_000
  });

  const sortParam = sorting[0]
    ? `${sortFieldMap[sorting[0].id] ?? sorting[0].id},${sorting[0].desc ? 'desc' : 'asc'}`
    : undefined;

  const measurementParams = useMemo(
    () => ({
      orgId: filters.orgId,
      categoryId: filters.categoryId,
      itemId: filters.itemId,
      keyword: filters.keyword,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      page: pagination.page,
      size: pagination.pageSize,
      sort: sortParam
    }),
    [filters, pagination.page, pagination.pageSize, sortParam]
  );

  const queryKey = useMemo(() => qk.measurements(measurementParams), [measurementParams]);

  const { data, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await pageMeasurements(measurementParams);
      if (response.status !== 'OK' || !response.data) {
        throw new Error(response.message ?? '加载失败');
      }
      return response.data;
    },
    placeholderData: () => ({
      content: mockRecords,
      total: mockRecords.length,
      page: 0,
      size: mockRecords.length
    })
  });

  const measurements = data?.content ?? [];
  const total = data?.total ?? measurements.length;

  const normalizedMeasurements = useMemo(
    () =>
      measurements.map((item) => {
        const bizDate = (item as any).bizDate ?? (item as any).date ?? '';
        return {
          ...item,
          bizDate,
          date: bizDate,
          itemName: item.itemName ?? (item as any).itemName,
          itemCode: item.itemCode ?? (item as any).itemCode,
          unit: item.unit ?? (item as any).unit
        };
      }),
    [measurements]
  );
  const availableIds = useMemo(
    () => new Set(normalizedMeasurements.map((item) => item.id).filter((id): id is number | string => id !== undefined)),
    [normalizedMeasurements]
  );

  useEffect(() => {
    if (pagination.total !== total) {
      pagination.setTotal(total);
    }
    if (selectedIds.size) {
      const next = new Set<number | string>();
      selectedIds.forEach((id) => {
        if (availableIds.has(id)) {
          next.add(id);
        }
      });
      if (next.size !== selectedIds.size) {
        setSelectedIds(next);
      }
    }
  }, [pagination, total, availableIds, selectedIds]);

  useEffect(() => {
    if (showForm && items && items.length > 0 && formError) {
      setFormError(undefined);
    }
  }, [items, showForm, formError]);

  const createMeasurement = useMutation({
    mutationFn: async (payload: MeasurementFormValues) => {
      const response = await upsertMeasurement(payload);
      if (response.status !== 'OK' || !response.data) {
        throw new Error(response.message ?? '保存失败');
      }
      return response.data;
    },
    onSuccess: async () => {
      setShowForm(false);
      setFormError(undefined);
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: unknown) => {
      setFormError((error as Error)?.message ?? '保存失败');
    }
  });

  const handleDelete = async () => {
    const ids = Array.from(selectedIds).map((value) => Number(value)).filter((id) => !Number.isNaN(id));
    if (ids.length === 0) {
      alert('请先选择要删除的明细');
      return;
    }
    if (!window.confirm(`确认删除选中的 ${ids.length} 条明细吗？`)) {
      return;
    }
    await deleteMeasurements(ids);
    setSelectedIds(new Set());
    await queryClient.invalidateQueries({ queryKey });
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportMeasurementsCSV(measurementParams);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `measurements-${filters.orgId}-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('export csv failed', error);
    } finally {
      setExporting(false);
    }
  };

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm">
        <span className="text-muted-foreground">组织</span>
        <select
          className="bg-transparent text-sm outline-none"
          value={filters.orgId}
          onChange={(event) => {
            setFilters((prev) => ({ ...prev, orgId: Number(event.target.value) }));
            pagination.setPage(0);
          }}
        >
          <option value={1}>示例水司 A</option>
          <option value={2}>示例水司 B</option>
        </select>
      </label>
      <select
        className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm"
        value={filters.categoryId ?? ''}
        onChange={(event) => {
          setFilters((prev) => ({
            ...prev,
            categoryId: event.target.value ? Number(event.target.value) : undefined,
            itemId: undefined
          }));
          pagination.setPage(0);
        }}
      >
        <option value="">全部类别</option>
        {categories?.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <select
        className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm"
        value={filters.itemId ?? ''}
        onChange={(event) => {
          setFilters((prev) => ({
            ...prev,
            itemId: event.target.value ? Number(event.target.value) : undefined
          }));
          pagination.setPage(0);
        }}
        disabled={!items?.length}
      >
        <option value="">全部子项</option>
        {items?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <DateRangePicker
        start={filters.dateFrom}
        end={filters.dateTo}
        onChange={({ start, end }) => {
          setFilters((prev) => ({
            ...prev,
            dateFrom: start,
            dateTo: end
          }));
          pagination.setPage(0);
        }}
      />
      <div className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 text-sm">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <input
          className="bg-transparent text-sm outline-none"
          placeholder="关键字检索"
          value={filters.keyword ?? ''}
          onChange={(event) => {
            setFilters((prev) => ({ ...prev, keyword: event.target.value }));
            pagination.setPage(0);
          }}
        />
      </div>
    </div>
  );

  const actions = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        onClick={handleExport}
        disabled={exporting}
      >
        <Import className={`h-4 w-4 ${exporting ? 'animate-spin' : ''}`} />
        {exporting ? '导出中…' : '导出 CSV'}
      </button>
      <button
        className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        onClick={handleDelete}
        disabled={selectedIds.size === 0}
      >
        <Trash2 className="h-4 w-4" />
        {selectedIds.size ? `删除选中 (${selectedIds.size})` : '批量删除'}
      </button>
      <button
        className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        type="button"
        onClick={() => {
          if (!items || items.length === 0) {
            setFormError('当前筛选下暂无子项，请先在“子项管理”维护或选择子项。');
            setShowForm(false);
            return;
          }
          setFormError(undefined);
          setShowForm(true);
        }}
        disabled={!items || items.length === 0}
      >
        <Plus className="h-4 w-4" />
        新建明细
      </button>
    </div>
  );

  const handleSubmitMeasurement = async (values: MeasurementFormValues) => {
    setFormError(undefined);
    await createMeasurement.mutateAsync({
      ...values,
      bizDate: values.bizDate.trim(),
      source: values.source.trim(),
      remarks: values.remarks?.trim() || undefined
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">明细管理</h1>
          <p className="text-sm text-muted-foreground">
            支持按组织、类别、时间筛选数据，提供快速导入导出与批量操作。
          </p>
        </div>
        {actions}
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="lg:col-span-2">
          {showForm ? (
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-brand-700">新建明细</h2>
                <button
                  type="button"
                  className="text-sm text-muted-foreground"
                  onClick={() => {
                    setShowForm(false);
                    setFormError(undefined);
                  }}
                >
                  关闭
                </button>
              </div>
              {formError ? (
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</div>
              ) : null}
              <MeasurementForm
                submitting={createMeasurement.isPending}
                onSubmit={handleSubmitMeasurement}
                orgLabel={filters.orgId === 2 ? '示例水司 B' : '示例水司 A'}
                defaultValues={{
                  itemId: filters.itemId,
                  bizDate: filters.dateTo ?? filters.dateFrom ?? '',
                  source: 'MANUAL'
                }}
                itemOptions={(items ?? []).map((item) => ({ value: item.id, label: item.name }))}
              />
            </div>
          ) : null}
          <MeasurementTable
            records={normalizedMeasurements}
            total={total}
            page={pagination.page}
            size={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            renderToolbar={toolbar}
            sorting={sorting}
            onSortingChange={(next) => {
              setSorting(next);
              pagination.setPage(0);
            }}
            selectable
            selectedKeys={selectedIds}
            onSelectedKeysChange={setSelectedIds}
          />
          {normalizedMeasurements.length === 0 && !isFetching ? (
            <EmptyState title="暂无明细数据" description="尝试调整筛选条件或导入数据。" />
          ) : null}
          {isFetching ? <LoadingBlock label="刷新中…" /> : null}
        </div>
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-700">快速导入</h2>
            <p className="text-sm text-muted-foreground">上传 CSV / Excel，系统将自动校验并生成导入任务。</p>
            <div className="mt-4">
              <ImportUploader
                accept={['.csv', '.xlsx']}
                onUploaded={(jobId) => {
                  console.info('uploaded job', jobId);
                }}
              />
            </div>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold text-brand-700">批量导出</h2>
            <p className="text-sm text-muted-foreground">根据筛选条件导出 CSV，支持二次分析。</p>
            <button
              type="button"
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
            >
              <Import className="h-4 w-4" />
              导出筛选结果
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

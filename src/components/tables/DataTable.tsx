"use client";

import type { ColumnDef, SortingState, TableState } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { useMemo, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  page: number;
  size: number;
  total: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSortingChange?: (state: SortingState) => void;
  sorting?: SortingState;
  selectable?: boolean;
  selectedKeys?: Set<number | string>;
  onSelectedKeysChange?: (keys: Set<number | string>) => void;
  renderToolbar?: ReactNode;
  footer?: () => React.ReactNode;
}

const pageSizeOptions = [10, 20, 50, 100];

export function DataTable<TData extends { id?: number | string }>({
  columns,
  data,
  page,
  size,
  total,
  onPageChange,
  onPageSizeChange,
  onSortingChange,
  sorting,
  selectable,
  selectedKeys,
  onSelectedKeysChange,
  renderToolbar,
  footer
}: DataTableProps<TData>) {
  const handleSelectAll = (checked: boolean) => {
    if (!selectable || !onSelectedKeysChange) return;
    if (!checked) {
      onSelectedKeysChange(new Set());
      return;
    }
    const next = new Set<number | string>();
    data.forEach((row) => {
      if (row?.id !== undefined) {
        next.add(row.id);
      }
    });
    onSelectedKeysChange(next);
  };

  const handleSelectRow = (key: number | string | undefined, checked: boolean) => {
    if (!selectable || !onSelectedKeysChange || key === undefined) return;
    const next = new Set(selectedKeys ?? new Set());
    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }
    onSelectedKeysChange(next);
  };

  const table = useReactTable<TData>({
    data,
    columns,
    state: {
      pagination: {
        pageIndex: page,
        pageSize: size
      },
      sorting: sorting ?? []
    } as TableState,
    manualPagination: true,
    manualSorting: true,
    pageCount: Math.ceil((total ?? 0) / size),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: page, pageSize: size })
          : updater;
      if (next.pageIndex !== page) {
        onPageChange?.(next.pageIndex);
      }
      if (next.pageSize !== size) {
        onPageSizeChange?.(next.pageSize);
      }
    },
    onSortingChange: (updater) => {
      if (!onSortingChange) return;
      const next = typeof updater === 'function' ? updater(sorting ?? []) : updater;
      onSortingChange(next);
    }
  });

  const pageCount = useMemo(() => Math.ceil((total ?? 0) / size), [total, size]);

  return (
    <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
      {renderToolbar ? <div className="flex flex-wrap items-center justify-between gap-3">{renderToolbar}</div> : null}
      <div className="overflow-hidden rounded-xl border border-border/40">
        <table className="min-w-full divide-y divide-border/60 text-sm">
          <thead className="bg-muted/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {selectable ? (
                  <th className="w-10 px-3 py-2 text-left text-xs uppercase text-muted-foreground">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border"
                      checked={Boolean(selectedKeys && data.length > 0 && selectedKeys.size === data.length)}
                      indeterminate={Boolean(
                        selectedKeys && selectedKeys.size > 0 && selectedKeys.size < data.length
                      )}
                      onChange={(event) => handleSelectAll(event.target.checked)}
                    />
                  </th>
                ) : null}
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={cn(
                      'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground select-none',
                      header.column.getCanSort() && 'cursor-pointer'
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : (
                          <span className="inline-flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === 'asc' ? '▲' : null}
                            {header.column.getIsSorted() === 'desc' ? '▼' : null}
                          </span>
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-border/40 bg-card-foreground/5">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-muted/30">
                  {selectable ? (
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border"
                        checked={selectedKeys?.has(row.original?.id ?? '') ?? false}
                        onChange={(event) => handleSelectRow(row.original?.id, event.target.checked)}
                      />
                    </td>
                  ) : null}
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-2 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  暂无数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          每页
          <select
            className="rounded-lg border border-border/70 bg-transparent px-2 py-1"
            value={size}
            onChange={(event) => onPageSizeChange?.(Number(event.target.value))}
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          行 · 共 {total} 条
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange?.(0)}
            disabled={page === 0}
            className={cn(
              'rounded-lg border border-border/60 px-3 py-1 text-sm transition hover:bg-muted',
              page === 0 && 'cursor-not-allowed opacity-60'
            )}
          >
            首页
          </button>
          <button
            type="button"
            onClick={() => onPageChange?.(Math.max(page - 1, 0))}
            disabled={page === 0}
            className={cn(
              'rounded-lg border border-border/60 px-3 py-1 text-sm transition hover:bg-muted',
              page === 0 && 'cursor-not-allowed opacity-60'
            )}
          >
            上一页
          </button>
          <span className="text-sm text-muted-foreground">
            {page + 1} / {pageCount || 1}
          </span>
          <button
            type="button"
            onClick={() => onPageChange?.(Math.min(page + 1, Math.max(pageCount - 1, 0)))}
            disabled={page + 1 >= pageCount}
            className={cn(
              'rounded-lg border border-border/60 px-3 py-1 text-sm transition hover:bg-muted',
              page + 1 >= pageCount && 'cursor-not-allowed opacity-60'
            )}
          >
            下一页
          </button>
          <button
            type="button"
            onClick={() => onPageChange?.(Math.max(pageCount - 1, 0))}
            disabled={page + 1 >= pageCount}
            className={cn(
              'rounded-lg border border-border/60 px-3 py-1 text-sm transition hover:bg-muted',
              page + 1 >= pageCount && 'cursor-not-allowed opacity-60'
            )}
          >
            末页
          </button>
        </div>
      </div>
      {footer ? <div className="border-t border-border/60 pt-3">{footer()}</div> : null}
    </div>
  );
}

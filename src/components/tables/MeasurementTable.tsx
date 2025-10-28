"use client";

import type { ColumnDef, SortingState } from '@tanstack/react-table';
import { useMemo, type ReactNode } from 'react';
import { DataTable } from './DataTable';
import { formatDate, formatNumber } from '@/lib/format';
import type { MeasurementDto } from '@/lib/types';

interface Props {
  records: MeasurementDto[];
  total: number;
  page: number;
  size: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  renderToolbar?: ReactNode;
  sorting?: SortingState;
  onSortingChange?: (state: SortingState) => void;
  selectable?: boolean;
  selectedKeys?: Set<number | string>;
  onSelectedKeysChange?: (keys: Set<number | string>) => void;
}

export function MeasurementTable({
  records,
  renderToolbar,
  sorting,
  onSortingChange,
  selectable,
  selectedKeys,
  onSelectedKeysChange,
  ...tableProps
}: Props) {
  const columns = useMemo<ColumnDef<MeasurementDto>[]>(
    () => [
      { accessorKey: 'date', header: '日期', cell: ({ getValue }) => formatDate(getValue<string>()) },
      {
        accessorKey: 'itemName',
        header: '子项',
        cell: ({ row }) => row.original.itemName ?? `#${row.original.itemId}`,
        enableSorting: false
      },
      { accessorKey: 'value', header: '数值', cell: ({ getValue }) => formatNumber(getValue<number>()) },
      { accessorKey: 'source', header: '来源', enableSorting: false },
      { accessorKey: 'remarks', header: '备注', cell: ({ getValue }) => getValue<string>() ?? '—', enableSorting: false }
    ],
    []
  );

  return (
    <DataTable
      columns={columns}
      data={records}
      renderToolbar={renderToolbar}
      sorting={sorting}
      onSortingChange={onSortingChange}
      selectable={selectable}
      selectedKeys={selectedKeys}
      onSelectedKeysChange={onSelectedKeysChange}
      {...tableProps}
    />
  );
}

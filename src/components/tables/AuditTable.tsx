"use client";

import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { DataTable } from './DataTable';
import { formatDate } from '@/lib/format';

interface AuditRecord {
  id: number;
  userId: number;
  action: string;
  entity: string;
  entityId?: string;
  beforeJson?: unknown;
  afterJson?: unknown;
  ip?: string;
  at: string;
}

interface Props {
  records: AuditRecord[];
  total: number;
  page: number;
  size: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function AuditTable(props: Props) {
  const columns = useMemo<ColumnDef<AuditRecord>[]>(
    () => [
      { accessorKey: 'at', header: '时间', cell: ({ getValue }) => formatDate(getValue<string>()) },
      { accessorKey: 'userId', header: '用户 ID' },
      { accessorKey: 'action', header: '动作' },
      { accessorKey: 'entity', header: '实体' },
      { accessorKey: 'entityId', header: '实体 ID', cell: ({ getValue }) => getValue<string>() ?? '—' },
      { accessorKey: 'ip', header: 'IP', cell: ({ getValue }) => getValue<string>() ?? '—' }
    ],
    []
  );

  return <DataTable columns={columns} data={props.records} {...props} />;
}

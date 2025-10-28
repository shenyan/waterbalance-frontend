"use client";

import { useMemo, useState } from 'react';

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export function usePagination(initialState: PaginationState = { page: 0, pageSize: 20, total: 0 }) {
  const [state, setState] = useState(initialState);

  const setPage = (page: number) => {
    setState((prev) => ({ ...prev, page }));
  };

  const setPageSize = (pageSize: number) => {
    setState((prev) => ({ ...prev, pageSize, page: 0 }));
  };

  const setTotal = (total: number) => {
    setState((prev) => ({ ...prev, total }));
  };

  return useMemo(
    () => ({
      page: state.page,
      pageSize: state.pageSize,
      total: state.total,
      setPage,
      setPageSize,
      setTotal
    }),
    [state]
  );
}

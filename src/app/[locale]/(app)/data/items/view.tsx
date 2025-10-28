"use client";

import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Save, X } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { createItem, listCategories, listItems } from '@/lib/services';
import { qk } from '@/lib/types';

interface ItemView {
  id: number;
  categoryId: number;
  code: string;
  name: string;
  unit: string;
  orderNo: number;
}

interface NewItemForm {
  categoryId?: number;
  code: string;
  name: string;
  unit: string;
  orderNo: number;
}

export default function ItemsClient() {
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [newItem, setNewItem] = useState<NewItemForm>({
    categoryId: undefined,
    code: '',
    name: '',
    unit: 'm³',
    orderNo: 1
  });
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: qk.categories,
    queryFn: async () => {
      const response = await listCategories();
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载失败');
      return response.data;
    },
    staleTime: 600_000
  });

  const { data, isError } = useQuery({
    queryKey: qk.items(categoryId),
    queryFn: async () => {
      const response = await listItems(categoryId);
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载失败');
      return response.data;
    },
    staleTime: 600_000
  });

  const items: ItemView[] =
    data ??
    [
      { id: 11, categoryId: 1, code: 'PROD_TOTAL', name: '供水总量', unit: 'm³', orderNo: 1 },
      { id: 12, categoryId: 1, code: 'PROD_FACTORY', name: '出厂供水量', unit: 'm³', orderNo: 2 }
    ];

  const filteredItems = useMemo(
    () => (categoryId ? items.filter((item) => item.categoryId === categoryId) : items),
    [items, categoryId]
  );

  const createMutation = useMutation({
    mutationFn: async (payload: { categoryId: number; code: string; name: string; unit?: string; orderNo?: number }) => {
      const response = await createItem(payload);
      if (response.status !== 'OK') throw new Error(response.message ?? '新建失败');
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: qk.items(variables.categoryId) });
      queryClient.invalidateQueries({ queryKey: qk.items(undefined) });
      setShowForm(false);
      setFormError(undefined);
      setNewItem({
        categoryId: variables.categoryId,
        code: '',
        name: '',
        unit: 'm³',
        orderNo: items.filter((item) => item.categoryId === variables.categoryId).length + 1
      });
    },
    onError: (error: unknown) => {
      setFormError((error as Error)?.message ?? '新建失败');
    }
  });

  const openForm = () => {
    const targetCategory = categoryId ?? categories?.[0]?.id;
    if (!targetCategory) {
      setFormError('请先同步类别数据');
      return;
    }
    const categoryItems = items.filter((item) => item.categoryId === targetCategory);
    setNewItem({
      categoryId: targetCategory,
      code: '',
      name: '',
      unit: 'm³',
      orderNo: categoryItems.length + 1
    });
    setFormError(undefined);
    setShowForm(true);
  };

  const handleCategoryFilterChange = (value: number | undefined) => {
    setCategoryId(value);
    if (showForm) {
      setNewItem((prev) => ({
        ...prev,
        categoryId: value ?? prev.categoryId
      }));
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newItem.categoryId) {
      setFormError('请选择类别');
      return;
    }
    if (!newItem.code.trim() || !newItem.name.trim()) {
    setFormError('编码与名称不能为空');
    return;
  }
  setFormError(undefined);
  createMutation.mutate({
    categoryId: newItem.categoryId,
    code: newItem.code.trim(),
    name: newItem.name.trim(),
    unit: newItem.unit.trim(),
    orderNo: newItem.orderNo
  });
  };

  if (isError) {
    return <EmptyState title="无法加载子项" description="请检查网络或稍后再试。" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">子项管理</h1>
          <p className="text-sm text-muted-foreground">维护各类别下子项的编码、单位与排序。</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
            value={categoryId ?? ''}
            onChange={(event) =>
              handleCategoryFilterChange(event.target.value ? Number(event.target.value) : undefined)
            }
          >
            <option value="">全部类别</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={openForm}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            新建子项
          </button>
        </div>
      </div>

      {showForm ? (
        <div className="card max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-700">新建子项</h2>
            <button
              type="button"
              className="text-sm text-muted-foreground"
              onClick={() => {
                setShowForm(false);
                setFormError(undefined);
              }}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <form className="grid gap-4" onSubmit={handleFormSubmit}>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">所属类别</span>
              <select
                className="rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={newItem.categoryId ?? ''}
                onChange={(event) =>
                  setNewItem((prev) => ({
                    ...prev,
                    categoryId: event.target.value ? Number(event.target.value) : undefined
                  }))
                }
              >
                <option value="" disabled>
                  请选择类别
                </option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">编码</span>
              <input
                required
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={newItem.code}
                onChange={(event) =>
                  setNewItem((prev) => ({
                    ...prev,
                    code: event.target.value
                  }))
                }
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">名称</span>
              <input
                required
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={newItem.name}
                onChange={(event) =>
                  setNewItem((prev) => ({
                    ...prev,
                    name: event.target.value
                  }))
                }
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">单位</span>
              <input
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={newItem.unit}
                onChange={(event) =>
                  setNewItem((prev) => ({
                    ...prev,
                    unit: event.target.value
                  }))
                }
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">排序</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={newItem.orderNo}
                onChange={(event) =>
                  setNewItem((prev) => ({
                    ...prev,
                    orderNo: Number(event.target.value)
                  }))
                }
              />
            </label>
            {formError ? (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</div>
            ) : null}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              >
                <Save className="h-4 w-4" /> {createMutation.isPending ? '保存中…' : '保存子项'}
              </button>
              <button
                type="button"
                className="rounded-xl border border-border/60 px-4 py-2 text-sm text-muted-foreground transition hover:bg-muted"
                onClick={() => {
                  setShowForm(false);
                  setFormError(undefined);
                }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {filteredItems.length === 0 ? (
        <EmptyState title="该类别暂无子项" description="请新建子项或调整筛选条件。" />
      ) : (
        <DataTable
          columns={[
            { accessorKey: 'code', header: '编码' },
            { accessorKey: 'name', header: '名称' },
            { accessorKey: 'unit', header: '单位' },
            { accessorKey: 'orderNo', header: '排序' }
          ]}
          data={filteredItems}
          page={0}
          size={filteredItems.length || 10}
          total={filteredItems.length}
        />
      )}
    </div>
  );
}

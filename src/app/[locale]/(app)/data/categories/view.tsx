"use client";

import { FormEvent, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Save, X } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { createCategory, listCategories } from '@/lib/services';
import { qk } from '@/lib/types';

interface CategoryView {
  id: number;
  code: string;
  name: string;
  orderNo: number;
}

interface NewCategory {
  code: string;
  name: string;
  orderNo: number;
}

export default function CategoriesClient() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [category, setCategory] = useState<NewCategory>({ code: '', name: '', orderNo: 1 });

  const { data, isLoading, isError } = useQuery({
    queryKey: qk.categories,
    queryFn: async () => {
      const response = await listCategories();
      if (response.status !== 'OK' || !response.data) {
        throw new Error(response.message ?? '加载失败');
      }
      return response.data;
    },
    staleTime: 600_000
  });

  const categories: CategoryView[] =
    data ?? [
      { id: 1, code: 'PROD', name: '供水总量', orderNo: 1 },
      { id: 2, code: 'BILL', name: '计费用水量', orderNo: 2 }
    ];

  const mutation = useMutation({
    mutationFn: async (payload: NewCategory) => {
      const response = await createCategory(payload);
      if (response.status !== 'OK') throw new Error(response.message ?? '创建失败');
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.categories });
      setShowForm(false);
      setFormError(undefined);
      setCategory({ code: '', name: '', orderNo: categories.length + 1 });
    },
    onError: (error: unknown) => {
      setFormError((error as Error)?.message ?? '创建失败');
    }
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!category.code.trim() || !category.name.trim()) {
      setFormError('编码与名称不能为空');
      return;
    }
    setFormError(undefined);
    mutation.mutate({
      code: category.code.trim(),
      name: category.name.trim(),
      orderNo: category.orderNo
    });
  };

  if (isError) {
    return <EmptyState title="无法加载类别" description="请检查网络或稍后再试。" />;
  }

  const openForm = () => {
    setCategory({ code: '', name: '', orderNo: categories.length + 1 });
    setFormError(undefined);
    setShowForm(true);
  };

  if (!isLoading && categories.length === 0) {
    return (
      <EmptyState
        title="尚无类别"
        description="点击下方新建按钮，配置基础水量类别。"
        action={
          <button
            type="button"
            onClick={openForm}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700"
          >
            <Plus className="h-4 w-4" />
            新建类别
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">类别管理</h1>
          <p className="text-sm text-muted-foreground">维护水量平衡计算涉及的类别、排序与展示名称。</p>
        </div>
        <button
          type="button"
          onClick={openForm}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" />
          新建类别
        </button>
      </div>

      {showForm ? (
        <div className="card max-w-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-700">新建类别</h2>
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
          <form className="grid gap-4" onSubmit={handleSubmit}>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">编码</span>
              <input
                required
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={category.code}
                onChange={(event) => setCategory((prev) => ({ ...prev, code: event.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">名称</span>
              <input
                required
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={category.name}
                onChange={(event) => setCategory((prev) => ({ ...prev, name: event.target.value }))}
              />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-muted-foreground">排序</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
                value={category.orderNo}
                onChange={(event) => setCategory((prev) => ({ ...prev, orderNo: Number(event.target.value) }))}
              />
            </label>
            {formError ? (
              <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</div>
            ) : null}
            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
              >
                <Save className="h-4 w-4" /> {mutation.isPending ? '保存中…' : '保存类别'}
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

      <DataTable
        columns={[
          { accessorKey: 'code', header: '编码' },
          { accessorKey: 'name', header: '名称' },
          { accessorKey: 'orderNo', header: '排序' }
        ]}
        data={categories}
        page={0}
        size={categories.length || 10}
        total={categories.length}
      />
    </div>
  );
}

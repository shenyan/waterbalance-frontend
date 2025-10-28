"use client";

import { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/feedback/EmptyState';

interface DictionaryItem {
  id: number;
  name: string;
}

const initialCategories = [
  { id: 1, name: '供水总量', items: [{ id: 11, name: '总供水量' }] },
  { id: 2, name: '损耗指标', items: [{ id: 21, name: '漏损量' }] }
];

export default function DictionaryClient() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(initialCategories[0]?.id ?? null);

  const current = categories.find((c) => c.id === selectedCategory);

  const addCategory = () => {
    const id = Date.now();
    setCategories((prev) => [...prev, { id, name: `新类别 ${prev.length + 1}`, items: [] }]);
    setSelectedCategory(id);
  };

  const addItem = () => {
    if (!current) return;
    const id = Date.now();
    setCategories((prev) =>
      prev.map((category) =>
        category.id === current.id
          ? { ...category, items: [...category.items, { id, name: `新子项 ${category.items.length + 1}` }] }
          : category
      )
    );
  };

  const deleteItem = (id: number) => {
    if (!current) return;
    setCategories((prev) =>
      prev.map((category) =>
        category.id === current.id ? { ...category, items: category.items.filter((item) => item.id !== id) } : category
      )
    );
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr,2fr]">
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-700">类别</h2>
          <button
            type="button"
            onClick={addCategory}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-soft"
          >
            <Plus className="h-4 w-4" /> 新建
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full rounded-xl px-3 py-2 text-left transition ${
                  category.id === selectedCategory ? 'bg-brand-600/10 text-brand-700' : 'text-muted-foreground'
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card space-y-4">
        {current ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-brand-700">{current.name}</h2>
                <p className="text-sm text-muted-foreground">支持增删子项与拖拽排序（待实现）。</p>
              </div>
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-2 rounded-xl border border-border/60 px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted"
              >
                <Plus className="h-4 w-4" /> 新子项
              </button>
            </div>
            {current.items.length === 0 ? (
              <EmptyState title="暂无子项" description="点击新子项添加数据。" />
            ) : (
              <ul className="space-y-2 text-sm">
                {current.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between rounded-xl border border-border/60 px-3 py-2">
                    <span>{item.name}</span>
                    <button
                      className="inline-flex items-center gap-1 text-sm text-destructive"
                      type="button"
                      onClick={() => deleteItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" /> 删除
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700"
            >
              <Save className="h-4 w-4" /> 保存调整
            </button>
          </>
        ) : (
          <EmptyState title="未选择类别" description="请选择左侧类别以编辑子项。" />
        )}
      </div>
    </div>
  );
}

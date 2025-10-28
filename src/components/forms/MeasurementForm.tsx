"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  itemId: z.number({ invalid_type_error: '请选择子项' }),
  bizDate: z.string().min(1, '请选择日期'),
  value: z.number({ invalid_type_error: '请输入数值' }),
  source: z.string().min(1, '请输入来源'),
  remarks: z.string().optional()
});

export type MeasurementFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<MeasurementFormValues>;
  onSubmit: (values: MeasurementFormValues) => Promise<void>;
  submitting?: boolean;
  itemOptions: Array<{ value: number; label: string }>;
  orgLabel?: string;
}

export function MeasurementForm({ defaultValues, onSubmit, submitting, itemOptions, orgLabel }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<MeasurementFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      itemId: defaultValues?.itemId ?? itemOptions[0]?.value ?? 0,
      bizDate: defaultValues?.bizDate ?? '',
      value: defaultValues?.value ?? 0,
      source: defaultValues?.source ?? 'MANUAL',
      remarks: defaultValues?.remarks
    }
  });

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {orgLabel ? (
        <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">当前组织：{orgLabel}</div>
      ) : null}
      <div className="grid gap-3">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="itemId">
          子项
        </label>
        <select
          id="itemId"
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
          {...register('itemId', { valueAsNumber: true })}
        >
          {itemOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.itemId ? <p className="text-sm text-destructive">{errors.itemId.message}</p> : null}
      </div>
      <div className="grid gap-3">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="bizDate">
          日期
        </label>
        <input
          id="bizDate"
          type="date"
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
          {...register('bizDate')}
        />
        {errors.bizDate ? <p className="text-sm text-destructive">{errors.bizDate.message}</p> : null}
      </div>
      <div className="grid gap-3">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="value">
          数值 (m³)
        </label>
        <input
          id="value"
          type="number"
          step="0.001"
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
          {...register('value', {
            valueAsNumber: true,
            onChange: (event) => setValue('value', Number(event.target.value))
          })}
        />
        {errors.value ? <p className="text-sm text-destructive">{errors.value.message}</p> : null}
      </div>
      <div className="grid gap-3">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="source">
          数据来源
        </label>
        <input
          id="source"
          type="text"
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
          {...register('source')}
        />
        {errors.source ? <p className="text-sm text-destructive">{errors.source.message}</p> : null}
      </div>
      <div className="grid gap-3">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="remarks">
          备注
        </label>
        <textarea
          id="remarks"
          rows={3}
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
          {...register('remarks')}
        />
        {errors.remarks ? <p className="text-sm text-destructive">{errors.remarks.message}</p> : null}
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            保存中…
          </>
        ) : (
          '保存'
        )}
      </button>
    </form>
  );
}

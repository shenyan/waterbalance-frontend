"use client";

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  avgPressureMPa: z.number({ invalid_type_error: '请输入平均压力' }).min(0),
  maxFrostDepthM: z.number({ invalid_type_error: '请输入冻土深度' }).min(0),
  meterToHouseholdRatio: z.number({ invalid_type_error: '请输入抄表到户占比' }).min(0).max(1)
});

export type CorrectionFormValues = z.infer<typeof schema>;

interface Props {
  defaultValues?: Partial<CorrectionFormValues>;
  onSubmit: (values: CorrectionFormValues) => void;
}

export function CorrectionForm({ defaultValues, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CorrectionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      avgPressureMPa: defaultValues?.avgPressureMPa ?? 0.35,
      maxFrostDepthM: defaultValues?.maxFrostDepthM ?? 0.8,
      meterToHouseholdRatio: defaultValues?.meterToHouseholdRatio ?? 0.7
    }
  });

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="avgPressureMPa">
          平均管网压力 (MPa)
        </label>
        <input
          id="avgPressureMPa"
          type="number"
          step="0.01"
          {...register('avgPressureMPa', { valueAsNumber: true })}
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
        />
        {errors.avgPressureMPa ? <p className="text-sm text-destructive">{errors.avgPressureMPa.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="maxFrostDepthM">
          最大冻土深度 (m)
        </label>
        <input
          id="maxFrostDepthM"
          type="number"
          step="0.01"
          {...register('maxFrostDepthM', { valueAsNumber: true })}
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
        />
        {errors.maxFrostDepthM ? <p className="text-sm text-destructive">{errors.maxFrostDepthM.message}</p> : null}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium text-muted-foreground" htmlFor="meterToHouseholdRatio">
          抄表到户占比 (%)
        </label>
        <input
          id="meterToHouseholdRatio"
          type="number"
          step="0.01"
          {...register('meterToHouseholdRatio', { valueAsNumber: true })}
          className="rounded-lg border border-border/60 bg-transparent px-3 py-2 text-sm"
        />
        {errors.meterToHouseholdRatio ? (
          <p className="text-sm text-destructive">{errors.meterToHouseholdRatio.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700"
      >
        计算
      </button>
    </form>
  );
}

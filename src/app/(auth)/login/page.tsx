"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
  remember: z.boolean().optional()
});

type LoginForm = z.infer<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      remember: true
    }
  });
  const [apiError, setApiError] = useState<string>();

  const { login, loginError } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    setApiError(undefined);
    try {
      await login({ username: data.username, password: data.password });
    } catch (error) {
      console.error(error);
      setApiError((error as Error)?.message ?? 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="card w-full max-w-md">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Water Balance</h1>
            <p className="text-muted-foreground text-sm">登录系统以继续</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground" htmlFor="username">
              用户名
            </label>
            <input
              id="username"
              type="text"
              className="mt-1 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
              {...register('username')}
              aria-invalid={Boolean(errors.username)}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground" htmlFor="password">
              密码
            </label>
            <input
              id="password"
              type="password"
              className="mt-1 w-full rounded-lg border border-input bg-transparent px-4 py-2 text-sm shadow-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/40"
              {...register('password')}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-destructive" role="alert">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border border-input text-brand-600 focus:ring-brand-600"
                {...register('remember')}
              />
              记住我
            </label>
            <Link href="#" className="text-brand-600 hover:underline">
              忘记密码？
            </Link>
          </div>
          {apiError || loginError ? (
            <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive" role="alert">
              {apiError ?? loginError?.message}
            </div>
          ) : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            disabled={isSubmitting}
          >
            {isSubmitting ? '登录中…' : '登录'}
          </button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { api } from '@/lib/api';
import { clearAccessToken, setAccessToken, setCurrentOrg } from '@/lib/auth';
import type { ApiResponse, LoginResponse } from '@/lib/types';

export function useAuth() {
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (variables: { username: string; password: string }) => {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/api/auth/login', variables);
      if (data.status !== 'OK' || !data.data) {
        throw new Error(data.message ?? 'Login failed');
      }
      return data.data;
    },
    onSuccess: (payload) => {
      setAccessToken(payload.token);
      setCurrentOrg(payload.user.orgId);
      setUser(payload.user);
      const target = `/${locale}`;
      router.replace(target);
    }
  });

  const logout = useCallback(() => {
    clearAccessToken();
    const loginPath = locale === 'zh' ? '/login' : `/${locale}/login`;
    router.replace(loginPath);
  }, [locale, router]);

  return useMemo(
    () => ({
      user,
      login: loginMutation.mutateAsync,
      loginStatus: loginMutation.status,
      loginError: loginMutation.error as Error | null,
      logout
    }),
    [loginMutation.error, loginMutation.status, loginMutation.mutateAsync, logout, user]
  );
}

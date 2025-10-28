"use client";

import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { KeyRound, Plus, Save, Check, ChevronDown } from 'lucide-react';
import { DataTable } from '@/components/tables/DataTable';
import { EmptyState } from '@/components/feedback/EmptyState';
import { pageUsers, createUser, resetPassword } from '@/lib/services';

const fallbackUsers = {
  content: [
    { id: 1, username: 'admin', roles: ['ADMIN'], enabled: true },
    { id: 2, username: 'planner', roles: ['ANALYST'], enabled: true }
  ],
  page: 0,
  size: 20,
  total: 2
};

export default function UsersClient() {
  const queryKey = ['settings', 'users'] as const;

  const { data, isError, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await pageUsers({ page: 0, size: 20 });
      if (response.status !== 'OK' || !response.data) throw new Error(response.message ?? '加载失败');
      return response.data;
    },
    placeholderData: fallbackUsers
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Water@123');
  const [roles, setRoles] = useState<string[]>(['ANALYST']);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const roleMenuRef = useRef<HTMLDivElement | null>(null);

  const createMutation = useMutation({
    mutationFn: async () => {
      const response = await createUser({ username, password, orgId: 1, roles });
      if (response.status !== 'OK') throw new Error(response.message ?? '创建失败');
    }
  });

  useEffect(() => {
    if (!createMutation.isSuccess) return;
    refetch();
    setUsername('');
    setPassword('Water@123');
    setRoles(['ANALYST']);
    setRoleMenuOpen(false);
  }, [createMutation.isSuccess, refetch]);

  const resetMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await resetPassword(id, 'Reset@123');
      if (response.status !== 'OK') throw new Error(response.message ?? '重置失败');
    }
  });

  const users = data?.content ?? fallbackUsers.content;

  if (isError) {
    return <EmptyState title="无法加载用户" description="请稍后再试。" />;
  }

  const toggleRoleMenu = () => setRoleMenuOpen((prev) => !prev);
  const closeRoleMenu = () => setRoleMenuOpen(false);

  useEffect(() => {
    if (!roleMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        closeRoleMenu();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [roleMenuOpen]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-brand-700">用户与权限</h1>
          <p className="text-sm text-muted-foreground">管理账号、角色与启用状态，支持密码重置。</p>
        </div>
        <button
          type="button"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
        >
          <Plus className="h-4 w-4" /> {createMutation.isPending ? '创建中…' : '创建用户'}
        </button>
      </div>

      <div className="grid gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">用户名</span>
            <input
              className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label className="space-y-1 text-sm">
            <span className="text-muted-foreground">密码</span>
            <input
              className="w-full rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <div className="space-y-1 text-sm">
            <span className="text-muted-foreground">角色</span>
            <div className="relative" ref={roleMenuRef}>
              <button
                type="button"
                onClick={toggleRoleMenu}
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-transparent px-3 py-2 text-sm shadow-soft transition hover:bg-muted"
              >
                <span>{roles.length ? roles.join(', ') : '请选择角色'}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {roleMenuOpen ? (
                <div className="absolute z-10 mt-2 w-full rounded-xl border border-border/60 bg-card p-2 shadow-soft">
                  {['ADMIN', 'ANALYST', 'OPERATOR'].map((role) => {
                    const selected = roles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => {
                          setRoles((prev) =>
                            prev.includes(role)
                              ? prev.filter((item) => item !== role)
                              : [...prev, role]
                          );
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-muted"
                      >
                        <span>{role}</span>
                        {selected ? <Check className="h-4 w-4 text-brand-600" /> : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => createMutation.mutate()}
          disabled={createMutation.isPending}
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {createMutation.isPending ? '保存中…' : '保存并创建'}
        </button>
      </div>

      <DataTable
        columns={[
          { accessorKey: 'username', header: '用户名' },
          {
            accessorKey: 'roles',
            header: '角色',
            cell: ({ getValue }) => (getValue<string[]>() ?? []).join(', ')
          },
          {
            accessorKey: 'enabled',
            header: '状态',
            cell: ({ getValue }) => (getValue<boolean>() ? '启用' : '禁用')
          },
          {
            id: 'actions',
            header: '操作',
            cell: ({ row }) => (
              <button
                className="inline-flex items-center gap-1 text-sm text-brand-600"
                onClick={() => resetMutation.mutate(row.original.id)}
                type="button"
              >
                <KeyRound className="h-4 w-4" /> 重置密码
              </button>
            )
          }
        ]}
        data={users}
        page={data?.page ?? 0}
        size={data?.size ?? users.length}
        total={data?.total ?? users.length}
      />
    </div>
  );
}

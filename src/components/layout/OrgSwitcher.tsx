"use client";

import { Building2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCurrentOrg, setCurrentOrg } from '@/lib/auth';

const organizations = [
  { id: 1, name: '示例水司 A' },
  { id: 2, name: '示例水司 B' },
  { id: 3, name: '示例水司 C' }
];

export function OrgSwitcher() {
  const [orgId, setOrgId] = useState<number>(() => getCurrentOrg() ?? organizations[0]?.id ?? 1);

  useEffect(() => {
    setCurrentOrg(orgId);
  }, [orgId]);

  return (
    <label className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm shadow-soft">
      <Building2 className="h-4 w-4 text-brand-600" aria-hidden />
      <select
        className="bg-transparent text-sm font-medium outline-none"
        value={orgId}
        onChange={(event) => setOrgId(Number(event.target.value))}
        aria-label="选择组织"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </label>
  );
}

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Admin() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <h1 className="text-xl font-bold text-slate-100">Admin</h1>
      </div>
      <p className="text-slate-500 text-sm">Administration panel — coming soon.</p>
    </div>
  );
}

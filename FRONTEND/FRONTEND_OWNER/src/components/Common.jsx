import React from 'react';
import { X } from 'lucide-react';

export function StatusBadge({ status }) {
  const styles = {
    CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    ARRIVED: 'bg-purple-50 text-purple-700 border-purple-200',
    IN_SERVICE: 'bg-blue-50 text-blue-700 border-blue-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
    NO_SHOW: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const current = styles[status] || 'bg-slate-50 text-slate-700 border-slate-200';

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {status ? status.replace('_', ' ') : 'UNKNOWN'}
    </span>
  );
}

export function StatCard({ title, value, change, trend = 'up', icon: Icon, subtitle }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-[#E8EAF0] shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-xs font-semibold uppercase tracking-wider">{title}</span>
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      </div>
      <div className="my-2.5">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {change && (
          <span className={`font-semibold ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
        {subtitle && <span className="text-slate-400">{subtitle}</span>}
      </div>
    </div>
  );
}

export function Drawer({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#E8EAF0] animate-in slide-in-from-right duration-200">
        <div className="px-6 py-4 border-b border-[#E8EAF0] flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
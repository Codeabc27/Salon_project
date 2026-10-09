import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CalendarDays,
  Scissors,
  Users,
  UserRound,
  Store,
  Tag,
  Star,
  Wallet,
  ChartNoAxesCombined,
  Bell,
  LogOut,
  Plus
} from 'lucide-react';

export default function OwnerLayout({
  currentTab,
  setCurrentTab,
  children,
  onLogout,
  selectedSalon,
  salons = [],
  onSalonChange,
  onOpenWalkIn
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck, badge: 3 },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'services', label: 'Services', icon: Scissors },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'customers', label: 'Customers', icon: UserRound },
    { id: 'profile', label: 'Salon Profile', icon: Store },
    { id: 'offers', label: 'Offers', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex text-slate-800">
      {/* Persistent Dark Sidebar */}
      <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col justify-between hidden md:flex border-r border-slate-800 shrink-0">
        <div>
          {/* Brand */}
          <div className="p-6 border-b border-slate-800/80">
            <h1 className="text-white font-bold tracking-tight text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5B4BDB]"></span>
              SalonPro
            </h1>
            <p className="text-xs text-slate-400 mt-1 truncate">{selectedSalon?.name || 'My Salon Workspace'}</p>
          </div>

          {/* Quick Action */}
          <div className="p-4">
            <button
              onClick={onOpenWalkIn}
              className="w-full bg-[#5B4BDB] hover:bg-[#4C3EC8] text-white py-2.5 px-3 rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Quick Walk-in
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#5B4BDB] text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/70 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-[#E8EAF0] h-16 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 capitalize">{currentTab}</h2>
            {salons.length > 0 && (
              <select
                className="text-xs border border-[#E8EAF0] rounded-lg px-2.5 py-1.5 font-medium text-slate-700 bg-slate-50 focus:outline-none focus:border-[#5B4BDB]"
                value={selectedSalon?.id || ''}
                onChange={(e) => onSalonChange(Number(e.target.value))}
              >
                {salons.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.city})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50">
              <Bell className="w-4 h-4" />
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
              R
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
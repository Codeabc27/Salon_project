import React from 'react';
import { StatCard, StatusBadge } from '../components/Common';
import { CalendarCheck, DollarSign, UserPlus, Star } from 'lucide-react';

export default function DashboardTab({ stats = {}, queue = {}, onOpenWalkIn, onStatusChange }) {
  return (
    <div className="space-y-6">
      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Bookings"
          value={stats.today_total_bookings ?? 18}
          change="12% from yesterday"
          trend="up"
          icon={CalendarCheck}
        />
        <StatCard
          title="Today's Revenue"
          value={`₹${(stats.today_revenue ?? 8450).toLocaleString()}`}
          change="18%"
          trend="up"
          icon={DollarSign}
        />
        <StatCard
          title="New Customers"
          value={stats.new_customers_count ?? 14}
          change="7%"
          trend="up"
          icon={UserPlus}
        />
        <StatCard
          title="Customer Rating"
          value={`${stats.customer_rating ?? 4.8} ★`}
          subtitle="Based on 124 reviews"
          icon={Star}
        />
      </div>

      {/* Live Floor Queue */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-xs p-6">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Live Customer Queue & Operations</h4>
            <p className="text-xs text-slate-400 mt-0.5">Track customers currently in the salon.</p>
          </div>
          <button onClick={onOpenWalkIn} className="text-xs font-semibold text-[#5B4BDB] hover:underline">
            + Quick Walk-In
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Arrived */}
          <div className="bg-[#F7F8FC] p-3.5 rounded-lg border border-[#E8EAF0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-700">● Arrived</span>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {stats.queue_arrived?.length || 1}
              </span>
            </div>
            <div className="space-y-2">
              {(stats.queue_arrived?.length ? stats.queue_arrived : [
                { id: 101, customer_name: 'Arun Kumar', service_name: 'Haircut', start_time: '10:15 AM' }
              ]).map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-md border border-[#E8EAF0] text-xs">
                  <p className="font-bold text-slate-900">{item.customer_name}</p>
                  <p className="text-slate-500 mt-0.5">{item.service_name} • {item.start_time}</p>
                  <button
                    onClick={() => onStatusChange(item.id, 'IN_SERVICE')}
                    className="w-full mt-2 bg-indigo-50 hover:bg-indigo-100 text-[#5B4BDB] py-1 rounded text-xs font-semibold"
                  >
                    Start Service →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Waiting */}
          <div className="bg-[#F7F8FC] p-3.5 rounded-lg border border-[#E8EAF0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-700">● Waiting</span>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {stats.queue_waiting?.length || 1}
              </span>
            </div>
            <div className="space-y-2">
              {(stats.queue_waiting?.length ? stats.queue_waiting : [
                { id: 102, customer_name: 'Priya Sharma', service_name: 'Hair Color', start_time: '10:30 AM' }
              ]).map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-md border border-[#E8EAF0] text-xs">
                  <p className="font-bold text-slate-900">{item.customer_name}</p>
                  <p className="text-slate-500 mt-0.5">{item.service_name} • {item.start_time}</p>
                  <button
                    onClick={() => onStatusChange(item.id, 'ARRIVED')}
                    className="w-full mt-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-1 rounded text-xs font-semibold"
                  >
                    Mark Arrived ✓
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* In Service */}
          <div className="bg-[#F7F8FC] p-3.5 rounded-lg border border-[#E8EAF0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-700">● In Service</span>
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                {stats.queue_in_service?.length || 1}
              </span>
            </div>
            <div className="space-y-2">
              {(stats.queue_in_service?.length ? stats.queue_in_service : [
                { id: 103, customer_name: 'Rahul Mehta', service_name: 'Facial', start_time: '10:00 AM' }
              ]).map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-md border border-[#E8EAF0] text-xs">
                  <p className="font-bold text-slate-900">{item.customer_name}</p>
                  <p className="text-slate-500 mt-0.5">{item.service_name} • Stylist: Kumar</p>
                  <button
                    onClick={() => onStatusChange(item.id, 'COMPLETED')}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white py-1 rounded text-xs font-semibold"
                  >
                    Complete Service ✓
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Completed */}
          <div className="bg-[#F7F8FC] p-3.5 rounded-lg border border-[#E8EAF0]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600">✓ Completed</span>
              <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-full">
                {stats.queue_completed?.length || 4}
              </span>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-md border border-[#E8EAF0] text-xs">
                <p className="font-bold text-slate-900">Sneha Iyer</p>
                <p className="text-slate-500 mt-0.5">Hair Spa • Paid ₹1,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
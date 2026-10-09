import React, { useState } from 'react';
import { StatusBadge, Drawer } from '../components/Common';
import { Search, Eye } from 'lucide-react';

export default function BookingsTab({ bookings = [], onUpdateStatus }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filtered = bookings.filter((b) => {
    const matchesFilter = filter === 'ALL' || b.status === filter;
    const matchesSearch = b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
                          b.service_name?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E8EAF0] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-[#E8EAF0] overflow-x-auto w-full md:w-auto">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                filter === tab ? 'bg-[#5B4BDB] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-[#E8EAF0] rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#5B4BDB]"
          />
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-xl border border-[#E8EAF0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F8FC] border-b border-[#E8EAF0] text-slate-500 font-semibold uppercase">
              <tr>
                <th className="px-5 py-3.5">Customer</th>
                <th className="px-5 py-3.5">Service</th>
                <th className="px-5 py-3.5">Staff</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAF0] text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-slate-900">{b.customer_name}</p>
                    <p className="text-[11px] text-slate-400">{b.customer_phone || 'Walk-in'}</p>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{b.service_name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{b.staff_name || 'Unassigned'}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-slate-900">{b.booking_date}</span>
                    <span className="text-slate-400 block text-[11px]">{b.start_time}</span>
                  </td>
                  <td className="px-5 py-3.5 font-bold text-slate-900">₹{b.amount}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="p-1.5 rounded-lg border border-[#E8EAF0] hover:bg-slate-100 text-slate-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400">
                    No appointments match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side-Drawer Details */}
      <Drawer
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title={`Appointment #${selectedBooking?.id}`}
      >
        {selectedBooking && (
          <div className="space-y-6 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Customer</span>
              <h4 className="text-base font-bold text-slate-900">{selectedBooking.customer_name}</h4>
              <p className="text-slate-500">{selectedBooking.customer_phone || 'Walk-in Guest'}</p>
            </div>

            <div className="p-4 bg-[#F7F8FC] rounded-lg border border-[#E8EAF0] space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Service</span>
                <span className="font-bold text-slate-900">{selectedBooking.service_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Stylist</span>
                <span className="font-medium text-slate-900">{selectedBooking.staff_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Time</span>
                <span className="font-medium text-slate-900">{selectedBooking.booking_date} @ {selectedBooking.start_time}</span>
              </div>
              <div className="flex justify-between border-t border-[#E8EAF0] pt-2">
                <span className="text-slate-500">Total Price</span>
                <span className="font-bold text-[#5B4BDB]">₹{selectedBooking.amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Update Lifecycle</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, 'ARRIVED');
                    setSelectedBooking(null);
                  }}
                  className="py-2 bg-emerald-50 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-100"
                >
                  Mark Arrived
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, 'IN_SERVICE');
                    setSelectedBooking(null);
                  }}
                  className="py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100"
                >
                  Start Service
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, 'COMPLETED');
                    setSelectedBooking(null);
                  }}
                  className="py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Complete Service
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(selectedBooking.id, 'CANCELLED');
                    setSelectedBooking(null);
                  }}
                  className="py-2 bg-rose-50 text-rose-700 rounded-lg font-semibold hover:bg-rose-100"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
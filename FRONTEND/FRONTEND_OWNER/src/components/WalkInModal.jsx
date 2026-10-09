import React, { useState } from 'react';

export default function WalkInModal({ isOpen, onClose, onSave, services = [], staff = [] }) {
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    service_name: services[0]?.name || '',
    staff_name: staff[0]?.name || 'Assigned Stylist',
    start_time: 'Now',
    duration_minutes: 45,
    amount: services[0]?.price || 500,
    payment_method: 'CASH',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleServiceChange = (e) => {
    const sName = e.target.value;
    const selected = services.find((s) => s.name === sName);
    setForm({
      ...form,
      service_name: sName,
      amount: selected ? selected.price : form.amount,
      duration_minutes: selected ? selected.duration : form.duration_minutes,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to book walk-in appointment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-150">
        <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">⚡ Add Walk-in Appointment</h3>
            <p className="text-xs text-slate-500 mt-0.5">Immediately reserves a calendar slot and records in CRM.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Customer Name *</label>
            <input
              type="text"
              required
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Arun Kumar"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Phone Number</label>
            <input
              type="text"
              value={form.customer_phone}
              onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Service *</label>
              <select
                value={form.service_name}
                onChange={handleServiceChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name} (₹{s.price})</option>
                ))}
                {services.length === 0 && <option value="Haircut">Haircut (Default)</option>}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Assign Stylist</label>
              <select
                value={form.staff_name}
                onChange={(e) => setForm({ ...form, staff_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white outline-none"
              >
                {staff.map((st) => (
                  <option key={st.id} value={st.name}>{st.name}</option>
                ))}
                {staff.length === 0 && <option value="Assigned Stylist">Any Available Staff</option>}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Price (₹) *</label>
              <input
                type="number"
                required
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Payment Method</label>
              <select
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:bg-white outline-none"
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI / QR Code</option>
                <option value="ONLINE">Card / Online</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
            >
              {submitting ? 'Reserving...' : 'Confirm Walk-In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState } from 'react';

export default function StaffTab({ staffList = [], onAddStaff }) {
  const [form, setForm] = useState({
    name: '',
    role: '',
    phone: '',
    work_start_time: '09:00',
    work_end_time: '20:00',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!onAddStaff) return;
    setLoading(true);
    try {
      await onAddStaff(form);
      setForm({ name: '', role: '', phone: '', work_start_time: '09:00', work_end_time: '20:00' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Ensure staffList is always treated as an array
  const safeStaffList = Array.isArray(staffList) ? staffList : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Add Staff Form */}
      <div className="bg-white shadow-xs rounded-xl p-6 col-span-1 border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Add New Stylist</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Staff Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1 focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., John Doe"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Role / Specialization</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
              placeholder="e.g., Senior Hair Stylist"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-gray-600">Start Time</label>
              <input
                type="text"
                value={form.work_start_time}
                onChange={(e) => setForm({ ...form, work_start_time: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">End Time</label>
              <input
                type="text"
                value={form.work_end_time}
                onChange={(e) => setForm({ ...form, work_end_time: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 text-sm transition-colors shadow-sm"
          >
            {loading ? 'Adding...' : 'Add Team Member'}
          </button>
        </form>
      </div>

      {/* Staff List Grid */}
      <div className="bg-white shadow-xs rounded-xl p-6 col-span-2 border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Salon Staff Team</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {safeStaffList.map((st, index) => (
            <div key={st.id || index} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold text-gray-800">{st.name}</h4>
                  <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
                </div>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">{st.role || 'Stylist'}</p>
                <p className="text-xs text-gray-500 mt-2">Shift: {st.work_start_time || '09:00'} - {st.work_end_time || '20:00'}</p>
              </div>
            </div>
          ))}
          {safeStaffList.length === 0 && (
            <p className="text-gray-500 text-sm col-span-2 py-6 text-center">No staff members added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
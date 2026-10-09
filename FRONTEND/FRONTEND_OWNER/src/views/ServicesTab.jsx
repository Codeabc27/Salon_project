import React, { useState } from 'react';

export default function ServicesTab({ services = [], onAddService, onDeleteService }) {
  const [form, setForm] = useState({ name: '', category: '', price: '', duration: 45 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onAddService(form);
    setForm({ name: '', category: '', price: '', duration: 45 });
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Salon Services & Pricing</h3>
          <p className="text-sm text-gray-500 mt-0.5">Manage the treatments and services available for online customer booking.</p>
        </div>
        <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-100 self-start">
          Total Services: {services.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form: Add Service */}
        <div className="bg-white shadow-xs rounded-xl p-6 border border-gray-100 lg:col-span-1 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm">➕</span>
            <h4 className="font-bold text-gray-800 text-base">Add New Service</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Service Name</label>
              <input 
                type="text" 
                required 
                value={form.name} 
                onChange={(e) => setForm({ ...form, name: e.target.value })} 
                className="w-full bg-gray-50/55 border border-gray-200 rounded-lg p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                placeholder="e.g., Advanced Hair Styling" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Category</label>
              <input 
                type="text" 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
                className="w-full bg-gray-50/55 border border-gray-200 rounded-lg p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                placeholder="e.g., Hair, Spa, Beard" 
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Price (₹)</label>
                <input 
                  type="number" 
                  required 
                  value={form.price} 
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} 
                  className="w-full bg-gray-50/55 border border-gray-200 rounded-lg p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                  placeholder="499" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Duration (Mins)</label>
                <input 
                  type="number" 
                  required 
                  value={form.duration} 
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} 
                  className="w-full bg-gray-50/55 border border-gray-200 rounded-lg p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all" 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 text-sm transition-colors shadow-sm mt-2"
            >
              {loading ? 'Adding Service...' : 'Save & Publish Service'}
            </button>
          </form>
        </div>

        {/* Right List: Catalog Grid */}
        <div className="bg-white shadow-xs rounded-xl p-6 border border-gray-100 lg:col-span-2">
          <h4 className="font-bold text-gray-800 text-base mb-4">Active Service Catalog</h4>
          
          <div className="space-y-3">
            {services.map((srv) => (
              <div 
                key={srv.id} 
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h5 className="font-semibold text-gray-900">{srv.name}</h5>
                    {srv.category && (
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full uppercase tracking-wide">
                        {srv.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <span>⏱️</span> {srv.duration} minutes appointment time
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-extrabold text-gray-900">₹{srv.price}</span>
                  <button 
                    onClick={() => onDeleteService(srv.id)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                    title="Delete Service"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-xl">
                <span className="text-3xl">✂️</span>
                <p className="text-gray-500 text-sm font-medium mt-2">No services added yet.</p>
                <p className="text-gray-400 text-xs mt-1">Use the form on the left to add your first salon service.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
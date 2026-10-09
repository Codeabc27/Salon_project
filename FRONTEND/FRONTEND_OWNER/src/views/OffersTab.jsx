import React, { useState } from 'react';

export default function OffersTab() {
  const [offers, setOffers] = useState([
    { id: 1, title: 'Flat 20% Off on Hair Services', code: 'HAIR20', valid: '30 Sep 2026' },
    { id: 2, title: 'Weekend Grooming Combo Special', code: 'WEEKEND50', valid: '15 Oct 2026' }
  ]);
  const [form, setForm] = useState({ title: '', code: '', valid: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setOffers([...offers, { id: Date.now(), ...form }]);
    setForm({ title: '', code: '', valid: '' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow-xs rounded-xl p-6 col-span-1 border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Create New Offer</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-600">Offer Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
              placeholder="e.g., Summer Special Discount"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Promo Code</label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1 uppercase"
              placeholder="SUMMER20"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">Valid Until</label>
            <input
              type="text"
              required
              value={form.valid}
              onChange={(e) => setForm({ ...form, valid: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm mt-1"
              placeholder="31 Dec 2026"
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-md font-medium hover:bg-indigo-700 text-sm shadow-sm">
            Publish Offer
          </button>
        </form>
      </div>

      <div className="bg-white shadow-xs rounded-xl p-6 col-span-2 border border-gray-100">
        <h3 className="font-bold text-lg mb-4 text-gray-800">Active Promotional Campaigns</h3>
        <div className="space-y-3">
          {offers.map((o) => (
            <div key={o.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50/50 flex justify-between items-center">
              <div>
                <h4 className="font-semibold text-gray-800">{o.title}</h4>
                <p className="text-xs text-indigo-600 font-mono mt-0.5">Code: {o.code} • Valid till: {o.valid}</p>
              </div>
              <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Active</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
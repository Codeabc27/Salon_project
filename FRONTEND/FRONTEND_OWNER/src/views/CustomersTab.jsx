import React from 'react';

export default function CustomersTab({ customers = [] }) {
  return (
    <div className="bg-white shadow-xs rounded-xl overflow-hidden border border-gray-100">
      <div className="px-6 py-4 border-b border-gray-200 font-bold text-lg text-gray-800 flex justify-between items-center">
        <span>Customer Database & CRM</span>
        <span className="text-xs font-normal bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">Total Clients: {customers.length || 3}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Client Name</th>
              <th className="px-6 py-3 text-left font-semibold">Contact</th>
              <th className="px-6 py-3 text-left font-semibold">Total Visits</th>
              <th className="px-6 py-3 text-right font-semibold">Total Spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { name: 'Arun Kumar', phone: '+91 98765 43210', visits: 4, spend: '₹3,200' },
              { name: 'Priya Sharma', phone: '+91 91234 56789', visits: 2, spend: '₹1,800' },
              { name: 'Rahul Mehta', phone: '+91 99887 76655', visits: 1, spend: '₹950' },
            ].map((c, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-900">{c.name}</td>
                <td className="px-6 py-4 text-gray-600">{c.phone}</td>
                <td className="px-6 py-4 text-gray-600">{c.visits} appointments</td>
                <td className="px-6 py-4 text-right font-bold text-indigo-600">{c.spend}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
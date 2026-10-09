import React, { useState } from 'react';
import { login, register } from '../services/api';

export default function AuthPage({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Helper to extract a readable string from FastAPI 422 error structures
  const extractErrorMessage = (err) => {
    const detail = err.response?.data?.detail;
    if (!detail) return err.message || 'Something went wrong. Please try again.';
    if (typeof detail === 'string') return detail;
    if (Array.isArray(detail)) {
      return detail.map((d) => d.msg || `${d.loc?.join('.')} is invalid`).join(', ');
    }
    if (typeof detail === 'object') {
      return detail.msg || JSON.stringify(detail);
    }
    return 'Invalid input format';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await login({ email: email.trim(), password });
        localStorage.setItem('owner_token', res.data.access_token);
        if (onLoginSuccess) onLoginSuccess();
      } else {
        await register({ email: email.trim(), password, role: 'SALON_OWNER' });
        setIsLogin(true);
        setError('Account created successfully! Please sign in.');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FC] flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full rounded-2xl border border-[#E8EAF0] shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#5B4BDB] text-white rounded-xl flex items-center justify-center font-black text-xl mx-auto mb-3 shadow-md shadow-[#5B4BDB]/20">
            SP
          </div>
          <h2 className="text-2xl font-bold text-slate-900">SalonPro Owner Portal</h2>
          <p className="text-xs text-slate-500 mt-1">
            {isLogin ? 'Sign in to access your daily control center' : 'Register your salon partner workspace'}
          </p>
        </div>

        {error && (
          <div className={`p-3 rounded-lg text-xs font-semibold mb-5 ${
            error.includes('successfully') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5B4BDB] outline-none"
              placeholder="owner@salon.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#5B4BDB] outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#5B4BDB] hover:bg-[#4C3EC8] text-white py-2.5 rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In to Dashboard' : 'Create Owner Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-xs font-bold text-[#5B4BDB] hover:underline"
          >
            {isLogin ? "Don't have an owner account? Register here" : 'Already registered? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Shield, AlertCircle, Loader2, KeyRound } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
  onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected authentication error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f9f9f8] text-[#111110] flex items-center justify-center p-4 select-none relative">
      {/* Main Login Card */}
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-[#e5e5e2] shadow-sm relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-[#b6f542]/20 border border-[#b6f542] flex items-center justify-center mb-3">
            <Shield className="h-6 w-6 text-[#111110]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111110]">ShadowGuard SOC</h2>
          <p className="text-sm text-[#70706c] mt-1">Enterprise AI Security & Data Loss Prevention</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Form fields with clean cream & lime theme styling */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70706c] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 rounded-lg bg-[#f9f9f8] border border-[#e5e5e2] text-[#111110] focus:outline-none focus:border-[#b6f542] transition-colors disabled:opacity-60"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#70706c] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 rounded-lg bg-[#f9f9f8] border border-[#e5e5e2] text-[#111110] focus:outline-none focus:border-[#b6f542] transition-colors disabled:opacity-60"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#b6f542] text-[#111110] font-semibold hover:opacity-95 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Sign In to Console</span>
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-[#e5e5e2] text-center text-xs text-[#70706c]">
          Protected by ShadowGuard Zero-Trust DLP & Supabase Auth
        </div>
      </div>
    </div>
  );
};

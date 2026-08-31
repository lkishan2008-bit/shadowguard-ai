import React, { useState } from 'react';
import { Shield, AlertCircle, Loader2, KeyRound, Eye, EyeOff, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginProps {
  onSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (authError) {
          setError(authError.message);
        } else if (data.user && !data.session) {
          setMessage(
            'Account created successfully. Please check your email to confirm your account, then sign in.'
          );
          setIsSignUp(false);
        } else {
          onSuccess?.();
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (authError) {
          setError(authError.message);
        } else {
          onSuccess?.();
        }
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
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-[#e5e5e2] shadow-sm relative z-10">

        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-[#b6f542]/20 border border-[#b6f542] flex items-center justify-center mb-3">
            <Shield className="h-6 w-6 text-[#111110]" />
          </div>

          <h2 className="text-2xl font-bold text-[#111110]">
            ShadowGuard SOC
          </h2>

          <p className="text-sm text-[#70706c] mt-1">
            Enterprise AI Security & Data Loss Prevention
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

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

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-3 py-2 pr-10 rounded-lg bg-[#f9f9f8] border border-[#e5e5e2] text-[#111110] focus:outline-none focus:border-[#b6f542] transition-colors disabled:opacity-60"
                placeholder="Enter your password"
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#70706c] hover:text-[#111110] transition-colors disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#b6f542] text-[#111110] font-semibold hover:opacity-95 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  {isSignUp ? 'Creating Account...' : 'Authenticating...'}
                </span>
              </>
            ) : (
              <>
                {isSignUp ? (
                  <UserPlus className="w-4 h-4" />
                ) : (
                  <KeyRound className="w-4 h-4" />
                )}

                <span>
                  {isSignUp
                    ? 'Create ShadowGuard Account'
                    : 'Sign In to Console'}
                </span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp((current) => !current);
              setError(null);
              setMessage(null);
            }}
            disabled={loading}
            className="text-sm font-medium text-[#111110] underline underline-offset-4 hover:opacity-70 disabled:opacity-50"
          >
            {isSignUp
              ? 'Already have an account? Sign in'
              : 'New to ShadowGuard? Create an account'}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-[#e5e5e2] text-center text-xs text-[#70706c]">
          Protected by ShadowGuard Zero-Trust DLP & Supabase Auth
        </div>

      </div>
    </div>
  );
};

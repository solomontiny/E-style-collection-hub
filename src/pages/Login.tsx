import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState(() => localStorage.getItem('eclection_remembered_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem('eclection_remembered_email'));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signIn, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/admin';

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Remember email if checked
    if (rememberMe) {
      localStorage.setItem('eclection_remembered_email', email);
    } else {
      localStorage.removeItem('eclection_remembered_email');
    }

    const { error } = await signIn(email, password);
    if (error) {
      if (error === 'Invalid login credentials') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(error || 'Login failed. Please try again.');
      }
      setLoading(false);
    }
    // Navigation handled by useEffect above when user state updates
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Check your inbox for a link to reset your password.');
        setTimeout(() => {
          setResetMode(false);
          setResetEmail('');
          setSuccess('');
        }, 3000);
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Don't render login form if already authenticated
  if (!authLoading && user) return null;

  return (
    <div className="pt-[72px] min-h-screen bg-gradient-to-br from-stone-50 to-white flex items-center">
      <div className="w-full max-w-md mx-auto px-5 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium text-stone-400 hover:text-stone-900 transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Store
        </Link>

        {resetMode ? (
          <>
            <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Reset Password</h1>
            <p className="mt-3 text-stone-500 font-light text-[15px]">Enter your email to receive a password reset link.</p>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-[13px] font-light">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-emerald-700 text-[13px] font-light">{success}</p>
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="mt-8 space-y-5">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader size={14} className="animate-spin" />}
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <p className="mt-6 text-center text-[13px] text-stone-500 font-light">
              Remember your password?{' '}
              <button
                onClick={() => setResetMode(false)}
                className="text-stone-900 font-medium border-b border-stone-900 pb-0.5 hover:text-stone-600 transition-colors"
              >
                Sign In
              </button>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Welcome Back</h1>
            <p className="mt-3 text-stone-500 font-light text-[15px]">Sign in to your account to continue.</p>

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-[13px] font-light">{error}</p>
              </div>
            )}

            {success && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3">
                <CheckCircle size={16} className="text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-emerald-700 text-[13px] font-light">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-stone-300 text-stone-900"
                    disabled={loading}
                  />
                  <span className="text-[13px] text-stone-600 font-light">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-[13px] text-stone-500 hover:text-stone-900 transition-colors font-light"
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <Loader size={14} className="animate-spin" />}
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <p className="mt-8 text-center text-[13px] text-stone-400 font-light">
              Don't have an account?{' '}
              <Link to="/register" className="text-stone-900 font-medium border-b border-stone-900 pb-0.5 hover:text-stone-600 transition-colors">
                Create one
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

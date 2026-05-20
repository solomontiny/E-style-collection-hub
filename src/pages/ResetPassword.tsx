import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Verify reset token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setIsValid(false);
        setError('Invalid reset link. Please request a new one.');
      }
    };
    verifyToken();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to reset password. Please try again.');
      } else {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isValid) {
    return (
      <div className="pt-[72px] min-h-screen bg-gradient-to-br from-stone-50 to-white flex items-center">
        <div className="w-full max-w-md mx-auto px-5 py-16">
          <Link to="/" className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium text-stone-400 hover:text-stone-900 transition-colors mb-10">
            <ArrowLeft size={14} /> Back to Store
          </Link>
          <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Reset Link Invalid</h1>
          <p className="mt-3 text-stone-500 font-light text-[15px]">This password reset link has expired or is invalid.</p>
          <Link to="/login" className="btn-primary w-full mt-8 text-center">Request New Reset Link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] min-h-screen bg-gradient-to-br from-stone-50 to-white flex items-center">
      <div className="w-full max-w-md mx-auto px-5 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium text-stone-400 hover:text-stone-900 transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Store
        </Link>

        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Create New Password</h1>
        <p className="mt-3 text-stone-500 font-light text-[15px]">Enter a new password for your account.</p>

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
            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="At least 8 characters"
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

          <div>
            <label className="block text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-2 font-semibold">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-field pr-10"
                placeholder="Confirm your new password"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
                disabled={loading}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50 flex items-center justify-center gap-2">
            {loading && <Loader size={14} className="animate-spin" />}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-stone-500 font-light">
          Remember your password?{' '}
          <Link to="/login" className="text-stone-900 font-medium border-b border-stone-900 pb-0.5 hover:text-stone-600 transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

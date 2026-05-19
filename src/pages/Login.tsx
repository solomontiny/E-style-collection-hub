import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      setError(error === 'Invalid login credentials' ? 'Invalid email or password.' : error);
      setLoading(false);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="pt-[72px] min-h-screen bg-white flex items-center">
      <div className="w-full max-w-md mx-auto px-5 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium text-stone-400 hover:text-stone-900 transition-colors mb-10">
          <ArrowLeft size={14} /> Back to Store
        </Link>

        <h1 className="text-3xl font-display font-medium text-stone-900 tracking-tight">Welcome Back</h1>
        <p className="mt-3 text-stone-500 font-light text-[15px]">Sign in to your account to continue.</p>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 text-[13px] font-light">
            {error}
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
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-[13px] text-stone-400 font-light">
          Don't have an account?{' '}
          <Link to="/register" className="text-stone-900 font-medium border-b border-stone-900 pb-0.5 hover:text-stone-600 transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

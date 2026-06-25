import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import Logo from './Logo';
import type { CurrencyCode } from '../hooks/useCurrency';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Customer Service' },
];

const CURRENCY_OPTIONS: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: 'NGN', symbol: '₦', label: 'NGN' },
  { code: 'USD', symbol: '$', label: 'USD' },
  { code: 'GBP', symbol: '£', label: 'GBP' },
  { code: 'JPY', symbol: '¥', label: 'JPY' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const { itemCount, toggleCart } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { currency, setCurrency, info } = useCurrency();
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setCurrencyOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
      if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) setCurrencyOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isTransparent = !scrolled && isHome;
  const textClass = isTransparent ? 'text-white' : 'text-stone-900';
  const bgClass = scrolled
    ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
    : isHome ? 'bg-transparent' : 'bg-white border-b border-stone-100';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgClass}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 hover:opacity-85 transition-opacity">
              <Logo textColor={textClass} size="md" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative text-[11px] tracking-[0.18em] uppercase font-medium transition-colors duration-200 group ${
                    location.pathname === to
                      ? isTransparent ? 'text-amber-300' : 'text-amber-600'
                      : textClass
                  }`}
                >
                  {label}
                  <span className={`absolute -bottom-0.5 left-0 h-px bg-current transition-all duration-300 ${
                    location.pathname === to ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Currency */}
              <div ref={currencyRef} className="relative hidden sm:block">
                <button
                  onClick={() => { setCurrencyOpen(!currencyOpen); setUserMenuOpen(false); }}
                  className={`flex items-center gap-1 text-[11px] font-semibold tracking-wider px-2 py-1.5 rounded-lg hover:bg-black/5 transition-colors ${textClass}`}
                >
                  {info.symbol} {info.code} <ChevronDown size={11} className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>
                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-stone-100 rounded-xl shadow-xl py-1 min-w-[110px] z-50">
                    {CURRENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => { setCurrency(opt.code); setCurrencyOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium tracking-wider transition-colors ${
                          currency === opt.code ? 'text-amber-600 bg-amber-50' : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {opt.symbol} {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User Menu */}
              {user ? (
                <div ref={userMenuRef} className="relative">
                  <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setCurrencyOpen(false); }}
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors hover:bg-black/5 ${textClass}`}
                  >
                    <User size={17} />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-stone-100 rounded-xl shadow-xl w-52 py-2 z-50">
                      <div className="px-4 py-2 border-b border-stone-100 mb-1">
                        <p className="text-xs font-semibold text-stone-900 truncate">{user.email}</p>
                        {isAdmin && <p className="text-[10px] text-amber-600 font-semibold mt-0.5">Admin</p>}
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          <Settings size={13} /> Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={13} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors ${textClass}`}
                >
                  <User size={17} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => toggleCart(true)}
                className={`relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors ${textClass}`}
              >
                <ShoppingBag size={17} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-black/5 transition-colors ${textClass}`}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            {/* Mobile Header */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-stone-100">
              <Logo textColor="text-stone-900" size="sm" />
              <button onClick={() => setMobileOpen(false)} className="p-2 text-stone-400 hover:text-stone-600">
                <X size={18} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 px-4 py-5 space-y-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === to
                      ? 'bg-amber-50 text-amber-700'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {isAdmin && (
                <Link to="/admin" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </nav>

            {/* Mobile Currency + Auth */}
            <div className="border-t border-stone-100 px-4 py-4 space-y-2">
              <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase px-3 mb-2">Currency</p>
              <div className="flex flex-wrap gap-2 px-1">
                {CURRENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => setCurrency(opt.code)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      currency === opt.code ? 'bg-amber-500 text-white border-amber-500' : 'text-stone-600 border-stone-200'
                    }`}
                  >
                    {opt.symbol} {opt.label}
                  </button>
                ))}
              </div>
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              ) : (
                <Link to="/login" className="block px-3 py-2.5 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

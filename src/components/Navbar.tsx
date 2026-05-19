import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useCurrency } from '../hooks/useCurrency';
import type { CurrencyCode } from '../hooks/useCurrency';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
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
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const { user, isAdmin, signOut } = useAuth();
  const { currency, setCurrency, info } = useCurrency();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCurrencyOpen(false);
  }, [location.pathname]);

  const textColor = scrolled || !isHome ? 'text-stone-900' : 'text-white';
  const bgColor = scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)]' : 'bg-transparent';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgColor}`}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">
            <Link to="/" className={`text-xl sm:text-2xl font-display font-medium tracking-[0.2em] uppercase ${textColor} transition-colors duration-300`}>
              Eclection
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-[11px] tracking-[0.18em] uppercase font-medium ${textColor} transition-colors duration-300 group`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Currency Switcher */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className={`flex items-center gap-1 text-[11px] tracking-wider font-medium ${textColor} transition-colors duration-300`}
                >
                  {info.symbol} {info.code} <ChevronDown size={12} />
                </button>
                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border border-stone-100 shadow-xl rounded-lg py-1 min-w-[100px] animate-fade-down z-50">
                    {CURRENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => { setCurrency(opt.code); setCurrencyOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-[12px] tracking-wider transition-colors ${
                          currency === opt.code ? 'text-stone-900 font-semibold bg-stone-50' : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50'
                        }`}
                      >
                        {opt.symbol} {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Auth */}
              {user ? (
                <div className="relative group">
                  <button className={`flex items-center gap-1.5 ${textColor} transition-colors duration-300`}>
                    <User size={18} strokeWidth={1.5} />
                    {isAdmin && <span className="hidden sm:inline text-[9px] tracking-wider uppercase bg-brand-600 text-white px-1.5 py-0.5 rounded">Admin</span>}
                  </button>
                  <div className="absolute right-0 top-full mt-2 bg-white border border-stone-100 shadow-xl rounded-lg py-1 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-[12px] font-medium text-stone-900 truncate">{user.email}</p>
                      <p className="text-[10px] text-stone-400 mt-0.5">{isAdmin ? 'Administrator' : 'Customer'}</p>
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-2.5 text-[12px] text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors">
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login" className={`${textColor} transition-colors duration-300 hover:opacity-70`} aria-label="Login">
                  <User size={18} strokeWidth={1.5} />
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={() => toggleCart(true)}
                className={`relative ${textColor} transition-colors duration-300 hover:opacity-70`}
                aria-label="Open cart"
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-brand-600 text-white text-[9px] font-semibold rounded-full flex items-center justify-center px-1">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                className={`lg:hidden ${textColor} transition-colors duration-300`}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-stone-100">
              <span className="text-lg font-display tracking-[0.2em] uppercase text-stone-900">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <nav className="p-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block py-3 text-[11px] tracking-[0.18em] uppercase font-medium transition-colors ${
                    location.pathname === link.to ? 'text-stone-900' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-6 pt-2 border-t border-stone-100">
              <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3 font-semibold">Currency</p>
              <div className="flex flex-wrap gap-2">
                {CURRENCY_OPTIONS.map((opt) => (
                  <button
                    key={opt.code}
                    onClick={() => { setCurrency(opt.code); setMobileOpen(false); }}
                    className={`px-3 py-1.5 text-[11px] tracking-wider border transition-all ${
                      currency === opt.code ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-500'
                    }`}
                  >
                    {opt.symbol} {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {user && (
              <div className="px-6 pt-4 border-t border-stone-100 mt-4">
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block py-2 text-[11px] tracking-[0.15em] uppercase font-medium text-brand-600">
                    Admin Dashboard
                  </Link>
                )}
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="py-2 text-[11px] tracking-[0.15em] uppercase font-medium text-red-500">
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

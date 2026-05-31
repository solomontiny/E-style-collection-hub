import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X, User, ChevronDown } from 'lucide-react';
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
  const [currencyOpen, setCurrencyOpen] = useState(false);

  const { itemCount, toggleCart } = useCart();
  const { user, signOut } = useAuth();
  const { setCurrency, info } = useCurrency();
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
  const bgColor = scrolled
    ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)]'
    : 'bg-transparent';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgColor}`}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* LOGO */}
            <Link to="/" className="transition-opacity duration-300 hover:opacity-80">
              <Logo textColor={textColor} />
            </Link>

            {/* NAV LINKS */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative text-[11px] tracking-[0.18em] uppercase font-medium ${textColor} transition-colors duration-300 group`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-300 ${
                      location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* ✅ FIXED ADMIN LINK (TEMP SAFE VERSION) */}
              {user && (
                <Link
                  to="/admin/products"
                  className="text-[10px] px-2 py-1 border rounded opacity-70 hover:opacity-100"
                >
                  Admin
                </Link>
              )}

              {/* Currency */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className={`flex items-center gap-1 text-[11px] tracking-wider font-medium ${textColor}`}
                >
                  {info.symbol} {info.code} <ChevronDown size={12} />
                </button>

                {currencyOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white border shadow-xl rounded-lg py-1 min-w-[100px] z-50">
                    {CURRENCY_OPTIONS.map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          setCurrency(opt.code);
                          setCurrencyOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-[12px] hover:bg-stone-50"
                      >
                        {opt.symbol} {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AUTH */}
              {user ? (
                <div className="relative group">
                  <button className={`flex items-center gap-1.5 ${textColor}`}>
                    <User size={18} />
                  </button>

                  <div className="absolute right-0 top-full mt-2 bg-white border shadow-xl rounded-lg py-1 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">

                    <div className="px-4 py-2 border-b">
                      <p className="text-[12px] truncate">{user.email}</p>
                    </div>

                    {/* ADMIN LINKS */}
                    {user && (
                      <>
                        <Link to="/admin/products" className="block px-4 py-2 text-[12px] hover:bg-stone-50">
                          Products
                        </Link>
                        <Link to="/admin/products/add" className="block px-4 py-2 text-[12px] hover:bg-stone-50">
                          Add Product
                        </Link>
                      </>
                    )}

                    <button
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-[12px] text-red-500 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <User size={18} />
                </Link>
              )}

              {/* CART */}
              <button onClick={() => toggleCart(true)} className="relative">
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-brand-600 text-white text-[9px] rounded-full px-1">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* MOBILE MENU */}
              <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />

          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white p-6">

            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm"
              >
                {link.label}
              </Link>
            ))}

            {/* ADMIN MOBILE */}
            {user && (
              <Link
                to="/admin/products"
                onClick={() => setMobileOpen(false)}
                className="block py-3 text-sm font-semibold text-blue-600"
              >
                Admin Products
              </Link>
            )}

          </div>
        </div>
      )}
    </>
  );
}
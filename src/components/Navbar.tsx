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
  const { user, isAdmin, signOut } = useAuth();
  const { setCurrency, info } = useCurrency();
  const location = useLocation();

  const isHome = location.pathname === '/';

  // 🚨 DEBUG AUTH STATE
  useEffect(() => {
    console.log("🔥 AUTH DEBUG STATE:", {
      user,
      isAdmin
    });
  }, [user, isAdmin]);

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
            <Link to="/" className="hover:opacity-80">
              <Logo textColor={textColor} />
            </Link>

            {/* NAV */}
            <nav className="hidden lg:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[11px] uppercase tracking-[0.18em] font-medium ${textColor}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4">

              {/* 🚨 TEMP ADMIN DEBUG LINK (ALWAYS SHOWS IF USER EXISTS OR NOT) */}
              {user && (
                <Link
                  to="/admin/products"
                  className="text-[10px] px-2 py-1 border rounded opacity-80 hover:opacity-100"
                >
                  Admin
                </Link>
              )}

              {/* 🔥 TEMP SAFETY NET (REMOVE LATER) */}
              {!user && (
                <Link
                  to="/login"
                  className="text-[10px] px-2 py-1 border rounded opacity-80"
                >
                  Login
                </Link>
              )}

              {/* Currency */}
              <div className="relative hidden sm:block">
                <button onClick={() => setCurrencyOpen(!currencyOpen)}>
                  {info.symbol} {info.code}
                </button>
              </div>

              {/* AUTH ICON */}
              {user ? (
                <div className="relative">
                  <button>
                    <User />
                  </button>

                  <div className="absolute right-0 bg-white border shadow-md">
                    <div className="p-2 text-xs">{user.email}</div>

                    <Link to="/admin/products" className="block px-3 py-2 text-xs">
                      Admin Products
                    </Link>

                    <Link to="/admin/products/add" className="block px-3 py-2 text-xs">
                      Add Product
                    </Link>

                    <button onClick={signOut} className="px-3 py-2 text-xs text-red-500">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <User />
                </Link>
              )}

              {/* CART */}
              <button onClick={() => toggleCart(true)}>
                <ShoppingBag />
                {itemCount > 0 && (
                  <span>{itemCount}</span>
                )}
              </button>

              {/* MOBILE */}
              <button onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 lg:hidden">
          <div className="absolute right-0 top-0 w-72 h-full bg-white p-5">

            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}

            {user && (
              <Link to="/admin/products">
                Admin Products
              </Link>
            )}

          </div>
        </div>
      )}
    </>
  );
}
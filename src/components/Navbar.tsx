import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const textColor = scrolled || !isHome ? 'text-stone-900' : 'text-white';
  const bgColor = scrolled ? 'bg-white/95 backdrop-blur-lg shadow-[0_1px_0_0_rgba(0,0,0,0.05)]' : 'bg-transparent';

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${bgColor}`}>
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <Link to="/" className={`text-xl sm:text-2xl font-extralight tracking-[0.35em] uppercase ${textColor} transition-colors duration-300`}>
              Eclection
            </Link>

            {/* Desktop Nav */}
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

            {/* Right Actions */}
            <div className="flex items-center gap-4">
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

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in">
            <div className="flex items-center justify-between px-6 h-[72px] border-b border-stone-100">
              <span className="text-lg font-extralight tracking-[0.3em] uppercase text-stone-900">Menu</span>
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
          </div>
        </div>
      )}
    </>
  );
}

import { Link } from 'react-router-dom';

const CATEGORIES = [
  { label: 'Dresses', cat: 'dresses' },
  { label: 'Outerwear', cat: 'outerwear' },
  { label: 'Bags', cat: 'bags' },
  { label: 'Shoes', cat: 'shoes' },
  { label: 'Tops', cat: 'tops' },
  { label: 'Bottoms', cat: 'bottoms' },
];

const COMPANY_LINKS = [
  { to: '/about', label: 'Our Story' },
  { to: '/contact', label: 'Contact' },
  { to: '/shop', label: 'Collections' },
];

export default function Footer() {
  return (
    <footer className="bg-stone-950 text-stone-400">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="text-xl font-extralight tracking-[0.35em] uppercase text-white">
              Eclection
            </Link>
            <p className="mt-5 text-sm font-light leading-relaxed max-w-xs">
              Curating exceptional fashion for the discerning individual. Where artistry meets elegance.
            </p>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white mb-5 font-semibold">Collections</h4>
            <ul className="space-y-2.5">
              {CATEGORIES.map((item) => (
                <li key={item.cat}>
                  <Link
                    to={`/shop?category=${item.cat}`}
                    className="text-sm font-light hover:text-white transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white mb-5 font-semibold">Company</h4>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm font-light hover:text-white transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-white mb-5 font-semibold">Newsletter</h4>
            <p className="text-sm font-light mb-4 leading-relaxed">Receive exclusive updates on new collections and events.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 bg-stone-900 border border-stone-800 px-4 py-3 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-stone-600 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-stone-950 px-5 py-3 text-[10px] tracking-[0.15em] uppercase font-semibold hover:bg-stone-200 transition-colors flex-shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-800/60">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-light tracking-wider text-stone-500">
            &copy; {new Date().getFullYear()} Eclection. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Shipping'].map((item) => (
              <button key={item} className="text-[11px] font-light tracking-wider text-stone-500 hover:text-stone-300 transition-colors">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

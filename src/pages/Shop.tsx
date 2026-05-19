import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

const CATEGORIES = ['All', 'Dresses', 'Outerwear', 'Bags', 'Shoes', 'Tops', 'Bottoms'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = searchParams.get('category') || 'all';
  const activeCategory = categoryParam === 'all' ? 'All' : categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1);

  useEffect(() => {
    setLoading(true);
    let query = supabase.from('products').select('*');
    if (categoryParam !== 'all') query = query.eq('category', categoryParam);
    query.then(({ data }) => {
      setProducts(data || []);
      setLoading(false);
    });
  }, [categoryParam]);

  const sorted = useMemo(() => {
    const copy = [...products];
    switch (sort) {
      case 'price-asc': return copy.sort((a, b) => a.price - b.price);
      case 'price-desc': return copy.sort((a, b) => b.price - a.price);
      case 'name': return copy.sort((a, b) => a.name.localeCompare(b.name));
      default: return copy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [products, sort]);

  const setCategory = (cat: string) => {
    setSearchParams(cat === 'All' ? {} : { category: cat.toLowerCase() });
    setShowFilters(false);
  };

  return (
    <div className="pt-[72px]">
      <section className="relative h-[35vh] sm:h-[40vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.pexels.com/photos/769110/pexels-photo-769110.jpeg?auto=compress&cs=tinysrgb&w=1920')` }}
        >
          <div className="absolute inset-0 bg-stone-950/60" />
        </div>
        <div className="relative z-10 text-center animate-fade-in">
          <p className="section-label text-stone-300 mb-3">Collections</p>
          <h1 className="text-4xl sm:text-5xl font-display font-medium text-white tracking-tight">Shop</h1>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-10 sm:py-14">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
            <p className="text-[13px] text-stone-400 font-light">
              {loading ? 'Loading...' : `${sorted.length} product${sorted.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-[11px] tracking-[0.1em] uppercase text-stone-500 bg-transparent border-none focus:outline-none cursor-pointer font-medium"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-10">
          <aside
            className={`${
              showFilters
                ? 'fixed inset-0 z-40 bg-white p-6 overflow-y-auto lg:static lg:p-0 lg:bg-transparent lg:overflow-visible lg:block'
                : 'hidden lg:block'
            } w-full lg:w-44 flex-shrink-0`}
          >
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h3 className="text-[11px] tracking-[0.2em] uppercase font-semibold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div>
              <h3 className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-4 font-semibold">Category</h3>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setCategory(cat)}
                      className={`text-[13px] font-light transition-colors ${
                        activeCategory === cat ? 'text-stone-900 font-medium' : 'text-stone-400 hover:text-stone-700'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-stone-200 aspect-[3/4]" />
                    <div className="mt-4 h-3.5 bg-stone-200 w-3/4 rounded" />
                    <div className="mt-2 h-3.5 bg-stone-200 w-1/3 rounded" />
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-stone-400 font-light">No products found in this category.</p>
                <button onClick={() => setCategory('All')} className="mt-4 text-[11px] tracking-[0.12em] uppercase font-semibold text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 transition-colors">
                  View All Products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {sorted.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

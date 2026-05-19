import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .eq('in_stock', true)
      .limit(8)
      .then(({ data }) => {
        setFeatured(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/336372/pexels-photo-336372.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/40 to-stone-950/70" />
        </div>
        <div className="relative z-10 text-center px-5 max-w-3xl animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles size={14} className="text-brand-400" />
            <p className="section-label text-stone-300">Autumn / Winter 2025</p>
            <Sparkles size={14} className="text-brand-400" />
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight text-white tracking-tight leading-[1.05]">
            The Art of
            <br />
            <span className="font-light italic">Refined</span> Style
          </h1>
          <p className="mt-7 text-stone-300 font-light text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Discover curated collections that transcend seasons. Where craftsmanship meets contemporary elegance.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/shop" className="btn-primary bg-white text-stone-950 hover:bg-stone-100">
              Explore Collection <ArrowRight size={13} />
            </Link>
            <Link to="/about" className="btn-outline border-white/30 text-white hover:bg-white hover:text-stone-950">
              Our Story
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in animate-delay-600">
          <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-medium">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-stone-400 to-transparent" />
        </div>
      </section>

      {/* ── Brand Statement ── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <p className="section-label mb-5">Our Philosophy</p>
              <h2 className="section-title">
                Fashion that speaks
                <br />
                <span className="italic font-extralight">without shouting</span>
              </h2>
            </div>
            <div>
              <p className="text-stone-500 font-light leading-[1.8] text-[15px]">
                At Eclection, we believe true luxury lies in restraint. Each piece in our collection is selected for its
                ability to elevate the everyday, combining exceptional materials with timeless design. We curate for
                those who understand that style is not about following trends — it is about defining them.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
              >
                Learn More <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-24 sm:py-32 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="section-label mb-3">Curated Selection</p>
              <h2 className="section-title">Featured Pieces</h2>
            </div>
            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 aspect-[3/4]" />
                  <div className="mt-4 h-3.5 bg-stone-200 w-3/4 rounded" />
                  <div className="mt-2 h-3.5 bg-stone-200 w-1/3 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {featured.slice(0, 4).map((product, i) => (
                <div key={product.id} className="opacity-0 animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          <Link
            to="/shop"
            className="md:hidden flex items-center justify-center gap-2 mt-10 text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-900 border-b border-stone-900 pb-1 hover:text-stone-600 transition-colors"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── Editorial Banner ── */}
      <section className="relative h-[55vh] sm:h-[65vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&w=1920')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-5 sm:px-8 w-full">
          <div className="max-w-md">
            <p className="section-label text-stone-300 mb-4">New Arrival</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white tracking-tight leading-[1.15]">
              The Cashmere
              <br />
              <span className="italic font-light">Collection</span>
            </h2>
            <p className="mt-5 text-stone-300 font-light leading-relaxed text-[15px]">
              Wrap yourself in the finest cashmere. Sourced from the highlands, crafted for the extraordinary.
            </p>
            <Link
              to="/shop?category=outerwear"
              className="inline-flex items-center gap-2 mt-8 text-[11px] tracking-[0.15em] uppercase font-semibold text-white border-b border-white pb-1 hover:text-stone-300 hover:border-stone-300 transition-colors"
            >
              Shop Now <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Browse By</p>
            <h2 className="section-title">Categories</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { name: 'Dresses', img: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'dresses' },
              { name: 'Outerwear', img: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'outerwear' },
              { name: 'Bags', img: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'bags' },
              { name: 'Shoes', img: 'https://images.pexels.com/photos/2673014/pexels-photo-2673014.jpeg?auto=compress&cs=tinysrgb&w=600', cat: 'shoes' },
            ].map((cat) => (
              <Link
                key={cat.name}
                to={`/shop?category=${cat.cat}`}
                className="group relative overflow-hidden aspect-[3/4] card-hover"
              >
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/20 to-transparent group-hover:from-stone-950/70 transition-all duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-white text-[11px] tracking-[0.25em] uppercase font-semibold">{cat.name}</span>
                  <div className="w-8 h-px bg-white/50 mt-2 transition-all duration-500 group-hover:w-12" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 sm:py-32 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="section-label mb-3">What They Say</p>
            <h2 className="section-title">Client Voices</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                quote: 'Every piece I have purchased from Eclection has become a cornerstone of my wardrobe. The quality is simply unmatched.',
                name: 'Isabelle Moreau',
                title: 'Creative Director',
              },
              {
                quote: 'Shopping here feels like entering another world. The curation is impeccable, and the attention to detail is extraordinary.',
                name: 'Caroline Ashford',
                title: 'Architect',
              },
              {
                quote: 'I have never experienced such thoughtful service. The pieces arrive beautifully packaged, and the quality exceeds every expectation.',
                name: 'Elena Vasquez',
                title: 'Gallery Owner',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white p-8 sm:p-10 card-hover">
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-brand-500 text-sm">&#9733;</span>
                  ))}
                </div>
                <p className="text-stone-600 font-light leading-[1.8] text-[15px] italic">"{t.quote}"</p>
                <div className="mt-7 pt-6 border-t border-stone-100">
                  <p className="text-sm font-medium text-stone-900">{t.name}</p>
                  <p className="text-[11px] text-stone-400 mt-1 tracking-[0.1em] uppercase">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 sm:py-32 bg-stone-900">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 text-center">
          <p className="section-label text-stone-400 mb-4">Join the World of Eclection</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extralight text-white tracking-tight leading-[1.15]">
            Experience fashion
            <br />
            <span className="italic font-light">redefined</span>
          </h2>
          <Link to="/shop" className="btn-primary bg-white text-stone-950 hover:bg-stone-100 mt-10">
            Shop Now <ArrowRight size={13} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

const WHATSAPP_NUMBER = '2348081759542';

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(8);

      if (error) {
        console.log('Supabase error:', error);
        setFeatured([]);
      } else {
        setFeatured(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/3622627/pexels-photo-3622627.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center px-5 max-w-3xl animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles size={14} className="text-amber-400" />
            <p className="section-label text-amber-200">
              Affordable Fashion for Everyone
            </p>
            <Sparkles size={14} className="text-amber-400" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium text-white leading-[1.05]">
            E Style
            <br />
            <span className="italic font-normal">Collection</span>
          </h1>

          <p className="mt-7 text-stone-100 font-light text-base sm:text-lg max-w-lg mx-auto">
            Premium fashion for women & men. Elegance meets affordability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/shop"
              className="btn-primary bg-amber-500 text-white hover:bg-amber-600"
            >
              Shop Now <ArrowRight size={13} />
            </Link>

            <Link
              to="/about"
              className="btn-outline border-white/30 text-white hover:bg-amber-600 hover:border-amber-600"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="py-24 sm:py-32 bg-stone-50">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <div className="flex items-end justify-between mb-14">
            <div>
              <p className="section-label mb-3">Curated Selection</p>
              <h2 className="section-title">Featured Pieces</h2>
            </div>

            <Link
              to="/shop"
              className="hidden md:flex items-center gap-2 text-[11px] uppercase font-semibold border-b border-stone-900 pb-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 aspect-[3/4]" />
                  <div className="h-3 mt-4 bg-stone-200 w-3/4" />
                  <div className="h-3 mt-2 bg-stone-200 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {featured.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-stone-900 text-center text-white">
        <h2 className="text-4xl font-display">
          Experience fashion redefined
        </h2>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          <Link
            to="/shop"
            className="bg-white text-black px-6 py-3 rounded"
          >
            Shop Now
          </Link>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
              'Hello! I want to inquire about your products.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white px-6 py-3 rounded flex items-center gap-2"
          >
            <MessageCircle size={16} /> WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
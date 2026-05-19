import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Check, Heart, Share2, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../hooks/useCurrency';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

const WHATSAPP_NUMBER = '2348000000000';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState<Product[]>([]);
  const { addItem } = useCart();
  const { format } = useCurrency();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo(0, 0);
    supabase.from('products').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      setProduct(data);
      if (data) {
        setSelectedSize(data.sizes[0] || '');
        setSelectedColor(data.colors[0] || '');
        supabase.from('products').select('*').eq('category', data.category).neq('id', data.id).limit(4)
          .then(({ data: rel }) => setRelated(rel || []));
      }
      setLoading(false);
    });
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    addItem(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMsg = `Hello Eclection! I am interested in: ${product?.name} (${[selectedSize, selectedColor].filter(Boolean).join('/')}) - ${format(product?.price || 0)}`;

  if (loading) {
    return (
      <div className="pt-[72px] max-w-[1400px] mx-auto px-5 sm:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="animate-pulse bg-stone-100 aspect-[3/4]" />
          <div className="space-y-4">
            <div className="h-4 bg-stone-100 w-20 rounded" />
            <div className="h-10 bg-stone-100 w-3/4 rounded" />
            <div className="h-6 bg-stone-100 w-24 rounded" />
            <div className="h-24 bg-stone-100 w-full rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-[72px] min-h-[60vh] flex items-center justify-center">
        <div className="text-center px-5">
          <p className="text-stone-400 font-light mb-6">Product not found.</p>
          <Link to="/shop" className="btn-outline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const allImages = [product.image_url, ...product.images.filter((img) => img !== product.image_url)];

  return (
    <div className="pt-[72px]">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium text-stone-400 hover:text-stone-900 transition-colors mb-8">
          <ArrowLeft size={14} /> Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-3">
            <div className="bg-stone-50 aspect-[3/4] overflow-hidden animate-fade-in">
              <img src={allImages[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-20 overflow-hidden border-2 transition-all duration-300 ${selectedImage === i ? 'border-stone-900' : 'border-transparent hover:border-stone-300'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:py-4">
            <p className="section-label mb-3">{product.category}</p>
            <h1 className="text-3xl sm:text-4xl font-display font-medium text-stone-900 tracking-tight">{product.name}</h1>
            <p className="text-2xl font-light text-stone-900 mt-4">{format(product.price)}</p>

            <div className="flex items-center gap-4 mt-5">
              <button className="text-stone-400 hover:text-stone-900 transition-colors" aria-label="Add to wishlist"><Heart size={18} strokeWidth={1.5} /></button>
              <button className="text-stone-400 hover:text-stone-900 transition-colors" aria-label="Share"><Share2 size={18} strokeWidth={1.5} /></button>
            </div>

            <div className="w-full h-px bg-stone-100 my-7" />
            <p className="text-stone-500 font-light leading-[1.8] text-[15px]">{product.description}</p>

            {product.colors.length > 0 && (
              <div className="mt-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3 font-semibold">Color: <span className="text-stone-700 normal-case tracking-normal">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button key={color} onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2.5 text-[11px] tracking-wider border transition-all duration-300 ${selectedColor === color ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}
                    >{color}</button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mt-6">
                <p className="text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-3 font-semibold">Size: <span className="text-stone-700 normal-case tracking-normal">{selectedSize}</span></p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 flex items-center justify-center text-[12px] border transition-all duration-300 ${selectedSize === size ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 text-stone-500 hover:border-stone-400'}`}
                    >{size}</button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={handleAdd} disabled={!product.in_stock}
              className={`w-full mt-8 flex items-center justify-center gap-3 py-4 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 ${
                added ? 'bg-emerald-700 text-white' : product.in_stock ? 'bg-stone-900 text-white hover:bg-stone-700 active:scale-[0.98]' : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {added ? <><Check size={16} /> Added to Bag</> : <><ShoppingBag size={16} /> {product.in_stock ? 'Add to Bag' : 'Sold Out'}</>}
            </button>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-3 flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-[0.15em] uppercase font-medium text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle size={14} /> Inquire on WhatsApp
            </a>

            <div className="mt-8 pt-8 border-t border-stone-100 space-y-3">
              {[
                { label: 'SKU', value: `ECL-${product.id.slice(0, 8).toUpperCase()}` },
                { label: 'Category', value: product.category.charAt(0).toUpperCase() + product.category.slice(1) },
                { label: 'Availability', value: product.in_stock ? 'In Stock' : 'Sold Out' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-[13px]">
                  <span className="text-stone-400 font-light">{row.label}</span>
                  <span className={`font-light ${row.label === 'Availability' ? (product.in_stock ? 'text-emerald-700' : 'text-red-600') : 'text-stone-600'}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20 sm:mt-28">
            <div className="mb-10">
              <p className="section-label mb-3">You May Also Like</p>
              <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 tracking-tight">Related Pieces</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

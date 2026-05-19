import { Link } from 'react-router-dom';
import type { Product } from '../types';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-stone-50 aspect-[3/4]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          loading="lazy"
        />
        {!product.in_stock && (
          <div className="absolute inset-0 bg-stone-900/30 flex items-center justify-center">
            <span className="text-white text-[10px] tracking-[0.25em] uppercase font-semibold bg-stone-900/80 px-5 py-2.5">
              Sold Out
            </span>
          </div>
        )}
        {product.featured && product.in_stock && (
          <div className="absolute top-3 left-3">
            <span className="text-[9px] tracking-[0.2em] uppercase font-semibold bg-white/90 text-stone-900 px-3 py-1.5 backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
          <span className="block text-center text-[10px] tracking-[0.2em] uppercase font-semibold text-white bg-stone-900/80 py-3 backdrop-blur-sm">
            Quick View
          </span>
        </div>
      </div>
      <div className="mt-3.5">
        <h3 className="text-[13px] font-medium text-stone-800 tracking-wide truncate">{product.name}</h3>
        <p className="text-[13px] font-medium text-stone-900 mt-1">${product.price.toLocaleString()}</p>
      </div>
    </Link>
  );
}

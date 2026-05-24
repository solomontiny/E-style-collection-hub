import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '../types';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  // 🧠 SAFE IMAGE FALLBACK (THIS FIXES YOUR MAIN ISSUE)
  const image =
    (product as any).image_url ||
    (product as any).image ||
    'https://via.placeholder.com/600';

  // 💰 SAFE PRICE (FIXS NULL ISSUE)
  const price = Number((product as any).price || 0);

  // 📦 SAFE STOCK
  const inStock =
    (product as any).in_stock ?? (product as any).stock > 0;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* STOCK BADGE */}
        {!inStock && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] px-2 py-1 rounded">
            Sold Out
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm font-medium text-stone-900 truncate">
          {product.name}
        </h3>

        {/* PRICE */}
        <p className="mt-1 text-sm font-light text-stone-600">
          ₦{price.toLocaleString()}
        </p>

        {/* CTA */}
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[11px] text-stone-400">
            View product
          </span>

          <ShoppingBag
            size={16}
            className="text-stone-400 group-hover:text-stone-900 transition-colors"
          />
        </div>
      </div>
    </Link>
  );
}
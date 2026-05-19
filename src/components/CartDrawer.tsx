import { X, Minus, Plus, ArrowRight, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../hooks/useCurrency';

const WHATSAPP_NUMBER = '2348081759542';

export default function CartDrawer() {
  const { items, isOpen, toggleCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const { format } = useCurrency();

  if (!isOpen) return null;

  const whatsappItems = items.map((i) => `${i.product.name} (${[i.size, i.color].filter(Boolean).join('/')}) x${i.quantity}`).join(', ');
  const whatsappMsg = `Hello Eclection! I would like to order: ${whatsappItems}. Total: ${format(total)}`;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50" onClick={() => toggleCart(false)} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl animate-slide-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-100">
          <h2 className="text-[11px] tracking-[0.2em] uppercase font-semibold text-stone-900">
            Shopping Bag <span className="text-stone-400 font-normal ml-1">({itemCount})</span>
          </h2>
          <button onClick={() => toggleCart(false)} className="text-stone-400 hover:text-stone-900 transition-colors p-1" aria-label="Close cart">
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-full bg-stone-50 flex items-center justify-center mb-5">
                <span className="text-2xl font-light text-stone-300">0</span>
              </div>
              <p className="text-stone-400 font-light text-sm mb-6">Your bag is empty</p>
              <Link to="/shop" onClick={() => toggleCart(false)} className="btn-outline text-stone-600 border-stone-300 hover:bg-stone-900 hover:text-white hover:border-stone-900">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="px-6 py-5 divide-y divide-stone-100">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4 py-5 first:pt-2">
                  <Link to={`/product/${item.product.id}`} onClick={() => toggleCart(false)} className="w-[88px] h-[110px] flex-shrink-0 bg-stone-50 overflow-hidden group">
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link to={`/product/${item.product.id}`} onClick={() => toggleCart(false)} className="text-sm font-medium text-stone-900 truncate block hover:text-stone-600 transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-[11px] text-stone-400 mt-1 tracking-wide">
                        {[item.size, item.color].filter(Boolean).join(' / ')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200">
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-medium text-stone-900 border-x border-stone-200">
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-900 transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-stone-900">{format(item.product.price * item.quantity)}</p>
                    </div>
                    <button onClick={() => removeItem(item.product.id, item.size, item.color)} className="text-[10px] tracking-[0.15em] uppercase text-stone-400 hover:text-stone-900 transition-colors mt-1 self-start">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-stone-100 px-6 py-6 bg-stone-50/50">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-900">Subtotal</span>
              <span className="text-lg font-medium text-stone-900">{format(total)}</span>
            </div>
            <p className="text-[11px] text-stone-400 mb-5">Shipping calculated at checkout</p>
            <Link to="/checkout" onClick={() => toggleCart(false)} className="btn-primary w-full">
              Checkout <ArrowRight size={13} />
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMsg)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-[11px] tracking-[0.12em] uppercase font-medium text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              <MessageCircle size={14} /> Order via WhatsApp
            </a>
            <button onClick={() => toggleCart(false)} className="w-full mt-2 py-2.5 text-[11px] tracking-[0.12em] uppercase text-stone-400 hover:text-stone-700 transition-colors font-medium">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [form, setForm] = useState({
    email: '', full_name: '', address: '', city: '', postal_code: '', country: '',
  });

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const { data: order, error } = await supabase
        .from('orders')
        .insert({ ...form, total, status: 'pending' })
        .select()
        .maybeSingle();

      if (error) throw error;

      if (order) {
        await supabase.from('order_items').insert(
          items.map((item) => ({
            order_id: order.id,
            product_id: item.product.id,
            product_name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            size: item.size,
            color: item.color,
          }))
        );
      }
      clearCart();
      setComplete(true);
    } catch {
      const localOrders = JSON.parse(localStorage.getItem('eclection_orders') || '[]');
      localOrders.push({
        id: crypto.randomUUID(),
        ...form,
        total,
        status: 'pending',
        items: items.map((i) => ({
          product_name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
          size: i.size,
          color: i.color,
        })),
        created_at: new Date().toISOString(),
      });
      localStorage.setItem('eclection_orders', JSON.stringify(localOrders));
      clearCart();
      setComplete(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (complete) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-5 animate-scale-in">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-emerald-700" />
          </div>
          <h1 className="text-2xl font-light text-stone-900 tracking-tight">Order Confirmed</h1>
          <p className="mt-3 text-stone-500 font-light">Thank you for your purchase. You will receive a confirmation shortly.</p>
          <Link to="/shop" className="btn-primary mt-8">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-5">
          <p className="text-stone-400 font-light mb-6">Your bag is empty.</p>
          <Link to="/shop" className="btn-primary">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] bg-white min-h-screen">
      <div className="max-w-[1100px] mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[11px] tracking-[0.12em] uppercase font-medium text-stone-400 hover:text-stone-900 transition-colors mb-8">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>

        <h1 className="text-3xl sm:text-4xl font-light text-stone-900 tracking-tight mb-12">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3 space-y-8">
              <div>
                <h2 className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-4 font-semibold">Contact</h2>
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <h2 className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-4 font-semibold">Shipping Address</h2>
                <div className="space-y-4">
                  <input type="text" required placeholder="Full name" value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="input-field" />
                  <input type="text" required placeholder="Address" value={form.address} onChange={(e) => update('address', e.target.value)} className="input-field" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" required placeholder="City" value={form.city} onChange={(e) => update('city', e.target.value)} className="input-field" />
                    <input type="text" required placeholder="Postal code" value={form.postal_code} onChange={(e) => update('postal_code', e.target.value)} className="input-field" />
                  </div>
                  <input type="text" required placeholder="Country" value={form.country} onChange={(e) => update('country', e.target.value)} className="input-field" />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <div className="bg-stone-50 p-6 sm:p-8 sticky top-24">
                <h2 className="text-[10px] tracking-[0.25em] uppercase text-stone-400 mb-6 font-semibold">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-3">
                      <div className="w-14 h-16 bg-stone-200 flex-shrink-0 overflow-hidden">
                        <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] text-stone-900 font-medium truncate">{item.product.name}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {[item.size, item.color].filter(Boolean).join(' / ')} &middot; Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-[13px] text-stone-900 font-medium">${(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-stone-200 pt-4 space-y-2">
                  <div className="flex justify-between text-[13px]">
                    <span className="text-stone-500 font-light">Subtotal</span>
                    <span className="text-stone-900 font-light">${total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[13px]">
                    <span className="text-stone-500 font-light">Shipping</span>
                    <span className="text-stone-900 font-light">Complimentary</span>
                  </div>
                </div>
                <div className="border-t border-stone-200 mt-4 pt-4 flex justify-between">
                  <span className="text-[13px] font-semibold text-stone-900">Total</span>
                  <span className="text-lg font-medium text-stone-900">${total.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full mt-6 disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

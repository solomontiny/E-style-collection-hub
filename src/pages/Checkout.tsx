import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, MessageCircle } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../hooks/useCurrency';
import { supabase } from '../lib/supabase';

const WHATSAPP_NUMBER = '2348081759542';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { format } = useCurrency();

  const [submitting, setSubmitting] = useState(false);
  const [complete, setComplete] = useState(false);

  const [form, setForm] = useState({
    email: '',
    full_name: '',
    address: '',
    city: '',
    postal_code: '',
    country: '',
    phone: '',
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setSubmitting(true);

    try {
      // 1. CREATE ORDER (MAIN CONNECTOR TO ADMIN)
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            ...form,
            total,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. CREATE ORDER ITEMS (IMPORTANT FOR ADMIN VIEW)
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        size: item.size,
        color: item.color,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Optional stock reduction
      for (const item of items) {
        const currentQty = (item.product.stock_quantity ?? 0);
        if (currentQty > 0) {
          await supabase
            .from('products')
            .update({ stock_quantity: Math.max(0, currentQty - item.quantity) })
            .eq('id', item.product.id);
        }
      }

      // 4. CLEAR CART + COMPLETE
      clearCart();
      setComplete(true);
    } catch (error) {
      console.log('Supabase failed, using local fallback');

      const localOrders = JSON.parse(
        localStorage.getItem('eclection_orders') || '[]'
      );

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

      localStorage.setItem(
        'eclection_orders',
        JSON.stringify(localOrders)
      );

      clearCart();
      setComplete(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (complete) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-5">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-emerald-700" />
          </div>

          <h1 className="text-2xl font-medium">Order Confirmed</h1>

          <p className="mt-3 text-stone-500">
            Your order has been sent to admin dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Link to="/shop" className="btn-primary">
              Continue Shopping
            </Link>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello, I just placed an order. Please confirm.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <MessageCircle size={14} />
              WhatsApp Confirm
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-[72px] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Your bag is empty</p>
          <Link to="/shop" className="btn-primary mt-4 inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[72px] min-h-screen">
      <div className="max-w-[1100px] mx-auto px-5 py-10">
        <Link to="/shop" className="flex items-center gap-2 mb-8">
          <ArrowLeft size={14} />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-medium mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-5 gap-10">

            {/* FORM */}
            <div className="lg:col-span-3 space-y-5">

              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
                className="input-field"
              />

              <input
                placeholder="Full Name"
                value={form.full_name}
                onChange={(e) => update('full_name', e.target.value)}
                required
                className="input-field"
              />

              <input
                placeholder="Address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                required
                className="input-field"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  required
                  className="input-field"
                />

                <input
                  placeholder="Postal Code"
                  value={form.postal_code}
                  onChange={(e) => update('postal_code', e.target.value)}
                  required
                  className="input-field"
                />
              </div>

              <input
                placeholder="Country"
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                required
                className="input-field"
              />
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-2 bg-gray-50 p-6 sticky top-24">
              <h2 className="mb-4 font-medium">Order Summary</h2>

              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between mb-3">
                  <div>
                    <p>{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty {item.quantity}
                    </p>
                  </div>

                  <p>{format(item.product.price * item.quantity)}</p>
                </div>
              ))}

              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{format(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full mt-6"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}
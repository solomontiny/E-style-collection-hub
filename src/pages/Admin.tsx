import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, DollarSign, Plus, Pencil, Trash2, X, BarChart3, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Order, OrderItem } from '../types';

type Tab = 'products' | 'orders' | 'summary';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  processing: 'bg-blue-50 text-blue-700 border-blue-200',
  shipped: 'bg-teal-50 text-teal-700 border-teal-200',
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const STATUS_BAR: Record<string, string> = {
  pending: 'bg-amber-500',
  processing: 'bg-blue-500',
  shipped: 'bg-teal-500',
  delivered: 'bg-emerald-500',
};

export default function Admin() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<(Order & { items?: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
  };

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      const { data: items } = await supabase.from('order_items').select('*');
      const withItems = data.map((order) => ({
        ...order,
        items: (items || []).filter((i) => i.order_id === order.id),
      }));
      setOrders(withItems);
    } else {
      const local = JSON.parse(localStorage.getItem('eclection_orders') || '[]');
      setOrders(local);
    }
    setLoading(false);
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <div className="pt-[72px] bg-stone-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light text-stone-900 tracking-tight">Dashboard</h1>
            <p className="text-[13px] text-stone-400 font-light mt-1">Manage your store</p>
          </div>
          <Link to="/" className="btn-ghost text-stone-400">
            View Store
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {[
            { icon: DollarSign, label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
            { icon: ShoppingBag, label: 'Orders', value: totalOrders.toString(), color: 'text-blue-700 bg-blue-50 border-blue-100' },
            { icon: Package, label: 'Pending', value: pendingOrders.toString(), color: 'text-amber-700 bg-amber-50 border-amber-100' },
            { icon: TrendingUp, label: 'Avg. Order', value: `$${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, color: 'text-teal-700 bg-teal-50 border-teal-100' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white p-5 border ${stat.color.split(' ').slice(2).join(' ')} rounded-lg`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color.split(' ').slice(0, 2).join(' ')}`}>
                  <stat.icon size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-stone-400 font-semibold tracking-[0.12em] uppercase">{stat.label}</p>
                  <p className="text-xl font-medium text-stone-900 mt-0.5">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white border border-stone-200 p-1 rounded-lg w-fit">
          {(['products', 'orders', 'summary'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-[11px] tracking-[0.1em] uppercase font-semibold rounded-md transition-all duration-200 ${
                tab === t ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[13px] text-stone-400 font-light">{products.length} products</p>
              <button
                onClick={() => { setEditingProduct(null); setShowForm(true); }}
                className="btn-primary py-2.5 px-5"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/50">
                      <th className="text-left text-[10px] tracking-[0.12em] uppercase text-stone-400 font-semibold px-5 py-3">Product</th>
                      <th className="text-left text-[10px] tracking-[0.12em] uppercase text-stone-400 font-semibold px-5 py-3 hidden sm:table-cell">Category</th>
                      <th className="text-left text-[10px] tracking-[0.12em] uppercase text-stone-400 font-semibold px-5 py-3">Price</th>
                      <th className="text-left text-[10px] tracking-[0.12em] uppercase text-stone-400 font-semibold px-5 py-3 hidden md:table-cell">Stock</th>
                      <th className="text-right text-[10px] tracking-[0.12em] uppercase text-stone-400 font-semibold px-5 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-stone-50/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 bg-stone-50 flex-shrink-0 overflow-hidden rounded">
                              <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[13px] text-stone-900 font-medium truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[13px] text-stone-500 font-light capitalize hidden sm:table-cell">{product.category}</td>
                        <td className="px-5 py-4 text-[13px] text-stone-900 font-medium">${product.price.toLocaleString()}</td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                            product.in_stock ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {product.in_stock ? 'In Stock' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => { setEditingProduct(product); setShowForm(true); }}
                              className="p-2 text-stone-400 hover:text-stone-900 transition-colors rounded hover:bg-stone-100"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="p-2 text-stone-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showForm && (
              <ProductForm
                product={editingProduct}
                onClose={() => { setShowForm(false); setEditingProduct(null); }}
                onSaved={() => { setShowForm(false); setEditingProduct(null); fetchProducts(); }}
              />
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {tab === 'orders' && (
          <div>
            <p className="text-[13px] text-stone-400 font-light mb-5">{orders.length} orders</p>
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white border border-stone-200 h-24 rounded-lg" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-lg p-16 text-center">
                <ShoppingBag size={32} className="mx-auto text-stone-300 mb-4" />
                <p className="text-stone-400 font-light">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-stone-200 rounded-lg p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <p className="text-[14px] font-medium text-stone-900">{order.full_name || 'Customer'}</p>
                          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[order.status] || 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[12px] text-stone-400 mt-1">{order.email}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                        {order.items && order.items.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                            {order.items.map((item) => (
                              <p key={item.id} className="text-[12px] text-stone-500 font-light">
                                {item.product_name} &middot; Qty {item.quantity} &middot; ${item.price}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[15px] font-medium text-stone-900">${(order.total || 0).toLocaleString()}</p>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="mt-2 text-[11px] border border-stone-200 px-2.5 py-1.5 rounded bg-white focus:outline-none focus:border-stone-400"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Summary Tab ── */}
        {tab === 'summary' && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {/* Revenue by Status */}
              <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-semibold mb-6">Revenue by Status</h3>
                {['pending', 'processing', 'shipped', 'delivered'].map((status) => {
                  const statusOrders = orders.filter((o) => o.status === status);
                  const statusRevenue = statusOrders.reduce((sum, o) => sum + (o.total || 0), 0);
                  const pct = totalRevenue > 0 ? (statusRevenue / totalRevenue) * 100 : 0;
                  return (
                    <div key={status} className="mb-5 last:mb-0">
                      <div className="flex justify-between text-[13px] mb-1.5">
                        <span className="text-stone-600 font-light capitalize">{status}</span>
                        <span className="text-stone-900 font-medium">${statusRevenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${STATUS_BAR[status] || 'bg-stone-400'}`}
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8">
                <h3 className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-semibold mb-6">Recent Orders</h3>
                {orders.length === 0 ? (
                  <p className="text-[13px] text-stone-400 font-light">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-[13px] text-stone-900 font-medium">{order.full_name || 'Customer'}</p>
                          <p className="text-[11px] text-stone-400">
                            {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[13px] text-stone-900 font-medium">${(order.total || 0).toLocaleString()}</p>
                          <span className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status] || 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white border border-stone-200 rounded-lg p-6 sm:p-8">
              <h3 className="text-[10px] tracking-[0.2em] uppercase text-stone-400 font-semibold mb-6">Top Products</h3>
              <div className="space-y-3">
                {products.slice(0, 5).map((product, i) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-stone-400 font-medium w-5">{i + 1}</span>
                      <div className="w-8 h-10 bg-stone-50 overflow-hidden rounded">
                        <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[13px] text-stone-900 font-medium">{product.name}</span>
                    </div>
                    <span className="text-[13px] text-stone-600 font-light">${product.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Products', value: products.length.toString(), icon: Package },
                { label: 'In Stock', value: products.filter((p) => p.in_stock).length.toString(), icon: Package },
                { label: 'Featured', value: products.filter((p) => p.featured).length.toString(), icon: BarChart3 },
                { label: 'Delivered', value: deliveredOrders.toString(), icon: ShoppingBag },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-stone-200 rounded-lg p-5 text-center">
                  <s.icon size={18} className="mx-auto text-stone-400 mb-2" />
                  <p className="text-lg font-medium text-stone-900">{s.value}</p>
                  <p className="text-[10px] text-stone-400 font-semibold tracking-[0.1em] uppercase mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Product Form Modal ── */
function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || 'dresses',
    image_url: product?.image_url || '',
    images: product?.images?.join(', ') || '',
    sizes: product?.sizes?.join(', ') || '',
    colors: product?.colors?.join(', ') || '',
    in_stock: product?.in_stock ?? true,
    featured: product?.featured ?? false,
  });
  const [saving, setSaving] = useState(false);

  const update = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price) || 0,
      category: form.category,
      image_url: form.image_url,
      images: form.images.split(',').map((s) => s.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map((s) => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      in_stock: form.in_stock,
      featured: form.featured,
    };

    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 sticky top-0 bg-white z-10">
          <h2 className="text-[11px] tracking-[0.15em] uppercase font-semibold text-stone-900">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Name</label>
            <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Price</label>
              <input type="number" step="0.01" required value={form.price} onChange={(e) => update('price', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Category</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className="input-field bg-white">
                {['dresses', 'outerwear', 'bags', 'shoes', 'tops', 'bottoms'].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Image URL</label>
            <input type="url" value={form.image_url} onChange={(e) => update('image_url', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Additional Images (comma-separated URLs)</label>
            <input type="text" value={form.images} onChange={(e) => update('images', e.target.value)} className="input-field" placeholder="url1, url2" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Sizes (comma-separated)</label>
            <input type="text" value={form.sizes} onChange={(e) => update('sizes', e.target.value)} className="input-field" placeholder="XS, S, M, L, XL" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[0.15em] uppercase text-stone-400 mb-1.5 font-semibold">Colors (comma-separated)</label>
            <input type="text" value={form.colors} onChange={(e) => update('colors', e.target.value)} className="input-field" placeholder="Black, White, Navy" />
          </div>
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.in_stock} onChange={(e) => update('in_stock', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400" />
              <span className="text-[13px] text-stone-600 font-light">In Stock</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400" />
              <span className="text-[13px] text-stone-600 font-light">Featured</span>
            </label>
          </div>
          <div className="flex gap-3 pt-3">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline flex-shrink-0">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

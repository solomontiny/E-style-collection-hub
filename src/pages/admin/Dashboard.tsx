import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package, ShoppingBag, DollarSign, TrendingUp, Plus, ArrowRight,
  ArrowUp, Clock, CheckCircle2, Truck,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import AdminLayout from "../../layouts/AdminLayout";

interface Stats {
  totalProducts: number;
  inStock: number;
  totalOrders: number;
  revenue: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}

interface RecentOrder {
  id: string;
  full_name: string;
  total: number;
  status: string;
  created_at: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-teal-50 text-teal-700 border-teal-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0, inStock: 0, totalOrders: 0, revenue: 0,
    pendingOrders: 0, shippedOrders: 0, deliveredOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: products }, { data: orders }] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      const p = products || [];
      const o = orders || [];

      setStats({
        totalProducts: p.length,
        inStock: p.filter((x: any) => x.in_stock).length,
        totalOrders: o.length,
        revenue: o.filter((x: any) => x.status === "delivered").reduce((s: number, x: any) => s + (Number(x.total) || 0), 0),
        pendingOrders: o.filter((x: any) => x.status === "pending").length,
        shippedOrders: o.filter((x: any) => x.status === "shipped").length,
        deliveredOrders: o.filter((x: any) => x.status === "delivered").length,
      });

      setRecentOrders(o.slice(0, 5));
      setTopProducts(p.slice(0, 5));
      setLoading(false);
    };
    load();
  }, []);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 grid gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
            <p className="text-stone-400 text-sm mt-0.5">Welcome back — here's what's happening</p>
          </div>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={15} /> Add Product
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Revenue", value: fmt(stats.revenue), icon: DollarSign, color: "bg-emerald-50 text-emerald-600", change: "Delivered orders" },
            { label: "Total Orders", value: stats.totalOrders.toString(), icon: ShoppingBag, color: "bg-blue-50 text-blue-600", change: `${stats.pendingOrders} pending` },
            { label: "Total Products", value: stats.totalProducts.toString(), icon: Package, color: "bg-amber-50 text-amber-600", change: `${stats.inStock} in stock` },
            { label: "Delivered", value: stats.deliveredOrders.toString(), icon: TrendingUp, color: "bg-teal-50 text-teal-600", change: `${stats.shippedOrders} shipped` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-xs font-semibold text-stone-400 tracking-wider uppercase">{s.label}</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>
                  <s.icon size={15} />
                </div>
              </div>
              <p className="text-2xl font-bold text-stone-900">{s.value}</p>
              <p className="text-xs text-stone-400 mt-1 flex items-center gap-1">
                <ArrowUp size={11} className="text-emerald-500" />{s.change}
              </p>
            </div>
          ))}
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending", count: stats.pendingOrders, icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
            { label: "Shipped", count: stats.shippedOrders, icon: Truck, color: "text-blue-600 bg-blue-50 border-blue-100" },
            { label: "Delivered", count: stats.deliveredOrders, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          ].map((s) => (
            <div key={s.label} className={`bg-white rounded-xl border p-4 flex items-center gap-3 ${s.color.split(" ")[2]}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color.split(" ")[1]} ${s.color.split(" ")[2]}`}>
                <s.icon size={18} className={s.color.split(" ")[0]} />
              </div>
              <div>
                <p className="text-xl font-bold text-stone-900">{s.count}</p>
                <p className="text-xs text-stone-400 font-medium">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tables */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl border border-stone-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-800">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium">
                View all <ArrowRight size={12} />
              </Link>
            </div>
            {recentOrders.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <ShoppingBag size={28} className="mx-auto text-stone-300 mb-2" />
                <p className="text-sm text-stone-400">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-stone-50">
                {recentOrders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{o.full_name || "Customer"}</p>
                      <p className="text-xs text-stone-400">{new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-stone-900">₦{Number(o.total).toLocaleString()}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[o.status] || "bg-stone-50 text-stone-600 border-stone-200"}`}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl border border-stone-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-800">Products Overview</h2>
              <Link to="/admin/products" className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 font-medium">
                Manage <ArrowRight size={12} />
              </Link>
            </div>
            {topProducts.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Package size={28} className="mx-auto text-stone-300 mb-2" />
                <p className="text-sm text-stone-400">No products yet</p>
                <Link to="/admin/products/add" className="mt-3 inline-flex items-center gap-1 text-xs text-amber-600 font-medium hover:text-amber-700">
                  <Plus size={12} /> Add your first product
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-stone-50">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-xs text-stone-300 font-bold w-5 flex-shrink-0">{i + 1}</span>
                    <div className="w-10 h-12 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                      {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-900 truncate">{p.name}</p>
                      <p className="text-xs text-stone-400">{p.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-stone-900">₦{Number(p.price).toLocaleString()}</p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${p.in_stock ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
                        {p.in_stock ? "In Stock" : "Out"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { to: "/admin/products/add", label: "Add Product", icon: Plus, color: "bg-amber-500 text-white hover:bg-amber-600" },
            { to: "/admin/products", label: "Manage Products", icon: Package, color: "bg-stone-900 text-white hover:bg-stone-800" },
            { to: "/admin/orders", label: "View Orders", icon: ShoppingBag, color: "bg-white text-stone-900 border border-stone-200 hover:bg-stone-50" },
          ].map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className={`flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold transition-all ${a.color}`}
            >
              <a.icon size={15} />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

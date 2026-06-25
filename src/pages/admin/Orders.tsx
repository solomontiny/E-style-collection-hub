import { useEffect, useState, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import {
  ShoppingBag, Search, ChevronDown, ChevronUp, Package,
  Phone, Mail, MapPin, Clock, Truck, CheckCircle2, RefreshCw,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  size: string;
  color: string;
}

interface Order {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  country: string;
  total: number;
  status: string;
  created_at: string;
  items?: OrderItem[];
}

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: any }> = {
  pending: { label: "Pending", class: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  processing: { label: "Processing", class: "bg-blue-50 text-blue-700 border-blue-200", icon: RefreshCw },
  shipped: { label: "Shipped", class: "bg-teal-50 text-teal-700 border-teal-200", icon: Truck },
  delivered: { label: "Delivered", class: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
};

const STATUSES = ["pending", "processing", "shipped", "delivered"];

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data: orderData, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const orders = orderData || [];

    if (orders.length > 0) {
      const { data: items } = await supabase
        .from("order_items")
        .select("*")
        .in("order_id", orders.map((o: any) => o.id));

      const withItems = orders.map((o: any) => ({
        ...o,
        items: (items || []).filter((i: any) => i.order_id === o.id),
      }));
      setOrders(withItems);
    } else {
      setOrders([]);
    }

    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    setUpdating(null);
    if (error) return toast.error(error.message);
    toast.success(`Order marked as ${status}`);
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = !search ||
        o.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.id?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total), 0),
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Orders</h1>
            <p className="text-stone-400 text-sm">{orders.length} orders total</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-lg px-3.5 py-2 transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Total Orders", value: stats.total, color: "bg-stone-50 text-stone-700" },
            { label: "Pending", value: stats.pending, color: "bg-amber-50 text-amber-700" },
            { label: "Shipped", value: stats.shipped, color: "bg-teal-50 text-teal-700" },
            { label: "Revenue (Delivered)", value: `₦${stats.revenue.toLocaleString()}`, color: "bg-emerald-50 text-emerald-700" },
          ].map((s) => (
            <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
              <p className="text-xs font-semibold tracking-wider uppercase opacity-60">{s.label}</p>
              <p className="text-xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, email, or order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-stone-50"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="all">All Status</option>
              {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-stone-100 rounded w-1/3" />
                    <div className="h-3 bg-stone-100 rounded w-1/4" />
                  </div>
                  <div className="w-20 h-6 bg-stone-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 py-16 text-center">
            <ShoppingBag size={36} className="mx-auto text-stone-300 mb-3" />
            <p className="text-stone-500 font-medium">No orders found</p>
            <p className="text-stone-400 text-sm mt-1">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = cfg.icon;
              const isExpanded = expanded === order.id;

              return (
                <div key={order.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden">
                  {/* Order Header */}
                  <div
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-5 cursor-pointer hover:bg-stone-50/50 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-stone-900">{order.full_name}</p>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.class}`}>
                          <StatusIcon size={10} />
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 mt-0.5 truncate">{order.email}</p>
                      <p className="text-[11px] text-stone-300 mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-right">
                        <p className="text-sm font-bold text-stone-900">₦{Number(order.total).toLocaleString()}</p>
                        <p className="text-xs text-stone-400">
                          {new Date(order.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-stone-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-stone-400 flex-shrink-0" />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-stone-100 p-5 space-y-5">
                      <div className="grid sm:grid-cols-3 gap-4">
                        {/* Customer Info */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Customer</p>
                          {order.email && (
                            <div className="flex items-center gap-2 text-sm text-stone-600">
                              <Mail size={13} className="text-stone-400" /> {order.email}
                            </div>
                          )}
                          {order.phone && (
                            <div className="flex items-center gap-2 text-sm text-stone-600">
                              <Phone size={13} className="text-stone-400" /> {order.phone}
                            </div>
                          )}
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Shipping Address</p>
                          <div className="flex items-start gap-2 text-sm text-stone-600">
                            <MapPin size={13} className="text-stone-400 mt-0.5 flex-shrink-0" />
                            <span>{[order.address, order.city, order.country].filter(Boolean).join(", ")}</span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Items</p>
                          {order.items && order.items.length > 0 ? (
                            <div className="space-y-1.5">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-start gap-2">
                                  <Package size={13} className="text-stone-400 mt-0.5 flex-shrink-0" />
                                  <div className="text-sm text-stone-600">
                                    <span className="font-medium">{item.product_name}</span>
                                    <span className="text-stone-400"> × {item.quantity}</span>
                                    {item.size && <span className="text-stone-400"> · {item.size}</span>}
                                    {item.color && <span className="text-stone-400"> · {item.color}</span>}
                                    <span className="block text-xs text-stone-500">₦{Number(item.price).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-stone-400">No item details</p>
                          )}
                        </div>
                      </div>

                      {/* Status Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100">
                        <span className="text-xs font-semibold text-stone-400 mr-1">Update Status:</span>
                        {STATUSES.map((s) => {
                          const sCfg = STATUS_CONFIG[s];
                          return (
                            <button
                              key={s}
                              onClick={() => updateStatus(order.id, s)}
                              disabled={order.status === s || updating === order.id}
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 ${
                                order.status === s
                                  ? `${sCfg.class} cursor-default`
                                  : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:text-stone-900"
                              }`}
                            >
                              <sCfg.icon size={11} />
                              {sCfg.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

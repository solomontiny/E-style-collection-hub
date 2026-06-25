import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import {
  Plus, Search, Pencil, Trash2, Package, Filter, ChevronDown,
  Star, CheckCircle, XCircle, AlertCircle,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";
import type { Product } from "../../types";

const CATEGORIES = ["All", "Dresses", "Tops", "Bottoms", "Outerwear", "Bags", "Shoes", "Accessories"];

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetch = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === "All" || p.category === catFilter;
      const matchStock = stockFilter === "all" ? true : stockFilter === "in" ? p.in_stock : !p.in_stock;
      return matchSearch && matchCat && matchStock;
    });
  }, [products, search, catFilter, stockFilter]);

  const deleteProduct = async (id: string) => {
    if (!confirm("Permanently delete this product?")) return;
    setDeleting(id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    setDeleting(null);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    fetch();
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.size} products?`)) return;
    const ids = [...selected];
    const { error } = await supabase.from("products").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`Deleted ${ids.length} products`);
    setSelected(new Set());
    fetch();
  };

  const toggleFeatured = async (p: Product) => {
    const { error } = await supabase.from("products").update({ featured: !p.featured }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(p.featured ? "Removed from featured" : "Marked as featured");
    fetch();
  };

  const toggleStock = async (p: Product) => {
    const { error } = await supabase.from("products").update({ in_stock: !p.in_stock }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success(p.in_stock ? "Marked out of stock" : "Marked in stock");
    fetch();
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-5">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Products</h1>
            <p className="text-stone-400 text-sm">{products.length} products total</p>
          </div>
          <Link
            to="/admin/products/add"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={15} /> Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border border-stone-200 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 bg-stone-50"
              />
            </div>
            <div className="relative">
              <select
                value={catFilter}
                onChange={(e) => setCatFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="all">All Stock</option>
                <option value="in">In Stock</option>
                <option value="out">Out of Stock</option>
              </select>
              <Filter size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <span className="text-sm font-medium text-amber-800">{selected.size} selected</span>
            <button
              onClick={bulkDelete}
              className="ml-auto flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              <Trash2 size={14} /> Delete Selected
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-12 h-14 bg-stone-100 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3.5 bg-stone-100 rounded w-1/2" />
                    <div className="h-3 bg-stone-100 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Package size={36} className="mx-auto text-stone-300 mb-3" />
              <p className="text-stone-500 font-medium">No products found</p>
              <p className="text-stone-400 text-sm mt-1">Try adjusting your filters</p>
              <Link
                to="/admin/products/add"
                className="mt-4 inline-flex items-center gap-2 text-sm text-amber-600 font-medium hover:text-amber-700"
              >
                <Plus size={14} /> Add a product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-100">
                    <th className="pl-5 py-3 w-10">
                      <input
                        type="checkbox"
                        checked={selected.size === filtered.length && filtered.length > 0}
                        onChange={selectAll}
                        className="rounded border-stone-300 text-amber-500 focus:ring-amber-400"
                      />
                    </th>
                    <th className="text-left text-xs font-semibold tracking-wider text-stone-400 uppercase px-3 py-3">Product</th>
                    <th className="text-left text-xs font-semibold tracking-wider text-stone-400 uppercase px-3 py-3 hidden sm:table-cell">Category</th>
                    <th className="text-left text-xs font-semibold tracking-wider text-stone-400 uppercase px-3 py-3">Price</th>
                    <th className="text-left text-xs font-semibold tracking-wider text-stone-400 uppercase px-3 py-3 hidden md:table-cell">Stock</th>
                    <th className="text-left text-xs font-semibold tracking-wider text-stone-400 uppercase px-3 py-3 hidden lg:table-cell">Featured</th>
                    <th className="text-right text-xs font-semibold tracking-wider text-stone-400 uppercase px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {filtered.map((p) => (
                    <tr key={p.id} className={`hover:bg-stone-50/60 transition-colors ${selected.has(p.id) ? "bg-amber-50/40" : ""}`}>
                      <td className="pl-5 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          className="rounded border-stone-300 text-amber-500 focus:ring-amber-400"
                        />
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-13 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 aspect-[4/5]">
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package size={14} className="text-stone-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-stone-900 truncate max-w-[160px]">{p.name}</p>
                            {p.sku && <p className="text-xs text-stone-400">SKU: {p.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden sm:table-cell">
                        <span className="text-xs bg-stone-100 text-stone-600 font-medium px-2 py-1 rounded-full">{p.category}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-sm font-bold text-stone-900">₦{Number(p.price).toLocaleString()}</span>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <button
                          onClick={() => toggleStock(p)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                            p.in_stock
                              ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                              : "text-red-600 bg-red-50 border-red-200 hover:bg-red-100"
                          }`}
                        >
                          {p.in_stock ? <CheckCircle size={11} /> : <XCircle size={11} />}
                          {p.in_stock ? "In Stock" : "Out of Stock"}
                        </button>
                      </td>
                      <td className="px-3 py-3 hidden lg:table-cell">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                            p.featured
                              ? "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                              : "text-stone-500 bg-stone-50 border-stone-200 hover:bg-stone-100"
                          }`}
                        >
                          <Star size={11} className={p.featured ? "fill-amber-500" : ""} />
                          {p.featured ? "Featured" : "Set Featured"}
                        </button>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/products/edit/${p.id}`}
                            className="p-2 text-stone-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            disabled={deleting === p.id}
                            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                            title="Delete"
                          >
                            {deleting === p.id ? (
                              <AlertCircle size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-stone-400 text-right">{filtered.length} of {products.length} products shown</p>
      </div>
    </AdminLayout>
  );
}

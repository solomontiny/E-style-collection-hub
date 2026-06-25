import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Search, Filter, X, Grid3x3 as Grid3X3, LayoutList } from "lucide-react";
import type { Product } from "../types";

const CATEGORIES = ["All", "Dresses", "Tops", "Bottoms", "Outerwear", "Bags", "Shoes", "Accessories"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

function ProductCard({ product }: { product: Product }) {
  const [imgError, setImgError] = useState(false);
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-stone-100 rounded-xl aspect-[3/4] mb-3">
        {product.image_url && !imgError ? (
          <img
            src={product.image_url}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-stone-300 text-4xl font-light">E</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase">
            Featured
          </span>
        )}
        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-stone-500 text-xs font-semibold tracking-wider uppercase">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="px-1">
        <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium mb-0.5">{product.category}</p>
        <h3 className="text-sm font-semibold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">{product.name}</h3>
        <p className="text-sm font-bold text-stone-900 mt-1">₦{Number(product.price).toLocaleString()}</p>
      </div>
    </Link>
  );
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    supabase.from("products").select("*").eq("in_stock", true).order("created_at", { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];
    if (search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") result = result.filter((p) => p.category === category);
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    else if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, search, category, sort]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 pt-24 pb-12 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2">Explore Our Collection</p>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-white tracking-tight">Shop All Products</h1>
          <p className="text-stone-400 mt-2 text-sm">{products.length} products available</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-8">
        {/* Search + Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-amber-400 transition-colors bg-stone-50"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-stone-200 rounded-xl px-3 py-3 text-sm bg-stone-50 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <button
              onClick={() => setView(view === "grid" ? "list" : "grid")}
              className="p-3 border border-stone-200 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
              title="Toggle view"
            >
              {view === "grid" ? <LayoutList size={16} /> : <Grid3X3 size={16} />}
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Category Sidebar */}
          <aside className="hidden md:block w-44 flex-shrink-0">
            <div className="sticky top-24">
              <p className="text-[10px] font-bold tracking-widest text-stone-400 uppercase mb-3">Categories</p>
              <div className="space-y-0.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === c
                        ? "bg-amber-500 text-white"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Category Pills */}
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5 md:hidden no-scrollbar">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    category === c
                      ? "bg-amber-500 text-white border-amber-500"
                      : "bg-white text-stone-600 border-stone-200 hover:border-amber-300"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Result count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-stone-400">
                {filtered.length} {filtered.length === 1 ? "product" : "products"}
                {category !== "All" ? ` in ${category}` : ""}
                {search ? ` matching "${search}"` : ""}
              </p>
              {(search || category !== "All") && (
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="text-xs text-amber-600 font-medium hover:text-amber-700 flex items-center gap-1"
                >
                  <X size={12} /> Clear filters
                </button>
              )}
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={`grid gap-5 ${view === "grid" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className={`bg-stone-100 rounded-xl mb-3 ${view === "grid" ? "aspect-[3/4]" : "h-28"}`} />
                    <div className="h-3 bg-stone-100 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-stone-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <Filter size={36} className="mx-auto text-stone-300 mb-3" />
                <p className="text-stone-500 font-medium">No products found</p>
                <p className="text-stone-400 text-sm mt-1">Try adjusting your search or category</p>
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="mt-4 text-sm text-amber-600 font-medium hover:text-amber-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((p) => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group flex gap-4 bg-white border border-stone-100 rounded-xl p-4 hover:border-amber-200 transition-all hover:shadow-sm">
                    <div className="w-20 h-24 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest font-medium">{p.category}</p>
                      <h3 className="text-sm font-semibold text-stone-900 mt-0.5 group-hover:text-amber-700 transition-colors">{p.name}</h3>
                      {p.description && <p className="text-xs text-stone-400 mt-1 line-clamp-2">{p.description}</p>}
                      <p className="text-sm font-bold text-stone-900 mt-2">₦{Number(p.price).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

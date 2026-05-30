import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  created_at?: string;
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error(error.message);

    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) return toast.error(error.message);

    toast.success("Product deleted");
    fetchProducts();
  };

  // UPDATE PRODUCT
  const updateProduct = async () => {
    if (!editing) return;

    setSaving(true);

    const { error } = await supabase
      .from("products")
      .update({
        name: editing.name,
        price: editing.price,
        category: editing.category,
        image_url: editing.image_url,
        description: editing.description,
      })
      .eq("id", editing.id);

    setSaving(false);

    if (error) return toast.error(error.message);

    toast.success("Product updated");
    setEditing(null);
    fetchProducts();
  };

  // FILTERED PRODUCTS
  const filtered = useMemo(() => {
    return products.filter((p) => {
      return (
        p.name?.toLowerCase().includes(search.toLowerCase()) &&
        (categoryFilter === "" || p.category === categoryFilter)
      );
    });
  }, [products, search, categoryFilter]);

  const categories = [...new Set(products.map((p) => p.category))];

  // DASHBOARD STATS
  const totalProducts = products.length;
  const totalCategories = categories.length;
  const avgPrice =
    products.reduce((sum, p) => sum + (p.price || 0), 0) /
    (products.length || 1);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Dashboard</h1>

        <button
          onClick={() => (window.location.href = "/admin/products/add")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Total Products</p>
          <h2 className="text-xl font-bold">{totalProducts}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Categories</p>
          <h2 className="text-xl font-bold">{totalCategories}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500 text-sm">Avg Price</p>
          <h2 className="text-xl font-bold">₦{Math.round(avgPrice)}</h2>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 mb-6">
        <input
          className="border p-2 flex-1"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* PRODUCTS GRID */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded shadow overflow-hidden">

              <img
                src={p.image_url}
                className="h-44 w-full object-cover"
              />

              <div className="p-4 space-y-2">
                <h2 className="font-bold">{p.name}</h2>
                <p className="text-sm text-gray-500">{p.category}</p>
                <p className="font-semibold">₦{p.price}</p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setEditing(p)}
                    className="flex-1 bg-blue-500 text-white py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="flex-1 bg-red-500 text-white py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EDIT MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex justify-end">
          <div className="w-[420px] bg-white h-full p-6 space-y-3">

            <h2 className="text-xl font-bold">Edit Product</h2>

            <input
              className="w-full border p-2"
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
            />

            <input
              className="w-full border p-2"
              value={editing.price}
              onChange={(e) =>
                setEditing({ ...editing, price: Number(e.target.value) })
              }
            />

            <input
              className="w-full border p-2"
              value={editing.category}
              onChange={(e) =>
                setEditing({ ...editing, category: e.target.value })
              }
            />

            <input
              className="w-full border p-2"
              value={editing.image_url}
              onChange={(e) =>
                setEditing({ ...editing, image_url: e.target.value })
              }
            />

            <textarea
              className="w-full border p-2"
              value={editing.description}
              onChange={(e) =>
                setEditing({ ...editing, description: e.target.value })
              }
            />

            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 border"
              >
                Cancel
              </button>

              <button
                onClick={updateProduct}
                disabled={saving}
                className="flex-1 bg-black text-white"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setProducts(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();

    // 🔥 LIVE SYNC (auto refresh every 5 seconds)
    const interval = setInterval(() => {
      fetchProducts();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-20 px-6">
      <h1 className="text-2xl font-bold mb-6">Shop</h1>

      {loading && <p>Loading products...</p>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link
            key={p.id}
            to={`/product/${p.id}`}
            className="border p-3 rounded hover:shadow"
          >
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-40 object-cover mb-2"
            />

            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-500">${p.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
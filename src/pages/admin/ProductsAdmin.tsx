import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
  stock: number;
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState("");
  const [stock, setStock] = useState<number>(1);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setProducts(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD PRODUCT
  const addProduct = async () => {
    const { error } = await supabase.from("products").insert([
      {
        name,
        price,
        image,
        stock,
      },
    ]);

    if (!error) {
      setName("");
      setPrice(0);
      setImage("");
      setStock(1);
      fetchProducts();
    } else {
      console.log(error);
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // UPDATE STOCK
  const updateStock = async (id: string, value: number) => {
    await supabase.from("products").update({ stock: value }).eq("id", id);
    fetchProducts();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Products Admin 🛍️</h1>

      {/* CREATE PRODUCT */}
      <div className="bg-white p-4 shadow rounded mb-6 space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <input
          className="border p-2 w-full"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
        />

        <button
          onClick={addProduct}
          className="bg-black text-white px-4 py-2"
        >
          Add Product
        </button>
      </div>

      {/* PRODUCT LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex justify-between items-center bg-gray-100 p-3 rounded"
            >
              <div>
                <p className="font-bold">{p.name}</p>
                <p>₦{p.price}</p>
                <p className="text-sm text-gray-500">
                  Stock: {p.stock}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={p.stock}
                  onChange={(e) =>
                    updateStock(p.id, Number(e.target.value))
                  }
                  className="w-16 border p-1"
                />

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
};

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // CREATE FORM
  const [name, setName] = useState("");
  const [price, setPrice] = useState<string>(""); // string = FIX
  const [image, setImage] = useState("");
  const [stock, setStock] = useState<string>("1");

  // EDIT MODE
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState<string>("");
  const [editStock, setEditStock] = useState<string>("");

  // ---------------- IMAGE UPLOAD ----------------
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, file);

    if (error) {
      console.log("Upload error:", error);
      return null;
    }

    const { data } = supabase.storage
      .from("products")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ---------------- FETCH ----------------
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

  // ---------------- ADD ----------------
  const addProduct = async () => {
    if (!name || !price) return;

    const { error } = await supabase.from("products").insert([
      {
        name: name.trim(),
        price: Number(price),
        image: image || "",
        stock: Number(stock),
      },
    ]);

    if (!error) {
      setName("");
      setPrice("");
      setImage("");
      setStock("1");
      fetchProducts();
    } else {
      console.log(error);
    }
  };

  // ---------------- DELETE ----------------
  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  // ---------------- EDIT ----------------
  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.price));
    setEditStock(String(p.stock));
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const { error } = await supabase
      .from("products")
      .update({
        name: editName.trim(),
        price: Number(editPrice),
        stock: Number(editStock),
      })
      .eq("id", editingId);

    if (!error) {
      setEditingId(null);
      fetchProducts();
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">Products Admin 🛍️</h1>

      {/* CREATE PRODUCT */}
      <div className="bg-white p-4 shadow rounded mb-6 space-y-3">

        <input
          className="border p-2 w-full"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* PRICE INPUT FIXED */}
        <input
          className="border p-2 w-full"
          placeholder="Amount (e.g 15000)"
          value={price}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^\d*$/.test(val)) {
              setPrice(val);
            }
          }}
        />

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const url = await uploadImage(file);
            if (url) setImage(url);
          }}
        />

        {image && (
          <img src={image} className="w-24 h-24 object-cover rounded" />
        )}

        <input
          className="border p-2 w-full"
          placeholder="Stock"
          value={stock}
          onChange={(e) => {
            const val = e.target.value;
            if (val === "" || /^\d*$/.test(val)) {
              setStock(val);
            }
          }}
        />

        <button
          onClick={addProduct}
          className="bg-black text-white px-4 py-2 w-full"
        >
          Add Product
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">

          {products.map((p) => {

            // SAFE IMAGE FIX
            const img =
              p.image ||
              "https://via.placeholder.com/200";

            return (
              <div key={p.id} className="bg-gray-100 p-3 rounded">

                {editingId === p.id ? (
                  <div className="space-y-2">

                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border p-1 w-full"
                    />

                    <input
                      value={editPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*$/.test(val)) {
                          setEditPrice(val);
                        }
                      }}
                      className="border p-1 w-full"
                    />

                    <input
                      value={editStock}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d*$/.test(val)) {
                          setEditStock(val);
                        }
                      }}
                      className="border p-1 w-full"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="bg-green-600 text-white px-3 py-1"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 px-3 py-1"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">

                    <div>
                      <p className="font-bold">{p.name}</p>
                      <p>₦{p.price}</p>
                      <p className="text-sm text-gray-500">
                        Stock: {p.stock}
                      </p>

                      <img
                        src={img}
                        className="w-16 h-16 object-cover mt-2 rounded"
                      />
                    </div>

                    <div className="flex gap-2 items-center">

                      <button
                        onClick={() => startEdit(p)}
                        className="bg-blue-500 text-white px-2 py-1"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="bg-red-500 text-white px-2 py-1"
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}
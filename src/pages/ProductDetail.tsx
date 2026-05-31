import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft } from "lucide-react";

import { supabase } from "../lib/supabase";
import { useCart } from "../hooks/useCart";
import { useCurrency } from "../hooks/useCurrency";

import type { Product } from "../types";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { format } = useCurrency();

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error || !data) {
        setProduct(null);
        setLoading(false);
        return;
      }

      const typedProduct = data as Product;

      setProduct(typedProduct);

      setSelectedSize(typedProduct.sizes?.[0] || "");
      setSelectedColor(typedProduct.colors?.[0] || "");

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!product) {
    return <div className="p-10">Product not found</div>;
  }

  const baseImage =
    product.image_url ||
    product.images?.[0] ||
    "https://via.placeholder.com/600";

  const allImages = [
    baseImage,
    ...(product.images?.filter((img) => img !== baseImage) || []),
  ];

  const price = product.price ?? 0;

  const handleAdd = () => {
    addItem(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* BACK */}
      <Link to="/shop" className="flex items-center gap-2 text-gray-500">
        <ArrowLeft size={14} /> Back
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">

        {/* IMAGES */}
        <div>
          <img
            src={allImages[selectedImage]}
            className="w-full h-[500px] object-cover rounded-lg"
          />

          <div className="flex gap-2 mt-3">
            {allImages.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setSelectedImage(i)}
                className={`w-16 h-16 object-cover cursor-pointer border ${
                  selectedImage === i ? "border-black" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-2xl mt-2">{format(price)}</p>

          <p className="text-gray-500 mt-4">{product.description}</p>

          {/* COLORS */}
          {product.colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Color</p>
              <div className="flex gap-2 mt-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 border rounded-full ${
                      selectedColor === c ? "bg-black text-white" : ""
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZES */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Size</p>
              <div className="flex gap-2 mt-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 border ${
                      selectedSize === s ? "bg-black text-white" : ""
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUANTITY */}
          <div className="mt-6">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 border"
              >
                -
              </button>

              <span>{quantity}</span>

              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 border"
              >
                +
              </button>
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={handleAdd}
            className="w-full mt-8 bg-black text-white py-3 flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}
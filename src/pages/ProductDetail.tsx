import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

import { supabase } from '../lib/supabase';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../hooks/useCurrency';

import type { Product } from '../types';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCart();
  const { format } = useCurrency();

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) {
          setProduct(null);
          setLoading(false);
          return;
        }

        setProduct(data);

        const sizes = Array.isArray((data as any).sizes)
          ? (data as any).sizes
          : [];

        const colors = Array.isArray((data as any).colors)
          ? (data as any).colors
          : [];

        setSelectedSize(sizes[0] || '');
        setSelectedColor(colors[0] || '');

        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 animate-pulse">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="p-10">
        Product not found
      </div>
    );
  }

  // 🖼️ SAFE IMAGE HANDLING
  const baseImage =
    (product as any).image_url ||
    (product as any).image ||
    'https://via.placeholder.com/600';

  const extraImages = Array.isArray((product as any).images)
    ? (product as any).images
    : [];

  const allImages = [
    baseImage,
    ...extraImages.filter((i: string) => i !== baseImage),
  ];

  // 💰 SAFE PRICE
  const price = Number((product as any).price || 0);

  const handleAdd = () => {
    addItem(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* BACK */}
      <Link to="/shop" className="text-sm text-gray-500 flex items-center gap-2">
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
                  selectedImage === i ? 'border-black' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* DETAILS */}
        <div>

          <h1 className="text-3xl font-bold">
            {product.name}
          </h1>

          {/* 💰 PRICE */}
          <p className="text-2xl mt-2 font-light">
            {format(price)}
          </p>

          <p className="text-gray-500 mt-4">
            {product.description}
          </p>

          {/* COLORS */}
          {(product as any).colors?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Color</p>

              <div className="flex gap-2 mt-2">
                {(product as any).colors.map((c: string) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1 border rounded-full ${
                      selectedColor === c
                        ? 'bg-black text-white'
                        : ''
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZES */}
          {(product as any).sizes?.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Size</p>

              <div className="flex gap-2 mt-2">
                {(product as any).sizes.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 border ${
                      selectedSize === s
                        ? 'bg-black text-white'
                        : ''
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
                onClick={() =>
                  setQuantity((q) => Math.max(1, q - 1))
                }
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

          {/* ADD BUTTON */}
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
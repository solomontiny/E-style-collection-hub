import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import {
  ArrowLeft, Upload, X, Plus, Loader, ImagePlus, Package,
} from "lucide-react";
import AdminLayout from "../../layouts/AdminLayout";

const CATEGORIES = ["Dresses", "Tops", "Bottoms", "Outerwear", "Bags", "Shoes", "Accessories"];
const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "One Size"];
const COLOR_PRESETS = ["Black", "White", "Beige", "Brown", "Navy", "Red", "Pink", "Green", "Gold", "Silver", "Multi"];

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dva5xu3pr/image/upload";
const CLOUDINARY_PRESET = "e_style_upload";

async function uploadToCloudinary(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", CLOUDINARY_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: form });
  const data = await res.json();
  if (!data.secure_url) throw new Error("Upload failed");
  return data.secure_url;
}

export default function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingExtra, setUploadingExtra] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    sku: "",
    category: "",
    image_url: "",
    images: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    in_stock: true,
    featured: false,
    stock_quantity: "0",
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data, error }) => {
      if (error || !data) {
        toast.error("Product not found");
        navigate("/admin/products");
        return;
      }
      setForm({
        name: data.name || "",
        description: data.description || "",
        price: data.price?.toString() || "",
        sku: data.sku || "",
        category: data.category || "",
        image_url: data.image_url || "",
        images: data.images || [],
        sizes: data.sizes || [],
        colors: data.colors || [],
        in_stock: data.in_stock ?? true,
        featured: data.featured ?? false,
        stock_quantity: (data.stock_quantity ?? 0).toString(),
      });
      setLoadingProduct(false);
    });
  }, [id, navigate]);

  const set = (field: string, value: any) => setForm((p) => ({ ...p, [field]: value }));

  const handleMainImage = async (file: File) => {
    try {
      setUploadingMain(true);
      const url = await uploadToCloudinary(file);
      set("image_url", url);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingMain(false);
    }
  };

  const handleExtraImages = async (files: FileList) => {
    try {
      setUploadingExtra(true);
      const urls = await Promise.all(Array.from(files).map(uploadToCloudinary));
      set("images", [...form.images, ...urls]);
      toast.success(`${urls.length} image(s) uploaded`);
    } catch {
      toast.error("One or more uploads failed");
    } finally {
      setUploadingExtra(false);
    }
  };

  const removeExtraImage = (i: number) => {
    set("images", form.images.filter((_, idx) => idx !== i));
  };

  const toggleSize = (s: string) => {
    set("sizes", form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]);
  };

  const toggleColor = (c: string) => {
    set("colors", form.colors.includes(c) ? form.colors.filter((x) => x !== c) : [...form.colors, c]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Product name is required");
    if (!form.price || isNaN(Number(form.price))) return toast.error("Valid price is required");
    if (!form.category) return toast.error("Please select a category");

    setSaving(true);
    const { error } = await supabase.from("products").update({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      sku: form.sku.trim(),
      category: form.category,
      image_url: form.image_url,
      images: form.images,
      sizes: form.sizes,
      colors: form.colors,
      in_stock: form.in_stock,
      featured: form.featured,
      stock_quantity: Number(form.stock_quantity) || 0,
    }).eq("id", id!);
    setSaving(false);

    if (error) return toast.error(error.message || "Failed to update product");
    toast.success("Product updated!");
    navigate("/admin/products");
  };

  if (loadingProduct) {
    return (
      <AdminLayout>
        <div className="p-8 flex items-center justify-center">
          <Loader size={28} className="animate-spin text-amber-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/products")}
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-stone-900">Edit Product</h1>
            <p className="text-sm text-stone-400">{form.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid lg:grid-cols-3 gap-5">
            {/* Left */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
                <h2 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <Package size={15} className="text-amber-500" /> Product Information
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Price (₦) *</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={form.price}
                      onChange={(e) => set("price", e.target.value)}
                      className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => set("sku", e.target.value)}
                      className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
                <h2 className="text-sm font-semibold text-stone-800 flex items-center gap-2">
                  <ImagePlus size={15} className="text-amber-500" /> Product Images
                </h2>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Main Image</label>
                  <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${
                    uploadingMain ? "border-amber-300 bg-amber-50" : "border-stone-200 hover:border-amber-300 hover:bg-amber-50/30"
                  }`}>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleMainImage(f); e.target.value = ""; }} />
                    {uploadingMain ? (
                      <><Loader size={24} className="text-amber-500 animate-spin" /><p className="text-sm text-amber-600">Uploading...</p></>
                    ) : form.image_url ? (
                      <div className="relative">
                        <img src={form.image_url} alt="" className="h-40 rounded-lg object-cover mx-auto" />
                        <p className="text-xs text-stone-400 mt-2 text-center">Click to replace</p>
                      </div>
                    ) : (
                      <><Upload size={24} className="text-stone-300" /><p className="text-sm text-stone-400">Click to upload main image</p></>
                    )}
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">Additional Images</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {form.images.map((url, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-stone-200" />
                        <button type="button" onClick={() => removeExtraImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square border-2 border-dashed border-stone-200 hover:border-amber-300 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors">
                      <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleExtraImages(e.target.files); e.target.value = ""; }} />
                      {uploadingExtra ? <Loader size={18} className="text-amber-400 animate-spin" /> : <><Plus size={18} className="text-stone-300" /><p className="text-[10px] text-stone-400">Add</p></>}
                    </label>
                  </div>
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h2 className="text-sm font-semibold text-stone-800 mb-3">Available Sizes</h2>
                <div className="flex flex-wrap gap-2">
                  {SIZE_PRESETS.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSize(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.sizes.includes(s) ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-600 border-stone-200 hover:border-amber-300"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h2 className="text-sm font-semibold text-stone-800 mb-3">Available Colors</h2>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button key={c} type="button" onClick={() => toggleColor(c)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.colors.includes(c) ? "bg-amber-500 text-white border-amber-500" : "bg-white text-stone-600 border-stone-200 hover:border-amber-300"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-stone-200 p-5">
                <h2 className="text-sm font-semibold text-stone-800 mb-3">Category *</h2>
                <div className="space-y-1.5">
                  {CATEGORIES.map((c) => (
                    <button key={c} type="button" onClick={() => set("category", c)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${form.category === c ? "bg-amber-500 text-white" : "text-stone-600 hover:bg-stone-50"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 p-5 space-y-4">
                <h2 className="text-sm font-semibold text-stone-800">Inventory</h2>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Stock Quantity</label>
                  <input type="number" min="0" value={form.stock_quantity} onChange={(e) => set("stock_quantity", e.target.value)}
                    className="w-full border border-stone-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-amber-400" />
                </div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-stone-700">In Stock</span>
                  <div onClick={() => set("in_stock", !form.in_stock)} className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${form.in_stock ? "bg-amber-500" : "bg-stone-200"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.in_stock ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-stone-700">Featured</span>
                  <div onClick={() => set("featured", !form.featured)} className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${form.featured ? "bg-amber-500" : "bg-stone-200"}`}>
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </label>
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader size={15} className="animate-spin" /> Saving...</> : "Update Product"}
              </button>
              <button type="button" onClick={() => navigate("/admin/products")}
                className="w-full border border-stone-200 text-stone-600 hover:bg-stone-50 font-medium py-3 rounded-xl text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

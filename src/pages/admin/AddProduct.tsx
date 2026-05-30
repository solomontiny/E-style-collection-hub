import { useState } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Dresses",
  "Outerwear",
  "Bags",
  "Shoes",
  "Tops",
  "Bottoms",
  "Accessories",
];

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // CLOUDINARY
  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "e_style_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dva5xu3pr/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    if (!data.secure_url) throw new Error("Upload failed");

    return data.secure_url;
  };

  const handleFile = async (file: File) => {
    try {
      setUploading(true);
      toast.loading("Uploading image...", { id: "upload" });

      const url = await uploadImage(file);
      setImageUrl(url);

      toast.success("Image uploaded", { id: "upload" });
    } catch {
      toast.error("Upload failed", { id: "upload" });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name || !price || !category) {
      return toast.error("Fill all required fields");
    }

    setSaving(true);

    const { error } = await supabase.from("products").insert({
      name,
      price: Number(price),
      category,
      description,
      image_url: imageUrl,
    });

    setSaving(false);

    if (error) {
      console.error(error);
      return toast.error("Failed to save product");
    }

    toast.success("Product saved successfully!");

    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/admin/products")}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-lg sm:text-xl font-bold">
          Add New Product
        </h1>

        <div />
      </div>

      {/* MAIN CARD */}
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-6 space-y-5">

        {/* IMAGE UPLOAD */}
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
        >
          <input
            type="file"
            hidden
            id="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />

          <label htmlFor="file" className="cursor-pointer block">
            {uploading ? (
              <p>Uploading...</p>
            ) : imageUrl ? (
              <img
                src={imageUrl}
                className="h-44 mx-auto object-cover rounded"
              />
            ) : (
              <p className="text-gray-500 text-sm">
                Drag & drop or click to upload image
              </p>
            )}
          </label>
        </div>

        {/* FORM GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <input
            className="border p-3 rounded w-full"
            placeholder="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-3 rounded w-full"
            placeholder="Price (NGN)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* CATEGORY DROPDOWN */}
          <select
            className="border p-3 rounded w-full sm:col-span-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <textarea
            className="border p-3 rounded w-full sm:col-span-2"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-900"
        >
          {saving ? "Saving..." : "Save Product"}
        </button>
      </div>
    </div>
  );
}
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // CLOUDINARY UPLOAD
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

    if (!data.secure_url) {
      throw new Error("Upload failed");
    }

    return data.secure_url;
  };

  // HANDLE FILE
  const handleFile = async (file: File) => {
    try {
      setUploading(true);
      toast.loading("Uploading image...", { id: "upload" });

      const url = await uploadImage(file);
      setImageUrl(url);

      toast.success("Image uploaded", { id: "upload" });
    } catch (err) {
      toast.error("Upload failed", { id: "upload" });
    } finally {
      setUploading(false);
    }
  };

  // SAVE PRODUCT
  const handleSave = async () => {
    if (!name || !price || !category) {
      return toast.error("Please fill required fields");
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

    // reset form
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

      {/* IMAGE UPLOAD BOX */}
      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 mb-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <input
          type="file"
          id="fileUpload"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        <label htmlFor="fileUpload" className="cursor-pointer block">
          {uploading ? (
            <p>Uploading image...</p>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              className="h-44 mx-auto object-cover rounded"
            />
          ) : (
            <p className="text-gray-500">
              Drag & drop image or click to upload
            </p>
          )}
        </label>
      </div>

      {/* FORM */}
      <div className="space-y-3">

        <input
          className="border p-2 w-full"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Price (NGN)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          className="border p-2 w-full"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-black text-white w-full py-3"
        >
          {saving ? "Saving..." : "Add Product"}
        </button>
      </div>
    </div>
  );
}
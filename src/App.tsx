import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC PAGES
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";

// ADMIN PAGES
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import AddProduct from "./pages/admin/AddProduct";
import Dashboard from "./pages/admin/Dashboard";
import Orders from "./pages/admin/Orders";

// LAYOUT
import Layout from "./components/Layout";
import AdminLayout from "./pages/admin/AdminLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC PAGES
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";

// ADMIN PAGES
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import AddProduct from "./pages/admin/AddProduct";

// OPTIONAL LAYOUT (if you use it)
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin/products" element={<ProductsAdmin />} />
        <Route path="/admin/products/add" element={<AddProduct />} />

        {/* FALLBACK */}
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}
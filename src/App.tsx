import ProductsAdmin from "./pages/admin/ProductsAdmin";
<Route path="/admin/products" element={<ProductsAdmin />} />
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import { CartProvider } from './hooks/useCart';
import { CurrencyProvider } from './hooks/useCurrency';
import { AuthProvider } from './hooks/useAuth';

import Layout from './components/Layout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Checkout from './pages/Checkout';

import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';

import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';

import AIChatBot from './components/AIChatBot';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);

  return null;
}

function ChatBotWidget() {
  const { pathname } = useLocation();

  if (
    pathname === '/admin' ||
    pathname === '/login' ||
    pathname === '/register'
  ) {
    return null;
  }

  return <AIChatBot />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <ScrollToTop />

            <div className="min-h-screen bg-white flex flex-col">
              <Routes>

                {/* PUBLIC ROUTES */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/checkout" element={<Checkout />} />

                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="orders" element={<Orders />} />
                </Route>

              </Routes>

              <ChatBotWidget />
            </div>

          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
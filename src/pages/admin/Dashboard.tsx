import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();

  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("admin-auth");
    navigate("/admin/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { count: products } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      const { count: orders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      setProductsCount(products || 0);
      setOrdersCount(orders || 0);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>

        <button
          onClick={logout}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>

      {/* WELCOME */}
      <div className="mt-6">
        <p className="text-lg">Welcome back 👋</p>
        <p className="text-gray-500">
          Manage your store, products, and orders from here.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">

        <div className="p-5 bg-white shadow rounded">
          <h3 className="text-sm text-gray-500">Total Products</h3>
          <p className="text-2xl font-bold">{productsCount}</p>
        </div>

        <div className="p-5 bg-white shadow rounded">
          <h3 className="text-sm text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold">{ordersCount}</p>
        </div>

        <div className="p-5 bg-white shadow rounded">
          <h3 className="text-sm text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold">$0.00</p>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>

        <div className="flex gap-3 flex-wrap">

          <button
            onClick={() => navigate("/admin/products")}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Manage Products
          </button>

          <button
            onClick={() => navigate("/admin/products/add")}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Add Product
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            View Orders
          </button>

        </div>
      </div>

    </div>
  );
}
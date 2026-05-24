import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar() {
  const location = useLocation();

  const linkStyle = (path: string) =>
    `block p-2 rounded ${
      location.pathname === path
        ? "bg-black text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-2">
      <h1 className="text-xl font-bold mb-4">Admin</h1>

      <Link className={linkStyle("/admin/dashboard")} to="/admin/dashboard">
        Dashboard
      </Link>

      <Link className={linkStyle("/admin/products")} to="/admin/products">
        Products
      </Link>

      <Link className={linkStyle("/admin/orders")} to="/admin/orders">
        Orders
      </Link>

      <Link className="text-blue-600 mt-6 block" to="/">
        ← Back to Store
      </Link>
    </aside>
  );
}
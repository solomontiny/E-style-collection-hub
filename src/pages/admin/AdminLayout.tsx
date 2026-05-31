import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, PackagePlus, Boxes } from "lucide-react";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col p-4">
        <h1 className="text-xl font-bold mb-6">Admin Panel</h1>

        <nav className="flex flex-col gap-2">

          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded ${
                isActive ? "bg-black text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded ${
                isActive ? "bg-black text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <Boxes size={18} />
            Products
          </NavLink>

          <NavLink
            to="/admin/products/add"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded ${
                isActive ? "bg-black text-white" : "hover:bg-gray-100"
              }`
            }
          >
            <PackagePlus size={18} />
            Add Product
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
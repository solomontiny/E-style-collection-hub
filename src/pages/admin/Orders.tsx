import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Supabase error:", error);
    } else {
      setOrders(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      fetchOrders();
    } else {
      console.log("Update error:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {loading && (
        <p className="text-gray-500 mb-4">Loading orders...</p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-4 rounded shadow">
            
            {/* ORDER HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">Order ID: {order.id}</p>
                <p className="text-sm text-gray-500">
                  Total: ${order.total}
                </p>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-medium">{order.status}</span>
                </p>
              </div>

              {/* STATUS ACTIONS */}
              <div className="space-x-2">
                <button
                  onClick={() => updateStatus(order.id, "pending")}
                  className="px-2 py-1 bg-yellow-400 text-white"
                >
                  Pending
                </button>

                <button
                  onClick={() => updateStatus(order.id, "shipped")}
                  className="px-2 py-1 bg-blue-500 text-white"
                >
                  Shipped
                </button>

                <button
                  onClick={() => updateStatus(order.id, "delivered")}
                  className="px-2 py-1 bg-green-600 text-white"
                >
                  Delivered
                </button>
              </div>
            </div>

            {/* ORDER ITEMS (DISABLED FOR NOW) */}
            <div className="mt-4 border-t pt-3">
              <p className="text-sm text-gray-400 italic">
                Order items view disabled (table not set up yet)
              </p>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
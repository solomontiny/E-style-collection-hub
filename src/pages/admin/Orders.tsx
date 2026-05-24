import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false });

    if (!error) {
      setOrders(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    // initial load
    fetchOrders();

    // auto refresh every 5 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    // cleanup
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (!error) {
      fetchOrders(); // refresh immediately after update
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
          <div
            key={order.id}
            className="bg-white p-4 rounded shadow"
          >
            {/* ORDER HEADER */}
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">
                  Order ID: {order.id}
                </p>

                <p className="text-sm text-gray-500">
                  Total: ${order.total}
                </p>

                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span className="font-medium">
                    {order.status}
                  </span>
                </p>
              </div>

              {/* STATUS ACTIONS */}
              <div className="space-x-2">
                <button
                  onClick={() =>
                    updateStatus(order.id, "pending")
                  }
                  className="px-2 py-1 bg-yellow-400 text-white"
                >
                  Pending
                </button>

                <button
                  onClick={() =>
                    updateStatus(order.id, "shipped")
                  }
                  className="px-2 py-1 bg-blue-500 text-white"
                >
                  Shipped
                </button>

                <button
                  onClick={() =>
                    updateStatus(order.id, "delivered")
                  }
                  className="px-2 py-1 bg-green-600 text-white"
                >
                  Delivered
                </button>
              </div>
            </div>

            {/* ORDER ITEMS */}
            {order.order_items?.length > 0 && (
              <div className="mt-4 border-t pt-3">
                <p className="text-sm font-semibold mb-2">
                  Items:
                </p>

                <div className="space-y-1">
                  {order.order_items.map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600"
                      >
                        • {item.product_name} × {item.quantity} — ${item.price}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
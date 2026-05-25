const fetchProducts = async () => {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  setProducts(data || []);
};

const fetchOrders = async () => {
  setLoading(true);
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (data && data.length > 0) {
    const { data: items } = await supabase.from('order_items').select('*');
    const withItems = data.map((order) => ({
      ...order,
      items: (items || []).filter((i) => i.order_id === order.id),
    }));
    setOrders(withItems);

    // Build customer list from orders
    const customerMap = new Map<string, CustomerInfo>();
    data.forEach((order) => {
      const key = order.email;
      const existing = customerMap.get(key);
      if (existing) {
        existing.orders += 1;
        existing.total += Number(order.total);
        if (new Date(order.created_at) > new Date(existing.lastOrder)) {
          existing.lastOrder = order.created_at;
        }
      } else {
        customerMap.set(key, {
          email: order.email,
          name: order.full_name,
          orders: 1,
          total: Number(order.total),
          lastOrder: order.created_at,
        });
      }
    });
    setCustomers(Array.from(customerMap.values()).sort((a, b) => b.total - a.total));
  } else {
    const local = JSON.parse(localStorage.getItem('eclection_orders') || '[]');
    setOrders(local);
  }
  setLoading(false);
};
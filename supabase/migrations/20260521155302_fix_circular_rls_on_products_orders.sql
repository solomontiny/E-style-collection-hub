/*
  # Fix circular RLS policies on products, orders, and order_items

  All admin policies on these tables had the same circular reference:
  `EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')`
  
  This queries the profiles table, which is protected by RLS, creating a deadlock.
  The admin check would fail because the profiles SELECT policy itself was circular.

  Now that we have the `is_admin()` SECURITY DEFINER helper function,
  we replace all circular subqueries with `public.is_admin()`.

  Tables affected:
  - products (UPDATE, DELETE)
  - orders (UPDATE, DELETE)
  - order_items (UPDATE, DELETE)
*/

-- Products: fix admin policies
DROP POLICY IF EXISTS "Admin can update products" ON public.products;
DROP POLICY IF EXISTS "Admin can delete products" ON public.products;

CREATE POLICY "Admin can update products"
  ON public.products FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete products"
  ON public.products FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Orders: fix admin policies
DROP POLICY IF EXISTS "Admin can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admin can delete orders" ON public.orders;

CREATE POLICY "Admin can update orders"
  ON public.orders FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete orders"
  ON public.orders FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- Order items: fix admin policies
DROP POLICY IF EXISTS "Admin can update order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin can delete order items" ON public.order_items;

CREATE POLICY "Admin can update order items"
  ON public.order_items FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin can delete order items"
  ON public.order_items FOR DELETE
  TO authenticated
  USING (public.is_admin());

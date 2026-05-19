/*
  # Fix Security Issues

  1. Function `handle_new_user`
    - Set immutable search_path to prevent search path injection
    - Revoke EXECUTE from anon and authenticated (only trigger should call it)

  2. Products RLS Policies
    - Replace permissive authenticated write policies with admin-only policies
    - Only admin users can INSERT, UPDATE, DELETE products
    - SELECT remains public

  3. Orders RLS Policies
    - Replace "Anyone can insert" with a policy that allows anon/authenticated to insert
      but only with valid required fields (email, full_name)
    - Replace "Anyone can update" with admin-only update policy
    - Replace "Authenticated can delete" with admin-only delete policy
    - SELECT remains available to all (for order lookup)

  4. Order Items RLS Policies
    - Replace permissive authenticated write policies with admin-only
    - Allow anon/authenticated to INSERT order_items only when the parent order exists
    - UPDATE and DELETE restricted to admin only
    - SELECT remains available to all

  5. Security Notes
    - All write operations on products, order updates/deletes now require admin role
    - Anon users can only create orders and their items (for checkout flow)
    - The handle_new_user function can no longer be called via REST API
*/

-- ============================================================
-- 1. Fix handle_new_user: immutable search_path + revoke execute
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'customer'
  );
  RETURN NEW;
END;
$$;

-- Revoke execute from anon and authenticated so it can only be called by the trigger
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- ============================================================
-- 2. Fix Products RLS: admin-only write
-- ============================================================

-- Drop old permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;

-- Admin-only insert
CREATE POLICY "Admin can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin-only update
CREATE POLICY "Admin can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin-only delete
CREATE POLICY "Admin can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 3. Fix Orders RLS: restrict anon insert, admin-only update/delete
-- ============================================================

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can insert orders" ON orders;
DROP POLICY IF EXISTS "Anyone can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can insert orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can delete orders" ON orders;
DROP POLICY IF EXISTS "Anyone can read orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can read orders" ON orders;

-- Anyone can read orders (needed for order lookup by email)
CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anon/authenticated can insert orders (checkout flow) with required fields
CREATE POLICY "Customers can place orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL AND email != '' AND
    full_name IS NOT NULL AND full_name != ''
  );

-- Admin-only update
CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin-only delete
CREATE POLICY "Admin can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ============================================================
-- 4. Fix Order Items RLS: restrict anon insert, admin-only update/delete
-- ============================================================

-- Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can insert order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can read order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can insert order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can update order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can delete order items" ON order_items;
DROP POLICY IF EXISTS "Authenticated users can read order items" ON order_items;

-- Anyone can read order items (for order details lookup)
CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Anon/authenticated can insert order items only for valid orders
CREATE POLICY "Customers can add order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
    )
  );

-- Admin-only update
CREATE POLICY "Admin can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin-only delete
CREATE POLICY "Admin can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

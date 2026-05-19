/*
  # Add Auth Schema, Admin Role, and Public Order Access

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, user email)
      - `full_name` (text, display name)
      - `role` (text, 'admin' or 'customer', default 'customer')
      - `phone` (text, optional phone number)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `profiles`
    - Users can read their own profile
    - Admin users can read all profiles
    - Users can update their own profile
    - Admin users can update any profile

  3. Policy Changes
    - Allow anonymous (unauthenticated) users to INSERT orders
    - Allow anonymous users to INSERT order_items
    - Allow anonymous users to read orders by email (for order lookup)

  4. Notes
    - The admin account sojirin.solomon@yahoo.com should be created via Supabase Auth
    - After signup, their profile role should be set to 'admin' via SQL
    - A trigger auto-creates a profile when a new user signs up
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL DEFAULT '',
  full_name text DEFAULT '',
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admin users can read all profiles
CREATE POLICY "Admin can read all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin can update any profile
CREATE POLICY "Admin can update any profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Allow inserting profiles (for signup trigger)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Allow anonymous order creation (checkout without auth)
CREATE POLICY "Anyone can insert orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous order items creation
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anonymous users to read orders (for order lookup by email)
CREATE POLICY "Anyone can read orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anonymous users to read order items
CREATE POLICY "Anyone can read order items"
  ON order_items FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anonymous users to update orders (for status changes from webhook etc)
CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Add index on profiles role for admin lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

/*
  # Fix circular RLS policy on profiles table

  The "Admin can read all profiles" SELECT policy was circular:
  it queried the profiles table itself to check if the current user is admin,
  which is blocked by RLS, creating a deadlock. This meant admins could
  only read their own profile (via the "Users can read own profile" policy),
  not all profiles.

  Similarly, the "Admin can update any profile" UPDATE policy had the same
  circular reference issue.

  Fix: Replace circular subquery with a check against auth.users raw_app_meta_data
  or use a SECURITY DEFINER helper function that bypasses RLS to check admin status.

  Approach: Create a helper function `is_admin()` that runs as SECURITY DEFINER
  (executes with owner privileges, bypassing RLS) to check if the current user
  has admin role in profiles. Then use this function in RLS policies.

  1. New function: `public.is_admin()` - SECURITY DEFINER, returns boolean
  2. Drop old circular policies
  3. Create new policies using `is_admin()`
*/

-- 1. Create helper function that checks admin status without RLS interference
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Revoke public execute on this function (only system should use it)
REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
REVOKE ALL ON FUNCTION public.is_admin() FROM authenticated;

-- 3. Drop the old circular policies
DROP POLICY IF EXISTS "Admin can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;

-- 4. Create new non-circular policies using is_admin()
CREATE POLICY "Admin can read all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin can update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

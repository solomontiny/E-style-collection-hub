-- Add collections table and extra product columns

CREATE TABLE IF NOT EXISTS public.collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text DEFAULT '',
  image text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Collections publicly readable"
  ON public.collections FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Admin insert collections"
  ON public.collections FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admin update collections"
  ON public.collections FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin delete collections"
  ON public.collections FOR DELETE TO authenticated
  USING (public.is_admin());

-- Add columns to products if not already there
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='collection_id') THEN
    ALTER TABLE public.products ADD COLUMN collection_id uuid REFERENCES public.collections(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock_quantity') THEN
    ALTER TABLE public.products ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='sku') THEN
    ALTER TABLE public.products ADD COLUMN sku text DEFAULT '';
  END IF;
END $$;

-- Admin can insert products (ensure this policy exists)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Admin can insert products'
  ) THEN
    CREATE POLICY "Admin can insert products"
      ON public.products FOR INSERT TO authenticated
      WITH CHECK (public.is_admin());
  END IF;
END $$;

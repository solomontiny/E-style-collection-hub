/*
  # Add phone column to orders table

  1. Changes
    - Add `phone` column (text, optional) to the `orders` table
    - This allows customers to provide a phone number during checkout

  2. Notes
    - Column is nullable since existing orders don't have phone numbers
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'phone'
  ) THEN
    ALTER TABLE orders ADD COLUMN phone text DEFAULT '';
  END IF;
END $$;

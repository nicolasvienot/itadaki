-- Add optional location data to dish_checks so users can record where they tried each dish.

ALTER TABLE dish_checks
  ADD COLUMN IF NOT EXISTS restaurant_name TEXT,
  ADD COLUMN IF NOT EXISTS restaurant_area TEXT,
  ADD COLUMN IF NOT EXISTS restaurant_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS restaurant_lng DOUBLE PRECISION;

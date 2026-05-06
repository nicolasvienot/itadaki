-- Enable anonymous auth in Supabase dashboard:
-- Authentication > Providers > Anonymous sign-ins > Enable

-- Storage: create a "dish-photos" bucket (public)

CREATE TABLE IF NOT EXISTS dish_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  dish_id TEXT NOT NULL,
  destination_id TEXT NOT NULL,
  tried_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  note TEXT,
  photo_url TEXT,
  UNIQUE (user_id, dish_id)
);

CREATE TABLE IF NOT EXISTS active_destinations (
  user_id UUID NOT NULL,
  destination_id TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, destination_id)
);

-- Row-Level Security
ALTER TABLE dish_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_destinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own checks"
  ON dish_checks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own checks"
  ON dish_checks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own checks"
  ON dish_checks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users read own destinations"
  ON active_destinations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own destinations"
  ON active_destinations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Grant table-level access to authenticated role (required even with RLS)
-- Anonymous auth users receive the 'authenticated' role in Supabase
GRANT SELECT, INSERT, UPDATE ON public.dish_checks TO authenticated;
GRANT SELECT, INSERT ON public.active_destinations TO authenticated;

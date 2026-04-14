
-- People table
CREATE TABLE public.people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  engagement TEXT NOT NULL DEFAULT 'regular',
  roles TEXT[] NOT NULL DEFAULT '{}',
  tags TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT NOT NULL DEFAULT '',
  follow_up_notes TEXT NOT NULL DEFAULT '',
  ministries TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON public.people FOR ALL USING (true) WITH CHECK (true);

-- Group types table
CREATE TABLE public.group_types (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  color TEXT NOT NULL
);

ALTER TABLE public.group_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON public.group_types FOR ALL USING (true) WITH CHECK (true);

-- Groups table
CREATE TABLE public.groups (
  id TEXT PRIMARY KEY,
  type_id TEXT NOT NULL REFERENCES public.group_types(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  members TEXT[] NOT NULL DEFAULT '{}',
  member_legends JSONB NOT NULL DEFAULT '{}'
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON public.groups FOR ALL USING (true) WITH CHECK (true);

-- One-to-ones table
CREATE TABLE public.one_to_ones (
  id TEXT PRIMARY KEY,
  person_a TEXT NOT NULL,
  person_b TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'regular',
  notes TEXT NOT NULL DEFAULT ''
);

ALTER TABLE public.one_to_ones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON public.one_to_ones FOR ALL USING (true) WITH CHECK (true);

-- Categories table (ministries, roles, tags)
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  UNIQUE(type, value)
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public access" ON public.categories FOR ALL USING (true) WITH CHECK (true);

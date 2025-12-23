-- Final Schema Guard: Re-enforce correct schema and policies
-- This script ensures all tables have the expected structure regardless of previous errors.

-- Ensure is_admin exists in profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Ensure issues has all necessary columns
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS resolved BOOLEAN DEFAULT false;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS resolved_by UUID REFERENCES auth.users(id);

-- Verify all tables have RLS enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Re-create public read access for all main tables to ensure they work
DO $$ 
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY['profiles', 'resources', 'issues', 'comments', 'announcements', 'events', 'jobs', 'study_groups', 'scholarships'])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Public read access" ON public.%I', table_name);
    EXECUTE format('CREATE POLICY "Public read access" ON public.%I FOR SELECT USING (true)', table_name);
  END LOOP;
END $$;


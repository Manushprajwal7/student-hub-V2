-- Fix the relationship between issues and profiles tables
-- This migration creates the required foreign key relationship that allows querying with joins

-- Since both issues.user_id and profiles.user_id reference auth.users(id),
-- we need to make sure the relationship is properly recognized by Supabase.
-- The constraint name fk_user_id is expected by the system for the relationship.

-- First, ensure the proper indexes exist
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON public.issues(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Create a foreign key constraint with the expected name that represents
-- the relationship between issues and profiles through the user_id
-- This will allow Supabase to recognize the relationship for queries
ALTER TABLE public.issues DROP CONSTRAINT IF EXISTS fk_user_id;
ALTER TABLE public.issues ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

-- Also make sure the resolved_by column has proper constraint
ALTER TABLE public.issues DROP CONSTRAINT IF EXISTS issues_resolved_by_fkey;
ALTER TABLE public.issues ADD CONSTRAINT issues_resolved_by_fkey FOREIGN KEY (resolved_by) REFERENCES auth.users(id);

-- Refresh the schema cache to recognize the new relationships
NOTIFY pgrst, 'reload schema';
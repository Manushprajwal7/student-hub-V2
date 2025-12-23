-- Superseded by 008_fix_comments_relationships.sql
-- This file is kept for sequence integrity but the logic is handled in 008.
/*
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
*/


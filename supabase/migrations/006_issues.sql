-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.comments;
DROP TABLE IF EXISTS public.issues;

-- Create issues table
CREATE TABLE public.issues (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  upvotes UUID[] DEFAULT ARRAY[]::UUID[],
  downvotes UUID[] DEFAULT ARRAY[]::UUID[],
  reports UUID[] DEFAULT ARRAY[]::UUID[],
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_category CHECK (
    category IN (
      'Teaching',
      'Women Rights',
      'Ragging',
      'Cultural Events',
      'Campus',
      'Sports',
      'Fest',
      'Infrastructure',
      'Academics',
      'Student Services',
      'Extracurricular Activities'
    )
  )
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  issue_id UUID REFERENCES public.issues(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_issues_user_id ON public.issues(user_id);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_resolved ON public.issues(resolved);
CREATE INDEX IF NOT EXISTS idx_comments_issue_id ON public.comments(issue_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

-- Enable RLS
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for issues
DROP POLICY IF EXISTS "Issues are viewable by everyone" ON public.issues;
CREATE POLICY "Issues are viewable by everyone"
  ON public.issues FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create issues" ON public.issues;
CREATE POLICY "Users can create issues"
  ON public.issues FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own issues" ON public.issues;
CREATE POLICY "Users can update their own issues"
  ON public.issues FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for comments
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can create comments" ON public.comments;
CREATE POLICY "Users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
CREATE POLICY "Users can update their own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin policies
DROP POLICY IF EXISTS "Admins can update issues" ON public.issues;
CREATE POLICY "Admins can update issues"
ON public.issues
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE profiles.user_id = auth.uid()
      AND profiles.is_admin = true
  )
);

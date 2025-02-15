// In types/issues.ts
export interface IssueWithUser {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  reports: string[];
  user_id: string;
  created_at: string;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  updated_at: string;
  upvotes: string[];
  downvotes: string[];
  user?: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

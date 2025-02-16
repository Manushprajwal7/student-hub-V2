export type IssueCategory =
  | "Teaching"
  | "Women Rights"
  | "Ragging"
  | "Cultural Events"
  | "Campus"
  | "Sports"
  | "Fest"
  | "Infrastructure"
  | "Academics"
  | "Student Services"
  | "Extracurricular Activities";

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: IssueCategory;
  tags: string[];
  upvotes: string[]; // Array of user IDs who upvoted
  downvotes: string[]; // Array of user IDs who downvoted
  created_at: string;
  user_id: string;
  reports: string[]; // Array of user IDs who reported
}

export interface Comment {
  id: string;
  issue_id: string;
  content: string;
  parent_id: string | null; // For nested replies
  likes: string[]; // Array of user IDs who liked
  created_at: string;
  user_id: string;
}

export interface CommentWithUser extends Comment {
  user: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  replies?: CommentWithUser[]; // Add this line to support nested replies
}

export interface IssueWithUser {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  reports: string[]; // Add this line
  user_id: string;
  created_at: string;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  upvotes: string[];
  downvotes: string[];
  user: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

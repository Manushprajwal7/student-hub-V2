export type Subject =
  | "Computer Science"
  | "Electronics"
  | "Bio Technology"
  | "Mechanical"
  | "Mechanotronics"
  | "Civil";

export interface StudyGroupWithUser {
  id: string;
  name: string;
  description: string;
  subject: Subject;
  day: string;
  location: string;
  whatsapp_link: string;
  members: string[];
  user_id: string;
  created_at: string;
  user?: {
    user_id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

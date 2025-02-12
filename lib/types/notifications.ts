export interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  read: boolean;
  created_at: string;
  related_id: string;
  related_type: string;
  action_url: string;
}

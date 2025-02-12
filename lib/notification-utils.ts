import { supabase } from "@/lib/supabase";

interface NotificationData {
  userId: string;
  title: string;
  content: string;
  relatedId: string;
  relatedType: string;
  actionUrl: string;
}

export async function createNotification({
  userId,
  title,
  content,
  relatedId,
  relatedType,
  actionUrl,
}: NotificationData) {
  return await supabase.from("notifications").insert({
    user_id: userId,
    title,
    content,
    related_id: relatedId,
    related_type: relatedType,
    action_url: actionUrl,
    read: false,
  });
}

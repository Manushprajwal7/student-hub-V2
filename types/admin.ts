import { createClient } from "@supabase/supabase-js";

export interface AdminConfig {
  isAdmin: boolean;
}

export const checkIsAdmin = async (email: string): Promise<boolean> => {
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("Admin email not configured");
    return false;
  }

  return email.toLowerCase() === adminEmail.toLowerCase();
};

export const getAdminStatus = async (
  supabase: ReturnType<typeof createClient>
) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user?.email) return false;

    return checkIsAdmin(session.user.email);
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;

      if (data.session?.user) {
        // Generate an avatar URL
        const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
          data.session.user.email || data.session.user.id
        )}`;

        await supabase.from("profiles").upsert({
          user_id: data.session.user.id,
          full_name: data.session.user.user_metadata?.full_name || "User",
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });
      }

      // Redirect with query parameters
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/login?verified=true&refresh=true`
      );
    } catch (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_SITE_URL}/login?error=verification_failed`
      );
    }
  }

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL}/login?error=invalid_code`
  );
}

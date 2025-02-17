import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const PRODUCTION_URL = "https://student-hub-mp.vercel.app";

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

      // Exchange the code for a session
      const {
        data: { session },
        error,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(
          `${PRODUCTION_URL}/login?error=Authentication failed`
        );
      }

      // If we have a session, update the user's profile
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        // If profile doesn't exist, create it with basic info
        if (!profile) {
          await supabase.from("profiles").insert([
            {
              user_id: session.user.id,
              full_name: session.user.user_metadata.full_name || "User",
              avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                session.user.user_metadata.full_name || session.user.id
              )}`,
              is_admin: false,
            },
          ]);
        }

        // Set the session cookie
        const response = NextResponse.redirect(`${PRODUCTION_URL}`);

        // Set auth cookie with session
        response.cookies.set("sb-auth-token", session.access_token, {
          path: "/",
          secure: true,
          sameSite: "lax",
          maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;
      }
    }

    // If no code or session, redirect to login
    return NextResponse.redirect(
      `${PRODUCTION_URL}/login?error=Verification failed`
    );
  } catch (error) {
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${PRODUCTION_URL}/login?error=Authentication failed`
    );
  }
}

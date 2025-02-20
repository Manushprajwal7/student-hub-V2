// app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const supabase = createRouteHandlerClient({ cookies });

  if (code) {
    try {
      // Exchange the code for a session
      const {
        data: { session },
        error: exchangeError,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) throw exchangeError;

      if (session) {
        // Set session in the cookie
        await supabase.auth.setSession(session);

        // Redirect to home with success parameter
        return NextResponse.redirect(new URL("/?auth=success", request.url));
      }
    } catch (error) {
      console.error("Error in auth callback:", error);
      return NextResponse.redirect(
        new URL("/login?error=auth_callback_error", request.url)
      );
    }
  }

  return NextResponse.redirect(new URL("/login?error=no_code", request.url));
}

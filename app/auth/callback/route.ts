// app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  
  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    
    try {
      const { data: { session }, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        throw exchangeError;
      }

      // If we have a session, update it in the browser
      if (session) {
        // Set the auth cookie
        const response = NextResponse.redirect(new URL(`${next}?verified=true`, request.url));
        
        // Set cookie with auth state
        response.cookies.set('supabase-auth-token', JSON.stringify(session), {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 1 week
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });

        return response;
      }
    } catch (error) {
      console.error('Auth callback error:', error);
      // Redirect to login with error
      return NextResponse.redirect(
        new URL('/login?error=auth_callback_error', request.url)
      );
    }
  }

  // Return to login if no code was provided
  return NextResponse.redirect(
    new URL('/login?error=no_code', request.url)
  );
}
import { NextRequest, NextResponse } from "next/server";
// IMPORTANT: Use a server-side Supabase client (not the one meant for the browser).
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse the incoming JSON body
    const { issue_id, user_id } = await req.json();

    // 2. Use a *server-side* supabase client so we have access to RLS or service role
    const supabase = createRouteHandlerClient({ cookies });

    // 3. Attempt to update
    const { data, error } = await supabase
      .from("issues")
      .update({
        resolved: true,
        resolved_by: user_id,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", issue_id)
      .select(); // or .single()

    // 4. Handle errors
    if (error) {
      throw error;
    }

    // 5. Return success
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error("Failed to resolve issue:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const checkIsAdmin = (email: string): boolean => {
  try {
    if (!process.env.NEXT_PUBLIC_ADMIN_EMAILS) {
      console.error("NEXT_PUBLIC_ADMIN_EMAILS is not defined in .env file.");
      return false;
    }
    const adminEmails = JSON.parse(process.env.NEXT_PUBLIC_ADMIN_EMAILS);
    if (!Array.isArray(adminEmails)) {
      console.error("NEXT_PUBLIC_ADMIN_EMAILS is not a valid JSON array.");
      return false;
    }
    return adminEmails.includes(email.toLowerCase());
  } catch (error) {
    console.error("Error parsing admin emails:", error);
    return false;
  }
};

// Helper function to update the admin flag in the Supabase profiles table.
const updateAdminFlag = async (
  supabase: ReturnType<typeof createClientComponentClient>,
  userId: string,
  isAdmin: boolean
) => {
  try {
    await supabase
      .from("profiles")
      .update({ is_admin: isAdmin })
      .eq("user_id", userId);
  } catch (error) {
    console.error("Error updating admin flag in profile:", error);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    user: null as User | null,
    session: null as Session | null,
    isLoading: true,
    isAdmin: false,
  });

  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        const isAdmin = session?.user?.email
          ? checkIsAdmin(session.user.email)
          : false;

        // If the user is admin, update their profile accordingly.
        if (session?.user && isAdmin) {
          await updateAdminFlag(supabase, session.user.id, true);
        }

        setState({
          session,
          user: session?.user ?? null,
          isLoading: false,
          isAdmin,
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAdmin: false,
        });
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const isAdmin = session?.user?.email
        ? checkIsAdmin(session.user.email)
        : false;

      // Update the profile's admin flag on auth state change if needed.
      if (session?.user && isAdmin) {
        await updateAdminFlag(supabase, session.user.id, true);
      }

      setState({
        session,
        user: session?.user ?? null,
        isLoading: false,
        isAdmin,
      });

      console.log("Admin Check Updated:", isAdmin);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const signIn = async (email: string, password: string, fullName: string) => {
    try {
      let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error && error.message === "Invalid login credentials") {
        // If login fails, sign up the user.
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (signUpError) throw new Error(signUpError.message);
        if (!signUpData.user) throw new Error("User registration failed.");

        const isAdmin = checkIsAdmin(email);

        // Upsert the user profile including the admin flag if applicable.
        const { error: upsertError } = await supabase.from("profiles").upsert(
          {
            user_id: signUpData.user.id,
            full_name: fullName,
            avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
              fullName
            )}`,
            is_admin: isAdmin,
          },
          { onConflict: "user_id" }
        );

        if (upsertError) throw upsertError;

        throw new Error(
          "A confirmation email has been sent. Please verify your email before logging in."
        );
      }

      if (data.session) {
        // Update profile for existing users if needed.
        const isAdmin = checkIsAdmin(email);
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            user_id: data.session.user.id,
            full_name: fullName,
            is_admin: isAdmin,
          },
          { onConflict: "user_id" }
        );

        if (profileError) throw profileError;

        if (isAdmin) {
          await updateAdminFlag(supabase, data.session.user.id, true);
        }

        setState((prev) => ({
          ...prev,
          isAdmin,
        }));

        router.refresh();
        router.push("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setState({
        user: null,
        session: null,
        isLoading: false,
        isAdmin: false,
      });

      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

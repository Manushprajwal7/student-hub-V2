"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ isNewUser: boolean }>;
  signOut: () => Promise<void>;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  isAdmin: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/auth/callback",
        data: { full_name: fullName },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        throw new Error("Email already registered. Please sign in.");
      }
      throw error;
    }
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

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

        if (session?.user) {
          const isAdmin = session.user.email
            ? checkIsAdmin(session.user.email)
            : false;

          // Ensure profile exists
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (!profile) {
            await supabase.from("profiles").insert([
              {
                user_id: session.user.id,
                full_name: session.user.user_metadata.full_name || "User",
                avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                  session.user.user_metadata.full_name || "User"
                )}`,
                is_admin: isAdmin,
              },
            ]);
          }

          setState({
            session,
            user: session.user,
            isLoading: false,
            isAdmin,
          });
        } else {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAdmin: false,
          });
        }
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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          const isAdmin = session.user.email
            ? checkIsAdmin(session.user.email)
            : false;

          // Check and create profile if needed
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (!profile) {
            await supabase.from("profiles").insert([
              {
                user_id: session.user.id,
                full_name: session.user.user_metadata.full_name || "User",
                avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
                  session.user.user_metadata.full_name || "User"
                )}`,
                is_admin: isAdmin,
              },
            ]);
          }

          setState({
            session,
            user: session.user,
            isLoading: false,
            isAdmin,
          });

          router.refresh();
        }
      }

      if (event === "SIGNED_OUT") {
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAdmin: false,
        });
        router.refresh();
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message === "Email not confirmed") {
          throw new Error("Please verify your email before signing in");
        }
        throw error;
      }

      if (data.user && !data.user.email_confirmed_at) {
        throw new Error("Email not confirmed");
      }

      router.push("/");
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

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const now = Math.floor(Date.now() / 1000);
        if (session.expires_at && session.expires_at < now) {
          const {
            data: { session: newSession },
          } = await supabase.auth.refreshSession();
          if (newSession) {
            setState((prev) => ({
              ...prev,
              session: newSession,
              user: newSession.user,
            }));
          }
        }
      }
    };

    const interval = setInterval(checkSession, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, signUp }}>
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

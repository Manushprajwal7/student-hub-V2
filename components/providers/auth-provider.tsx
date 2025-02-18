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
  refreshSession: () => Promise<void>;
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

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      if (data.session?.user) {
        const isAdmin = checkIsAdmin(data.session.user.email || "");
        setState({
          session: data.session,
          user: data.session.user,
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
      console.error("Session refresh error:", error);
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAdmin: false,
      });
    }
  };
  useEffect(() => {
    const initializeAuth = async () => {
      await refreshSession();
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        await refreshSession();
        router.refresh();
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

  return (
    <AuthContext.Provider value={{ ...state, refreshSession }}>
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

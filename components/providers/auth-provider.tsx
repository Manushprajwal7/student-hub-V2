"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Session, User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
}

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a broadcast channel for cross-tab communication
const authChannel =
  typeof window !== "undefined" ? new BroadcastChannel("auth_channel") : null;

const checkIsAdmin = (email: string): boolean => {
  try {
    if (!process.env.NEXT_PUBLIC_ADMIN_EMAILS) return false;
    const adminEmails = JSON.parse(process.env.NEXT_PUBLIC_ADMIN_EMAILS);
    return Array.isArray(adminEmails)
      ? adminEmails.includes(email.toLowerCase())
      : false;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

const createProfileIfNeeded = async (
  supabase: ReturnType<typeof createClientComponentClient>,
  user: User,
  isAdmin: boolean
) => {
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    await supabase.from("profiles").insert([
      {
        user_id: user.id,
        full_name: user.user_metadata.full_name || "User",
        avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
          user.user_metadata.full_name || user.email || "User"
        )}`,
        is_admin: isAdmin,
      },
    ]);
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAdmin: false,
  });

  const router = useRouter();
  const supabase = createClientComponentClient();

  // Function to update auth state
  const updateAuthState = async (session: Session | null) => {
    if (session?.user) {
      const isAdmin = session.user.email
        ? checkIsAdmin(session.user.email)
        : false;
      setState({
        session,
        user: session.user,
        isLoading: false,
        isAdmin,
      });

      await createProfileIfNeeded(supabase, session.user, isAdmin);
    } else {
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAdmin: false,
      });
    }
  };

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        await updateAuthState(session);
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

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      await updateAuthState(session);

      if (event === "SIGNED_IN") {
        router.refresh();
        // Broadcast sign-in event to other tabs
        authChannel?.postMessage({ type: "SIGNED_IN", session });
      } else if (event === "SIGNED_OUT") {
        router.refresh();
        router.push("/login");
        // Broadcast sign-out event to other tabs
        authChannel?.postMessage({ type: "SIGNED_OUT" });
      }
    });

    // Listen for auth events from other tabs
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.data.type === "SIGNED_IN") {
        await updateAuthState(event.data.session);
        router.refresh();
      } else if (event.data.type === "SIGNED_OUT") {
        await updateAuthState(null);
        router.refresh();
        router.push("/login");
      }
    };

    authChannel?.addEventListener("message", handleAuthMessage);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      authChannel?.removeEventListener("message", handleAuthMessage);
    };
  }, [supabase, router]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new Error("unverified_email");
        }
        throw new Error("Invalid credentials");
      }

      if (data.user && !data.user.email_confirmed_at) {
        throw new Error("unverified_email");
      }

      if (data.session) {
        await updateAuthState(data.session);
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
      await supabase.auth.signOut();
      await updateAuthState(null);
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
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

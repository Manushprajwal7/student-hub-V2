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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState({
    user: null as User | null,
    session: null as Session | null,
    isLoading: true,
  });

  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        setState({
          session,
          user: session?.user ?? null,
          isLoading: false,
        });
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState({
          user: null,
          session: null,
          isLoading: false,
        });
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState({
        session,
        user: session?.user ?? null,
        isLoading: false,
      });
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
        // If login fails, sign up the user
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
          });

        if (signUpError) throw new Error(signUpError.message);
        if (!signUpData.user) throw new Error("User registration failed.");

        // Insert or update user profile after signing up
        const { error: upsertError } = await supabase.from("profiles").upsert(
          {
            user_id: signUpData.user.id,
            full_name: fullName,
            avatar_url: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(
              fullName
            )}`,
          },
          { onConflict: "user_id" }
        );

        if (upsertError) throw upsertError;

        throw new Error(
          "A confirmation email has been sent. Please verify your email before logging in."
        );
      }

      if (data.session) {
        // Update profile for existing users if needed
        const { error: profileError } = await supabase.from("profiles").upsert(
          {
            user_id: data.session.user.id,
            full_name: fullName,
          },
          { onConflict: "user_id" }
        );

        if (profileError) throw profileError;

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

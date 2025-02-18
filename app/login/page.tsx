"use client";

import { useEffect, Suspense } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignInForm } from "@/components/auth/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const router = useAuth();
  const { refreshSession, user } = useAuth();

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh) {
      router.refresh();
    }
  }, [searchParams, router]);

  const error = searchParams.get("error");
  const verified = searchParams.get("verified");

  return (
    <>
      {verified && (
        <Alert variant="success" className="mb-4">
          Email verified successfully! Please sign in.
        </Alert>
      )}

      {error === "unverified_email" && (
        <Alert variant="destructive" className="mb-4">
          You must confirm your email before signing in.
        </Alert>
      )}

      {error === "invalid_credentials" && (
        <Alert variant="destructive" className="mb-4">
          Invalid email or password
        </Alert>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your email and password to sign in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading...</p>}>
            <SearchParamsWrapper />
          </Suspense>
          <SignInForm />
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm">
        Don't have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}

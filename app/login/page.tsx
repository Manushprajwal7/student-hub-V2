"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
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

          <Suspense fallback={<div>Loading...</div>}>
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

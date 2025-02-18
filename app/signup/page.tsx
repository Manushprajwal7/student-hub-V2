"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  const verificationSent = searchParams.get("verificationSent");
  const error = searchParams.get("error");

  return (
    <>
      {verificationSent && (
        <Alert variant="success" className="mb-4">
          A confirmation email has been sent to your registered email ID. Please
          check your inbox and verify your email to proceed.
        </Alert>
      )}

      {error === "unverified_email" && (
        <Alert variant="destructive" className="mb-4">
          You must confirm your email before signing in.
        </Alert>
      )}
    </>
  );
}

export default function SignUpPage() {
  const { user } = useAuth();

  // Redirect authenticated users to the home page
  useEffect(() => {
    if (user) {
      window.location.href = "/";
    }
  }, [user]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading...</p>}>
            <SearchParamsWrapper />
          </Suspense>
          <SignUpForm />
        </CardContent>
      </Card>

      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

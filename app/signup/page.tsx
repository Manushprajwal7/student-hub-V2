"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SignUpForm } from "@/components/auth/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const verificationSent = searchParams.get("verificationSent");
  const error = searchParams.get("error");

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
          {verificationSent && (
            <Alert variant="success" className="mb-4">
              A confirmation email has been sent to your registered email ID.
              Please check your inbox and verify your email to proceed.
            </Alert>
          )}

          {error === "unverified_email" && (
            <Alert variant="destructive" className="mb-4">
              You must confirm your email before signing in.
            </Alert>
          )}

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

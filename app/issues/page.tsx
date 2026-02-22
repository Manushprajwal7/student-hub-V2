import { Metadata } from "next";
import { IssuesPageClient } from "@/components/issues/issues-page-client";

export const metadata: Metadata = {
  title: "Community Issues & Grievances",
  description: "Browse and vote on community-reported issues, from infrastructure problems to academic concerns. Join the conversation and help improve our campus.",
  keywords: ["student issues", "campus grievances", "teaching quality", "infrastructure reporting", "student hub"],
  openGraph: {
    title: "Community Issues | Student Hub",
    description: "Voice your concerns and vote on campus issues.",
  }
};

export default function IssuesPage() {
  return <IssuesPageClient />;
}

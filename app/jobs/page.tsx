import { Metadata } from "next";
import { JobsPageClient } from "@/components/jobs/jobs-page-client";

export const metadata: Metadata = {
  title: "Student Jobs & Internships",
  description: "Explore part-time jobs, full-time opportunities, and internships specifically for students. Jumpstart your career and find the perfect role matching your skills.",
  keywords: ["student jobs", "internships for students", "part-time work", "campus recruitment", "career opportunities", "student hub"],
  openGraph: {
    title: "Student Jobs | Student Hub",
    description: "Find the perfect job or internship to kickstart your career.",
  }
};

export default function JobsPage() {
  return <JobsPageClient />;
}

import { Metadata } from "next";
import { ScholarshipsPageClient } from "@/components/scholarships/scholarships-page-client";

export const metadata: Metadata = {
  title: "Scholarship Opportunities",
  description: "Find financial aid and scholarship opportunities tailored for university students. Browse national, state, and gender-specific scholarships to support your education.",
  keywords: ["scholarships", "financial aid", "university funding", "student grants", "education support", "student hub"],
  openGraph: {
    title: "Scholarships | Student Hub",
    description: "Discover and apply for scholarships to fund your education.",
  }
};

export default function ScholarshipsPage() {
  return <ScholarshipsPageClient />;
}

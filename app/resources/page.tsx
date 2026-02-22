import { Metadata } from "next";
import { ResourcesPageClient } from "@/components/resources/resources-page-client";

export const metadata: Metadata = {
  title: "Academic Resources & Notes",
  description: "Access and share high-quality study materials, textbooks, and notes tailored for your department and semester. Empower your learning journey with peer-contributed resources.",
  keywords: ["study materials", "university notes", "academic resources", "textbooks", "practice tests", "student hub"],
  openGraph: {
    title: "Academic Resources | Student Hub",
    description: "Browse and share education materials with your peers.",
  }
};

export default function ResourcesPage() {
  return <ResourcesPageClient />;
}

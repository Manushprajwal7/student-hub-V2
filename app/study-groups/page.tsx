import { Metadata } from "next";
import { StudyGroupsPageClient } from "@/components/study-groups/study-groups-page-client";

export const metadata: Metadata = {
  title: "Collaborative Study Groups",
  description: "Join or create study groups for various subjects like Computer Science, Electronics, and more. Collaborate with peers to enhance your understanding and excel in your academics.",
  keywords: ["study groups", "academic collaboration", "peer learning", "university study sessions", "collaborative learning", "student hub"],
  openGraph: {
    title: "Study Groups | Student Hub",
    description: "Connect with peers and learn together in focused study groups.",
  }
};

export default function StudyGroupsPage() {
  return <StudyGroupsPageClient />;
}

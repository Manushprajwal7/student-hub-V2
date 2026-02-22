import { Metadata } from "next";
import { AnnouncementsPageClient } from "@/components/announcements/announcements-page-client";

export const metadata: Metadata = {
  title: "Campus Announcements",
  description: "Stay informed with the latest campus news, academic deadlines, and official university announcements. Don't miss out on important updates.",
  keywords: ["campus news", "academic announcements", "university updates", "student notices", "student hub"],
  openGraph: {
    title: "Campus Announcements | Student Hub",
    description: "Important updates and news from your university community.",
  }
};

export default function AnnouncementsPage() {
  return <AnnouncementsPageClient />;
}

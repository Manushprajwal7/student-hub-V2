import { Metadata } from "next";
import { EventsPageClient } from "@/components/events/events-page-client";

export const metadata: Metadata = {
  title: "Campus Events & Workshops",
  description: "Discover upcoming campus events, from technical workshops to cultural fests. Stay connected with everything happening at your university.",
  keywords: ["campus events", "university workshops", "student meetups", "cultural fest", "technical events", "student hub"],
  openGraph: {
    title: "Campus Events | Student Hub",
    description: "Discover and participate in exciting university events.",
  }
};

export default function EventsPage() {
  return <EventsPageClient />;
}

import "./globals.css";
import { Providers } from "@/components/providers";
import MainNav from "@/components/main-nav";
import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import type React from "react";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Student Hub | Community Platform for University Students",
    template: "%s | Student Hub",
  },
  description: "A community-driven platform for university students to share resources, join study groups, discover events, and find opportunities.",
  keywords: [
    "student hub",
    "university community",
    "study resources",
    "campus events",
    "student jobs",
    "internships",
    "scholarships",
    "study groups",
    "academic collaboration",
  ],
  authors: [{ name: "Student Hub Team" }],
  creator: "Student Hub",
  publisher: "Student Hub",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://student-hub.com", // Placeholder URL
    title: "Student Hub",
    description: "The ultimate community platform for university students.",
    siteName: "Student Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Hub",
    description: "The ultimate community platform for university students.",
    creator: "@studenthub",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <div className="relative flex min-h-screen">
            <Sidebar />
            <div className="flex w-full flex-1 flex-col">
              <MainNav />
              <main className="flex-1 space-y-4 overflow-y-auto p-4 pt-20 pb-20 md:ml-56 md:pb-8 md:pt-20">
                {children}
              </main>
            </div>
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}

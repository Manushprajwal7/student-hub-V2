"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  GraduationCap,
  LifeBuoy,
  Megaphone,
  School,
  Users2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageTransition } from "@/components/page-transition";
import { useDashboardStats } from "@/lib/hooks/use-query-hooks";

const statConfig = [
  {
    id: "issues",
    title: "Active Issues",
    description: "Currently open issues",
    key: "issues" as const,
    icon: LifeBuoy,
    href: "/issues",
  },
  {
    id: "events",
    title: "Upcoming Events",
    description: "Events this week",
    key: "events" as const,
    icon: Calendar,
    href: "/events",
  },
  {
    id: "announcements",
    title: "Announcements",
    description: "Recent announcements",
    key: "announcements" as const,
    icon: Megaphone,
    href: "/announcements",
  },
  {
    id: "resources",
    title: "Learning Resources",
    description: "Available study materials",
    key: "resources" as const,
    icon: BookOpen,
    href: "/resources",
  },
  {
    id: "jobs",
    title: "Job Opportunities",
    description: "Available positions",
    key: "jobs" as const,
    icon: GraduationCap,
    href: "/jobs",
  },
  {
    id: "study-groups",
    title: "Study Groups",
    description: "Active study sessions",
    key: "studyGroups" as const,
    icon: Users2,
    href: "/study-groups",
  },
  {
    id: "scholarships",
    title: "Scholarships",
    description: "Available scholarships",
    key: "scholarships" as const,
    icon: School,
    href: "/scholarships",
  },
];

export function HomePageClient() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <section className="space-y-6 pb-4 pt-4 md:pb-8 md:pt-6 lg:py-24">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Welcome to Student Hub
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Your one-stop platform for academic collaboration, resources, and
              community engagement.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/study-groups">Join Study Groups</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/resources">Browse Resources</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-0 py-0 md:py-1 lg:py-0">
          <div className="mx-auto grid gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:grid-cols-4">
            {statConfig.map((stat) => (
              <Card
                key={stat.id}
                className="transition-colors hover:bg-muted/50"
              >
                <Link href={stat.href}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <stat.icon className="h-5 w-5" />
                      {stat.title}
                    </CardTitle>
                    <CardDescription>{stat.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <p className="text-2xl font-bold">
                        {stats?.[stat.key] ?? 0}
                      </p>
                    )}
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

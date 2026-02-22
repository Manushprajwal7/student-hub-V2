"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PageTransition } from "@/components/page-transition";
import { IssueCard } from "@/components/issues/issue-card";
import { CreateIssueDialog } from "@/components/issues/create-issue-dialog";
import { Button } from "@/components/ui/button";
import { SkeletonGrid } from "@/components/ui/skeleton-card";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useIssues } from "@/lib/hooks/use-query-hooks";
import type { IssueCategory } from "@/types/issues";

const categories: IssueCategory[] = [
  "Teaching",
  "Women Rights",
  "Ragging",
  "Cultural Events",
  "Campus",
  "Sports",
  "Fest",
  "Infrastructure",
  "Academics",
  "Student Services",
  "Extracurricular Activities",
];

export function IssuesPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | "All">("All");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: issues = [], isLoading, error } = useIssues(selectedCategory);

  const invalidateIssues = () => {
    queryClient.invalidateQueries({ queryKey: ["issues"] });
  };

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Community Issues</h1>
          <CreateIssueDialog onSuccess={invalidateIssues} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedCategory === "All" ? "secondary" : "outline"}
            onClick={() => setSelectedCategory("All")}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "secondary" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                category === "Teaching" && "text-blue-500",
                category === "Women Rights" && "text-purple-500",
                category === "Ragging" && "text-red-500",
                category === "Cultural Events" && "text-pink-500",
                category === "Campus" && "text-green-500",
                category === "Sports" && "text-orange-500",
                category === "Fest" && "text-yellow-500",
                category === "Infrastructure" && "text-gray-500",
                category === "Academics" && "text-indigo-500",
                category === "Student Services" && "text-teal-500",
                category === "Extracurricular Activities" && "text-cyan-500"
              )}
            >
              {category}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <SkeletonGrid count={6} cols="grid-cols-1" />
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive gap-2">
            <span className="font-bold">Failed to load issues.</span>
            <span className="text-xs font-mono">{(error as any)?.message || String(error)}</span>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : issues.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No issues found.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                currentUserId={user?.id}
                onVote={invalidateIssues}
              />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

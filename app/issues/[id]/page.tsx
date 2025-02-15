"use client";

import { createClient } from "@supabase/supabase-js"; // Ensure this import is at the top
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Comment } from "@/components/issues/comment";
import { PageTransition } from "@/components/page-transition";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";

interface User {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
}

interface IssueWithUser {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  reports: string[];
  user_id: string;
  created_at: string;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  user: User | null;
}

interface CommentWithUser {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  issue_id: string;
  parent_id: string | null;
  likes: string[];
  user: User;
  replies?: CommentWithUser[];
}

interface IssuePageProps {
  params: {
    id: string;
  };
}

const sortOptions = [
  { label: "Most Recent", value: "recent" },
  { label: "Most Liked", value: "liked" },
];

export default function IssuePage({ params }: IssuePageProps) {
  const [issue, setIssue] = useState<IssueWithUser | null>(null);
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolvingIssue, setIsResolvingIssue] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState("recent");
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAdmin } = useAuth();

  const loadComments = async (
    issueId: string,
    parentId: string | null = null
  ) => {
    try {
      let query = supabase.from("comments").select("*").eq("issue_id", issueId);

      if (parentId) {
        query = query.eq("parent_id", parentId);
      } else {
        query = query.is("parent_id", null);
      }

      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("likes", { ascending: false });
      }

      const { data: commentsData, error: commentsError } = await query;

      if (commentsError) throw commentsError;

      if (commentsData && commentsData.length > 0) {
        const userIds = [...new Set(commentsData.map((c) => c.user_id))];

        const { data: usersData, error: usersError } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        if (usersError) throw usersError;

        const userMap = (usersData || []).reduce((acc, user) => {
          acc[user.user_id] = user;
          return acc;
        }, {} as Record<string, any>);

        return commentsData.map((comment) => ({
          ...comment,
          user: userMap[comment.user_id] || {
            full_name: "Anonymous",
            avatar_url: null,
          },
        })) as CommentWithUser[];
      }

      return [];
    } catch (error) {
      console.error("Error in loadComments:", error);
      throw error;
    }
  };

  const loadIssueAndComments = async () => {
    try {
      setIsLoading(true);

      // Fetch issue data
      const { data: issueData, error: issueError } = await supabase
        .from("issues")
        .select("*")
        .eq("id", params.id)
        .single();

      if (issueError) throw issueError;

      if (!issueData) {
        throw new Error("Issue not found");
      }

      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .eq("user_id", issueData.user_id)
        .single();

      if (userError) {
        console.error("Error fetching user data:", userError);
      }

      const issueWithUser: IssueWithUser = {
        ...issueData,
        user: userData || null,
      };

      setIssue(issueWithUser);

      // Load comments
      const topLevelComments = await loadComments(params.id, null);
      const commentsWithReplies = await Promise.all(
        topLevelComments.map(async (comment) => {
          try {
            const replies = await loadComments(params.id, comment.id);
            return { ...comment, replies };
          } catch (error) {
            console.error(
              `Error loading replies for comment ${comment.id}:`,
              error
            );
            return { ...comment, replies: [] };
          }
        })
      );

      setComments(commentsWithReplies);
    } catch (error) {
      console.error("Error in loadIssueAndComments:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load issue details. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIssueAndComments();
  }, [params.id, sortBy]);

  useEffect(() => {
    console.log("Auth state:", { user, isAdmin });
  }, [user, isAdmin]);

  const handleComment = async (parentId: string | null = null) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to comment.",
      });
      router.push("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase.from("comments").insert({
        issue_id: params.id,
        content: newComment,
        user_id: user.id,
        parent_id: parentId,
      });

      if (error) throw error;

      setNewComment("");
      await loadIssueAndComments();

      toast({
        title: "Success",
        description: "Comment posted successfully!",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async () => {
    if (!user || !issue) return;

    try {
      const updatedReports = issue.reports.includes(user.id)
        ? issue.reports.filter((id) => id !== user.id)
        : [...issue.reports, user.id];

      const { error } = await supabase
        .from("issues")
        .update({ reports: updatedReports })
        .eq("id", issue.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Issue reported successfully.",
      });
      await loadIssueAndComments();
    } catch (error) {
      console.error("Error reporting issue:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to report issue. Please try again.",
      });
    }
  };

  const handleResolve = async () => {
    if (!user || !isAdmin || !issue) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You don't have permission to resolve this issue.",
      });
      return;
    }

    try {
      setIsResolvingIssue(true);

      const response = await fetch("/api/resolve-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issue_id: issue.id,
          user_id: user.id,
        }),
      });

      if (!response.ok) throw new Error("Failed to resolve");

      // Update local state
      setIssue((prev) =>
        prev
          ? {
              ...prev,
              resolved: true,
              resolved_by: user.id,
              resolved_at: new Date().toISOString(),
            }
          : null
      );

      toast({
        title: "Success",
        description: "Issue resolved successfully",
      });
      router.refresh();
    } catch (error) {
      console.error("Resolution failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resolve issue",
      });
    } finally {
      setIsResolvingIssue(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Issue not found.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issues
          </Button>
          <div className="flex items-center gap-2">
            {isAdmin && issue && !issue.resolved && (
              <Button
                onClick={handleResolve}
                disabled={isResolvingIssue}
                className="gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                {isResolvingIssue ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Resolve Issue
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Report Issue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Report Issue</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to report this issue? This will help
                    moderators review the content.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-4">
                  <Button variant="outline" onClick={handleReport}>
                    Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div
          className={cn(
            "space-y-4 rounded-lg border p-6",
            issue.resolved &&
              "border-green-500 bg-green-50 dark:bg-green-900/10",
            issue.reports?.length > 0 &&
              !issue.resolved &&
              "border-red-500 bg-red-50 dark:bg-red-900/10"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{issue.title}</h1>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={issue.user?.avatar_url || undefined}
                    alt={issue.user?.full_name || "Anonymous"}
                  />
                  <AvatarFallback>
                    {issue.user?.full_name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase() || "A"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">
                  Posted by {issue.user?.full_name || "Anonymous"}{" "}
                  {formatDistanceToNow(new Date(issue.created_at))} ago
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{issue.category}</Badge>
              {issue.resolved && <Badge variant="success">Resolved</Badge>}
              {issue.reports?.length > 0 && !issue.resolved && (
                <Badge variant="destructive">Reported</Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground">{issue.description}</p>
          {issue.tags && issue.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {issue.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {issue.resolved && issue.resolved_by && (
            <div className="mt-4 rounded-lg bg-green-100 p-4 dark:bg-green-900/20">
              <p className="text-sm text-green-800 dark:text-green-200">
                This issue was resolved{" "}
                {issue.resolved_at &&
                  formatDistanceToNow(new Date(issue.resolved_at))}{" "}
                ago
              </p>
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Comments ({comments.length})
            </h2>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Textarea
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleComment(null)}
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Post Comment
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onReply={async (parentId, content) => {
                  setNewComment(content);
                  await handleComment(parentId);
                }}
                onLike={loadIssueAndComments}
                replies={comment.replies || []}
                onLoadReplies={async (parentId) => {
                  const replies = await loadComments(params.id, parentId);
                  setComments((prevComments) =>
                    prevComments.map((c) =>
                      c.id === parentId ? { ...c, replies } : c
                    )
                  );
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

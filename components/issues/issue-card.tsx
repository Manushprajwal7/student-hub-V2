"use client";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowBigDown, ArrowBigUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import type { IssueWithUser, IssueCategory } from "@/types/issues";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
interface IssueCardProps {
  issue: IssueWithUser;
  currentUserId?: string;
  onVote: () => void;
}
const categoryColors: Record<IssueCategory, string> = {
  Teaching:
    "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300",
  "Women Rights":
    "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-300",
  Ragging:
    "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-300",
  "Cultural Events":
    "bg-pink-100 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800 text-pink-900 dark:text-pink-300",
  Campus:
    "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-300",
  Sports:
    "bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-300",
  Fest: "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-300",
  Infrastructure:
    "bg-gray-100 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300",
  Academics:
    "bg-indigo-100 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300",
  "Student Services":
    "bg-teal-100 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-300",
  "Extracurricular Activities":
    "bg-cyan-100 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800 text-cyan-900 dark:text-cyan-300",
};

export function IssueCard({ issue, currentUserId, onVote }: IssueCardProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();
  const [voteCount, setVoteCount] = useState(
    issue.upvotes.length - issue.downvotes.length
  );
  const REPORT_THRESHOLD = 4;

  const initials =
    issue.user?.full_name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A";

  const hasUpvoted = currentUserId
    ? issue.upvotes.includes(currentUserId)
    : false;
  const hasDownvoted = currentUserId
    ? issue.downvotes.includes(currentUserId)
    : false;
  const hasBeenReported = (issue.reports?.length || 0) >= REPORT_THRESHOLD;
  const hasReported = currentUserId
    ? issue.reports?.includes(currentUserId)
    : false;

  const handleReport = async () => {
    if (!currentUserId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to report issues.",
      });
      return;
    }

    try {
      setIsReporting(true);
      const updatedReports = issue.reports.includes(currentUserId)
        ? issue.reports.filter((id) => id !== currentUserId)
        : [...issue.reports, currentUserId];

      const { error } = await supabase
        .from("issues")
        .update({
          reports: updatedReports,
        })
        .eq("id", issue.id);

      if (error) throw error;

      // Call onVote to refresh the issues list
      onVote();

      toast({
        title: "Success",
        description: issue.reports.includes(currentUserId)
          ? "Report removed successfully."
          : "Issue reported successfully.",
      });
    } catch (error) {
      console.error("Error reporting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to report issue. Please try again.",
      });
    } finally {
      setIsReporting(false);
    }
  };
  const handleVote = async (voteType: "up" | "down") => {
    if (!currentUserId) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please sign in to vote on issues.",
      });
      return;
    }

    if (issue.resolved || hasBeenReported) {
      toast({
        variant: "destructive",
        title: "Voting Disabled",
        description: "You cannot vote on resolved or reported issues.",
      });
      return;
    }

    try {
      setIsVoting(true);

      // Optimistically update the UI
      const oldUpvotes = [...issue.upvotes];
      const oldDownvotes = [...issue.downvotes];
      let updatedUpvotes = [...issue.upvotes];
      let updatedDownvotes = [...issue.downvotes];

      if (voteType === "up") {
        if (hasUpvoted) {
          // Remove upvote
          updatedUpvotes = updatedUpvotes.filter((id) => id !== currentUserId);
          setVoteCount((prev) => prev - 1);
        } else {
          // Add upvote and remove downvote if exists
          updatedUpvotes.push(currentUserId);
          updatedDownvotes = updatedDownvotes.filter(
            (id) => id !== currentUserId
          );
          setVoteCount((prev) => prev + (hasDownvoted ? 2 : 1));
        }
      } else {
        if (hasDownvoted) {
          // Remove downvote
          updatedDownvotes = updatedDownvotes.filter(
            (id) => id !== currentUserId
          );
          setVoteCount((prev) => prev + 1);
        } else {
          // Add downvote and remove upvote if exists
          updatedDownvotes.push(currentUserId);
          updatedUpvotes = updatedUpvotes.filter((id) => id !== currentUserId);
          setVoteCount((prev) => prev - (hasUpvoted ? 2 : 1));
        }
      }

      const { error } = await supabase
        .from("issues")
        .update({
          upvotes: updatedUpvotes,
          downvotes: updatedDownvotes,
        })
        .eq("id", issue.id);

      if (error) {
        // Revert optimistic update on error
        setVoteCount(oldUpvotes.length - oldDownvotes.length);
        throw error;
      }

      // Update the parent component
      onVote();

      // Show success toast for voting action
      toast({
        title: "Success",
        description: `Vote ${
          voteType === "up" ? "upvote" : "downvote"
        } registered successfully.`,
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register vote. Please try again.",
      });
    } finally {
      setIsVoting(false);
    }
  };
  useEffect(() => {
    setVoteCount(issue.upvotes.length - issue.downvotes.length);
  }, [issue.upvotes.length, issue.downvotes.length]);


  return (
    <Card
      className={cn(
        "transition-colors duration-200",
        issue.resolved && "border-green-500 bg-green-50 dark:bg-green-900/10",
        hasBeenReported &&
          !issue.resolved &&
          "border-red-500 bg-red-50 dark:bg-red-900/10",
        !issue.resolved &&
          !hasBeenReported &&
          "hover:border-gray-300 dark:hover:border-gray-600"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="line-clamp-2">
              {hasBeenReported ? (
                <span className="text-muted-foreground">{issue.title}</span>
              ) : (
                <Link href={`/issues/${issue.id}`} className="hover:underline">
                  {issue.title}
                </Link>
              )}
            </CardTitle>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge className={categoryColors[issue.category as IssueCategory]}>
                {issue.category}
              </Badge>
              {issue.resolved && (
                <Badge variant="success" className="bg-green-500">
                  Resolved
                </Badge>
              )}
              {hasBeenReported && !issue.resolved && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Reported Issue
                </Badge>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={issue.user?.avatar_url || undefined}
                  alt={issue.user?.full_name || "Anonymous"}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span>{issue.user?.full_name || "Anonymous"}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(issue.created_at))} ago</span>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "text-muted-foreground hover:text-foreground",
                  hasReported && "text-red-600"
                )}
                disabled={isReporting}
              >
                {isReporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Issue</DialogTitle>
                <DialogDescription>
                  {hasReported
                    ? "Do you want to remove your report from this issue?"
                    : "Are you sure you want to report this issue? This action cannot be undone."}
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4">
                <Button
                  variant={hasReported ? "destructive" : "default"}
                  onClick={handleReport}
                  disabled={isReporting}
                >
                  {isReporting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : hasReported ? (
                    "Remove Report"
                  ) : (
                    "Report Issue"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {issue.description}
        </p>
        {issue.tags && issue.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {issue.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {issue.resolved && issue.resolved_at && (
          <div className="mt-4 rounded-md bg-green-100 p-2 dark:bg-green-900/20">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✓ Issue was resolved successfully
              {issue.resolved_at &&
                ` ${formatDistanceToNow(new Date(issue.resolved_at))} ago`}
              {issue.resolved_by && ` by Admin`}
            </p>
          </div>
        )}
        {hasBeenReported && !issue.resolved && (
          <div className="mt-4 rounded-md bg-red-100 p-2 dark:bg-red-900/20">
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ This issue has been reported multiple times and is under review
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "transition-colors duration-200",
              hasUpvoted && "text-green-600 bg-green-50 dark:bg-green-900/20",
              (issue.resolved || hasBeenReported) &&
                "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleVote("up")}
            disabled={isVoting || issue.resolved || hasBeenReported}
          >
            {isVoting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowBigUp className="h-5 w-5" />
            )}
          </Button>
          <span
            className={cn(
              "min-w-[2ch] text-center font-medium transition-colors duration-200",
              voteCount > 0 && "text-green-600",
              voteCount < 0 && "text-red-600"
            )}
          >
            {voteCount}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "transition-colors duration-200",
              hasDownvoted && "text-red-600 bg-red-50 dark:bg-red-900/20",
              (issue.resolved || hasBeenReported) &&
                "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleVote("down")}
            disabled={isVoting || issue.resolved || hasBeenReported}
          >
            {isVoting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowBigDown className="h-5 w-5" />
            )}
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={cn(hasBeenReported && "pointer-events-none opacity-50")}
        >
          <Link href={`/issues/${issue.id}`}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Discuss
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
